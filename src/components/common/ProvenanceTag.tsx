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
  calculated: "text-cyan border-cyan/30",
  "ml-prediction": "text-accent border-accent/30",
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
        "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        TONE[kind],
        className,
      )}
    >
      {LABELS[kind]}
    </span>
  );
}

/** Persistent demo-mode marker. */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-warning/30 bg-warning-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning",
        className,
      )}
      title="This application is running in demo mode with illustrative mock data."
    >
      <FlaskConical className="size-3" />
      Demo data
    </span>
  );
}
