import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { PageHeader } from "@/components/common/PageHeader";
import { ModelLogo } from "@/components/model/ModelLogo";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";

export const metadata: Metadata = { title: "Models", description: "Model roster and synthetic benchmark results." };

export default async function ModelsPage() {
  const repo = getRepository();
  const rows = await repo.getLeaderboard(benchmark.methodologyVersion);
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Model index"
        title="Model behaviour through one investment lens."
        lede="The board compares model behaviour against investment workflow tasks, not general preference. Every score and rank on this pass is synthetic and illustrative."
      />
      <section className="section">
        <div className="table-wrap">
          <table className="method-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Provider</th>
                <th>Version</th>
                <th>Overall</th>
                <th>Weights</th>
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
                    </Link>
                  </td>
                  <td>{row.provider.name}</td>
                  <td className="mono">{row.model.version}</td>
                  <td className="mono">{row.overall.toFixed(1)}</td>
                  <td>
                    <Badge>{row.model.openWeights ? "Open" : "Closed"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
