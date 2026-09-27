"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { AnalysisEvent } from "@/lib/types";

const STATUS_TONE: Record<AnalysisEvent["status"], string> = {
  idle: "text-fg-subtle",
  waiting: "text-fg-subtle",
  running: "text-accent",
  completed: "text-positive",
  failed: "text-negative",
};

/** Terminal-style live execution log that auto-scrolls to the newest event. */
export function LiveExecutionLog({
  events,
  className,
}: {
  events: AnalysisEvent[];
  className?: string;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [events.length]);

  return (
    <div
      className={cn(
        "h-64 overflow-y-auto rounded-lg border border-border bg-bg p-3 font-mono text-xs",
        className,
      )}
      role="log"
      aria-live="polite"
    >
      {events.length === 0 ? (
        <p className="text-fg-subtle">Waiting for execution events…</p>
      ) : (
        <div className="space-y-1">
          {events.map((e, i) => (
            <div key={`${e.agent}-${i}`} className="flex gap-2">
              <span className="shrink-0 tabular text-fg-subtle">{e.clock ?? "--:--"}</span>
              <span className={cn("shrink-0 uppercase", STATUS_TONE[e.status])}>
                {e.agent}
              </span>
              <span className="text-fg-muted">{e.message}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
}
