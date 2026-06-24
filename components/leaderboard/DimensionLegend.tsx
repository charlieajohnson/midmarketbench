import type { Dimension } from "@/lib/types";

export function DimensionLegend({ dimensions }: { dimensions: Dimension[] }) {
  return (
    <div className="dimension-grid">
      {dimensions.map((dimension) => {
        const weightPercent = Math.round(dimension.weight / 0.01);
        const barWidth = Math.min(100, Math.round(dimension.weight / 0.0025));
        return (
          <article className="dimension-item" key={dimension.key}>
            <div className="dimension-head">
              <h3>{dimension.label}</h3>
              <span className="dimension-weight mono">{weightPercent}%</span>
            </div>
            <span className="bar-track" aria-hidden="true">
              <span className="bar-fill" style={{ width: `${barWidth}%` }} />
            </span>
            <p>{dimension.description}</p>
          </article>
        );
      })}
    </div>
  );
}
