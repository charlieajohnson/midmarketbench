export function RankDelta({ delta }: { delta: number | "new" }) {
  if (delta === "new") return <span className="rank-delta muted">new</span>;
  if (delta === 0) return <span className="rank-delta muted">•</span>;
  return (
    <span className={`rank-delta ${delta > 0 ? "rank-up" : "rank-down"}`}>
      {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
    </span>
  );
}
