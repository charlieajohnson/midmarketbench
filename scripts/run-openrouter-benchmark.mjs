#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { aggregateModelRuns, evaluateCandidate, validJudge } from "./benchmark/evaluate.mjs";
import {
  buildCandidateMessages,
  buildJudgeMessages,
  candidateOutputValidator,
  candidateSchema,
  judgeOutputValidator,
  judgeSchema,
} from "./benchmark/prompts.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const benchmarkRoot = join(repoRoot, "benchmark", "mini-v0.4");
const runId = process.env.BENCHMARK_RUN_ID ?? "2026-07-18-final";
if (!/^[a-zA-Z0-9-]+$/.test(runId)) throw new Error("BENCHMARK_RUN_ID contains unsupported characters.");
const budgetRoot = join(benchmarkRoot, "runs");
const runRoot = join(budgetRoot, runId);
const config = await readJson(join(benchmarkRoot, "config.json"));
const benchmarkCase = await readJson(join(benchmarkRoot, "case.json"));
const anchors = await readJson(join(benchmarkRoot, "anchors.json"));
const stage = process.argv.find((argument) => argument.startsWith("--stage="))?.split("=")[1] ?? "all";
const modelFilter = process.argv
  .find((argument) => argument.startsWith("--models="))
  ?.split("=")[1]
  .split(",")
  .filter(Boolean);
const retryBillable = process.argv.includes("--retry-billable");
const sampleFilter = process.argv
  .find((argument) => argument.startsWith("--samples="))
  ?.split("=")[1]
  .split(",")
  .map(Number)
  .filter((sample) => Number.isInteger(sample) && sample > 0);
const judgeFilter = process.argv
  .find((argument) => argument.startsWith("--judges="))
  ?.split("=")[1]
  .split(",")
  .filter(Boolean);
const apiKey = process.env.OPENROUTER_API_KEY;
const apiBase = "https://openrouter.ai/api/v1";
const appHeaders = {
  "Content-Type": "application/json",
  "HTTP-Referer": "https://midmarketbench.vercel.app",
  "X-OpenRouter-Title": "MidMarketBench",
  "X-OpenRouter-Metadata": "enabled",
};
const calibratedJudgeOutputValidator = judgeOutputValidator.refine(validJudge, {
  message: "Judge failed the strong/weak anchor calibration check.",
});

function sha256(value) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");
}

function judgeMaxTokens(judge) {
  return judge.id === "anthropic/claude-sonnet-5"
    ? (config.claude_judge_max_tokens ?? config.judge_max_tokens)
    : config.judge_max_tokens;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

async function readJsonIfPresent(path) {
  try {
    return await readJson(path);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function walkJson(path) {
  const results = [];
  let entries;
  try {
    entries = await readdir(path, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return results;
    throw error;
  }
  for (const entry of entries) {
    const target = join(path, entry.name);
    if (entry.isDirectory()) results.push(...(await walkJson(target)));
    else if (entry.name.endsWith(".json")) results.push(target);
  }
  return results;
}

async function accountedSpend(after = null) {
  const generationCosts = new Map();
  const afterTimestamp = after ? Date.parse(after) : null;
  for (const path of await walkJson(budgetRoot)) {
    if (path.endsWith(".dispatch.json") && (await readJsonIfPresent(path.replace(/\.dispatch\.json$/, ".json")))) {
      continue;
    }
    const artifact = await readJsonIfPresent(path);
    if (afterTimestamp !== null) {
      const settledTimestamp = Date.parse(artifact?.completed_at ?? artifact?.started_at ?? "");
      if (!Number.isFinite(settledTimestamp) || settledTimestamp <= afterTimestamp) continue;
    }
    const accountedCost = artifact?.accounted_cost_usd ?? artifact?.actual_cost_usd;
    const costId =
      artifact?.generation_id ??
      (artifact?.request_sha256 && artifact?.started_at ? `${artifact.request_sha256}:${artifact.started_at}` : null);
    if (costId && typeof accountedCost === "number" && accountedCost > 0) {
      generationCosts.set(costId, accountedCost);
    }
  }
  return [...generationCosts.values()].reduce((sum, cost) => sum + cost, 0);
}

async function existingSpend() {
  const reconciliation = await readJsonIfPresent(join(budgetRoot, "budget-reconciliation.json"));
  if (!reconciliation) return accountedSpend();
  return reconciliation.dashboard_usage_usd + (await accountedSpend(reconciliation.observed_at));
}

async function providerReportedSpend() {
  const generationCosts = new Map();
  for (const path of await walkJson(budgetRoot)) {
    const artifact = await readJsonIfPresent(path);
    if (artifact?.generation_id && typeof artifact?.actual_cost_usd === "number" && artifact.actual_cost_usd > 0) {
      generationCosts.set(artifact.generation_id, artifact.actual_cost_usd);
    }
  }
  return [...generationCosts.values()].reduce((sum, cost) => sum + cost, 0);
}

async function providerReportedSpendUnder(path) {
  const generationCosts = new Map();
  for (const artifactPath of await walkJson(path)) {
    const artifact = await readJsonIfPresent(artifactPath);
    if (artifact?.generation_id && typeof artifact.actual_cost_usd === "number" && artifact.actual_cost_usd > 0) {
      generationCosts.set(artifact.generation_id, artifact.actual_cost_usd);
    }
  }
  return [...generationCosts.values()].reduce((sum, cost) => sum + cost, 0);
}

class BudgetLedger {
  constructor(spent, limit) {
    this.spent = spent;
    this.reserved = 0;
    this.limit = limit;
  }

  reserve(maximumCost) {
    if (this.spent + this.reserved + maximumCost > this.limit) {
      throw new Error(
        `Budget stop: $${this.spent.toFixed(4)} spent + $${this.reserved.toFixed(4)} reserved + $${maximumCost.toFixed(4)} next exceeds $${this.limit.toFixed(2)}.`,
      );
    }
    this.reserved += maximumCost;
  }

  commit(maximumCost, actualCost) {
    this.reserved = Math.max(0, this.reserved - maximumCost);
    this.spent += actualCost;
    return this.spent + this.reserved <= this.limit;
  }

  release(maximumCost) {
    this.reserved = Math.max(0, this.reserved - maximumCost);
  }
}

function sleep(milliseconds) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
}

async function fetchJson(url, options = {}, retries = 2) {
  const { timeoutMs = 180_000, retryNetworkErrors = true, onRetry, ...fetchOptions } = options;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { ...fetchOptions, signal: AbortSignal.timeout(timeoutMs) });
      const rawBody = await response.text();
      let body;
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        body = { non_json_response: rawBody.slice(0, 2_000) };
      }
      if (response.ok) return body;
      const error = new Error(body?.error?.message ?? `HTTP ${response.status}`);
      error.status = response.status;
      error.body = body;
      error.retryable = [408, 409, 429, 500, 502, 503, 504].includes(response.status);
      const retryAfter = response.headers.get("retry-after");
      const retryAfterSeconds = Number(retryAfter);
      error.retryAfterMs = Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : null;
      throw error;
    } catch (error) {
      lastError = error;
      const mayRetry = error.retryable ?? retryNetworkErrors;
      if (!mayRetry || attempt === retries) throw error;
      const delayMs = error.retryAfterMs ?? 2_000 * 2 ** attempt;
      onRetry?.({ attempt: attempt + 1, status: error.status ?? null, message: error.message, delay_ms: delayMs });
      await sleep(delayMs);
    }
  }
  throw lastError;
}

async function snapshotModels() {
  const modelIds = [...config.models, ...config.judges].map((model) => model.id);
  const catalogueResponse = await fetchJson(`${apiBase}/models`);
  const catalogue = new Map(catalogueResponse.data.map((model) => [model.id, model]));
  const missing = modelIds.filter((id) => !catalogue.has(id));
  if (missing.length) throw new Error(`OpenRouter catalogue is missing: ${missing.join(", ")}`);
  const endpoints = {};
  await runPool(modelIds, config.concurrency, async (modelId) => {
    const response = await fetchJson(`${apiBase}/models/${modelId}/endpoints`);
    endpoints[modelId] = response.data ?? response;
  });
  const snapshot = {
    retrieved_at: new Date().toISOString(),
    source: `${apiBase}/models`,
    catalogue_response_sha256: sha256(catalogueResponse),
    models: modelIds.map((id) => catalogue.get(id)),
    endpoints,
  };
  snapshot.selected_snapshot_sha256 = sha256({ models: snapshot.models, endpoints: snapshot.endpoints });
  await writeJson(join(runRoot, "model-snapshot.json"), snapshot);
  return snapshot;
}

function priceFor(snapshot, modelId) {
  const model = snapshot.models.find((candidate) => candidate.id === modelId);
  if (!model) throw new Error(`No model snapshot for ${modelId}`);
  return {
    prompt: Number(model.pricing.prompt),
    completion: Number(model.pricing.completion),
  };
}

function providerPreferences(snapshot, modelId) {
  const price = priceFor(snapshot, modelId);
  return {
    require_parameters: true,
    sort: "price",
    max_price: {
      prompt: price.prompt * 1_000_000,
      completion: price.completion * 1_000_000,
    },
  };
}

function requestPlan(snapshot, modelId, messages, maxTokens, minimumInputTokens = 0) {
  const inputTokens = Math.max(estimateInputTokens(messages), minimumInputTokens);
  const requiredParameters = ["max_tokens", "reasoning", "response_format", "structured_outputs"];
  const endpointData = snapshot.endpoints[modelId]?.endpoints ?? snapshot.endpoints[modelId] ?? [];
  const eligible = asArray(endpointData)
    .filter((endpoint) => !String(endpoint.tag ?? "").includes("/flex"))
    .filter((endpoint) => !String(endpoint.tag ?? "").includes("/priority"))
    .filter((endpoint) => requiredParameters.every((parameter) => endpoint.supported_parameters?.includes(parameter)))
    .map((endpoint) => {
      const prompt = Number(endpoint.pricing?.prompt);
      const completion = Number(endpoint.pricing?.completion);
      return {
        endpoint,
        prompt,
        completion,
        maximumCost: inputTokens * prompt + maxTokens * completion,
      };
    })
    .filter((item) => Number.isFinite(item.maximumCost))
    .sort((a, b) => a.maximumCost - b.maximumCost);
  if (!eligible.length) {
    return {
      maximumCost: maximumRequestCost(snapshot, modelId, messages, maxTokens, minimumInputTokens),
      provider: providerPreferences(snapshot, modelId),
      route: { basis: "catalogue_fallback", required_parameters: requiredParameters },
    };
  }
  const endpointOverrides = {
    "anthropic/claude-fable-5": "amazon-bedrock/us",
  };
  const selected = eligible.find((item) => item.endpoint.tag === endpointOverrides[modelId]) ?? eligible[0];
  const priceMargin = 1.001;
  return {
    maximumCost: selected.maximumCost * priceMargin,
    provider: {
      require_parameters: true,
      only: [selected.endpoint.tag],
      allow_fallbacks: false,
      max_price: {
        prompt: selected.prompt * 1_000_000 * priceMargin,
        completion: selected.completion * 1_000_000 * priceMargin,
      },
    },
    route: {
      basis: "cheapest_eligible_endpoint",
      endpoint_tag: selected.endpoint.tag ?? null,
      provider_name: selected.endpoint.provider_name ?? null,
      quantization: selected.endpoint.quantization ?? null,
      required_parameters: requiredParameters,
      maximum_prompt_usd_per_million: selected.prompt * 1_000_000 * priceMargin,
      maximum_completion_usd_per_million: selected.completion * 1_000_000 * priceMargin,
    },
  };
}

function estimateInputTokens(messages) {
  return Math.ceil(JSON.stringify(messages).length / 3);
}

function maximumRequestCost(snapshot, modelId, messages, maxTokens, minimumInputTokens = 0) {
  const price = priceFor(snapshot, modelId);
  const inputTokens = Math.max(estimateInputTokens(messages), minimumInputTokens);
  return inputTokens * price.prompt + maxTokens * price.completion;
}

function parseContent(message) {
  const content = message?.content;
  if (typeof content === "string") return JSON.parse(content);
  if (Array.isArray(content)) {
    const text = content.map((part) => (typeof part === "string" ? part : (part?.text ?? ""))).join("");
    return JSON.parse(text);
  }
  throw new Error("Completion did not contain JSON text.");
}

function safeGenerationMetadata(data) {
  if (!data) return null;
  const allowed = [
    "id",
    "model",
    "provider_name",
    "provider",
    "native_tokens_prompt",
    "native_tokens_completion",
    "native_tokens_reasoning",
    "num_media_prompt",
    "num_media_completion",
    "latency",
    "generation_time",
    "total_cost",
    "created_at",
    "finish_reason",
  ];
  return Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]));
}

async function generationMetadata(generationId) {
  if (!generationId || !apiKey) return null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await sleep(500 * (attempt + 1));
    try {
      const response = await fetchJson(
        `${apiBase}/generation?id=${encodeURIComponent(generationId)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeoutMs: 30_000,
        },
        0,
      );
      return safeGenerationMetadata(response.data ?? response);
    } catch (error) {
      if (attempt === 2) return { error: error.message };
    }
  }
  return null;
}

function safeErrorBody(body) {
  if (!body) return null;
  return body.error ?? body;
}

function safeRejectedMessage(message) {
  if (!message) return null;
  const content = Array.isArray(message.content)
    ? message.content.map((part) => (typeof part === "string" ? part : (part?.text ?? ""))).join("")
    : message.content;
  return {
    role: message.role ?? null,
    content: typeof content === "string" ? content.slice(0, 100_000) : null,
    refusal: typeof message.refusal === "string" ? message.refusal.slice(0, 10_000) : null,
  };
}

function attemptPathFor(artifactPath, startedAt) {
  const relative = artifactPath.slice(runRoot.length + 1).replace(/\.json$/, "");
  const timestamp = startedAt.replace(/[:.]/g, "-");
  return join(runRoot, "attempts", relative, `${timestamp}.json`);
}

function dispatchPathFor(artifactPath, startedAt) {
  return attemptPathFor(artifactPath, startedAt).replace(/\.json$/, ".dispatch.json");
}

async function persistDispatch(artifactPath, artifact) {
  await writeJson(dispatchPathFor(artifactPath, artifact.started_at), artifact);
  await writeJson(artifactPath, artifact);
}

async function persistAttempt(artifactPath, artifact) {
  await writeJson(attemptPathFor(artifactPath, artifact.started_at), artifact);
  await writeJson(artifactPath, artifact);
}

function validationMessage(result) {
  return result.success
    ? null
    : result.error.issues
        .slice(0, 8)
        .map((issue) => `${issue.path.join(".") || "output"}: ${issue.message}`)
        .join("; ");
}

async function executeCompletion({
  request,
  artifactPath,
  maximumCost,
  ledger,
  kind,
  modelConfig,
  validator,
  routePlan,
}) {
  const requestHash = sha256(request);
  const existing = await readJsonIfPresent(artifactPath);
  const existingValidation = existing?.status === "completed" ? validator.safeParse(existing.output) : null;
  const existingAccepted =
    existing?.status === "completed" && existing.finish_reason === "stop" && existingValidation?.success;
  if (
    existing?.request_sha256 &&
    existing.request_sha256 !== requestHash &&
    (existingAccepted || ((existing.accounted_cost_usd ?? 0) > 0 && !retryBillable))
  ) {
    throw new Error(`Resume conflict at ${artifactPath}: request hash changed.`);
  }
  if (existingAccepted) return existing;
  if (existing?.status === "completed" && !retryBillable) {
    if (!existingValidation?.success || existing.finish_reason !== "stop") {
      throw new Error(`Existing completion at ${artifactPath} is not a valid accepted result.`);
    }
  }
  if ((existing?.accounted_cost_usd ?? 0) > 0 && !retryBillable) {
    throw new Error(`Refusing to overwrite a billable failed attempt at ${artifactPath}.`);
  }
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is required for completion stages.");

  ledger.reserve(maximumCost);
  const startedAt = new Date().toISOString();
  const started = performance.now();
  const transportRetries = [];
  let requestDispatched = false;
  let response = null;
  let choice = null;
  let generation = null;
  let latencyMs = null;
  let actualCost = null;
  let parsedOutput = null;
  let rejectedMessage = null;
  await persistDispatch(artifactPath, {
    kind,
    status: "dispatching",
    benchmark_id: config.benchmark_id,
    started_at: startedAt,
    request_sha256: requestHash,
    request,
    requested_model: request.model,
    route_plan: routePlan,
    maximum_reserved_cost_usd: maximumCost,
    accounted_cost_usd: maximumCost,
    cost_basis: "dispatch_reservation",
    model_config: modelConfig,
  });
  try {
    requestDispatched = true;
    response = await fetchJson(
      `${apiBase}/chat/completions`,
      {
        method: "POST",
        headers: { ...appHeaders, Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(request),
        timeoutMs: request.model === "moonshotai/kimi-k3" ? 1_200_000 : 600_000,
        retryNetworkErrors: false,
        onRetry: (event) => transportRetries.push(event),
      },
      0,
    );
    latencyMs = Math.round(performance.now() - started);
    choice = response.choices?.[0];
    rejectedMessage = safeRejectedMessage(choice?.message);
    generation = await generationMetadata(response.id);
    const reportedCost = Number(response.usage?.cost ?? generation?.total_cost);
    actualCost = Number.isFinite(reportedCost) ? reportedCost : null;
    const accountedCost = actualCost ?? maximumCost;

    if (response?.error) {
      const routerError = new Error(response.error.message ?? "OpenRouter returned a top-level completion error.");
      routerError.body = response.error;
      throw routerError;
    }
    if (!choice) {
      const missingChoiceError = new Error("OpenRouter response did not contain a completion choice.");
      missingChoiceError.body = { response_keys: Object.keys(response ?? {}) };
      throw missingChoiceError;
    }
    if (choice.error) {
      const providerError = new Error(choice.error.message ?? "Provider returned an embedded completion error.");
      providerError.body = choice.error;
      throw providerError;
    }
    if (choice?.finish_reason !== "stop") {
      throw new Error(`Completion finish reason was ${choice?.finish_reason ?? "missing"}, not stop.`);
    }
    parsedOutput = parseContent(choice?.message);
    const validation = validator.safeParse(parsedOutput);
    if (!validation.success) throw new Error(`Local schema validation failed: ${validationMessage(validation)}`);

    const artifact = {
      kind,
      status: "completed",
      benchmark_id: config.benchmark_id,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      request_sha256: requestHash,
      request,
      requested_model: request.model,
      returned_model: response.model,
      provider: response.provider ?? generation?.provider_name ?? generation?.provider ?? null,
      router_metadata: response.openrouter_metadata ?? null,
      generation_id: response.id,
      finish_reason: choice.finish_reason,
      native_finish_reason: choice.native_finish_reason ?? null,
      latency_ms: latencyMs,
      actual_cost_usd: actualCost,
      accounted_cost_usd: accountedCost,
      cost_basis: actualCost === null ? "request_maximum" : "openrouter_reported",
      usage: response.usage ?? null,
      generation,
      transport_retries: transportRetries,
      route_plan: routePlan,
      output: validation.data,
      model_config: modelConfig,
    };
    await persistAttempt(artifactPath, artifact);
    const withinBudget = ledger.commit(maximumCost, accountedCost);
    process.stdout.write(
      `${kind} ${modelConfig.slug} completed in ${(latencyMs / 1000).toFixed(1)}s for $${accountedCost.toFixed(4)}\n`,
    );
    if (!withinBudget)
      throw Object.assign(new Error("Budget exceeded after provider-reported cost."), { code: "BUDGET_EXCEEDED" });
    return artifact;
  } catch (error) {
    if (error.code === "BUDGET_EXCEEDED") throw error;
    const errorResponse = error.body?.data ?? error.body ?? null;
    const generationId = response?.id ?? errorResponse?.id ?? null;
    const usage = response?.usage ?? errorResponse?.usage ?? null;
    const reportedCost = Number(usage?.cost ?? generation?.total_cost);
    const receivedBillableResponse = Boolean(generationId) || (Number.isFinite(reportedCost) && reportedCost > 0);
    const ambiguousProviderFailure =
      requestDispatched &&
      !response &&
      (!error.status || error.status === 408 || error.status === 409 || (error.status >= 500 && error.status < 600));
    let accountedCost = 0;
    let costBasis = "not_charged";
    if (receivedBillableResponse) {
      actualCost = Number.isFinite(reportedCost) ? reportedCost : null;
      accountedCost = actualCost ?? maximumCost;
      costBasis = actualCost === null ? "request_maximum" : "openrouter_reported";
    } else if (ambiguousProviderFailure) {
      accountedCost = maximumCost;
      costBasis = "ambiguous_request_maximum";
    }
    const artifact = {
      kind,
      status: "failed",
      benchmark_id: config.benchmark_id,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      requested_model: request.model,
      returned_model: response?.model ?? errorResponse?.model ?? null,
      provider:
        response?.provider ??
        errorResponse?.provider ??
        errorResponse?.metadata?.provider_name ??
        generation?.provider_name ??
        generation?.provider ??
        null,
      router_metadata: response?.openrouter_metadata ?? errorResponse?.openrouter_metadata ?? null,
      generation_id: generationId,
      finish_reason: choice?.finish_reason ?? null,
      native_finish_reason: choice?.native_finish_reason ?? null,
      latency_ms: latencyMs ?? Math.round(performance.now() - started),
      actual_cost_usd: actualCost,
      accounted_cost_usd: accountedCost,
      cost_basis: costBasis,
      usage,
      generation,
      transport_retries: transportRetries,
      route_plan: routePlan,
      request_sha256: requestHash,
      error: { message: error.message, status: error.status ?? null, body: safeErrorBody(error.body) },
      rejected_output: parsedOutput,
      rejected_message: rejectedMessage,
      model_config: modelConfig,
    };
    await persistAttempt(artifactPath, artifact);
    const withinBudget =
      accountedCost > 0 ? ledger.commit(maximumCost, accountedCost) : (ledger.release(maximumCost), true);
    process.stdout.write(`${kind} ${modelConfig.slug} failed: ${error.message}\n`);
    if (!withinBudget) throw new Error("Budget exceeded after conservatively accounting a failed attempt.");
    return artifact;
  }
}

async function runPool(items, concurrency, worker) {
  const queue = [...items];
  const results = [];
  const runners = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await worker(item));
    }
  });
  await Promise.all(runners);
  return results;
}

function candidateItems(snapshot) {
  const messages = buildCandidateMessages(benchmarkCase);
  const selectedModels = modelFilter?.length
    ? config.models.filter((model) => modelFilter.includes(model.slug))
    : config.models;
  return selectedModels.flatMap((model) =>
    Array.from({ length: config.samples_per_model }, (_, index) => {
      const sample = index + 1;
      const maxTokens =
        model.id === "moonshotai/kimi-k3"
          ? config.kimi_max_tokens
          : model.id === "z-ai/glm-5.2"
            ? config.glm_max_tokens
            : model.id === "anthropic/claude-opus-4.8"
              ? config.opus_max_tokens
              : model.id === "deepseek/deepseek-v4-pro"
                ? config.deepseek_max_tokens
                : config.candidate_max_tokens;
      const plan = requestPlan(snapshot, model.id, messages, maxTokens);
      const request = {
        model: model.id,
        messages,
        max_tokens: maxTokens,
        response_format: { type: "json_schema", json_schema: candidateSchema },
        provider: plan.provider,
      };
      if (model.id === "moonshotai/kimi-k3") {
        request.reasoning = { effort: "max", exclude: true };
      } else {
        request.reasoning = { max_tokens: 2_048, exclude: true };
      }
      return {
        model,
        sample,
        request,
        maximumCost: plan.maximumCost,
        routePlan: plan.route,
        artifactPath: join(runRoot, "candidates", model.slug, `sample-${sample}.json`),
      };
    }).filter((item) => !sampleFilter?.length || sampleFilter.includes(item.sample)),
  );
}

async function runCandidates(snapshot, ledger) {
  const items = candidateItems(snapshot);
  const groups = [...Map.groupBy(items, (item) => item.model.slug).values()];
  await runPool(groups, config.concurrency, async (group) => {
    for (const item of group) {
      await executeCompletion({
        request: item.request,
        artifactPath: item.artifactPath,
        maximumCost: item.maximumCost,
        ledger,
        kind: `candidate-${item.sample}`,
        modelConfig: item.model,
        validator: candidateOutputValidator,
        routePlan: item.routePlan,
      });
    }
  });
}

async function judgeItems(snapshot) {
  const items = [];
  const selectedModels = modelFilter?.length
    ? config.models.filter((model) => modelFilter.includes(model.slug))
    : config.models;
  for (const model of selectedModels) {
    for (let sample = 1; sample <= config.samples_per_model; sample += 1) {
      if (sampleFilter?.length && !sampleFilter.includes(sample)) continue;
      const candidatePath = join(runRoot, "candidates", model.slug, `sample-${sample}.json`);
      const candidate = await readJsonIfPresent(candidatePath);
      if (candidate?.status !== "completed") continue;
      const selectedJudges = judgeFilter?.length
        ? config.judges.filter((judge) => judgeFilter.includes(judge.slug))
        : config.judges;
      for (const judge of selectedJudges) {
        const messages = buildJudgeMessages(benchmarkCase, anchors, candidate.output.ic_note);
        const maxTokens = judgeMaxTokens(judge);
        const plan = requestPlan(snapshot, judge.id, messages, maxTokens);
        const request = {
          model: judge.id,
          messages,
          max_tokens: maxTokens,
          reasoning: { max_tokens: 1_024, exclude: true },
          response_format: { type: "json_schema", json_schema: judgeSchema },
          provider: plan.provider,
        };
        items.push({
          model,
          judge,
          sample,
          request,
          maximumCost: plan.maximumCost,
          routePlan: plan.route,
          artifactPath: join(runRoot, "judgements", model.slug, `sample-${sample}`, `${judge.slug}.json`),
        });
      }
    }
  }
  return items;
}

async function runJudges(snapshot, ledger) {
  const items = await judgeItems(snapshot);
  await runPool(items, config.concurrency, (item) =>
    executeCompletion({
      request: item.request,
      artifactPath: item.artifactPath,
      maximumCost: item.maximumCost,
      ledger,
      kind: `judge-${item.model.slug}-sample-${item.sample}`,
      modelConfig: item.judge,
      validator: calibratedJudgeOutputValidator,
      routePlan: item.routePlan,
    }),
  );
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function modelEndpointSummary(candidateArtifacts, snapshot, modelId) {
  const providers = [...new Set(candidateArtifacts.map((artifact) => artifact.provider).filter(Boolean))];
  const returnedModels = [...new Set(candidateArtifacts.map((artifact) => artifact.returned_model).filter(Boolean))];
  const endpointData = snapshot.endpoints[modelId]?.endpoints ?? snapshot.endpoints[modelId] ?? [];
  const endpointTags = [
    ...new Set(candidateArtifacts.map((artifact) => artifact.route_plan?.endpoint_tag).filter(Boolean)),
  ];
  const selectedEndpoints = endpointTags
    .map((tag) => asArray(endpointData).find((endpoint) => endpoint.tag === tag))
    .filter(Boolean);
  const quantizations = [
    ...new Set(
      candidateArtifacts
        .map((artifact) => artifact.route_plan?.quantization)
        .concat(selectedEndpoints.map((endpoint) => endpoint.quantization))
        .filter(Boolean),
    ),
  ];
  const pricing = selectedEndpoints.length
    ? {
        basis: "selected_endpoint_snapshot",
        endpoints: selectedEndpoints.map((endpoint) => ({
          tag: endpoint.tag,
          provider: endpoint.provider_name,
          prompt_usd_per_million: Number(endpoint.pricing?.prompt ?? 0) * 1_000_000,
          completion_usd_per_million: Number(endpoint.pricing?.completion ?? 0) * 1_000_000,
        })),
      }
    : null;
  return { providers, returnedModels, endpointTags, quantizations, pricing };
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function artifactIntegrityIssue({
  artifact,
  expectedModel,
  expectedMessages,
  expectedSchema,
  allowedResponseFormatHashes,
  snapshot,
  seenGenerationIds,
}) {
  if (artifact?.benchmark_id !== config.benchmark_id) return "Artefact benchmark ID does not match this run.";
  if (artifact?.requested_model !== expectedModel.id || artifact?.model_config?.id !== expectedModel.id) {
    return "Artefact model identity does not match its roster position.";
  }
  if (!artifact?.request || sha256(artifact.request) !== artifact.request_sha256) {
    return "Artefact request hash does not match its stored request.";
  }
  if (sha256(asArray(artifact.request.messages)) !== sha256(expectedMessages)) {
    return "Artefact prompt payload is stale.";
  }
  const responseFormatHash = sha256(artifact.request.response_format);
  const acceptedSchemaHashes = allowedResponseFormatHashes ?? [
    sha256({ type: "json_schema", json_schema: expectedSchema }),
  ];
  if (!acceptedSchemaHashes.includes(responseFormatHash)) {
    return "Artefact response schema does not match the benchmark schema.";
  }
  const routeTag = artifact.route_plan?.endpoint_tag;
  const availableEndpoints =
    snapshot.endpoints[expectedModel.id]?.endpoints ?? snapshot.endpoints[expectedModel.id] ?? [];
  if (!routeTag || !asArray(availableEndpoints).some((endpoint) => endpoint.tag === routeTag)) {
    return "Artefact route is absent from the frozen endpoint snapshot.";
  }
  if (
    artifact.request.provider?.allow_fallbacks !== false ||
    !asArray(artifact.request.provider?.only).includes(routeTag)
  ) {
    return "Artefact request was not pinned to its recorded endpoint.";
  }
  if (!artifact.generation_id) return "Artefact has no OpenRouter generation ID.";
  if (seenGenerationIds.has(artifact.generation_id))
    return "OpenRouter generation ID is duplicated in the score inputs.";
  seenGenerationIds.add(artifact.generation_id);
  return null;
}

async function scoreRun(snapshot) {
  const modelResults = [];
  const seenGenerationIds = new Set();
  const judgeSystemPromptHashes = new Set();
  const candidateSchemaVariantCounts = new Map();
  const candidateMessages = buildCandidateMessages(benchmarkCase);
  for (const model of config.models) {
    const scoredRuns = [];
    const candidateArtifacts = [];
    const incompleteSamples = [];
    for (let sample = 1; sample <= config.samples_per_model; sample += 1) {
      const candidate = await readJsonIfPresent(join(runRoot, "candidates", model.slug, `sample-${sample}.json`));
      const candidateValidation = candidateOutputValidator.safeParse(candidate?.output);
      const candidateIntegrity =
        candidate?.status === "completed"
          ? artifactIntegrityIssue({
              artifact: candidate,
              expectedModel: model,
              expectedMessages: candidateMessages,
              expectedSchema: candidateSchema,
              allowedResponseFormatHashes: config.candidate_schema_variants.map(
                (variant) => variant.response_format_sha256,
              ),
              snapshot,
              seenGenerationIds,
            })
          : null;
      if (
        candidate?.status !== "completed" ||
        candidate?.finish_reason !== "stop" ||
        !candidateValidation.success ||
        candidateIntegrity
      ) {
        incompleteSamples.push({
          sample,
          stage: "candidate",
          reason: candidateIntegrity ?? candidate?.error?.message ?? "No clean, locally valid candidate completion.",
        });
        continue;
      }
      candidateArtifacts.push(candidate);
      const candidateSchemaHash = sha256(candidate.request.response_format);
      candidateSchemaVariantCounts.set(
        candidateSchemaHash,
        (candidateSchemaVariantCounts.get(candidateSchemaHash) ?? 0) + 1,
      );
      const judgements = [];
      const judgeInputs = [];
      const judgeIntegrityIssues = [];
      for (const judge of config.judges) {
        const artifact = await readJsonIfPresent(
          join(runRoot, "judgements", model.slug, `sample-${sample}`, `${judge.slug}.json`),
        );
        const judgeValidation = judgeOutputValidator.safeParse(artifact?.output);
        if (artifact?.status === "completed" && artifact?.finish_reason === "stop" && judgeValidation.success) {
          const expectedJudgeMessages = buildJudgeMessages(benchmarkCase, anchors, candidate.output.ic_note);
          const integrityIssue = artifactIntegrityIssue({
            artifact,
            expectedModel: judge,
            expectedMessages: expectedJudgeMessages,
            expectedSchema: judgeSchema,
            snapshot,
            seenGenerationIds,
          });
          if (integrityIssue) {
            judgeIntegrityIssues.push(`${judge.slug}: ${integrityIssue}`);
            continue;
          }
          judgements.push({ slug: judge.slug, providerId: judge.provider_id, judgement: judgeValidation.data });
          judgeSystemPromptHashes.add(sha256(artifact.request.messages?.[0] ?? null));
          judgeInputs.push({
            slug: judge.slug,
            generation_id: artifact.generation_id,
            request_sha256: artifact.request_sha256,
            provider: artifact.provider,
            route: artifact.route_plan,
          });
        }
      }
      const scored = evaluateCandidate(candidateValidation.data, judgements, model, benchmarkCase.diligence_actions);
      const expectedEligibleJudges = config.judges.filter((judge) => judge.provider_id !== model.provider_id).length;
      if (scored.components.judges.eligibleJudges.length !== expectedEligibleJudges) {
        incompleteSamples.push({
          sample,
          stage: "judging",
          reason: `Expected ${expectedEligibleJudges} calibrated cross-family judges; received ${scored.components.judges.eligibleJudges.length}.${judgeIntegrityIssues.length ? ` ${judgeIntegrityIssues.join(" ")}` : ""}`,
        });
        await writeJson(join(runRoot, "scores", model.slug, `sample-${sample}.json`), {
          status: "incomplete",
          benchmark_id: config.benchmark_id,
          model,
          sample,
          candidate_generation_id: candidate.generation_id,
          ...incompleteSamples.at(-1),
          judge_diagnostics: scored.components.judges,
        });
        continue;
      }
      const scoredArtifact = {
        status: "completed",
        benchmark_id: config.benchmark_id,
        model,
        sample,
        candidate_generation_id: candidate.generation_id,
        candidate_request_sha256: candidate.request_sha256,
        judge_inputs: judgeInputs,
        score_input_sha256: sha256({
          candidate_generation_id: candidate.generation_id,
          candidate_request_sha256: candidate.request_sha256,
          judge_inputs: judgeInputs,
        }),
        ...scored,
      };
      await writeJson(join(runRoot, "scores", model.slug, `sample-${sample}.json`), scoredArtifact);
      scoredRuns.push(scored);
    }
    if (!scoredRuns.length) {
      const catalogueModel = snapshot.models.find((candidate) => candidate.id === model.id);
      const endpoint = modelEndpointSummary(candidateArtifacts, snapshot, model.id);
      modelResults.push({
        model,
        status: candidateArtifacts.length ? "incomplete" : "unavailable",
        samples_completed: 0,
        candidate_samples_completed: candidateArtifacts.length,
        incomplete_samples: incompleteSamples,
        openrouter: {
          requested_id: model.id,
          returned_models: endpoint.returnedModels,
          providers: endpoint.providers,
          endpoint_tags: endpoint.endpointTags,
          quantizations: endpoint.quantizations,
          context_length: catalogueModel?.context_length ?? null,
          pricing: endpoint.pricing,
        },
        caveat:
          model.id === "moonshotai/kimi-k3"
            ? "Kimi K3 via Moonshot AI, INT4, OpenRouter. Mandatory max reasoning; full weights were not yet released on 18 July 2026."
            : null,
      });
      continue;
    }
    const aggregate = aggregateModelRuns(scoredRuns);
    const catalogueModel = snapshot.models.find((candidate) => candidate.id === model.id);
    const endpoint = modelEndpointSummary(candidateArtifacts, snapshot, model.id);
    const candidateCost = await providerReportedSpendUnder(join(runRoot, "attempts", "candidates", model.slug));
    const judgeCost = await providerReportedSpendUnder(join(runRoot, "attempts", "judgements", model.slug));
    modelResults.push({
      model,
      status: scoredRuns.length === config.samples_per_model ? "complete" : "partial",
      samples_completed: scoredRuns.length,
      candidate_samples_completed: candidateArtifacts.length,
      incomplete_samples: incompleteSamples,
      ...aggregate,
      sample_scores: scoredRuns.map((run) => run.overall),
      provider_reported_candidate_cost_usd: Number(candidateCost.toFixed(6)),
      provider_reported_judge_cost_usd: Number(judgeCost.toFixed(6)),
      median_latency_ms: Math.round(median(candidateArtifacts.map((artifact) => artifact.latency_ms))),
      finish_reasons: [...new Set(candidateArtifacts.map((artifact) => artifact.finish_reason).filter(Boolean))],
      openrouter: {
        requested_id: model.id,
        returned_models: endpoint.returnedModels,
        providers: endpoint.providers,
        endpoint_tags: endpoint.endpointTags,
        quantizations: endpoint.quantizations,
        context_length: catalogueModel?.context_length ?? null,
        pricing: endpoint.pricing,
      },
      caveat:
        model.id === "moonshotai/kimi-k3"
          ? "Kimi K3 via Moonshot AI, INT4, OpenRouter. Mandatory max reasoning; full weights were not yet released on 18 July 2026."
          : null,
    });
  }

  const ranked = modelResults
    .filter((result) => result.status === "complete")
    .sort((a, b) => b.overall - a.overall || a.model.slug.localeCompare(b.model.slug));
  ranked.forEach((result, index) => {
    result.rank = index + 1;
    result.provisional_tie = [ranked[index - 1], ranked[index + 1]].some(
      (neighbour) => neighbour && Math.abs(result.overall - neighbour.overall) < 2,
    );
  });
  const partial = modelResults
    .filter((result) => result.status === "partial")
    .sort((a, b) => b.overall - a.overall || a.model.slug.localeCompare(b.model.slug));
  const incomplete = modelResults.filter((result) => result.status === "incomplete");
  const unavailable = modelResults.filter((result) => result.status === "unavailable");
  const spend = await existingSpend();
  const conservativeSpend = await accountedSpend();
  const reportedSpend = await providerReportedSpend();
  const publicResults = {
    benchmark: {
      id: config.benchmark_id,
      methodology_version: config.methodology_version,
      evaluated_at: config.evaluated_at,
      mode: config.mode,
      case_id: benchmarkCase.id,
      case_name: benchmarkCase.name,
      case_confidentiality: benchmarkCase.confidentiality,
      run_id: runId,
      tasks: 4,
      samples_per_model: config.samples_per_model,
      models_requested: config.models.length,
      models_completed: ranked.length,
      models_partial: partial.length,
      models_incomplete: incomplete.length,
      models_unavailable: unavailable.length,
      total_spend_usd: Number(spend.toFixed(6)),
      conservatively_accounted_spend_usd: Number(conservativeSpend.toFixed(6)),
      provider_reported_spend_usd: Number(reportedSpend.toFixed(6)),
      spend_basis:
        "Total spend is the final settled usage for the dedicated OpenRouter key. Conservative accounting reserves request maxima for ambiguous dispatches; provider-reported spend includes generations with usage records across all benchmark attempts.",
      local_budget_usd: config.local_budget_usd,
      prompt_sha256: sha256(buildCandidateMessages(benchmarkCase)),
      judge_system_prompt_sha256:
        judgeSystemPromptHashes.size === 1
          ? [...judgeSystemPromptHashes][0]
          : sha256([...judgeSystemPromptHashes].sort()),
      candidate_schema_variants: config.candidate_schema_variants.map((variant) => ({
        ...variant,
        accepted_samples: candidateSchemaVariantCounts.get(variant.response_format_sha256) ?? 0,
      })),
      case_sha256: sha256(benchmarkCase),
      model_snapshot_sha256:
        snapshot.selected_snapshot_sha256 ?? sha256({ models: snapshot.models, endpoints: snapshot.endpoints }),
      data_source: "Observed OpenRouter completions",
      limitation:
        "Directional mini benchmark: one fresh synthetic case and two samples per model. It is not a universal ranking of model intelligence.",
    },
    methodology: {
      weights: {
        grounding: 0.15,
        commercial_judgement: 0.2,
        scepticism: 0.15,
        numerical_sanity: 0.15,
        risk_discovery: 0.15,
        question_generation: 0.1,
        european_context: 0.05,
        output_usefulness: 0.05,
      },
      scoring:
        "Reference-scored metrics, issue coverage, ranking and constrained action selection; blinded cross-family judges score only the IC note, with grades normalised between weak and strong anchors.",
      reasoning_policy:
        "A 2,048-token reasoning budget for candidates and 1,024 for judges; Kimi K3 uses its mandatory max level.",
      tie_rule: "Differences below two points are marked as provisional ties.",
    },
    models: [...ranked, ...partial, ...incomplete, ...unavailable],
  };
  await writeJson(join(runRoot, "public-results.json"), publicResults);
  await writeJson(join(repoRoot, "data", "observed-results.json"), publicResults);
  process.stdout.write(`Scored ${ranked.length} models; recorded spend $${spend.toFixed(4)}.\n`);
  for (const result of ranked) {
    process.stdout.write(
      `#${result.rank} ${result.model.name}: ${result.overall.toFixed(2)} (${result.range.join("-")})\n`,
    );
  }
}

async function preflight(snapshot) {
  const includeCandidates = ["all", "preflight", "candidates"].includes(stage);
  const includeJudges = ["all", "preflight", "judges"].includes(stage);
  const candidates = includeCandidates ? candidateItems(snapshot) : [];
  const candidateMaximum = candidates.reduce((sum, item) => sum + item.maximumCost, 0);
  const judgeMessages = buildJudgeMessages(benchmarkCase, anchors, anchors.strong);
  const selectedJudges = judgeFilter?.length
    ? config.judges.filter((judge) => judgeFilter.includes(judge.slug))
    : config.judges;
  const selectedModelCount = modelFilter?.length
    ? config.models.filter((model) => modelFilter.includes(model.slug)).length
    : config.models.length;
  const selectedSampleCount = sampleFilter?.length ? sampleFilter.length : config.samples_per_model;
  const judgeMaximum = includeJudges
    ? selectedModelCount *
      selectedSampleCount *
      selectedJudges.reduce(
        (sum, judge) => sum + requestPlan(snapshot, judge.id, judgeMessages, judgeMaxTokens(judge), 5_000).maximumCost,
        0,
      )
    : 0;
  const estimate = {
    generated_at: new Date().toISOString(),
    input_token_estimator: "UTF-8 JSON characters divided by three",
    candidate_maximum_usd: Number(candidateMaximum.toFixed(6)),
    judge_maximum_usd: Number(judgeMaximum.toFixed(6)),
    all_in_maximum_usd: Number((candidateMaximum + judgeMaximum).toFixed(6)),
    local_budget_usd: config.local_budget_usd,
    recorded_spend_usd: Number((await existingSpend()).toFixed(6)),
    candidate_calls: candidates.length,
    judge_calls: includeJudges ? selectedModelCount * selectedSampleCount * selectedJudges.length : 0,
  };
  estimate.within_budget = estimate.recorded_spend_usd + candidateMaximum + judgeMaximum <= config.local_budget_usd;
  const preflightFilename = ["all", "preflight"].includes(stage) ? "preflight.json" : `preflight-${stage}.json`;
  await writeJson(join(runRoot, preflightFilename), estimate);
  process.stdout.write(`${JSON.stringify(estimate, null, 2)}\n`);
  if (!estimate.within_budget) throw new Error("Worst-case preflight exceeds the local budget.");
}

await mkdir(runRoot, { recursive: true });
const snapshot = (await readJsonIfPresent(join(runRoot, "model-snapshot.json"))) ?? (await snapshotModels());
if (!snapshot.selected_snapshot_sha256) {
  snapshot.selected_snapshot_sha256 = sha256({ models: snapshot.models, endpoints: snapshot.endpoints });
  await writeJson(join(runRoot, "model-snapshot.json"), snapshot);
}
await preflight(snapshot);

if (stage !== "preflight") {
  const ledger = new BudgetLedger(await existingSpend(), config.local_budget_usd);
  if (["all", "candidates"].includes(stage)) await runCandidates(snapshot, ledger);
  if (["all", "judges"].includes(stage)) await runJudges(snapshot, ledger);
  if (["all", "score"].includes(stage)) await scoreRun(snapshot);
  process.stdout.write(`Budget ledger: $${ledger.spent.toFixed(4)} spent of $${ledger.limit.toFixed(2)}.\n`);
}
