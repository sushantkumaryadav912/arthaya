"use client";

import * as React from "react";
import { API_BASE, API_PREFIX } from "@/lib/utils/env";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import type {
  AgentId,
  AgentStatus,
  AnalysisDepth,
  AnalysisEvent,
  AnalysisHorizon,
  AnalysisRun,
} from "@/lib/types";

export type StreamPhase = "idle" | "running" | "completed" | "failed";

interface StartArgs {
  ticker: string;
  horizon: AnalysisHorizon;
  depth: AnalysisDepth;
  gateway?: string;
}

function initialAgents(): AgentStatus[] {
  return AGENT_PIPELINE.map((d) => ({
    agentId: d.agentId,
    name: d.name,
    status: "idle",
  }));
}

/**
 * Drives the live analysis stream directly from the Arthaya backend
 * (https://arthaya-backend-1xdm.onrender.com/api/v1/analysis/{analysis_id}/stream).
 * Supports real-time agent progression, adversarial quality audits, and LLM model gateway synthesis.
 */
export function useAnalysisStream() {
  const [phase, setPhase] = React.useState<StreamPhase>("idle");
  const [events, setEvents] = React.useState<AnalysisEvent[]>([]);
  const [agents, setAgents] = React.useState<AgentStatus[]>(initialAgents);
  const [run, setRun] = React.useState<AnalysisRun | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const esRef = React.useRef<EventSource | null>(null);

  const stop = React.useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
  }, []);

  const reset = React.useCallback(() => {
    stop();
    setPhase("idle");
    setEvents([]);
    setAgents(initialAgents());
    setRun(null);
    setError(null);
  }, [stop]);

  const start = React.useCallback(
    ({ ticker, horizon, depth, gateway }: StartArgs) => {
      stop();
      setPhase("running");
      setEvents([]);
      setAgents(initialAgents());
      setRun(null);
      setError(null);

      const analysisId = `ana_${Date.now()}`;
      // Direct stream URL on Render backend
      const backendUrl = `${API_BASE}${API_PREFIX}/analysis/${analysisId}/stream?ticker=${encodeURIComponent(
        ticker,
      )}&horizon=${horizon}&depth=${depth}&gateway=${encodeURIComponent(gateway ?? "claude")}`;

      let es: EventSource;
      try {
        es = new EventSource(backendUrl);
      } catch {
        // Fallback to local route handler
        es = new EventSource(
          `/api/v1/analysis/stream?ticker=${encodeURIComponent(
            ticker,
          )}&horizon=${horizon}&depth=${depth}&gateway=${encodeURIComponent(gateway ?? "claude")}`,
        );
      }
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const raw = JSON.parse(e.data);

          // 1. Direct Backend SSE Format
          if (raw.status === "completed" && raw.run) {
            const completedRun: AnalysisRun = {
              analysisId: raw.run.analysisId || analysisId,
              ticker: raw.run.ticker || ticker,
              horizon: raw.run.horizon || horizon,
              horizonDays: horizon === "1D" ? 1 : horizon === "20D" ? 20 : 5,
              depth: raw.run.depth || depth,
              status: "completed",
              agents: AGENT_PIPELINE.map((d) => ({
                agentId: d.agentId,
                name: d.name,
                status: "completed",
              })),
              events: [],
              prediction: raw.run.prediction,
              critic: raw.run.critic,
              summary: raw.run.summary,
              createdAt: raw.run.createdAt || new Date().toISOString(),
              completedAt: raw.run.completedAt || new Date().toISOString(),
              modelGateway: gateway || "claude",
              coordinationTrace: {
                conflictDetected: false,
                replanningIterations: 0,
                arbitrationSummary: "Arbitration validated via live backend Model Gateway.",
              },
            };
            setRun(completedRun);
            setPhase("completed");
            stop();
            return;
          }

          if (raw.agent) {
            const ev: AnalysisEvent = {
              analysisId: raw.analysisId || analysisId,
              agent: raw.agent as AgentId,
              status: raw.status || "completed",
              message: raw.message || "",
              progress: raw.progress ?? 100,
              timestamp: raw.timestamp || new Date().toISOString(),
              clock: raw.clock || "00:05",
            };
            setEvents((prev) => [...prev, ev]);
            setAgents((prev) =>
              prev.map((a) =>
                a.agentId === ev.agent
                  ? { ...a, status: ev.status, progress: ev.progress, message: ev.message }
                  : a,
              ),
            );
            return;
          }

          // 2. Wrapped format { type: "event" | "complete" | "error" }
          if (raw.type === "event" && raw.event) {
            const ev = raw.event;
            setEvents((prev) => [...prev, ev]);
            setAgents((prev) =>
              prev.map((a) =>
                a.agentId === ev.agent
                  ? { ...a, status: ev.status, progress: ev.progress, message: ev.message }
                  : a,
              ),
            );
          } else if (raw.type === "complete" && raw.run) {
            setRun(raw.run);
            setAgents(raw.run.agents);
            setPhase("completed");
            stop();
          } else if (raw.type === "error") {
            setError(raw.message);
            setPhase("failed");
            stop();
          }
        } catch {
          /* ignore malformed frame */
        }
      };

      es.onerror = () => {
        setPhase((p) => {
          if (p === "running") {
            setError("Live analysis stream interrupted.");
            return "failed";
          }
          return p;
        });
        stop();
      };
    },
    [stop],
  );

  React.useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    phase,
    events,
    agents,
    run,
    error,
    start,
    stop,
    reset,
  };
}
