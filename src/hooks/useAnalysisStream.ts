"use client";

import * as React from "react";
import { API_BASE, API_PREFIX } from "@/lib/utils/env";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import type {
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
 * Drives the live analysis via the SSE route handler
 * (`GET /api/v1/analysis/stream`). Supports live agentic coordination,
 * conflict arbitration, and LLM model gateway routing.
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

      const url = `${API_BASE}${API_PREFIX}/analysis/stream?ticker=${encodeURIComponent(
        ticker,
      )}&horizon=${horizon}&depth=${depth}&gateway=${encodeURIComponent(gateway ?? "claude")}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data) as
            | { type: "event"; event: AnalysisEvent }
            | { type: "complete"; run: AnalysisRun }
            | { type: "error"; message: string };

          if (msg.type === "event") {
            const ev = msg.event;
            setEvents((prev) => [...prev, ev]);
            setAgents((prev) =>
              prev.map((a) =>
                a.agentId === ev.agent
                  ? { ...a, status: ev.status, progress: ev.progress, message: ev.message }
                  : a,
              ),
            );
          } else if (msg.type === "complete") {
            setRun(msg.run);
            setAgents(msg.run.agents);
            setPhase("completed");
            stop();
          } else if (msg.type === "error") {
            setError(msg.message);
            setPhase("failed");
            stop();
          }
        } catch {
          /* ignore malformed frame */
        }
      };

      es.onerror = () => {
        // EventSource fires error on normal close too; only surface if unfinished.
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

  React.useEffect(() => () => stop(), [stop]);

  return { phase, events, agents, run, error, start, reset };
}
