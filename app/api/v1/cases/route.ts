import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export const dynamic = "force-static";
export async function GET() {
  return NextResponse.json({ synthetic: true, cases: await getRepository().getCases() });
}
