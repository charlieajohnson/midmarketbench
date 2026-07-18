import type { Metadata } from "next";
import { CaseCard, StubCaseCard } from "@/components/case/CaseCard";
import { PageHeader } from "@/components/common/PageHeader";
import { caseStubs } from "@/data/cases/compliance-workflow-saas/case";
import { getRepository } from "@/lib/repo";

export const metadata: Metadata = { title: "Cases", description: "Synthetic European B2B software diligence cases." };

export default async function CasesPage() {
  const cases = await getRepository().getCases();
  const scoredCase = cases.find(({ slug }) => slug === "norwyn-controls");
  const legacyCases = cases.filter(({ slug }) => slug !== "norwyn-controls");
  return (
    <div className="shell page">
      <PageHeader
        eyebrow="Case library"
        title="Realistic enough to require judgement."
        lede="Each case is a synthetic diligence packet with ambiguity, embedded traps, open questions and an explicit scoring guide. No real company or proprietary deal material is used."
      />
      <section className="section">
        <p className="eyebrow">Scored on 18 July 2026</p>
        <div className="grid-2">{scoredCase && <CaseCard benchmarkCase={scoredCase} badge="Observed run" />}</div>
      </section>
      {legacyCases.length > 0 && (
        <section className="section">
          <p className="eyebrow">Legacy illustrative case</p>
          <div className="grid-2">
            {legacyCases.map((benchmarkCase) => (
              <CaseCard benchmarkCase={benchmarkCase} badge="Unscored example" key={benchmarkCase.id} />
            ))}
          </div>
        </section>
      )}
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
