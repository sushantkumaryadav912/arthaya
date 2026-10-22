"use client";

import { useEffect, useRef, useState } from "react";
import { Download, AlertTriangle, RefreshCw, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { AnalysisEvent } from "@/lib/types";

const PHASE_BADGE: Record<string, { label: string; tone: string }> = {
  planning: { label: "PLAN", tone: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  perception: { label: "PERCEIVE", tone: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  tool_execution: { label: "TOOL", tone: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  reasoning: { label: "REASON", tone: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  critique: { label: "CRITIQUE", tone: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  replanning: { label: "REPLAN", tone: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  synthesis: { label: "SYNTHESIS", tone: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30" },
};

/** Terminal-style live execution log with multi-agent handoffs, conflict tags & trace export. */
export function LiveExecutionLog({
  events,
  className,
}: {
  events: AnalysisEvent[];
  className?: string;
}) {
  const [filter, setFilter] = useState<"all" | "handoffs" | "conflicts">("all");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events.length]);

  const handleExportTrace = () => {
    if (events.length === 0) return;
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arthaya_execution_trace_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredEvents = events.filter((e) => {
    if (filter === "handoffs") return Boolean(e.targetAgent || e.toolName);
    if (filter === "conflicts") return Boolean(e.isConflict || e.isReplan);
    return true;
  });

  const conflictCount = events.filter((e) => e.isConflict).length;
  const replanCount = events.filter((e) => e.isReplan).length;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-fg-muted font-mono">
          <Cpu className="size-3.5 text-accent" />
          <span>Multi-Agent Message Bus ({events.length} frames)</span>
          {conflictCount > 0 && (
            <span className="flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-400 border border-amber-500/30">
              <AlertTriangle className="size-2.5" />
              {conflictCount} conflict
            </span>
          )}
          {replanCount > 0 && (
            <span className="flex items-center gap-1 rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] text-rose-400 border border-rose-500/30">
              <RefreshCw className="size-2.5" />
              {replanCount} re-plan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggles */}
          <div className="flex rounded-md border border-border bg-surface p-0.5 text-[11px] font-mono">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded px-2 py-0.5 transition-colors",
                filter === "all" ? "bg-accent/20 text-accent font-semibold" : "text-fg-subtle hover:text-fg",
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("handoffs")}
              className={cn(
                "rounded px-2 py-0.5 transition-colors",
                filter === "handoffs" ? "bg-accent/20 text-accent font-semibold" : "text-fg-subtle hover:text-fg",
              )}
            >
              Handoffs
            </button>
            <button
              type="button"
              onClick={() => setFilter("conflicts")}
              className={cn(
                "rounded px-2 py-0.5 transition-colors",
                filter === "conflicts" ? "bg-accent/20 text-accent font-semibold" : "text-fg-subtle hover:text-fg",
              )}
            >
              Conflicts
            </button>
          </div>

          {/* Export JSON trace button */}
          <button
            type="button"
            onClick={handleExportTrace}
            disabled={events.length === 0}
            className="flex items-center gap-1 rounded border border-border/80 bg-surface px-2 py-1 text-[11px] font-mono text-fg-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
            title="Download Execution Trace JSON for CA3 Submission"
          >
            <Download className="size-3" />
            <span>Trace JSON</span>
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div
        className="h-72 overflow-y-auto rounded-lg border border-border bg-[#0a1015] p-3 font-mono text-xs shadow-inner"
        role="log"
        aria-live="polite"
      >
        {filteredEvents.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Layers className="size-6 mb-2 opacity-50 text-accent" />
            <p className="text-slate-200">Ready to trace inter-agent communication & conflict arbitration…</p>
            <p className="text-[11px] text-slate-400">Configure ticker and click Run Analysis to observe real-time agent handoffs.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredEvents.map((e, i) => {
              const badge = e.phase ? PHASE_BADGE[e.phase] : null;

              return (
                <div
                  key={`${e.agent}-${i}`}
                  className={cn(
                    "group flex flex-col gap-0.5 rounded p-1.5 transition-colors",
                    e.isConflict
                      ? "bg-amber-950/40 border border-amber-500/40 text-amber-200"
                      : e.isReplan
                      ? "bg-rose-950/40 border border-rose-500/40 text-rose-200"
                      : "hover:bg-white/[0.04]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="shrink-0 tabular text-slate-400 font-mono text-[11px]">{e.clock ?? "--:--"}</span>

                    {badge && (
                      <span
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-wider",
                          badge.tone,
                        )}
                      >
                        {badge.label}
                      </span>
                    )}

                    <span className="shrink-0 font-bold uppercase text-accent">
                      {e.agent}
                    </span>

                    {e.targetAgent && (
                      <span className="flex items-center gap-1 text-[11px] text-cyan-400 font-semibold">
                        ➔ <span className="uppercase">{e.targetAgent}</span>
                      </span>
                    )}

                    {e.isConflict && (
                      <span className="flex items-center gap-1 rounded bg-amber-500/25 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                        ⚡ CRITIC DISAGREEMENT
                      </span>
                    )}

                    {e.isReplan && (
                      <span className="flex items-center gap-1 rounded bg-rose-500/25 px-1.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                        🔄 DYNAMIC RE-PLAN
                      </span>
                    )}

                    {e.toolName && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        [{e.toolName}]
                      </span>
                    )}
                  </div>

                  <p className="text-slate-100 pl-12 text-[11.5px] leading-relaxed">
                    {e.message}
                  </p>

                  {e.payloadSummary && (
                    <p className="text-slate-300 pl-12 text-[10.5px] italic font-mono">
                      Payload: {e.payloadSummary}
                    </p>
                  )}
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
        )}
      </div>
    </div>
  );
}
