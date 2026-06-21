import type { Metadata } from "next";
import { CaseCard, StubCaseCard } from "@/components/case/CaseCard";
import { PageHeader } from "@/components/common/PageHeader";
import { caseStubs } from "@/data/cases/compliance-workflow-saas/case";
import { getRepository } from "@/lib/repo";

export const metadata: Metadata = { title: "Cases", description: "Synthetic European B2B software diligence cases." };

export default async function CasesPage() {
  const cases = await getRepository().getCases();
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Case library"
        title="Realistic enough to require judgement."
        lede="Each case is a synthetic diligence packet with ambiguity, embedded traps, open questions and an explicit scoring guide. No real company or proprietary deal material is used."
      />
      <section className="section">
        <p className="eyebrow">Live</p>
        <div className="grid-2">
          {cases.map((benchmarkCase) => (
            <CaseCard benchmarkCase={benchmarkCase} key={benchmarkCase.id} />
          ))}
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Pipeline</p>
        <div className="grid-2">
          {caseStubs.map((stub) => (
            <StubCaseCard {...stub} key={stub.name} />
          ))}
        </div>
      </section>
    </div>
  );
}
