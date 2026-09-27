"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { AGENT_PIPELINE } from "@/lib/constants/agents";
import type { AgentId, AgentRunStatus } from "@/lib/types";

const NODE_TONE: Record<AgentRunStatus, string> = {
  idle: "border-border bg-surface text-fg-muted",
  waiting: "border-border bg-surface text-fg-muted",
  running: "border-accent bg-accent/10 text-fg animate-pulse-dot",
  completed: "border-positive/50 bg-positive-soft text-fg",
  failed: "border-negative/50 bg-negative-soft text-fg",
};

/** Compute dependency-depth layers (longest path from a root). */
function computeLayers() {
  const byId = new Map(AGENT_PIPELINE.map((a) => [a.agentId, a]));
  const depth = new Map<AgentId, number>();
  const resolve = (id: AgentId): number => {
    if (depth.has(id)) return depth.get(id)!;
    const node = byId.get(id)!;
    const d = node.dependsOn.length === 0 ? 0 : 1 + Math.max(...node.dependsOn.map(resolve));
    depth.set(id, d);
    return d;
  };
  AGENT_PIPELINE.forEach((a) => resolve(a.agentId));
  const maxDepth = Math.max(...[...depth.values()]);
  const layers: (typeof AGENT_PIPELINE)[] = Array.from({ length: maxDepth + 1 }, () => []);
  AGENT_PIPELINE.forEach((a) => layers[depth.get(a.agentId)!].push(a));
  return layers;
}

const LAYERS = computeLayers();

/** Component-based visualization of the agent pipeline, layered by dependency depth. */
export function AgentGraph({
  statuses,
  className,
}: {
  statuses?: Partial<Record<AgentId, AgentRunStatus>>;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex min-w-max items-stretch gap-2">
        {LAYERS.map((layer, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col justify-center gap-2">
              {layer.map((a) => {
                const st = statuses?.[a.agentId] ?? "idle";
                return (
                  <div
                    key={a.agentId}
                    className={cn(
                      "w-40 rounded-lg border p-2.5 transition-colors",
                      NODE_TONE[st],
                    )}
                    title={a.description}
                  >
                    <p className="text-xs font-semibold">{a.name}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-fg-subtle">
                      {st}
                    </p>
                  </div>
                );
              })}
            </div>
            {i < LAYERS.length - 1 && (
              <ChevronRight className="size-4 shrink-0 text-fg-subtle" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
