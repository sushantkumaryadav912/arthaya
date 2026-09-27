import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/States";
import { NA, formatNumber, formatPercent } from "@/lib/utils/format";
import type { ModelPerformance } from "@/lib/types";

const fmtPct = (v: number | null) => (v == null ? NA : formatPercent(v * 100, { signed: false }));
const fmt3 = (v: number | null) => (v == null ? NA : formatNumber(v, 3));

/** Classification + regression metrics per model. Backtested — not live performance. */
export function ModelPerformanceTable({ models }: { models: ModelPerformance[] }) {
  if (models.length === 0) {
    return <EmptyState title="No evaluation data available" description="Model performance has not been computed yet." />;
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead className="text-right">Accuracy</TableHead>
          <TableHead className="text-right">Precision</TableHead>
          <TableHead className="text-right">Recall</TableHead>
          <TableHead className="text-right">F1</TableHead>
          <TableHead className="text-right">ROC-AUC</TableHead>
          <TableHead className="text-right">Log Loss</TableHead>
          <TableHead className="text-right">Brier</TableHead>
          <TableHead className="text-right">MAE</TableHead>
          <TableHead className="text-right">RMSE</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((m) => (
          <TableRow key={m.model}>
            <TableCell className="font-medium text-fg">{m.model}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmtPct(m.classification.accuracy)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmtPct(m.classification.precision)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmtPct(m.classification.recall)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.classification.f1)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.classification.rocAuc)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.classification.logLoss)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.classification.brier)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.regression.mae)}</TableCell>
            <TableCell className="tabular text-right text-fg">{fmt3(m.regression.rmse)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
