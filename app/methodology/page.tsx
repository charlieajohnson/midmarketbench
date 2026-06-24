import type { Metadata } from "next";
import { Badge } from "@/components/common/Badge";
import { PageHeader } from "@/components/common/PageHeader";
import { getRepository } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Methodology",
  description: "Dimensions, weights, run modes and evaluation protocol.",
};

const rubric = [
  [
    "5",
    "Excellent",
    "Identifies the issue, supports it, explains decision impact and proposes the right diligence action.",
  ],
  ["4", "Good", "Identifies and explains the issue but misses some nuance or evidence."],
  ["3", "Acceptable", "Partially identifies the issue but treats it generically or weakly prioritises it."],
  ["2", "Weak", "Gestures at the issue without understanding its commercial significance."],
  ["1", "Poor", "Misses the issue or reaches the opposite conclusion."],
];

export default async function MethodologyPage() {
  const dimensions = await getRepository().getDimensions();
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Methodology v0.3"
        title="Judgement carries the most weight."
        lede="MidMarketBench tests applied investment judgement against realistic synthetic diligence packets. Overall is derived from eight dimension scores, never stored directly."
      />
      <section className="section">
        <h2 className="section-title">Dimensions and weights</h2>
        <div className="table-wrap" style={{ marginTop: 24 }}>
          <table className="method-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Weight</th>
                <th>Definition</th>
                <th>High score</th>
                <th>Low score</th>
              </tr>
            </thead>
            <tbody>
              {dimensions.map((dimension) => (
                <tr key={dimension.key}>
                  <td>
                    {dimension.label}
                    {dimension.key === "commercial_judgement" && (
                      <span style={{ marginLeft: 8 }}>
                        <Badge>Heaviest</Badge>
                      </span>
                    )}
                  </td>
                  <td className="mono">{Math.round(dimension.weight * 100)}%</td>
                  <td>{dimension.description}</td>
                  <td>{dimension.high}</td>
                  <td>{dimension.low}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="section grid-2">
        <div>
          <p className="eyebrow">Scoring reference</p>
          <h2 className="section-title">Five-point rubric</h2>
          <p className="lede">Dimension judgements map to a common anchored scale before aggregation.</p>
        </div>
        <div className="card card-pad">
          <table className="method-table">
            <tbody>
              {rubric.map(([score, label, description]) => (
                <tr key={score}>
                  <td className="mono">{score}</td>
                  <td>{label}</td>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Run protocol</p>
        <h2 className="section-title">Closed-book first.</h2>
        <div className="grid-2" style={{ marginTop: 24 }}>
          {[
            ["Closed-book", "Packet only. Default for v0.3 and the cleanest test of synthesis and judgement."],
            [
              "Web-enabled",
              "Public research allowed. Tests source selection, market mapping and competitive discovery.",
            ],
            ["Agentic", "File inspection, search and calculation tools enabled. Tests end-to-end workflow execution."],
            [
              "Human-in-the-loop",
              "The model may request missing evidence. Tests diligence process quality and question prioritisation.",
            ],
          ].map(([title, copy]) => (
            <article className="card card-pad" key={title}>
              <Badge>{title}</Badge>
              <p className="muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Scoring operation</p>
          <h2 className="section-title">Hybrid, traceable evaluation.</h2>
          <p className="lede">
            Deterministic checks should cover arithmetic, schema validity and answer-key issue coverage. Blind model
            judging covers subjective dimensions, calibrated against human investment professionals.
          </p>
        </article>
        <article>
          <p className="eyebrow">Public and private</p>
          <h2 className="section-title">Cases in public. Holdouts in reserve.</h2>
          <p className="lede">
            Public cases explain the method. Private variants reduce overfitting and should never be shipped to the
            browser or public repository.
          </p>
        </article>
      </section>
    </div>
  );
}
