import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/common/Badge";
import { SyntheticBanner } from "@/components/common/SyntheticBanner";
import { SampleOutput } from "@/components/task/SampleOutput";
import { systemPrompt as legacySystemPrompt } from "@/data/cases/compliance-workflow-saas/tasks";
import { norwynSystemPrompt, norwynTaskKeys } from "@/data/cases/norwyn-controls/tasks";
import { getRepository } from "@/lib/repo";

export async function generateStaticParams() {
  return (await getRepository().getTasks()).map(({ key }) => ({ key }));
}
export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const task = await getRepository().getTask((await params).key);
  return { title: task?.name ?? "Task", description: task?.prompt };
}

export default async function TaskDetailPage({ params }: { params: Promise<{ key: string }> }) {
  const key = (await params).key;
  const isObservedTask = norwynTaskKeys.has(key);
  const caseSlug = isObservedTask ? "norwyn-controls" : "compliance-workflow-saas";
  const systemPrompt = isObservedTask ? norwynSystemPrompt : legacySystemPrompt;
  const repo = getRepository();
  const [task, samples, models] = await Promise.all([
    repo.getTask(key),
    repo.getSamplesForTask(key, caseSlug),
    repo.getModels(),
  ]);
  if (!task) notFound();
  return (
    <div className="shell page">
      <header>
        <Badge>Closed-book</Badge>
        <h1 className="display page-title" style={{ marginTop: 18 }}>
          {task.name}
        </h1>
        <p className="lede">{task.prompt}</p>
      </header>
      <section className="section-tight">
        <SyntheticBanner dismissible={false} />
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Expected output</p>
          <ul>
            {task.expectedOutput.map((item) => (
              <li className="muted" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article>
          <p className="eyebrow">What good looks like</p>
          <ul>
            {task.whatGoodLooksLike.map((item) => (
              <li className="muted" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>
      <section className="section">
        <p className="eyebrow">System prompt</p>
        <div className="card card-pad mono" style={{ fontSize: ".8rem", color: "var(--color-ink-secondary)" }}>
          {systemPrompt}
        </div>
      </section>
      <section className="section grid-2">
        <article>
          <p className="eyebrow">Failure modes</p>
          {task.failureModes.map((mode) => (
            <p className="muted" key={mode}>
              • {mode}
            </p>
          ))}
        </article>
        <article>
          <p className="eyebrow">Evaluation status</p>
          <p className="lede" style={{ marginTop: 0 }}>
            {samples.length
              ? "Representative strong and weak examples are available below."
              : isObservedTask
                ? "Observed outputs are retained with request and score provenance in the dated benchmark run artefacts. This page documents the public task contract."
                : "This legacy task was not used for the observed 18 July 2026 run."}
          </p>
        </article>
      </section>
      {samples.length > 0 && (
        <section className="section">
          <p className="eyebrow">Representative outputs</p>
          <h2 className="section-title">Same packet. Different judgement.</h2>
          <div className="stack" style={{ marginTop: 28 }}>
            {samples.map((sample) => (
              <SampleOutput
                key={sample.id}
                output={sample}
                model={models.find((model) => model.slug === sample.modelSlug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
