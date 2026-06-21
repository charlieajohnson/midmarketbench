import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseFileList } from "@/components/case/CaseFileList";
import { TrapDisclosure } from "@/components/case/TrapDisclosure";
import { Badge } from "@/components/common/Badge";
import { SyntheticBanner } from "@/components/common/SyntheticBanner";
import { TaskCard } from "@/components/task/TaskCard";
import { formatCurrencyMillions, formatPercent } from "@/lib/format";
import { getRepository } from "@/lib/repo";

export async function generateStaticParams() {
  return (await getRepository().getCases()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = await getRepository().getCase((await params).slug);
  return { title: item?.name ?? "Case", description: item?.summary };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const repo = getRepository();
  const [benchmarkCase, allTasks, answerKey] = await Promise.all([
    repo.getCase(slug),
    repo.getTasks(),
    repo.getAnswerKey(slug),
  ]);
  if (!benchmarkCase) notFound();
  const tasks = allTasks.filter((task) => benchmarkCase.taskKeys.includes(task.key));
  const facts = [
    ["Sector", benchmarkCase.subsector],
    ["Geography", benchmarkCase.geography],
    ["ARR", formatCurrencyMillions(benchmarkCase.arrEurM)],
    ["Growth", formatPercent(benchmarkCase.growthRate)],
    ["EBITDA margin", formatPercent(benchmarkCase.ebitdaMargin)],
    ["Ownership", benchmarkCase.ownershipContext],
    ["Difficulty", benchmarkCase.difficulty],
    ["Status", benchmarkCase.confidentiality],
  ];
  return (
    <div className="shell page">
      <header>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <Badge>Synthetic case</Badge>
          <Badge>{benchmarkCase.difficulty}</Badge>
        </div>
        <h1 className="display page-title">{benchmarkCase.name}</h1>
        <p className="lede">{benchmarkCase.summary}</p>
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
      </section>
      <section className="section">
        <SyntheticBanner dismissible={false} />
      </section>
      <section className="section">
        <p className="eyebrow">Diligence packet</p>
        <h2 className="section-title">Evidence, not exposition.</h2>
        <p className="lede">
          The first pass renders core tables inline. The repository retains the same packet as typed data and raw CSV
          for later evaluation runs.
        </p>
        <div className="card card-pad" style={{ marginTop: 28 }}>
          <CaseFileList files={benchmarkCase.files} />
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Tasks</p>
        <h2 className="section-title">Five views of the same evidence.</h2>
        <div className="grid-3" style={{ marginTop: 28 }}>
          {tasks.map((task) => (
            <TaskCard task={task} key={task.key} />
          ))}
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Scoring guide</p>
        <h2 className="section-title">Attempt the case before opening.</h2>
        <div style={{ marginTop: 24 }}>
          <TrapDisclosure items={answerKey} />
        </div>
      </section>
    </div>
  );
}
