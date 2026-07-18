import type { LeaderboardRow } from "@/lib/types";

export function DistributionStrip({ rows, focusSlug }: { rows: LeaderboardRow[]; focusSlug: string }) {
  const scores = rows.map((row) => row.overall);
  if (!scores.length) {
    return <p className="fine">No complete model runs are available for this distribution.</p>;
  }
  const min = Math.max(0, Math.min(...scores) - 2);
  const max = Math.min(100, Math.max(...scores) + 2);
  const spread = Math.max(max - min, 1);
  return (
    <div>
      <div className="distribution" aria-label="Overall score distribution">
        {rows.map((row) => (
          <span
            key={row.model.slug}
            className="distribution-dot"
            data-focus={row.model.slug === focusSlug}
            title={`${row.model.name}: ${row.overall.toFixed(1)}`}
            style={{ left: `${((row.overall - min) / spread) * 100}%` }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }} className="mono fine">
        <span>{min.toFixed(0)}</span>
        <span>{max.toFixed(0)}</span>
      </div>
    </div>
  );
}
