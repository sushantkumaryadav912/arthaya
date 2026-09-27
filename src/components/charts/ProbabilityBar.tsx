import { cn } from "@/lib/utils/cn";
import type { Direction } from "@/lib/types";

/**
 * Model-probability bar. Labeled "Model Probability" — never "certainty"
 * or "confidence of outcome" (project.md §32 guardrails).
 */
export function ProbabilityBar({
  probability,
  direction,
  label = "Model Probability",
  className,
}: {
  probability: number; // 0..1
  direction?: Direction;
  label?: string;
  className?: string;
}) {
  const pct = Math.round(probability * 100);
  const tone =
    direction === "UP"
      ? "bg-positive"
      : direction === "DOWN"
        ? "bg-negative"
        : "bg-accent";
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="tabular text-sm font-semibold text-fg">{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-elevated"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={cn("h-full rounded-full transition-all duration-700", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
