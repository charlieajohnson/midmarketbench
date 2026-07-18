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
        lede="MidMarketBench evaluates observed frontier-model work against a fresh synthetic European private-market case."
      />
      <section className="section">
        <SyntheticBanner dismissible={false} />
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">What it measures</p>
          <h2 className="section-title">Grounded commercial judgement.</h2>
          <p className="lede">
            Standard prompts, reference-scored calculations, bounded diligence choices and blinded judgements of
            decision-useful IC work.
          </p>
        </article>
        <article>
          <p className="eyebrow">What it does not measure</p>
          <h2 className="section-title">Not market truth.</h2>
          <p className="lede">
            Norwyn Controls is not a real company. Two runs against one case are too small to establish general model
            quality, and this leaderboard should not be read as investment advice.
          </p>
        </article>
      </section>
      <section className="section card card-pad">
        <p className="eyebrow">Provenance</p>
        <h2 className="section-title">Synthetic case, observed outputs.</h2>
        <p className="lede">
          Norwyn Controls was created for the 18 July 2026 run from realistic operating patterns, without proprietary
          deal material. Candidate and judge responses were generated through OpenRouter. Each artefact records the
          requested model, routed endpoint, provider metadata, prompt and case hashes, token use, latency and cost.
        </p>
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Comparability</p>
          <h2 className="section-title">Same packet, bounded effort.</h2>
          <p className="lede">
            Each available candidate received four closed-book tasks twice. Candidates used a 2,048-token reasoning
            budget and judges used 1,024; Kimi K3 ran at its provider-mandated maximum reasoning level.
          </p>
        </article>
        <article>
          <p className="eyebrow">Interpretation</p>
          <h2 className="section-title">Small differences are provisional.</h2>
          <p className="lede">
            Models within two overall points are marked as provisional ties. Models without a complete, valid scored run
            are shown as unavailable or partial and are excluded from the ranked field.
          </p>
        </article>
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
