import type { Dimension } from "@/lib/types";

export function DimensionLegend({ dimensions }: { dimensions: Dimension[] }) {
  return (
    <div className="dimension-grid">
      {dimensions.map((dimension) => (
        <article className="dimension-item" key={dimension.key}>
          <div className="dimension-head">
            <h3>{dimension.label}</h3>
            <span className="mono fine">{Math.round(dimension.weight * 100)}%</span>
          </div>
          <p>{dimension.description}</p>
        </article>
      ))}
    </div>
  );
}
