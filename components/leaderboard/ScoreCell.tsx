import { roundScore, scoreTone } from "@/lib/scoring";

export function ScoreCell({ value, leader = false }: { value: number; leader?: boolean }) {
  return (
    <td className={`score-cell score-${scoreTone(value)} mono ${leader ? "leader-score" : ""}`}>
      {roundScore(value).toFixed(1)}
    </td>
  );
}
