
import type { NextRequest } from "next/server";
import { AGENT_ORDER } from "@/lib/constants/agents";
import { buildCompletedRun } from "@/lib/mock/analysis";
import type { AnalysisEvent } from "@/lib/types";
import { badRequest } from "@/app/api/v1/_lib/respond";
import { validateAnalysisInput } from "@/lib/utils/analysisValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const AGENT_MESSAGE: Record<string, string> = {
  orchestrator: "Analysis initialized",
  market: "Market data retrieved",
  technical: "Technical indicators calculated",
  fundamental: "Fundamental analysis completed",
  news: "News sentiment completed",
  historical: "Historical comparison completed",
  prediction: "Prediction model completed",
  critic: "Critic validation completed",
  synthesis: "Final synthesis completed",
};

const RUNNING_TASK: Record<string, string> = {
  orchestrator: "Sequencing agent graph...",
  market: "Fetching price & volume...",
  technical: "Computing RSI / MACD / Bollinger...",
  fundamental: "Parsing statements & ratios...",
  news: "Scoring news sentiment...",
  historical: "Matching historical analogs...",
  prediction: "Running LR / RF / XGBoost ensemble...",
  critic: "Validating data & model quality...",
  synthesis: "Composing research summary...",
};

const DEPTH_DELAY: Record<"quick" | "standard" | "deep", number> = {
  quick: 120,
  standard: 260,
  deep: 420,
};

function clock(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/** SSE analysis stream: emits per-agent running/completed events, then a completed run. */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const validation = validateAnalysisInput(
    searchParams.get("ticker") ?? "",
    searchParams.get("horizon"),
    searchParams.get("depth"),
  );

  if (!validation.ok) {
    return badRequest(validation.error);
  }

  const { ticker, horizon, depth } = validation.value;
  const analysisId = `an_${ticker}_${horizon}_${Date.now()}`;

  const encoder = new TextEncoder();
  const delay = DEPTH_DELAY[depth];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`),
        );

      const run = buildCompletedRun(ticker, horizon, depth, analysisId);

      if (!run) {
        send({
          type: "error",
          message: `Unknown ticker "${ticker}" (demo universe).`,
        });
        controller.close();
        return;
      }

      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

      let elapsed = 0;

      for (const agent of AGENT_ORDER) {
        const running: AnalysisEvent = {
          analysisId,
          agent,
          status: "running",
          message: RUNNING_TASK[agent],
          progress: 0.5,
          timestamp: new Date().toISOString(),
          clock: clock(elapsed),
        };

        send({ type: "event", event: running });
        await sleep(delay);
        elapsed += 1;

        const completed: AnalysisEvent = {
          analysisId,
          agent,
          status: "completed",
          message: AGENT_MESSAGE[agent],
          progress: 1,
          timestamp: new Date().toISOString(),
          clock: clock(elapsed),
        };

        send({ type: "event", event: completed });
        await sleep(Math.round(delay / 3));
      }

      send({ type: "complete", run });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
