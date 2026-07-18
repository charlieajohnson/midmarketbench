import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export const dynamic = "force-static";

export async function GET() {
  const run = await getRepository().getRunSummary();
  return NextResponse.json({
    status: "ok",
    service: "midmarketbench",
    methodology: run.methodologyVersion,
    dataStatus: run.dataStatus,
    dataSource: run.dataSource,
    runId: run.runId,
  });
}
