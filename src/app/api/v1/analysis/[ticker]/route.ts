
import type { NextRequest } from "next/server";
import { buildMultiAgentExecutionPlan } from "@/lib/agents/multiAgentCoordinator";
import { validateAnalysisInput } from "@/lib/utils/analysisValidation";
import { badRequest, ok } from "@/app/api/v1/_lib/respond";

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
  const gateway = searchParams.get("gateway") ?? "claude";
  const plan = buildMultiAgentExecutionPlan(ticker, horizon, depth, gateway);

  return ok(plan.finalRun);
}
