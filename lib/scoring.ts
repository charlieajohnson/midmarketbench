import type { DimensionKey, LeaderboardRow, Model, Provider, ScoreSet } from "@/lib/types";

export function calculateOverall(scores: ScoreSet, weights: Record<DimensionKey, number>): number {
  return Object.entries(weights).reduce((total, [key, weight]) => total + scores[key as DimensionKey] * weight, 0);
}

export function roundScore(value: number): number {
  return Math.round(value * 10) / 10;
}

export function rankModels(
  models: Model[],
  providers: Provider[],
  scoresByModel: Record<string, ScoreSet>,
  weights: Record<DimensionKey, number>,
  deltas: Record<string, number | "new">,
): LeaderboardRow[] {
  const rows = models.map((model) => {
    const scores = scoresByModel[model.slug];
    const provider = providers.find((candidate) => candidate.id === model.providerId);

    if (!scores || !provider) {
      throw new Error(`Incomplete leaderboard data for ${model.slug}`);
    }

    return {
      rank: 0,
      delta: deltas[model.slug] ?? "new",
      model,
      provider,
      scores,
      overall: calculateOverall(scores, weights),
      mode: "Closed-book" as const,
    };
  });

  return rows
    .sort(
      (a, b) =>
        b.overall - a.overall ||
        b.scores.commercial_judgement - a.scores.commercial_judgement ||
        b.scores.grounding - a.scores.grounding ||
        a.model.slug.localeCompare(b.model.slug),
    )
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

export function scoreTone(score: number): "positive" | "caution" | "negative" {
  if (score >= 80) return "positive";
  if (score >= 70) return "caution";
  return "negative";
}
