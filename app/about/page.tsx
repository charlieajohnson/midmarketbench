import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { SyntheticBanner } from "@/components/common/SyntheticBanner";

export const metadata: Metadata = {
  title: "About",
  description: "Purpose, audience and provenance of MidMarketBench.",
};

export default function AboutPage() {
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="About"
        title="A careful instrument for machine-era judgement."
        lede="MidMarketBench evaluates whether frontier models can produce useful investment workflow outputs from synthetic private-market cases."
      />
      <section className="section">
        <SyntheticBanner dismissible={false} />
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">What it measures</p>
          <h2 className="section-title">Grounded commercial judgement.</h2>
          <p className="lede">
            Synthetic cases, standard prompts, anchored rubrics, representative outputs and a leaderboard shaped by investment relevance.
          </p>
        </article>
        <article>
          <p className="eyebrow">What it does not measure</p>
          <h2 className="section-title">Not market truth.</h2>
          <p className="lede">
            No company is real. No score is an observed model result in this pass. The shell demonstrates the evaluation
            contract before live runs begin.
          </p>
        </article>
      </section>
      <section className="section card card-pad">
        <p className="eyebrow">Provenance</p>
        <h2 className="section-title">Synthetic by construction.</h2>
        <p className="lede">
          Cases are built from realistic patterns, not real companies or proprietary deal materials. Model names and
          provider logos were checked against primary provider sources on 21 June 2026. Scores, ranks, release months
          and unspecified technical metadata are illustrative until run artefacts and provider snapshots are persisted.
        </p>
      </section>
      <section className="section">
        <p className="eyebrow">Audience</p>
        <div className="grid-3">
          {[
            ["Investment teams", "PE and growth investors evaluating model usefulness in diligence and origination."],
            ["AI leads", "Internal teams selecting models, prompts, tools and evaluation controls."],
            ["Model providers", "Vendors testing whether general capability translates into decision-useful work."],
          ].map(([title, copy]) => (
            <article className="card card-pad" key={title}>
              <h3 style={{ margin: 0 }}>{title}</h3>
              <p className="muted">{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <Link className="text-link" href="mailto:hello@midmarketbench.example">
          Contact the project
        </Link>
      </section>
    </div>
  );
}
