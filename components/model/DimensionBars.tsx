import type { Dimension, ScoreSet } from "@/lib/types";

export function DimensionBars({ scores, dimensions }: { scores: ScoreSet; dimensions: Dimension[] }) {
  return (
    <div className="dimension-bars">
      {dimensions.map((dimension) => (
        <div className="bar-row" key={dimension.key}>
          <span>{dimension.label}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${scores[dimension.key]}%`, display: "block" }} />
          </span>
          <span className="mono">{scores[dimension.key]}</span>
        </div>
      ))}
    </div>
  );
}
