import { describe, expect, it } from "vitest";
import { dimensions, dimensionWeights } from "@/data/dimensions";
import { calculateOverall, rankModels, roundScore } from "@/lib/scoring";
import type { Model, Provider, ScoreSet } from "@/lib/types";

const equalScores: ScoreSet = {
  grounding: 80,
  commercial_judgement: 80,
  scepticism: 80,
  numerical_sanity: 80,
  risk_discovery: 80,
  question_generation: 80,
  european_context: 80,
  output_usefulness: 80,
};

describe("scoring", () => {
  it("keeps methodology weights at one", () => {
    expect(dimensions.reduce((sum, dimension) => sum + dimension.weight, 0)).toBeCloseTo(1);
  });

  it("computes and rounds the weighted score", () => {
    expect(calculateOverall(equalScores, dimensionWeights)).toBe(80);
    expect(roundScore(82.849)).toBe(82.8);
  });

  it("breaks ties deterministically by model slug", () => {
    const provider: Provider = { id: "p", name: "Provider", slug: "provider", website: "https://example.com" };
    const model = (slug: string): Model => ({
      id: slug,
      slug,
      name: slug,
      providerId: "p",
      version: "1",
      release: "2026-01",
      contextWindow: "n/a",
      openWeights: false,
      sourceUrl: "https://example.com",
    });
    const ranked = rankModels(
      [model("z-model"), model("a-model")],
      [provider],
      { "z-model": equalScores, "a-model": equalScores },
      dimensionWeights,
      {},
    );
    expect(ranked.map((row) => row.model.slug)).toEqual(["a-model", "z-model"]);
  });
});
