import { CheckCircle2, CircleDashed, Loader2, MinusCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AgentRunStatus, SignalClass } from "@/lib/types";

const AGENT_MAP: Record<
  AgentRunStatus,
  { tone: "neutral" | "positive" | "negative" | "warning" | "accent"; label: string; icon: React.ReactNode }
> = {
  idle: { tone: "neutral", label: "Idle", icon: <CircleDashed className="size-3" /> },
  waiting: { tone: "neutral", label: "Waiting", icon: <CircleDashed className="size-3" /> },
  running: { tone: "accent", label: "Running", icon: <Loader2 className="size-3 animate-spin" /> },
  completed: { tone: "positive", label: "Completed", icon: <CheckCircle2 className="size-3" /> },
  failed: { tone: "negative", label: "Failed", icon: <XCircle className="size-3" /> },
};

export function AgentStatusBadge({ status }: { status: AgentRunStatus }) {
  const s = AGENT_MAP[status];
  return (
    <Badge tone={s.tone}>
      {s.icon}
      {s.label}
    </Badge>
  );
}

const SIGNAL_MAP: Record<
  SignalClass,
  { tone: "positive" | "negative" | "neutral" | "warning"; label: string; icon: React.ReactNode }
> = {
  positive: { tone: "positive", label: "Positive", icon: <CheckCircle2 className="size-3" /> },
  negative: { tone: "negative", label: "Negative", icon: <XCircle className="size-3" /> },
  neutral: { tone: "neutral", label: "Neutral", icon: <MinusCircle className="size-3" /> },
  mixed: { tone: "warning", label: "Mixed", icon: <MinusCircle className="size-3" /> },
};

/** Analytical classification badge — icon+text so meaning is not color-only (§29). */
export function SignalBadge({ signal }: { signal: SignalClass }) {
  const s = SIGNAL_MAP[signal];
  return (
    <Badge tone={s.tone}>
      {s.icon}
      {s.label}
    </Badge>
  );
}
