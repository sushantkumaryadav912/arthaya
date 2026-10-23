import { AgentStatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils/cn";
import type { AgentStatus } from "@/lib/types";

import { AGENT_PIPELINE } from "@/lib/constants/agents";

const DOT: Record<AgentStatus["status"], string> = {
  idle: "border-border bg-surface",
  waiting: "border-border bg-surface",
  running: "border-accent bg-accent/20 animate-pulse-dot",
  completed: "border-positive bg-positive",
  failed: "border-negative bg-negative",
};

/** Vertical pipeline timeline of agent execution. */
export function AgentTimeline({ agents }: { agents?: AgentStatus[] }) {
  const list =
    Array.isArray(agents) && agents.length > 0
      ? agents
      : AGENT_PIPELINE.map((d) => ({
          agentId: d.agentId,
          name: d.name,
          status: "completed" as const,
        }));

  return (
    <ol className="relative space-y-4">
      {list.map((a, i) => (
        <li key={a.agentId} className="relative flex gap-3 pl-1">
          {i < agents.length - 1 && (
            <span className="absolute left-[7px] top-4 h-full w-px bg-border" aria-hidden />
          )}
          <span
            className={cn(
              "relative mt-1 size-3.5 shrink-0 rounded-full border-2",
              DOT[a.status],
            )}
            aria-hidden
          />
          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-fg">{a.name}</p>
              <AgentStatusBadge status={a.status} />
            </div>
            {a.currentTask && a.status === "running" && (
              <p className="mt-0.5 text-xs text-accent">{a.currentTask}</p>
            )}
            {a.message && <p className="mt-0.5 text-xs text-fg-muted">{a.message}</p>}
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-fg-subtle">
              {a.executionMs != null && a.status === "completed" && (
                <span className="tabular">{(a.executionMs / 1000).toFixed(1)}s</span>
              )}
              {a.dataSources && a.dataSources.length > 0 && (
                <span>{a.dataSources.join(" · ")}</span>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
