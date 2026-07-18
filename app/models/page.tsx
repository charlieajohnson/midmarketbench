import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { PageHeader } from "@/components/common/PageHeader";
import { ModelLogo } from "@/components/model/ModelLogo";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";
import type { OpenRouterEndpoint } from "@/lib/types";

export const metadata: Metadata = {
  title: "Models",
  description: "Observed OpenRouter model results and unavailable runs in MidMarketBench v0.4-mini.",
};

function endpointLabel(endpoint: OpenRouterEndpoint) {
  const route = endpoint.providers.length ? endpoint.providers.join(", ") : endpoint.requestedId;
  const quantization = endpoint.quantizations
    .filter((item) => item.toLowerCase() !== "unknown")
    .map((item) => item.toUpperCase())
    .join(", ");
  return quantization ? `${route} / ${quantization}` : route;
}

function latencyLabel(milliseconds: number) {
  return milliseconds >= 60_000 ? `${(milliseconds / 60_000).toFixed(1)}m` : `${(milliseconds / 1_000).toFixed(1)}s`;
}

export default async function ModelsPage() {
  const repo = getRepository();
  const [rows, unavailable, run] = await Promise.all([
    repo.getLeaderboard(benchmark.methodologyVersion),
    repo.getUnavailableModels(),
    repo.getRunSummary(),
  ]);
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Model index"
        title="Observed model behaviour through one investment lens."
        lede={`${rows.length} models completed ${run.samplesPerModel} scored OpenRouter samples against the same synthetic case. Incomplete or unavailable requests are disclosed below and excluded from ranking.`}
      />
      <section className="section">
        <p className="eyebrow">Complete runs</p>
        <h2 className="section-title">Ranked on complete evidence.</h2>
        <div className="table-wrap">
          <table className="method-table" aria-label="Ranked complete model runs">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Provider</th>
                <th>Overall</th>
                <th>Range</th>
                <th>Samples</th>
                <th>OpenRouter route</th>
                <th>Reported attributed cost</th>
                <th>Median latency</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.model.slug}>
                  <td className="mono">{row.rank}</td>
                  <td>
                    <Link className="model-cell" href={`/models/${row.model.slug}`}>
                      <ModelLogo provider={row.provider} />
                      <span>{row.model.name}</span>
                      {row.caveat && <Badge>Route caveat</Badge>}
                    </Link>
                  </td>
                  <td>{row.provider.name}</td>
                  <td className="mono">{row.overall.toFixed(1)}</td>
                  <td className="mono">
                    {row.range[0].toFixed(1)} to {row.range[1].toFixed(1)}
                  </td>
                  <td className="mono">
                    {row.samplesCompleted}/{row.samplesRequested}
                  </td>
                  <td>
                    <span className="mono fine">{endpointLabel(row.endpoint)}</span>
                  </td>
                  <td className="mono">
                    ${(row.providerReportedCandidateCostUsd + row.providerReportedJudgeCostUsd).toFixed(3)}
                  </td>
                  <td className="mono">{latencyLabel(row.medianLatencyMs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {unavailable.length > 0 && (
        <section className="section" aria-labelledby="unavailable-models">
          <p className="eyebrow">Not ranked</p>
          <h2 className="section-title" id="unavailable-models">
            Unavailable or incomplete runs.
          </h2>
          <p className="lede">
            Infrastructure and routing failures are not converted into zero scores. These models remain in the run
            ledger without a rank.
          </p>
          <div className="table-wrap" style={{ marginTop: 24 }}>
            <table className="method-table" aria-label="Unranked model runs">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Candidate samples</th>
                  <th>OpenRouter route</th>
                  <th>Recorded reason</th>
                </tr>
              </thead>
              <tbody>
                {unavailable.map((result) => (
                  <tr key={result.model.slug}>
                    <td>
                      <Link className="model-cell" href={`/models/${result.model.slug}`}>
                        <ModelLogo provider={result.provider} />
                        <span>{result.model.name}</span>
                      </Link>
                    </td>
                    <td>{result.provider.name}</td>
                    <td>
                      <Badge>{result.status}</Badge>
                    </td>
                    <td className="mono">
                      {result.candidateSamplesCompleted}/{result.samplesRequested}
                    </td>
                    <td className="mono fine">{endpointLabel(result.endpoint)}</td>
                    <td>{result.incompleteSamples[0]?.reason ?? result.caveat ?? "No complete scored result."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
