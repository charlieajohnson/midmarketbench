import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";
import { roundScore } from "@/lib/scoring";

export const dynamic = "force-static";

export async function GET() {
  const repository = getRepository();
  const [run, rows, modelResults] = await Promise.all([
    repository.getRunSummary(),
    repository.getLeaderboard(),
    repository.getModelResults(),
  ]);
  return NextResponse.json({
    methodology: run.methodologyVersion,
    dataStatus: run.dataStatus,
    dataSource: run.dataSource,
    run,
    rows: rows.map((row) => ({ ...row, overall: roundScore(row.overall) })),
    incomplete: modelResults.filter(({ status }) => status !== "complete"),
  });
}
