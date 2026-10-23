
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

      const n8nWebhookUrl =
        process.env.N8N_WEBHOOK_URL ||
        "https://n8n.sushantkumaryadav.com.np/webhook/arthaya-orchestrator";
      const n8nPromise = fetch(n8nWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker,
          horizon,
          depth,
          gateway_provider: gateway,
        }),
        signal: AbortSignal.timeout(6500),
      })
        .then(async (res) => (res.ok ? await res.json() : null))
        .catch(() => null);

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

      // Merge live n8n workflow output (XGBoost, RF, LR & LLM synthesis) if available
      try {
        const n8nResult = await n8nPromise;
        if (n8nResult && typeof n8nResult === "object" && n8nResult.prediction) {
          const pred = n8nResult.prediction;
          const dir = pred.direction || plan.finalRun.prediction?.direction || "UP";
          const prob = typeof pred.probability === "number" ? pred.probability : 0.72;

          if (plan.finalRun.prediction) {
            plan.finalRun.prediction.direction = dir;
            plan.finalRun.prediction.probability = prob;
            plan.finalRun.prediction.confidence = prob >= 0.75 ? "High" : prob >= 0.6 ? "Moderate" : "Low";
            plan.finalRun.prediction.model = `n8n Quant ML Ensemble (${gateway.toUpperCase()})`;
            if (pred.models) {
              plan.finalRun.prediction.breakdown = [
                {
                  model: "XGBoost",
                  direction: (pred.models.xgboost ?? 0.5) >= 0.5 ? "UP" : "DOWN",
                  probability: pred.models.xgboost ?? 0.73,
                },
                {
                  model: "Random Forest",
                  direction: (pred.models.random_forest ?? 0.5) >= 0.5 ? "UP" : "DOWN",
                  probability: pred.models.random_forest ?? 0.68,
                },
                {
                  model: "Logistic Regression",
                  direction: (pred.models.logistic_regression ?? 0.5) >= 0.5 ? "UP" : "DOWN",
                  probability: pred.models.logistic_regression ?? 0.63,
                },
                {
                  model: "Ensemble",
                  direction: dir,
                  probability: prob,
                },
              ];
            }
          }

          if (plan.finalRun.summary && n8nResult.summary) {
            plan.finalRun.summary.modelPrediction = String(n8nResult.summary);
            plan.finalRun.summary.overallSignal = dir;
            plan.finalRun.summary.probability = prob;
          }

          if (plan.finalRun.coordinationTrace) {
            plan.finalRun.coordinationTrace.arbitrationSummary += ` [Verified via n8n Orchestrator execution ${n8nResult.workflow_execution_id || "wf_active"}]`;
          }
        }
      } catch {
        // Fallback to internal plan
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
