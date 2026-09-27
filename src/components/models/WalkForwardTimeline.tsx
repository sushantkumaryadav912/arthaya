import { NA, formatNumber, formatPercent } from "@/lib/utils/format";
import { EmptyState } from "@/components/common/States";
import type { WalkForwardPeriod } from "@/lib/types";

/** Walk-forward evaluation across time — each fold trained on past, tested on unseen future. */
export function WalkForwardTimeline({ periods }: { periods: WalkForwardPeriod[] }) {
  if (periods.length === 0) {
    return <EmptyState title="No evaluation data available" description="Walk-forward folds have not been computed yet." />;
  }
  return (
    <div className="space-y-2">
      {periods.map((p) => {
        const acc = p.accuracy == null ? 0 : Math.round(p.accuracy * 100);
        return (
          <div key={p.period} className="rounded-lg border border-border bg-panel p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-fg">{p.period}</p>
              <span className="tabular text-xs text-fg-muted">
                Acc {p.accuracy == null ? NA : formatPercent(p.accuracy * 100, 1, false)} · ROC-AUC{" "}
                {p.rocAuc == null ? NA : formatNumber(p.rocAuc, 3)}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-elevated">
              <div className="h-full rounded-full bg-accent" style={{ width: `${acc}%` }} />
            </div>
            <p className="mt-1.5 text-[10px] text-fg-subtle">
              Train: {p.trainWindow} · Test: {p.testWindow}
            </p>
          </div>
        );
      })}
    </div>
  );
}
