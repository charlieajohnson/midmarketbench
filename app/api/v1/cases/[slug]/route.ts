import { NextResponse } from "next/server";
import { getRepository } from "@/lib/repo";

export async function generateStaticParams() {
  return (await getRepository().getCases()).map(({ slug }) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const benchmarkCase = await getRepository().getCase(slug);
  return benchmarkCase
    ? NextResponse.json({ synthetic: true, case: benchmarkCase })
    : NextResponse.json({ error: "Case not found" }, { status: 404 });
}
