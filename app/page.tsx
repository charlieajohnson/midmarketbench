import Link from "next/link";
import { Hero } from "@/components/common/Hero";
import { SyntheticBanner } from "@/components/common/SyntheticBanner";
import { DimensionLegend } from "@/components/leaderboard/DimensionLegend";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";

export default async function HomePage() {
  const repo = getRepository();
  const [rows, dimensions] = await Promise.all([
    repo.getLeaderboard(benchmark.methodologyVersion),
    repo.getDimensions(),
  ]);
  return (
    <>
      <Hero />
      <div className="shell-wide page">
        <section id="leaderboard">
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, marginBottom: 24 }}
          >
            <div>
              <p className="eyebrow">Methodology {benchmark.methodologyVersion}</p>
              <h2 className="section-title">Synthetic standings</h2>
            </div>
            <p className="fine mono">12 models · 8 dimensions · closed-book</p>
          </div>
          <SyntheticBanner />
          <div style={{ height: 16 }} />
          <LeaderboardTable rows={rows} dimensions={dimensions} />
        </section>
        <section className="section">
          <p className="eyebrow">Scoring shape</p>
          <h2 className="section-title">Judgement carries the most weight.</h2>
          <p className="lede">
            A grounded but commercially naive model should not lead an investment benchmark. Overall is derived from
            eight dimension scores, never stored directly.
          </p>
          <div style={{ height: 28 }} />
          <DimensionLegend dimensions={dimensions} />
        </section>
        <section className="section card card-pad" style={{ padding: "40px" }}>
          <p className="eyebrow">Interpretation</p>
          <h2 className="section-title">Workflow usefulness, not general intelligence.</h2>
          <p className="lede">
            The current board is a product demonstration built from synthetic scores. The methodology, case structure
            and data contracts are the testable artefacts.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link className="text-link" href="/methodology">
              Interrogate the method
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
