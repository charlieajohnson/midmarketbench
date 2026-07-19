import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { DimensionBars } from "@/components/model/DimensionBars";
import { DistributionStrip } from "@/components/model/DistributionStrip";
import { ModelLogo } from "@/components/model/ModelLogo";
import { RadarChart } from "@/components/model/RadarChart";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";
import type { OpenRouterEndpoint } from "@/lib/types";

export async function generateStaticParams() {
  return (await getRepository().getModels()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const model = await getRepository().getModel((await params).slug);
  return {
    title: model?.name ?? "Model",
    description: model ? `Observed MidMarketBench OpenRouter run profile for ${model.name}.` : undefined,
  };
}

function endpointLabel(endpoint: OpenRouterEndpoint) {
  return endpoint.providers.length ? endpoint.providers.join(", ") : "No completed route";
}

function quantisationLabel(endpoint: OpenRouterEndpoint) {
  return (
    endpoint.quantizations
      .filter((item) => item.toLowerCase() !== "unknown")
      .map((item) => item.toUpperCase())
      .join(", ") || "Not reported"
  );
}

function latencyLabel(milliseconds: number) {
  return milliseconds >= 60_000
    ? `${(milliseconds / 60_000).toFixed(1)} minutes`
    : `${(milliseconds / 1_000).toFixed(1)} seconds`;
}

function routePriceLabel(endpoint: OpenRouterEndpoint) {
  if (!endpoint.pricing?.endpoints.length) return "Not reported";
  return endpoint.pricing.endpoints
    .map(
      (price) =>
        `${price.tag}: $${price.promptUsdPerMillion.toFixed(3)} input / $${price.completionUsdPerMillion.toFixed(3)} output per 1M tokens`,
    )
    .join(", ");
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const repo = getRepository();
  const [result, rows, dimensions, run] = await Promise.all([
    repo.getModelResult(slug),
    repo.getLeaderboard(benchmark.methodologyVersion),
    repo.getDimensions(),
    repo.getRunSummary(),
  ]);

  if (!result) notFound();

  const isScored = result.status === "complete" || result.status === "partial";
  const routeFacts = [
    ["Requested model", result.endpoint.requestedId],
    ["Routed provider", endpointLabel(result.endpoint)],
    ["Endpoint tag", result.endpoint.endpointTags.join(", ") || "No completed route"],
    ["Returned model", result.endpoint.returnedModels.join(", ") || "No completed response"],
    ["Quantisation", quantisationLabel(result.endpoint)],
    ["Pinned route price", routePriceLabel(result.endpoint)],
  ];
  const modelFacts = [
    ["Provider", result.provider.name],
    ["Version", result.model.version],
    ["Release", result.model.release ?? "Not published"],
    ["Context", result.model.contextWindow],
    ["Weights", result.model.openWeights === null ? "Not published" : result.model.openWeights ? "Open" : "Closed"],
    ["Run status", result.status],
    ["Candidate samples", `${result.candidateSamplesCompleted}/${result.samplesRequested}`],
    ...(isScored
      ? [
          ["Scored samples", `${result.samplesCompleted}/${result.samplesRequested}`],
          ["Overall", result.overall.toFixed(1)],
          ["Observed range", `${result.range[0].toFixed(1)} to ${result.range[1].toFixed(1)}`],
          [
            "Provider-reported attributed cost",
            `$${(result.providerReportedCandidateCostUsd + result.providerReportedJudgeCostUsd).toFixed(3)}`,
          ],
          ["Candidate attempts", `$${result.providerReportedCandidateCostUsd.toFixed(3)}`],
          ["Judge attempts", `$${result.providerReportedJudgeCostUsd.toFixed(3)}`],
          ["Median candidate latency", latencyLabel(result.medianLatencyMs)],
        ]
      : []),
  ];

  return (
    <div className="shell page">
      <header className="detail-masthead model-masthead">
        <div className="model-masthead-body">
          <ModelLogo provider={result.provider} size={52} />
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {result.rank !== null && <Badge>Rank {result.rank}</Badge>}
              <Badge>{result.status}</Badge>
              <Badge>{run.dataStatus === "observed" ? "Observed OpenRouter run" : "Run pending"}</Badge>
              {result.provisionalTie && <Badge>Provisional tie</Badge>}
            </div>
            <h1 className="display page-title">{result.model.name}</h1>
          </div>
        </div>
        <div className="detail-masthead-field" aria-hidden="true" />
      </header>

      {result.caveat && (
        <section className="section-tight card card-pad" aria-label="Route caveat">
          <p className="eyebrow">Route caveat</p>
          <h2 className="section-title" id="route-caveat">
            Read this result with its endpoint.
          </h2>
          <p className="lede">{result.caveat}</p>
        </section>
      )}

      <section className="section-tight">
        <p className="eyebrow">Model and run</p>
        <dl className="definition-list">
          {modelFacts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="fine" style={{ marginTop: 12 }}>
          Model source:{" "}
          <a className="text-link" href={result.model.sourceUrl} target="_blank" rel="noreferrer">
            OpenRouter catalogue
          </a>
        </p>
        {isScored && (
          <p className="fine" style={{ marginTop: 8 }}>
            Attributed costs include every OpenRouter-reported candidate and judge attempt for this model, including
            retries. The run total is authoritative for settled key spend.
          </p>
        )}
      </section>

      <section className="section">
        <p className="eyebrow">OpenRouter provenance</p>
        <h2 className="section-title">Requested model and returned route.</h2>
        <dl className="definition-list" style={{ marginTop: 24 }}>
          {routeFacts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p className="fine mono" style={{ marginTop: 12 }}>
          Run {run.runId ?? "pending"} / {run.evaluatedAt.slice(0, 10)} / {run.mode}
        </p>
      </section>

      {!isScored ? (
        <section className="section card card-pad" aria-labelledby="unranked-result">
          <p className="eyebrow">Not ranked</p>
          <h2 className="section-title" id="unranked-result">
            No complete scored result.
          </h2>
          <p className="lede">
            MidMarketBench does not turn routing, availability or protocol failures into a zero. This model remains in
            the ledger without a rank.
          </p>
          {result.incompleteSamples.length > 0 && (
            <ul className="muted">
              {result.incompleteSamples.map((item) => (
                <li key={`${item.sample}-${item.stage}`}>
                  Sample {item.sample}, {item.stage}: {item.reason}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <>
          <section className="section grid-2">
            <div>
              <p className="eyebrow">Dimension shape</p>
              <h2 className="section-title">Where the observed score comes from.</h2>
              <p className="lede">
                Overall combines deterministic task checks with blinded, calibrated, cross-family judgements of the IC
                note.
              </p>
              <div style={{ marginTop: 32 }}>
                <DimensionBars scores={result.scores} dimensions={dimensions} />
              </div>
            </div>
            <RadarChart row={{ ...result, rank: result.rank ?? 0, mode: run.mode }} dimensions={dimensions} />
          </section>
          {result.status === "complete" ? (
            <section className="section">
              <p className="eyebrow">Complete field</p>
              <h2 className="section-title">Position among ranked two-sample runs.</h2>
              <div style={{ marginTop: 28 }}>
                <DistributionStrip rows={rows} focusSlug={result.model.slug} />
              </div>
            </section>
          ) : (
            <section className="section card card-pad">
              <p className="eyebrow">Not ranked</p>
              <h2 className="section-title">Partial evidence only.</h2>
              <p className="lede">
                This score is shown for auditability, but the model is excluded from the leaderboard because both
                samples did not complete the full evaluation protocol.
              </p>
            </section>
          )}
          <section className="section card card-pad">
            <p className="eyebrow">Interpretation limit</p>
            <h2 className="section-title">
              One case, {result.samplesCompleted} scored sample{result.samplesCompleted === 1 ? "" : "s"}.
            </h2>
            <p className="lede">{run.limitation}</p>
          </section>
        </>
      )}
    </div>
  );
}
