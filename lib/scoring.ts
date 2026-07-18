import type { DimensionKey, ScoreSet } from "@/lib/types";

export function calculateOverall(scores: ScoreSet, weights: Record<DimensionKey, number>): number {
  return Object.entries(weights).reduce((total, [key, weight]) => total + scores[key as DimensionKey] * weight, 0);
}

export function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

export function scoreTone(score: number): "positive" | "caution" | "negative" {
  if (score >= 80) return "positive";
  if (score >= 70) return "caution";
  return "negative";
}
