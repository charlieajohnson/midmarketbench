import type { Dimension, ScoreSet } from "@/lib/types";

export function DimensionBars({ scores, dimensions }: { scores: ScoreSet; dimensions: Dimension[] }) {
  return (
    <div className="dimension-bars">
      {dimensions.map((dimension) => (
        <div className="bar-row" key={dimension.key}>
          <span>{dimension.label}</span>
          <span className="bar-track">
            <span
              className="bar-fill"
              style={{ width: `${Math.min(Math.max(scores[dimension.key], 0), 100)}%`, display: "block" }}
            />
          </span>
          <span className="mono">{scores[dimension.key].toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
}
