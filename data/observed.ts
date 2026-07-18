import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import benchmarkCase from "@/benchmark/mini-v0.4/case.json";
import benchmarkConfig from "@/benchmark/mini-v0.4/config.json";
import { providers } from "@/data/providers";
import type {
  BenchmarkRunSummary,
  LeaderboardRow,
  Model,
  ModelBenchmarkResult,
  OpenRouterEndpoint,
  Provider,
  ScoreSet,
} from "@/lib/types";

const scoreSchema = z.number().finite().min(0).max(100);
const scoreSetSchema = z.object({
  grounding: scoreSchema,
  commercial_judgement: scoreSchema,
  scepticism: scoreSchema,
  numerical_sanity: scoreSchema,
  risk_discovery: scoreSchema,
  question_generation: scoreSchema,
  european_context: scoreSchema,
  output_usefulness: scoreSchema,
});

const rosterModelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  provider_id: z.string().min(1),
});

const incompleteSampleSchema = z.object({
  sample: z.number().int().positive(),
  stage: z.string().min(1),
  reason: z.string().min(1),
});

const endpointSchema = z.object({
  requested_id: z.string().min(1),
  returned_models: z.array(z.string()),
  providers: z.array(z.string()),
  endpoint_tags: z.array(z.string()),
  quantizations: z.array(z.string()),
  context_length: z.number().int().positive().nullable(),
  pricing: z
    .object({
      basis: z.literal("selected_endpoint_snapshot"),
      endpoints: z.array(
        z.object({
          tag: z.string().min(1),
          provider: z.string().min(1),
          prompt_usd_per_million: z.number().finite().nonnegative(),
          completion_usd_per_million: z.number().finite().nonnegative(),
        }),
      ),
    })
    .nullable(),
});

const resultBaseSchema = z.object({
  model: rosterModelSchema,
  samples_completed: z.number().int().nonnegative(),
  candidate_samples_completed: z.number().int().nonnegative(),
  incomplete_samples: z.array(incompleteSampleSchema),
  openrouter: endpointSchema,
  caveat: z.string().nullable(),
});

const scoredResultFields = {
  dimensions: scoreSetSchema,
  overall: scoreSchema,
  range: z.tuple([scoreSchema, scoreSchema]),
  sample_scores: z.array(scoreSchema).min(1),
  provider_reported_candidate_cost_usd: z.number().finite().nonnegative(),
  provider_reported_judge_cost_usd: z.number().finite().nonnegative(),
  median_latency_ms: z.number().int().nonnegative(),
  finish_reasons: z.array(z.string()),
};

const completeResultSchema = resultBaseSchema.extend({
  ...scoredResultFields,
  status: z.literal("complete"),
  rank: z.number().int().positive(),
  provisional_tie: z.boolean(),
});

const partialResultSchema = resultBaseSchema.extend({
  ...scoredResultFields,
  status: z.literal("partial"),
});

const unavailableResultSchema = resultBaseSchema.extend({
  status: z.literal("unavailable"),
  samples_completed: z.literal(0),
});

const incompleteResultSchema = resultBaseSchema.extend({
  status: z.literal("incomplete"),
  samples_completed: z.literal(0),
});

const publicResultsSchema = z
  .object({
    benchmark: z.object({
      id: z.string().min(1),
      methodology_version: z.string().min(1),
      evaluated_at: z.string().min(1),
      mode: z.enum(["Closed-book", "Web-enabled", "Agentic"]),
      case_id: z.string().min(1),
      case_name: z.string().min(1),
      case_confidentiality: z.string().min(1),
      run_id: z.string().min(1),
      tasks: z.number().int().positive(),
      samples_per_model: z.number().int().positive(),
      models_requested: z.number().int().positive(),
      models_completed: z.number().int().nonnegative(),
      models_partial: z.number().int().nonnegative(),
      models_incomplete: z.number().int().nonnegative(),
      models_unavailable: z.number().int().nonnegative(),
      total_spend_usd: z.number().finite().nonnegative(),
      conservatively_accounted_spend_usd: z.number().finite().nonnegative(),
      provider_reported_spend_usd: z.number().finite().nonnegative(),
      spend_basis: z.string().min(1),
      local_budget_usd: z.number().finite().positive(),
      prompt_sha256: z.string().min(1),
      judge_system_prompt_sha256: z.string().min(1),
      candidate_schema_variants: z.array(
        z.object({
          id: z.string().min(1),
          response_format_sha256: z.string().min(1),
          accepted_samples: z.number().int().nonnegative(),
        }),
      ),
      case_sha256: z.string().min(1),
      model_snapshot_sha256: z.string().min(1),
      data_source: z.string().min(1),
      limitation: z.string().min(1),
    }),
    methodology: z.object({
      weights: scoreSetSchema,
      scoring: z.string().min(1),
      reasoning_policy: z.string().min(1),
      tie_rule: z.string().min(1),
    }),
    models: z.array(
      z.discriminatedUnion("status", [
        completeResultSchema,
        partialResultSchema,
        incompleteResultSchema,
        unavailableResultSchema,
      ]),
    ),
  })
  .superRefine((data, context) => {
    const statuses = {
      complete: data.models.filter(({ status }) => status === "complete").length,
      partial: data.models.filter(({ status }) => status === "partial").length,
      incomplete: data.models.filter(({ status }) => status === "incomplete").length,
      unavailable: data.models.filter(({ status }) => status === "unavailable").length,
    };
    const expected = data.benchmark;
    const slugs = data.models.map(({ model }) => model.slug);
    const completeRanks = data.models
      .filter((result) => result.status === "complete")
      .map((result) => result.rank)
      .sort((a, b) => (a ?? 0) - (b ?? 0));

    if (new Set(slugs).size !== slugs.length) {
      context.addIssue({ code: "custom", message: "Model slugs must be unique.", path: ["models"] });
    }
    if (data.models.length !== expected.models_requested) {
      context.addIssue({ code: "custom", message: "models_requested does not match the result roster." });
    }
    if (
      statuses.complete !== expected.models_completed ||
      statuses.partial !== expected.models_partial ||
      statuses.incomplete !== expected.models_incomplete ||
      statuses.unavailable !== expected.models_unavailable
    ) {
      context.addIssue({ code: "custom", message: "Benchmark status counts do not match the model results." });
    }
    if (completeRanks.some((rank, index) => rank !== index + 1)) {
      context.addIssue({ code: "custom", message: "Complete model ranks must be present and contiguous." });
    }
    if (expected.total_spend_usd > expected.local_budget_usd) {
      context.addIssue({ code: "custom", message: "Recorded spend exceeds the published local budget." });
    }
    const schemaHashes = expected.candidate_schema_variants.map((variant) => variant.response_format_sha256);
    const acceptedSchemaSamples = expected.candidate_schema_variants.reduce(
      (sum, variant) => sum + variant.accepted_samples,
      0,
    );
    const completedCandidateSamples = data.models.reduce((sum, result) => sum + result.candidate_samples_completed, 0);
    if (new Set(schemaHashes).size !== schemaHashes.length || acceptedSchemaSamples !== completedCandidateSamples) {
      context.addIssue({ code: "custom", message: "Candidate schema manifest does not match accepted samples." });
    }
    const weightTotal = Object.values(data.methodology.weights).reduce((sum, weight) => sum + weight, 0);
    if (Math.abs(weightTotal - 1) > 0.000_001) {
      context.addIssue({ code: "custom", message: "Methodology weights must sum to one." });
    }
    for (const [index, result] of data.models.entries()) {
      if ((result.status === "complete" || result.status === "partial") && result.range[0] > result.range[1]) {
        context.addIssue({ code: "custom", message: "Score range is reversed.", path: ["models", index, "range"] });
      }
      if (result.status === "unavailable" || result.status === "incomplete") continue;

      const minimum = Math.min(...result.sample_scores);
      const maximum = Math.max(...result.sample_scores);
      const mean = result.sample_scores.reduce((sum, score) => sum + score, 0) / result.sample_scores.length;
      const weightedOverall = Object.entries(data.methodology.weights).reduce(
        (sum, [key, weight]) => sum + result.dimensions[key as keyof typeof result.dimensions] * weight,
        0,
      );
      if (result.sample_scores.length !== result.samples_completed) {
        context.addIssue({
          code: "custom",
          message: "Sample-score count does not match samples_completed.",
          path: ["models", index, "sample_scores"],
        });
      }
      if (Math.abs(result.range[0] - minimum) > 0.01 || Math.abs(result.range[1] - maximum) > 0.01) {
        context.addIssue({
          code: "custom",
          message: "Published range does not match the sample scores.",
          path: ["models", index, "range"],
        });
      }
      if (Math.abs(result.overall - mean) > 0.01 || Math.abs(result.overall - weightedOverall) > 0.05) {
        context.addIssue({
          code: "custom",
          message: "Published overall does not match the samples and weighted dimensions.",
          path: ["models", index, "overall"],
        });
      }
    }
  });

type PublicResults = z.infer<typeof publicResultsSchema>;
type RosterModel = z.infer<typeof rosterModelSchema>;

export type ObservedBenchmarkData = {
  run: BenchmarkRunSummary;
  models: ModelBenchmarkResult[];
  leaderboard: LeaderboardRow[];
};

function providerFor(providerId: string): Provider {
  const provider = providers.find(({ id }) => id === providerId);
  if (!provider) throw new Error(`Unknown model provider in observed results: ${providerId}`);
  return provider;
}

function formatContextWindow(contextLength: number | null): string {
  return contextLength ? `${new Intl.NumberFormat("en-GB").format(contextLength)} tokens` : "Not reported";
}

function endpointFromRaw(endpoint: z.infer<typeof endpointSchema>): OpenRouterEndpoint {
  return {
    requestedId: endpoint.requested_id,
    returnedModels: endpoint.returned_models,
    providers: endpoint.providers,
    endpointTags: endpoint.endpoint_tags,
    quantizations: endpoint.quantizations,
    contextLength: endpoint.context_length,
    pricing: endpoint.pricing
      ? {
          basis: endpoint.pricing.basis,
          endpoints: endpoint.pricing.endpoints.map((price) => ({
            tag: price.tag,
            provider: price.provider,
            promptUsdPerMillion: price.prompt_usd_per_million,
            completionUsdPerMillion: price.completion_usd_per_million,
          })),
        }
      : null,
  };
}

function modelFromRaw(rosterModel: RosterModel, endpoint: OpenRouterEndpoint): Model {
  return {
    id: rosterModel.id,
    slug: rosterModel.slug,
    name: rosterModel.name,
    providerId: rosterModel.provider_id,
    version: rosterModel.id.split("/").at(-1) ?? rosterModel.id,
    release: null,
    contextWindow: formatContextWindow(endpoint.contextLength),
    openWeights: null,
    sourceUrl: `https://openrouter.ai/${rosterModel.id}`,
  };
}

function normaliseObservedResults(raw: PublicResults): ObservedBenchmarkData {
  const models: ModelBenchmarkResult[] = raw.models.map((result) => {
    const endpoint = endpointFromRaw(result.openrouter);
    const model = modelFromRaw(result.model, endpoint);
    const provider = providerFor(model.providerId);
    const common = {
      model,
      provider,
      samplesCompleted: result.samples_completed,
      candidateSamplesCompleted: result.candidate_samples_completed,
      samplesRequested: raw.benchmark.samples_per_model,
      incompleteSamples: result.incomplete_samples.map((item) => ({
        sample: item.sample,
        stage: item.stage,
        reason: item.reason,
      })),
      endpoint,
      caveat: result.caveat,
    };

    if (result.status === "unavailable" || result.status === "incomplete") {
      return {
        ...common,
        status: result.status,
        samplesCompleted: 0,
        rank: null,
        provisionalTie: false,
      };
    }

    const scored = {
      ...common,
      scores: result.dimensions as ScoreSet,
      overall: result.overall,
      range: result.range,
      sampleScores: result.sample_scores,
      providerReportedCandidateCostUsd: result.provider_reported_candidate_cost_usd,
      providerReportedJudgeCostUsd: result.provider_reported_judge_cost_usd,
      medianLatencyMs: result.median_latency_ms,
      finishReasons: result.finish_reasons,
    };
    return result.status === "complete"
      ? {
          ...scored,
          status: result.status,
          rank: result.rank,
          provisionalTie: result.provisional_tie,
        }
      : {
          ...scored,
          status: result.status,
          rank: null,
          provisionalTie: false,
        };
  });

  const run: BenchmarkRunSummary = {
    dataStatus: "observed",
    dataSource: raw.benchmark.data_source,
    benchmarkId: raw.benchmark.id,
    methodologyVersion: raw.benchmark.methodology_version,
    evaluatedAt: raw.benchmark.evaluated_at,
    runId: raw.benchmark.run_id,
    mode: raw.benchmark.mode,
    caseId: raw.benchmark.case_id,
    caseName: raw.benchmark.case_name,
    caseConfidentiality: raw.benchmark.case_confidentiality,
    tasks: raw.benchmark.tasks,
    samplesPerModel: raw.benchmark.samples_per_model,
    modelsRequested: raw.benchmark.models_requested,
    modelsCompleted: raw.benchmark.models_completed,
    modelsPartial: raw.benchmark.models_partial,
    modelsIncomplete: raw.benchmark.models_incomplete,
    modelsUnavailable: raw.benchmark.models_unavailable,
    totalSpendUsd: raw.benchmark.total_spend_usd,
    conservativelyAccountedSpendUsd: raw.benchmark.conservatively_accounted_spend_usd,
    providerReportedSpendUsd: raw.benchmark.provider_reported_spend_usd,
    spendBasis: raw.benchmark.spend_basis,
    localBudgetUsd: raw.benchmark.local_budget_usd,
    promptSha256: raw.benchmark.prompt_sha256,
    judgeSystemPromptSha256: raw.benchmark.judge_system_prompt_sha256,
    candidateSchemaVariants: raw.benchmark.candidate_schema_variants.map((variant) => ({
      id: variant.id,
      responseFormatSha256: variant.response_format_sha256,
      acceptedSamples: variant.accepted_samples,
    })),
    caseSha256: raw.benchmark.case_sha256,
    modelSnapshotSha256: raw.benchmark.model_snapshot_sha256,
    limitation: raw.benchmark.limitation,
    scoring: raw.methodology.scoring,
    reasoningPolicy: raw.methodology.reasoning_policy,
    tieRule: raw.methodology.tie_rule,
  };

  const leaderboard = models
    .filter((result) => result.status === "complete")
    .map(
      (result): LeaderboardRow => ({
        rank: result.rank ?? 0,
        model: result.model,
        provider: result.provider,
        scores: result.scores,
        overall: result.overall,
        range: result.range,
        sampleScores: result.sampleScores,
        samplesCompleted: result.samplesCompleted,
        samplesRequested: result.samplesRequested,
        providerReportedCandidateCostUsd: result.providerReportedCandidateCostUsd,
        providerReportedJudgeCostUsd: result.providerReportedJudgeCostUsd,
        medianLatencyMs: result.medianLatencyMs,
        provisionalTie: result.provisionalTie,
        endpoint: result.endpoint,
        caveat: result.caveat,
        mode: raw.benchmark.mode,
      }),
    )
    .sort((a, b) => a.rank - b.rank);

  return { run, models, leaderboard };
}

function pendingData(): ObservedBenchmarkData {
  const config = z
    .object({
      benchmark_id: z.string(),
      methodology_version: z.string(),
      evaluated_at: z.string(),
      mode: z.enum(["Closed-book", "Web-enabled", "Agentic"]),
      samples_per_model: z.number().int().positive(),
      local_budget_usd: z.number().positive(),
      models: z.array(rosterModelSchema),
    })
    .parse(benchmarkConfig);
  const models: ModelBenchmarkResult[] = config.models.map((rosterModel) => {
    const endpoint: OpenRouterEndpoint = {
      requestedId: rosterModel.id,
      returnedModels: [],
      providers: [],
      endpointTags: [],
      quantizations: [],
      contextLength: null,
      pricing: null,
    };
    return {
      status: "pending",
      model: modelFromRaw(rosterModel, endpoint),
      provider: providerFor(rosterModel.provider_id),
      samplesCompleted: 0,
      candidateSamplesCompleted: 0,
      samplesRequested: config.samples_per_model,
      incompleteSamples: [],
      endpoint,
      caveat: null,
      rank: null,
      provisionalTie: false,
    };
  });

  return {
    run: {
      dataStatus: "pending",
      dataSource: "Observed results pending",
      benchmarkId: config.benchmark_id,
      methodologyVersion: config.methodology_version,
      evaluatedAt: config.evaluated_at,
      runId: null,
      mode: config.mode,
      caseId: benchmarkCase.id,
      caseName: benchmarkCase.name,
      caseConfidentiality: benchmarkCase.confidentiality,
      tasks: 4,
      samplesPerModel: config.samples_per_model,
      modelsRequested: models.length,
      modelsCompleted: 0,
      modelsPartial: 0,
      modelsIncomplete: 0,
      modelsUnavailable: 0,
      totalSpendUsd: null,
      conservativelyAccountedSpendUsd: null,
      providerReportedSpendUsd: null,
      spendBasis: null,
      localBudgetUsd: config.local_budget_usd,
      promptSha256: null,
      judgeSystemPromptSha256: null,
      candidateSchemaVariants: [],
      caseSha256: null,
      modelSnapshotSha256: null,
      limitation: "The live mini benchmark has not been scored yet.",
      scoring: "Observed benchmark scoring pending.",
      reasoningPolicy: "Observed benchmark run pending.",
      tieRule: "Differences below two points are marked as provisional ties.",
    },
    models,
    leaderboard: [],
  };
}

export function parseObservedResults(value: unknown): ObservedBenchmarkData {
  return normaliseObservedResults(publicResultsSchema.parse(value));
}

export function loadObservedBenchmarkData(
  path = join(process.cwd(), "data", "observed-results.json"),
): ObservedBenchmarkData {
  let contents: string;
  try {
    contents = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return pendingData();
    throw error;
  }

  try {
    return parseObservedResults(JSON.parse(contents));
  } catch (error) {
    throw new Error(`Invalid observed benchmark data at ${path}`, { cause: error });
  }
}
