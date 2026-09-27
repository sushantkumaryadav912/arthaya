import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-elevated p-3 text-fg-subtle">
        <Icon className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-fg">{title}</p>
        {description && <p className="text-xs text-fg-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title={title}
      description={description}
      className={cn("border-negative/30", className)}
    />
  );
}

export function ApiUnavailableState({ lastUpdate }: { lastUpdate?: string }) {
  return (
    <EmptyState
      icon={WifiOff}
      title="Market data unavailable"
      description={`Last successful update: ${lastUpdate ?? "--"}`}
    />
  );
}

export function LoadingSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
