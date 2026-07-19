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
  const isObservedCase = benchmarkCase.slug === "norwyn-controls";
  const facts = [
    ["Sector", benchmarkCase.subsector],
    ["Geography", benchmarkCase.geography],
    ["ARR", formatCurrencyMillions(benchmarkCase.arrEurM)],
    ["Growth", formatPercent(benchmarkCase.growthRate)],
    ["Reported EBITDA margin", formatPercent(benchmarkCase.ebitdaMargin)],
    ["Ownership", benchmarkCase.ownershipContext],
    ["Difficulty", benchmarkCase.difficulty],
    ["Status", benchmarkCase.confidentiality],
  ];
  return (
    <div className="shell page">
      <header className="detail-masthead">
        <div className="detail-masthead-copy">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            <Badge>Synthetic case</Badge>
            <Badge>{isObservedCase ? "Scored · 18 Jul 2026" : "Unscored legacy example"}</Badge>
            <Badge>{benchmarkCase.difficulty}</Badge>
          </div>
          <h1 className="display page-title">{benchmarkCase.name}</h1>
          <p className="lede">{benchmarkCase.summary}</p>
        </div>
        <div className="detail-masthead-field" aria-hidden="true" />
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
          {isObservedCase
            ? "This is the complete source packet supplied to every candidate model in the observed run. The benchmark repository retains the immutable prompts, responses and score artefacts."
            : "This earlier illustrative packet was not used for the 18 July 2026 leaderboard and remains available as an unscored design example."}
        </p>
        <div className="card card-pad" style={{ marginTop: 28 }}>
          <CaseFileList files={benchmarkCase.files} />
        </div>
      </section>
      <section className="section">
        <p className="eyebrow">Tasks</p>
        <h2 className="section-title">
          {isObservedCase
            ? `${tasks.length} tasks, one structured decision.`
            : `${tasks.length} views of the same evidence.`}
        </h2>
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
