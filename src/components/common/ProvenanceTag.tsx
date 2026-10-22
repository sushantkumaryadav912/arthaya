import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Provenance } from "@/lib/types";

const LABELS: Record<Provenance, string> = {
  "market-data": "Market data",
  calculated: "Calculated",
  "ml-prediction": "ML prediction",
  "ai-interpretation": "AI-generated interpretation",
  backtest: "Backtested",
  demo: "Demo data",
};

const TONE: Record<Provenance, string> = {
  "market-data": "text-fg-muted border-border-strong",
  calculated: "text-fg-muted border-border-strong",
  "ml-prediction": "text-fg-muted border-border-strong",
  "ai-interpretation": "text-warning border-warning/30",
  backtest: "text-fg-muted border-border-strong",
  demo: "text-warning border-warning/30",
};

/** Small provenance tag so every value's origin is explicit (project.md §32/§44). */
export function ProvenanceTag({
  kind,
  className,
}: {
  kind: Provenance;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[10px] font-medium",
        TONE[kind],
        className,
      )}
    >
      <span
        className="size-1 shrink-0 rounded-full bg-current opacity-70"
        aria-hidden
      />
      {LABELS[kind]}
    </span>
  );
}

import { DEMO_MODE } from "@/lib/utils/env";

/** Persistent demo-mode or live backend marker. */
export function DemoBadge({ className }: { className?: string }) {
  if (!DEMO_MODE) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400",
          className,
        )}
        title="Live Backend Mode — Synced with Arthaya Multi-Agent Platform"
      >
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live Backend
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-2 py-0.5 text-[10px] font-medium text-warning",
        className,
      )}
      title="This application is running in demo mode with illustrative mock data."
    >
      <FlaskConical className="size-3" />
      Demo data
    </span>
  );
}
