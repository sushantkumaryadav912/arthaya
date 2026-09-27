import { AgentStatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils/cn";
import type { AgentDefinition, AgentRunStatus } from "@/lib/types";

/** Card describing one agent in the pipeline, optionally showing its live status. */
export function AgentCard({
  agent,
  status,
  className,
}: {
  agent: AgentDefinition;
  status?: AgentRunStatus;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-lg border border-border bg-panel p-4 transition-colors hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-fg">{agent.name}</h3>
        {status && <AgentStatusBadge status={status} />}
      </div>
      <p className="mt-1 flex-1 text-xs leading-snug text-fg-muted">{agent.description}</p>
      {agent.dependsOn.length > 0 && (
        <p className="mt-2 text-[10px] uppercase tracking-wide text-fg-subtle">
          Depends on: {agent.dependsOn.join(", ")}
        </p>
      )}
    </div>
  );
}
