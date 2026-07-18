import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export const dynamic = "force-static";
export async function GET() {
  const repository = getRepository();
  const [run, models] = await Promise.all([repository.getRunSummary(), repository.getModelResults()]);
  return NextResponse.json({ dataStatus: run.dataStatus, run, models });
}
