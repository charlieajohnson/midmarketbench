import Link from "next/link";
import { Badge } from "@/components/common/Badge";
import { formatCurrencyMillions, formatPercent } from "@/lib/format";
import type { BenchmarkCase } from "@/lib/types";

export function CaseCard({ benchmarkCase }: { benchmarkCase: BenchmarkCase }) {
  return (
    <Link className="card card-pad case-card" href={`/cases/${benchmarkCase.slug}`}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <Badge>Live case</Badge>
          <Badge>{benchmarkCase.difficulty}</Badge>
        </div>
        <h3 style={{ marginTop: 24 }}>{benchmarkCase.name}</h3>
        <p>
          {benchmarkCase.subsector}. {benchmarkCase.summary}
        </p>
      </div>
      <div className="case-stats">
        <span>{benchmarkCase.geography}</span>
        <span>{formatCurrencyMillions(benchmarkCase.arrEurM)} ARR</span>
        <span>{formatPercent(benchmarkCase.growthRate)} growth</span>
        <span>{benchmarkCase.taskKeys.length} tasks</span>
      </div>
    </Link>
  );
}

export function StubCaseCard({
  name,
  subsector,
  geography,
  status,
}: {
  name: string;
  subsector: string;
  geography: string;
  status: string;
}) {
  return (
    <article className="card card-pad case-card" data-disabled="true">
      <div>
        <Badge>{status}</Badge>
        <h3 style={{ marginTop: 24 }}>{name}</h3>
        <p>{subsector}. Designed around sector-specific failure modes and European fragmentation.</p>
      </div>
      <div className="case-stats">
        <span>{geography}</span>
        <span>Synthetic</span>
      </div>
    </article>
  );
}
