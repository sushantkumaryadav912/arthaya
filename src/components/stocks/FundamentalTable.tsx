import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCompact, NA } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { StatementRow } from "@/lib/types";

/** Financial statement table. Null cells render N/A — never fabricated. */
export function FundamentalTable({
  rows,
  periods,
}: {
  rows: StatementRow[];
  periods: string[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Line item</TableHead>
          {periods.map((p) => (
            <TableHead key={p} className="text-right">
              {p}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className={cn("text-fg-muted", row.emphasis && "font-semibold text-fg")}>
              {row.label}
            </TableCell>
            {periods.map((p) => {
              const v = row.values[p];
              return (
                <TableCell
                  key={p}
                  className={cn("tabular text-right text-fg", v == null && "text-fg-subtle")}
                >
                  {v == null ? NA : formatCompact(v)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
