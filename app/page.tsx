import Image from "next/image";
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
          <div className="section-head">
            <div>
              <p className="eyebrow">Methodology {benchmark.methodologyVersion}</p>
              <h2 className="section-title">Synthetic standings as an evaluation ledger.</h2>
            </div>
            <p className="fine mono">12 models / 8 dimensions / closed-book</p>
          </div>
          <SyntheticBanner />
          <LeaderboardTable rows={rows} dimensions={dimensions} />
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
              The current board is a product demonstration built from synthetic scores. The methodology, case structure
              and data contracts are the testable artefacts.
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
