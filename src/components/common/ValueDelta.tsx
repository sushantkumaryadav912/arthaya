import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPercent, formatSignedNumber, toneForDelta } from "@/lib/utils/format";

const TONE_CLASS = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-fg-muted",
} as const;

/** Signed change with directional icon (never color-only). */
export function ValueDelta({
  change,
  changePercent,
  className,
  showValue = true,
}: {
  change?: number | null;
  changePercent?: number | null;
  className?: string;
  showValue?: boolean;
}) {
  const tone = toneForDelta(changePercent ?? change ?? 0);
  const Icon = tone === "positive" ? ArrowUpRight : tone === "negative" ? ArrowDownRight : Minus;
  return (
    <span className={cn("inline-flex items-center gap-1 tabular text-sm", TONE_CLASS[tone], className)}>
      <Icon className="size-3.5" aria-hidden />
      {showValue && change != null && <span>{formatSignedNumber(change)}</span>}
      {changePercent != null && <span>({formatPercent(changePercent)})</span>}
    </span>
  );
}
