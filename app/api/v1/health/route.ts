import { NextResponse } from "next/server";
import { benchmark } from "@/data/benchmark";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "midmarketbench",
    methodology: benchmark.methodologyVersion,
    dataSource: "seed",
  });
}
