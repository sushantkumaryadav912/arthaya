import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/States";
import { cn } from "@/lib/utils/cn";
import { NA, formatNumber, formatPercent } from "@/lib/utils/format";
import type { BaselineComparison as Baseline } from "@/lib/types";

/** Ablation: multi-source model vs. single-source and naive baselines (backtested). */
export function BaselineComparison({ baselines }: { baselines: Baseline[] }) {
  if (baselines.length === 0) {
    return <EmptyState title="No evaluation data available" description="Baseline comparisons have not been computed yet." />;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Configuration</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">ROC-AUC</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {baselines.map((b) => {
          const best = b.name === "Multi-source";
          return (
            <TableRow key={b.name} className={cn(best && "bg-accent/10")}>
              <TableCell className={cn("text-fg-muted", best && "font-semibold text-fg")}>
                {b.name}
              </TableCell>
              <TableCell className="tabular text-right text-fg">
                {b.accuracy == null ? NA : formatPercent(b.accuracy * 100, 1, false)}
              </TableCell>
              <TableCell className="tabular text-right text-fg">
                {b.rocAuc == null ? NA : formatNumber(b.rocAuc, 3)}
              </TableCell>
              <TableCell className="text-xs text-fg-subtle">{b.note ?? "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
