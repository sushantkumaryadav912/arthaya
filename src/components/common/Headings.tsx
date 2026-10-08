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
    <div className={cn("flex flex-col gap-4 border-b border-border/80 pb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-relaxed text-fg-muted font-normal">{description}</p>}
        {disclaimer && (
          <p className="max-w-2xl text-xs text-fg-subtle">{disclaimer}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
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
    <div className={cn("mb-3.5 flex items-end justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-1 shrink-0 rounded-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden />
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-fg">{title}</h2>
          {description && <p className="text-xs text-fg-muted">{description}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

