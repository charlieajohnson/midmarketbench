import type { CSSProperties } from "react";
import { roundScore, scoreTone } from "@/lib/scoring";

export function ScoreCell({ value, leader = false }: { value: number; leader?: boolean }) {
  const score = roundScore(value);
  return (
    <td
      className={`score-cell score-${scoreTone(value)} mono ${leader ? "leader-score" : ""}`}
      style={{ "--score": `${score}%` } as CSSProperties}
    >
      {score.toFixed(1)}
    </td>
  );
}
