"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search, TrendingUp } from "lucide-react";
import { NAV_SECTIONS } from "@/lib/constants/nav";
import { searchStocks } from "@/lib/api/stockApi";
import type { StockSummary } from "@/lib/types";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { cn } from "@/lib/utils/cn";

interface Cmd {
  id: string;
  label: string;
  sub?: string;
  icon: React.ReactNode;
  run: () => void;
}

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [stocks, setStocks] = React.useState<StockSummary[]>([]);
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  React.useEffect(() => {
    let alive = true;
    searchStocks(q).then((r) => alive && setStocks(r.slice(0, 6)));
    return () => {
      alive = false;
    };
  }, [q]);

  const navCmds: Cmd[] = NAV_SECTIONS.flatMap((s) => s.items).map((item) => ({
    id: `nav:${item.href}`,
    label: item.label,
    sub: "Go to page",
    icon: <item.icon className="size-4" />,
    run: () => {
      setOpen(false);
      router.push(item.href);
    },
  }));

  const stockCmds: Cmd[] = stocks.map((s) => ({
    id: `stock:${s.ticker}`,
    label: `${s.ticker} — ${s.name}`,
    sub: "Open stock",
    icon: <TrendingUp className="size-4" />,
    run: () => {
      setOpen(false);
      router.push(`/stocks/${s.ticker}`);
    },
  }));

  const ql = q.trim().toLowerCase();
  const filteredNav = ql
    ? navCmds.filter((c) => c.label.toLowerCase().includes(ql))
    : navCmds;
  const all = [...stockCmds, ...filteredNav];

  React.useEffect(() => setActive(0), [q]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, all.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      all[active]?.run();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border-strong bg-elevated shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-fg-subtle" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search stocks or jump to a page…"
            className="h-12 w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <kbd className="hidden rounded border border-border-strong px-1.5 py-0.5 text-[10px] text-fg-subtle sm:block">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {all.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-fg-subtle">No results.</p>
          )}
          {all.map((c, i) => (
            <button
              key={c.id}
              onMouseEnter={() => setActive(i)}
              onClick={c.run}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                i === active ? "bg-panel text-fg" : "text-fg-muted hover:bg-panel/60",
              )}
            >
              <span className="text-fg-subtle">{c.icon}</span>
              <span className="flex-1 truncate">{c.label}</span>
              <span className="text-[10px] text-fg-subtle">{c.sub}</span>
              {i === active && <CornerDownLeft className="size-3 text-fg-subtle" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
