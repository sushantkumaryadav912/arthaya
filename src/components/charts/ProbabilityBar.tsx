import { cn } from "@/lib/utils/cn";
import type { Direction } from "@/lib/types";

/**
 * Model-probability gauge — read as a calibrated measurement scale, not a
 * rounded progress pill. Ticks at 0/25/50/75/100 give the reading a frame of
 * reference; the fill stops at the measured value and a marker pins it.
 * Labeled "Model Probability" — never "certainty" (project.md §32 guardrails).
 */
export function ProbabilityBar({
  probability,
  direction,
  label = "Model Probability",
  className,
}: {
  probability: number; // 0..1
  direction?: Direction | string;
  label?: string;
  className?: string;
}) {
  const safeProb = typeof probability === "number" && !isNaN(probability) ? probability : 0.5;
  const pct = Math.min(100, Math.max(0, Math.round(safeProb * 100)));
  const normDir = (direction || "UP").toString().toUpperCase();
  const tone =
    normDir === "UP"
      ? "bg-positive"
      : normDir === "DOWN"
        ? "bg-negative"
        : "bg-accent";
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="tabular text-base font-medium text-fg">{pct}%</span>
      </div>
      <div className="relative">
        <div
          className="relative h-2.5 w-full overflow-hidden rounded-sm bg-elevated"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={cn("h-full transition-all duration-700", tone)}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* calibration ticks */}
        <div className="pointer-events-none absolute inset-0 flex justify-between px-0">
          {[0, 25, 50, 75, 100].map((t) => (
            <span
              key={t}
              className="h-2.5 w-px bg-bg/70"
              style={{ opacity: t === 0 || t === 100 ? 0 : 1 }}
              aria-hidden
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        {[0, 50, 100].map((t) => (
          <span key={t} className="tabular text-[9px] text-fg-subtle">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
