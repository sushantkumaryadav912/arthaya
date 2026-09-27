import { SignalBadge } from "@/components/common/StatusBadge";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { formatNumber } from "@/lib/utils/format";
import type { TechnicalIndicator } from "@/lib/types";

/** Single technical-indicator tile with interpretation and provenance. */
export function IndicatorCard({ indicator }: { indicator: TechnicalIndicator }) {
  return (
    <div className="rounded-lg border border-border bg-panel p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-fg-muted">{indicator.label}</p>
          <p className="tabular text-lg font-semibold text-fg">
            {formatNumber(indicator.value, 2)}
            {indicator.unit && <span className="ml-0.5 text-xs text-fg-subtle">{indicator.unit}</span>}
          </p>
        </div>
        <SignalBadge signal={indicator.status} />
      </div>
      <p className="mt-1 text-[11px] text-fg-muted">{indicator.interpretation}</p>
      {indicator.context && <p className="mt-0.5 text-[10px] text-fg-subtle">{indicator.context}</p>}
      <div className="mt-2">
        <ProvenanceTag kind="calculated" />
      </div>
    </div>
  );
}
