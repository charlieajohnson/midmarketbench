import type { Metadata } from "next";
import { Badge } from "@/components/common/Badge";
import { PageHeader } from "@/components/common/PageHeader";
import { getRepository } from "@/lib/repo";

export const metadata: Metadata = {
  title: "Methodology",
  description: "Dimensions, weights, run modes and evaluation protocol.",
};

const rubric = [
  ["4", "Exceptional", "Exact, decision-changing and unusually well calibrated to the evidence and task."],
  ["3", "Strong", "Grounded, commercially useful and clear, with only limited omissions."],
  ["2", "Acceptable", "Broadly sound but generic, incomplete or weakly prioritised."],
  ["1", "Weak", "Touches the issue without enough evidence or decision relevance."],
  ["0", "Miss", "Misses or contradicts the evidence, or produces unusable work."],
];

export default async function MethodologyPage() {
  const dimensions = await getRepository().getDimensions();
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Methodology v0.4-mini"
        title="Judgement carries the most weight."
        lede="The 18 July 2026 mini benchmark scores observed OpenRouter outputs from a fresh synthetic diligence packet. Overall is derived from eight dimensions and two samples per available model."
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
          <h2 className="section-title">Anchored 0 to 4 rubric</h2>
          <p className="lede">
            Blinded judges grade five subjective dimensions against the same strong and weak reference notes. Each grade
            is normalised per judge and dimension with the weak anchor at 0 and strong anchor at 100 before panel
            aggregation.
          </p>
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
        <p className="eyebrow">Observed run protocol</p>
        <h2 className="section-title">Four tasks, one fresh packet.</h2>
        <div className="grid-2" style={{ marginTop: 24 }}>
          {[
            [
              "Metric reconstruction",
              "Calculate eleven operating, retention, margin and market metrics with formulae and exact evidence IDs.",
            ],
            [
              "Ranked red flags",
              "Return six company-specific risks, challenged claims, supporting evidence and linked diligence actions.",
            ],
            ["Bounded diligence", "Select exactly four actions within EUR 25k and eight parallel working days."],
            [
              "IC decision note",
              "Make the EUR 250k diligence decision, identify thesis breakers and state decision-changing conditions.",
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
            Deterministic checks score arithmetic, citations, issue coverage, risk ordering, action linkage, budget
            feasibility and schema compliance. Blinded judges score only the IC note for grounding, commercial
            judgement, scepticism, European context and output usefulness.
          </p>
        </article>
        <article>
          <p className="eyebrow">Judge controls</p>
          <h2 className="section-title">Calibrated and cross-family.</h2>
          <p className="lede">
            Each judge also grades strong and weak anchors. Any dimension without separation is rejected. A judge from
            the same provider family as the candidate is excluded, then a three-judge median or two-judge mean is used.
            Material disagreement is recorded for review.
          </p>
        </article>
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Execution controls</p>
          <h2 className="section-title">Schema support is checked twice.</h2>
          <p className="lede">
            Routes must support the requested reasoning, maximum-token and structured-output parameters. Returned JSON
            is then validated locally. The run records two frozen response-format hashes: a bounded schema and a
            provider-compatible variant. Removed bounds are checked as scored protocol constraints. Response
            completeness and instruction-injection resistance also contribute to compliance, with injection-following
            outputs capped at 25 overall. One provider-compatible Opus sample returned a fifth action and was penalised
            rather than discarded, so schema adaptation remains a comparability limit.
          </p>
        </article>
        <article>
          <p className="eyebrow">Reasoning policy</p>
          <h2 className="section-title">Bounded where providers allow it.</h2>
          <p className="lede">
            Candidates receive a 2,048-token reasoning budget and judges receive 1,024. Kimi K3 requires maximum
            reasoning, so that exception is explicit in its provenance rather than presented as an identical setting.
          </p>
        </article>
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Routing and spend</p>
          <h2 className="section-title">Pinned, inspectable runs.</h2>
          <p className="lede">
            The runner snapshots OpenRouter&apos;s model catalogue and eligible endpoints, disables fallback on selected
            routes, records returned provider metadata and maintains a conservative in-process spend guard. The
            provider-side key cap is the authoritative cross-process limit.
          </p>
        </article>
        <article>
          <p className="eyebrow">Ranking policy</p>
          <h2 className="section-title">Complete evidence only.</h2>
          <p className="lede">
            The leaderboard averages two scored samples. A gap below two overall points is marked as a provisional tie.
            Partial or unavailable models remain visible for provenance but are excluded from ranked positions.
          </p>
        </article>
      </section>
      <section className="section card card-pad">
        <p className="eyebrow">Scope limit</p>
        <h2 className="section-title">Directional, not universal.</h2>
        <p className="lede">
          One synthetic company, four tasks and two samples reveal behaviour on this workflow. They do not establish a
          universal ranking of model intelligence, reliability or value across other domains.
        </p>
        <p className="fine" style={{ marginTop: 16 }}>
          Run qualification: the candidate boundary explicitly treated packet text as untrusted. The v0.4 judge system
          instruction did not restate that boundary, although no accepted judgement followed the embedded instruction.
          Some early length failures retain cost and error metadata but not raw response text. Both controls are
          hardened for subsequent runs without mixing protocols into this dated result.
        </p>
      </section>
    </div>
  );
}
