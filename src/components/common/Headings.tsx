import { cn } from "@/lib/utils/cn";

export function PageIntro({
  title,
  description,
  actions,
  disclaimer,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  disclaimer?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-fg-muted">{description}</p>}
        {disclaimer && (
          <p className="max-w-2xl text-xs text-fg-subtle">{disclaimer}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  right,
  className,
}: {
  title: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
        {description && <p className="text-xs text-fg-muted">{description}</p>}
      </div>
      {right}
    </div>
  );
}
