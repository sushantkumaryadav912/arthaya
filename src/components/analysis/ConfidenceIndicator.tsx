import { cn } from "@/lib/utils/cn";
import type { ConfidenceLabel } from "@/lib/types";

const LEVEL: Record<ConfidenceLabel, { pct: number; tone: string }> = {
  Low: { pct: 25, tone: "bg-negative" },
  Moderate: { pct: 50, tone: "bg-warning" },
  "Medium-High": { pct: 72, tone: "bg-accent" },
  High: { pct: 90, tone: "bg-positive" },
};

/** Qualitative confidence indicator. Confidence in the analysis, not a guarantee. */
export function ConfidenceIndicator({
  confidence,
  className,
}: {
  confidence: ConfidenceLabel;
  className?: string;
}) {
  const l = LEVEL[confidence];
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-fg-muted">Analysis confidence</span>
        <span className="text-xs font-medium text-fg">{confidence}</span>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              (i + 1) * 25 <= l.pct + 5 ? l.tone : "bg-elevated",
            )}
          />
        ))}
      </div>
      <p className="text-[10px] text-fg-subtle">
        Reflects agreement and data quality — not a probability of the outcome.
      </p>
    </div>
  );
}
