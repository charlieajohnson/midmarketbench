import { describe, expect, it } from "vitest";
import { loadObservedBenchmarkData, parseObservedResults } from "@/data/observed";

const scores = {
  grounding: 80,
  commercial_judgement: 80,
  scepticism: 80,
  numerical_sanity: 80,
  risk_discovery: 80,
  question_generation: 80,
  european_context: 80,
  output_usefulness: 80,
};

const weights = {
  grounding: 0.15,
  commercial_judgement: 0.2,
  scepticism: 0.15,
  numerical_sanity: 0.15,
  risk_discovery: 0.15,
  question_generation: 0.1,
  european_context: 0.05,
  output_usefulness: 0.05,
};

const endpoint = {
  requested_id: "openai/test-model",
  returned_models: ["openai/test-model"],
  providers: ["OpenAI"],
  endpoint_tags: ["openai"],
  quantizations: [],
  context_length: 100_000,
  pricing: {
    basis: "selected_endpoint_snapshot",
    endpoints: [
      {
        tag: "openai",
        provider: "OpenAI",
        prompt_usd_per_million: 1,
        completion_usd_per_million: 4,
      },
    ],
  },
};

function publicResultsFixture() {
  const scoredFields = {
    samples_completed: 1,
    candidate_samples_completed: 1,
    incomplete_samples: [],
    dimensions: scores,
    overall: 80,
    range: [80, 80],
    sample_scores: [80],
    provider_reported_candidate_cost_usd: 0.01,
    provider_reported_judge_cost_usd: 0.02,
    median_latency_ms: 1000,
    finish_reasons: ["stop"],
    openrouter: endpoint,
    caveat: null,
  };
  return {
    benchmark: {
      id: "test-benchmark",
      methodology_version: "test-v1",
      evaluated_at: "2026-07-18",
      mode: "Closed-book",
      case_id: "case-1",
      case_name: "Test case",
      case_confidentiality: "Synthetic",
      run_id: "run-1",
      tasks: 4,
      samples_per_model: 1,
      models_requested: 3,
      models_completed: 1,
      models_partial: 1,
      models_incomplete: 0,
      models_unavailable: 1,
      total_spend_usd: 0.1,
      conservatively_accounted_spend_usd: 0.1,
      provider_reported_spend_usd: 0.1,
      spend_basis: "Provider usage records.",
      local_budget_usd: 5,
      prompt_sha256: "prompt-hash",
      judge_system_prompt_sha256: "judge-prompt-hash",
      candidate_schema_variants: [{ id: "test", response_format_sha256: "schema-hash", accepted_samples: 2 }],
      case_sha256: "case-hash",
      model_snapshot_sha256: "snapshot-hash",
      data_source: "Observed OpenRouter completions",
      limitation: "Mini benchmark.",
    },
    methodology: {
      weights,
      scoring: "Test scoring.",
      reasoning_policy: "Test policy.",
      tie_rule: "Test tie rule.",
    },
    models: [
      {
        ...scoredFields,
        status: "complete",
        rank: 1,
        provisional_tie: false,
        model: { id: "openai/test-model", slug: "test-model", name: "Test Model", provider_id: "openai" },
      },
      {
        ...scoredFields,
        status: "partial",
        model: { id: "google/test-partial", slug: "test-partial", name: "Test Partial", provider_id: "google" },
        openrouter: { ...endpoint, requested_id: "google/test-partial" },
      },
      {
        status: "unavailable",
        samples_completed: 0,
        candidate_samples_completed: 0,
        incomplete_samples: [{ sample: 1, stage: "candidate", reason: "No route available." }],
        model: {
          id: "anthropic/test-unavailable",
          slug: "test-unavailable",
          name: "Test Unavailable",
          provider_id: "anthropic",
        },
        openrouter: { ...endpoint, requested_id: "anthropic/test-unavailable", returned_models: [] },
        caveat: null,
      },
    ],
  };
}

describe("observed benchmark adapter", () => {
  it("normalises ranked, partial and unavailable results without rank deltas", () => {
    const data = parseObservedResults(publicResultsFixture());

    expect(data.run.dataStatus).toBe("observed");
    expect(data.models.map(({ status }) => status)).toEqual(["complete", "partial", "unavailable"]);
    expect(data.leaderboard).toHaveLength(1);
    expect(data.leaderboard[0]).not.toHaveProperty("delta");
    expect(data.leaderboard[0]?.endpoint.requestedId).toBe("openai/test-model");
  });

  it("returns the current roster as unranked when the scored file is absent", () => {
    const data = loadObservedBenchmarkData("/definitely-not-present/midmarketbench-observed-results.json");

    expect(data.run.dataStatus).toBe("pending");
    expect(data.leaderboard).toEqual([]);
    expect(data.models).toHaveLength(9);
    expect(data.models.every(({ status, rank }) => status === "pending" && rank === null)).toBe(true);
  });

  it("rejects an internally inconsistent published score", () => {
    const fixture = publicResultsFixture();
    Object.assign(fixture.models[0]!, { overall: 72 });

    expect(() => parseObservedResults(fixture)).toThrow();
  });
});
