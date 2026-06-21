import { NextResponse } from "next/server";
import { benchmark } from "@/data/benchmark";
import { getRepository } from "@/lib/repo";
import { roundScore } from "@/lib/scoring";

export const dynamic = "force-static";

export async function GET() {
  const rows = await getRepository().getLeaderboard(benchmark.methodologyVersion);
  return NextResponse.json({
    methodology: benchmark.methodologyVersion,
    synthetic: true,
    rows: rows.map((row) => ({ ...row, overall: roundScore(row.overall) })),
  });
}
