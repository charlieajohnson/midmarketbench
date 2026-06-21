import type { LeaderboardRow } from "@/lib/types";

export function DistributionStrip({ rows, focusSlug }: { rows: LeaderboardRow[]; focusSlug: string }) {
  const scores = rows.map((row) => row.overall);
  const min = Math.min(...scores) - 2;
  const max = Math.max(...scores) + 2;
  return (
    <div>
      <div className="distribution" aria-label="Overall score distribution">
        {rows.map((row) => (
          <span
            key={row.model.slug}
            className="distribution-dot"
            data-focus={row.model.slug === focusSlug}
            title={`${row.model.name}: ${row.overall.toFixed(1)}`}
            style={{ left: `${((row.overall - min) / (max - min)) * 100}%` }}
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
