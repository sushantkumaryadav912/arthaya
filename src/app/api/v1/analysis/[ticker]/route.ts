import type { NextRequest } from "next/server";
import { buildCompletedRun } from "@/lib/mock/analysis";
import type { AnalysisDepth, AnalysisHorizon } from "@/lib/types";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(req: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const sp = new URL(req.url).searchParams;
  const horizon = (sp.get("horizon") ?? "5D") as AnalysisHorizon;
  const depth = (sp.get("depth") ?? "standard") as AnalysisDepth;
  const data = buildCompletedRun(ticker, horizon, depth);
  return data ? ok(data) : notFound(`Unknown ticker "${ticker}"`);
}
