"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { seg: "", label: "Overview" },
  { seg: "technical", label: "Technical" },
  { seg: "fundamentals", label: "Fundamentals" },
  { seg: "news", label: "News" },
  { seg: "historical", label: "Historical" },
  { seg: "prediction", label: "Prediction" },
  { seg: "analysis", label: "Analysis" },
];

export function StockTabs({ ticker }: { ticker: string }) {
  const pathname = usePathname();
  const base = `/stocks/${ticker}`;
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((t) => {
        const href = t.seg ? `${base}/${t.seg}` : base;
        const active = t.seg ? pathname === href : pathname === base;
        return (
          <Link
            key={t.seg || "overview"}
            href={href}
            className={cn(
              "whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors",
              active
                ? "border-accent text-fg"
                : "border-transparent text-fg-muted hover:text-fg",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
