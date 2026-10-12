
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

  if (!open) return null;

  return <CommandPaletteDialog setOpen={setOpen} />;
}

function CommandPaletteDialog({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [stocks, setStocks] = React.useState<StockSummary[]>([]);
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  React.useEffect(() => {
    let alive = true;

    searchStocks(q).then((results) => {
      if (alive) setStocks(results.slice(0, 6));
    });

    return () => {
      alive = false;
    };
  }, [q]);

  const navCmds: Cmd[] = NAV_SECTIONS.flatMap((section) =>
    section.items,
  ).map((item) => ({
    id: `nav:${item.href}`,
    label: item.label,
    sub: "Go to page",
    icon: <item.icon className="size-4" />,
    run: () => {
      setOpen(false);
      router.push(item.href);
    },
  }));

  const stockCmds: Cmd[] = stocks.map((stock) => ({
    id: `stock:${stock.ticker}`,
    label: `${stock.ticker} - ${stock.name}`,
    sub: "Open stock",
    icon: <TrendingUp className="size-4" />,
    run: () => {
      setOpen(false);
      router.push(`/stocks/${stock.ticker}`);
    },
  }));

  const queryLower = q.trim().toLowerCase();
  const filteredNav = queryLower
    ? navCmds.filter((command) =>
        command.label.toLowerCase().includes(queryLower),
      )
    : navCmds;

  const all = [...stockCmds, ...filteredNav];

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, all.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      all[active]?.run();
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border-strong bg-elevated shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="size-4 text-fg-subtle" />
          <input
            ref={inputRef}
            value={q}
            onChange={(event) => {
              setQ(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search stocks or jump to a page..."
            className="h-12 w-full bg-transparent text-sm text-fg placeholder:text-fg-subtle focus:outline-none"
          />
          <kbd className="hidden rounded border border-border-strong px-1.5 py-0.5 text-[10px] text-fg-subtle sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {all.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-fg-subtle">
              No results.
            </p>
          )}

          {all.map((command, index) => (
            <button
              key={command.id}
              onMouseEnter={() => setActive(index)}
              onClick={command.run}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                index === active
                  ? "bg-panel text-fg"
                  : "text-fg-muted hover:bg-panel/60",
              )}
            >
              <span className="text-fg-subtle">{command.icon}</span>
              <span className="flex-1 truncate">{command.label}</span>
              <span className="text-[10px] text-fg-subtle">
                {command.sub}
              </span>
              {index === active && (
                <CornerDownLeft className="size-3 text-fg-subtle" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
