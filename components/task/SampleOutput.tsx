import { Markdown } from "@/components/common/Markdown";
import { dimensions } from "@/data/dimensions";
import { roundScore } from "@/lib/scoring";
import type { Model, SampleOutput as SampleOutputType } from "@/lib/types";

export function SampleOutput({ output, model }: { output: SampleOutputType; model?: Model }) {
  return (
    <article className="sample-output" data-quality={output.quality}>
      <header className="sample-head">
        <div>
          <p className="eyebrow">{output.quality} sample</p>
          <h3 style={{ margin: 0 }}>{model?.name ?? output.modelSlug}</h3>
        </div>
        <div className="score-chips">
          {dimensions.map((dimension) => (
            <span className="score-chip" key={dimension.key}>
              {dimension.shortLabel} {roundScore(output.scores[dimension.key])}
            </span>
          ))}
        </div>
      </header>
      <Markdown>{output.content}</Markdown>
      <p className="rationale">
        <strong>Evaluator rationale:</strong> {output.evaluatorRationale}
      </p>
    </article>
  );
}
