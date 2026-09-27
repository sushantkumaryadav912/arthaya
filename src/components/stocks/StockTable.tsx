import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ValueDelta } from "@/components/common/ValueDelta";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatPrice, formatCompact } from "@/lib/utils/format";
import type { StockSummary } from "@/lib/types";

const CUR: Record<string, string> = { NSE: "INR", BSE: "INR", NASDAQ: "USD", NYSE: "USD" };

/** Reusable summary table for watchlist / market rows. */
export function StockTable({
  rows,
  onRemove,
}: {
  rows: StockSummary[];
  onRemove?: (ticker: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticker</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">Change</TableHead>
          <TableHead className="hidden text-right sm:table-cell">RSI</TableHead>
          <TableHead className="hidden text-right md:table-cell">Volume</TableHead>
          <TableHead className="text-right">Prediction</TableHead>
          {onRemove && <TableHead className="text-right" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.ticker}>
            <TableCell>
              <Link href={`/stocks/${r.ticker}`} className="block">
                <span className="tabular text-sm font-medium text-fg hover:text-accent">{r.ticker}</span>
                <span className="block max-w-[12rem] truncate text-xs text-fg-subtle">{r.name}</span>
              </Link>
            </TableCell>
            <TableCell className="tabular text-right text-fg">
              {formatPrice(r.price, CUR[r.exchange] ?? "USD")}
            </TableCell>
            <TableCell className="text-right">
              <ValueDelta changePercent={r.changePercent} showValue={false} />
            </TableCell>
            <TableCell className="hidden tabular text-right text-fg-muted sm:table-cell">
              {formatNumber(r.rsi, 1)}
            </TableCell>
            <TableCell className="hidden tabular text-right text-fg-muted md:table-cell">
              {formatCompact(r.volume)}
            </TableCell>
            <TableCell className="text-right">
              <Badge tone={r.prediction === "UP" ? "positive" : r.prediction === "DOWN" ? "negative" : "neutral"}>
                {r.prediction ?? "N/A"}
                {r.probability != null && (
                  <span className="tabular">{Math.round(r.probability * 100)}%</span>
                )}
              </Badge>
            </TableCell>
            {onRemove && (
              <TableCell className="text-right">
                <button
                  onClick={() => onRemove(r.ticker)}
                  className="text-xs text-fg-subtle hover:text-negative"
                  aria-label={`Remove ${r.ticker}`}
                >
                  Remove
                </button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
