import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/common/Hero";
import { SyntheticBanner } from "@/components/common/SyntheticBanner";
import { DimensionLegend } from "@/components/leaderboard/DimensionLegend";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { RunNotice } from "@/components/leaderboard/RunNotice";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";

export default async function HomePage() {
  const repo = getRepository();
  const [rows, dimensions, run] = await Promise.all([
    repo.getLeaderboard(benchmark.methodologyVersion),
    repo.getDimensions(),
    repo.getRunSummary(),
  ]);
  return (
    <>
      <Hero />
      <div className="shell-wide page">
        <section id="leaderboard">
          <div className="section-head">
            <div>
              <p className="eyebrow">Methodology {benchmark.methodologyVersion}</p>
              <h2 className="section-title">Observed standings from a synthetic diligence case.</h2>
            </div>
            <p className="fine mono">
              {run.modelsCompleted} ranked / {run.modelsRequested} requested / {run.samplesPerModel} samples
            </p>
          </div>
          {run.dataStatus === "observed" && run.totalSpendUsd !== null ? (
            <RunNotice
              caseName={run.caseName}
              evaluatedAt={run.evaluatedAt}
              modelsCompleted={run.modelsCompleted}
              modelsRequested={run.modelsRequested}
              samplesPerModel={run.samplesPerModel}
              totalSpendUsd={run.totalSpendUsd}
            />
          ) : (
            <SyntheticBanner />
          )}
          <LeaderboardTable rows={rows} dimensions={dimensions} />
          {run.modelsPartial + run.modelsIncomplete + run.modelsUnavailable > 0 && (
            <p className="fine" style={{ marginTop: 16 }}>
              {run.modelsPartial + run.modelsIncomplete + run.modelsUnavailable} requested model
              {run.modelsPartial + run.modelsIncomplete + run.modelsUnavailable === 1 ? " was" : "s were"} excluded from
              ranking because a complete two-sample result was not available.{" "}
              <Link className="text-link" href="/models">
                Inspect the full roster
              </Link>
            </p>
          )}
        </section>
        <section className="section scoring-section">
          <div>
            <p className="eyebrow">Scoring shape</p>
            <h2 className="section-title">Judgement carries the most weight.</h2>
            <p className="lede">
              A grounded but commercially naive model should not lead an investment benchmark. Overall is derived from
              eight dimension scores, never stored directly.
            </p>
          </div>
          <Image
            className="section-graphic"
            src="/graphics/evaluation-scale.svg"
            alt=""
            aria-hidden="true"
            width={720}
            height={420}
          />
          <DimensionLegend dimensions={dimensions} />
        </section>
        <section className="section doctrine-card">
          <div>
            <p className="eyebrow">Interpretation</p>
            <h2 className="section-title">Workflow usefulness, not general intelligence.</h2>
            <p className="lede">
              This board reports observed OpenRouter outputs and evaluator scores for one fresh, synthetic company. It
              measures decision usefulness on this workflow, not general model intelligence.
            </p>
            <div className="section-action">
              <Link className="text-link" href="/methodology">
                Interrogate the method
              </Link>
            </div>
          </div>
          <Image src="/graphics/case-ledger.svg" alt="" aria-hidden="true" width={620} height={420} />
        </section>
      </div>
    </>
  );
}
