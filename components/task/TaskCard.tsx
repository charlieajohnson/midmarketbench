import Link from "next/link";
import type { Task } from "@/lib/types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <article className="card card-pad task-card">
      <div>
        <p className="eyebrow">Benchmark task</p>
        <h3>{task.name}</h3>
        <p>{task.prompt}</p>
      </div>
      <Link className="text-link" href={`/tasks/${task.key}`}>
        Open task
      </Link>
    </article>
  );
}
