import { describe, expect, it } from "vitest";
import { dimensions, dimensionWeights } from "@/data/dimensions";
import { calculateOverall, roundScore } from "@/lib/scoring";
import type { ScoreSet } from "@/lib/types";

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
});
