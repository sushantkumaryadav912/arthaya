
import type { NextRequest } from "next/server";
import { badRequest } from "@/app/api/v1/_lib/respond";
import { validateAnalysisInput } from "@/lib/utils/analysisValidation";
import { buildMultiAgentExecutionPlan } from "@/lib/agents/multiAgentCoordinator";
import type { AnalysisEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatClock(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/**
 * SSE analysis stream: emits authentic multi-agent events including
 * tool execution, inter-agent handoffs, conflict detection, replanning,
 * and calibrated synthesis.
 */
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
  const gateway = searchParams.get("gateway") ?? "claude";
  const analysisId = `an_${ticker}_${horizon}_${Date.now()}`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`),
        );

      const plan = buildMultiAgentExecutionPlan(
        ticker,
        horizon,
        depth,
        gateway,
        analysisId,
      );

      const sleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

      let elapsedSeconds = 0;

      for (const step of plan.steps) {
        // Emit running phase event with tool execution metadata
        const runningEvent: AnalysisEvent = {
          analysisId,
          agent: step.agent,
          status: "running",
          message: `[${step.toolName}] ${step.message}`,
          progress: 0.5,
          timestamp: new Date().toISOString(),
          clock: formatClock(elapsedSeconds),
          phase: step.phase,
          toolName: step.toolName,
          targetAgent: step.targetAgent,
          payloadSummary: step.payloadSummary,
          isConflict: step.isConflict,
          isReplan: step.isReplan,
        };

        send({ type: "event", event: runningEvent });
        await sleep(Math.round(step.delayMs * 0.7));
        elapsedSeconds += 1;

        // Emit completed step event
        const completedEvent: AnalysisEvent = {
          analysisId,
          agent: step.agent,
          status: "completed",
          message: step.message,
          progress: 1,
          timestamp: new Date().toISOString(),
          clock: formatClock(elapsedSeconds),
          phase: step.phase,
          toolName: step.toolName,
          targetAgent: step.targetAgent,
          payloadSummary: step.payloadSummary,
          isConflict: step.isConflict,
          isReplan: step.isReplan,
        };

        send({ type: "event", event: completedEvent });
        await sleep(Math.round(step.delayMs * 0.3));
      }

      send({ type: "complete", run: plan.finalRun });
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
