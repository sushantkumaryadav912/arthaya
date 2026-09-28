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
    <div className={cn("flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-1.5">
        <h1 className="font-display text-[1.75rem] font-normal leading-none text-fg">{title}</h1>
        {description && <p className="max-w-2xl text-sm leading-relaxed text-fg-muted">{description}</p>}
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
      <div className="flex items-baseline gap-2.5">
        <span className="h-3.5 w-px shrink-0 self-center bg-accent" aria-hidden />
        <div>
          <h2 className="font-display text-base font-medium text-fg">{title}</h2>
          {description && <p className="text-xs text-fg-muted">{description}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}
