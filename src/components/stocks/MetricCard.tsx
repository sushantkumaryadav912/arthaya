import { cn } from "@/lib/utils/cn";
import { ValueDelta } from "@/components/common/ValueDelta";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import type { Provenance } from "@/lib/types";

/** Compact metric tile: label, value, optional delta and provenance. */
export function MetricCard({
  label,
  value,
  change,
  changePercent,
  provenance,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  change?: number | null;
  changePercent?: number | null;
  provenance?: Provenance;
  hint?: string;
  className?: string;
}) {
  const showDelta = change != null || changePercent != null;
  return (
    <div className={cn("rounded-xl border border-border bg-panel p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-fg-muted">{label}</p>
        {provenance && <ProvenanceTag kind={provenance} />}
      </div>
      <p className="mt-2 tabular text-xl font-semibold text-fg">{value}</p>
      {showDelta && (
        <div className="mt-1">
          <ValueDelta change={change ?? undefined} changePercent={changePercent ?? undefined} />
        </div>
      )}
      {hint && <p className="mt-1 text-[11px] text-fg-subtle">{hint}</p>}
    </div>
  );
}
