import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { DistributionStrip } from "@/components/model/DistributionStrip";
import { DimensionBars } from "@/components/model/DimensionBars";
import { ModelLogo } from "@/components/model/ModelLogo";
import { RadarChart } from "@/components/model/RadarChart";
import { SampleOutput } from "@/components/task/SampleOutput";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";

export async function generateStaticParams() {
  return (await getRepository().getModels()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = await getRepository().getModel((await params).slug);
  return {
    title: model?.name ?? "Model",
    description: model ? `Synthetic MidMarketBench profile for ${model.name}.` : undefined,
  };
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const repo = getRepository();
  const [rows, dimensions, providers, samples] = await Promise.all([
    repo.getLeaderboard(benchmark.methodologyVersion),
    repo.getDimensions(),
    repo.getProviders(),
    repo.getSamplesForTask("red-flag-detection", "compliance-workflow-saas"),
  ]);
  const row = rows.find((candidate) => candidate.model.slug === slug);
  if (!row) notFound();
  const provider = providers.find((candidate) => candidate.id === row.model.providerId);
  if (!provider) notFound();
  const facts = [
    ["Provider", provider.name],
    ["Version", row.model.version],
    ["Release", row.model.release],
    ["Context", row.model.contextWindow],
    ["Rank", `#${row.rank}`],
    ["Overall", row.overall.toFixed(1)],
    ["Run mode", row.mode],
    ["Weights", row.model.openWeights ? "Open" : "Closed"],
  ];
  return (
    <div className="shell page">
      <header style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <ModelLogo provider={provider} size={52} />
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <Badge>Rank {row.rank}</Badge>
            <Badge>Synthetic score</Badge>
          </div>
          <h1 className="display page-title">{row.model.name}</h1>
        </div>
      </header>
      <section className="section-tight">
        <dl className="definition-list">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="fine" style={{ marginTop: 12 }}>
          Roster source:{" "}
          <a className="text-link" href={row.model.sourceUrl} target="_blank" rel="noreferrer">
            provider documentation
          </a>
        </p>
      </section>
      <section className="section grid-2">
        <div>
          <p className="eyebrow">Dimension shape</p>
          <h2 className="section-title">Where the score comes from.</h2>
          <p className="lede">The profile is finance-weighted. Commercial judgement breaks ties before grounding.</p>
          <div style={{ marginTop: 32 }}>
            <DimensionBars scores={row.scores} dimensions={dimensions} />
          </div>
        </div>
        <RadarChart row={row} dimensions={dimensions} />
      </section>
      <section className="section">
        <p className="eyebrow">Board distribution</p>
        <h2 className="section-title">Position in the current synthetic field.</h2>
        <div style={{ marginTop: 28 }}>
          <DistributionStrip rows={rows} focusSlug={row.model.slug} />
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Representative outputs</p>
        <h2 className="section-title">Useful judgement versus polished summary.</h2>
        <p className="lede">
          These are benchmark examples, not claims about unrun model behaviour. Live attribution begins only when run
          artefacts exist.
        </p>
        <div className="stack" style={{ marginTop: 28 }}>
          {samples.map((sample) => (
            <SampleOutput
              key={sample.id}
              output={sample}
              model={rows.find((item) => item.model.slug === sample.modelSlug)?.model}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
