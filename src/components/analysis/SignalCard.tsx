import { SignalBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils/cn";
import type { SignalClass } from "@/lib/types";

/** One dimension of the analysis (Technical, Fundamental, News, ...) with its classification. */
export function SignalCard({
  label,
  signal,
  detail,
  className,
}: {
  label: string;
  signal: SignalClass;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-panel p-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-fg">{label}</p>
        <SignalBadge signal={signal} />
      </div>
      {detail && <p className="mt-1.5 text-[11px] leading-snug text-fg-muted">{detail}</p>}
    </div>
  );
}
