
import type { NextRequest } from "next/server";
import { buildCompletedRun } from "@/lib/mock/analysis";
import { validateAnalysisInput } from "@/lib/utils/analysisValidation";
import { badRequest, notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker: rawTicker } = await params;
  const searchParams = new URL(req.url).searchParams;

  const validation = validateAnalysisInput(
    rawTicker,
    searchParams.get("horizon"),
    searchParams.get("depth"),
  );

  if (!validation.ok) {
    return badRequest(validation.error);
  }

  const { ticker, horizon, depth } = validation.value;
  const data = buildCompletedRun(ticker, horizon, depth);

  return data ? ok(data) : notFound(`Unknown ticker "${ticker}"`);
}
