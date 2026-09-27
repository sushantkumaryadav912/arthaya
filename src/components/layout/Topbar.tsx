"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, Menu, Moon, Search as SearchIcon, Sun } from "lucide-react";
import { PAGE_TITLES } from "@/lib/constants/nav";
import { StockSearch } from "./StockSearch";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { cn } from "@/lib/utils/cn";

function titleFor(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/stocks/")) return "Stock Detail";
  if (pathname.startsWith("/reports/")) return "Research Report";
  return "Arthaya";
}

function ThemeToggle() {
  const [light, setLight] = React.useState(false);
  React.useEffect(() => {
    const stored = localStorage.getItem("arthaya:theme");
    const isLight = stored === "light";
    setLight(isLight);
    document.documentElement.classList.toggle("light", isLight);
  }, []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("arthaya:theme", next ? "light" : "dark");
  };
  return (
    <button
      onClick={toggle}
      className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-elevated hover:text-fg"
      aria-label="Toggle theme"
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { toggle: togglePalette } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur">
      <button
        onClick={onMenu}
        className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-elevated hover:text-fg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>

      <h1 className="hidden text-sm font-semibold text-fg sm:block">{titleFor(pathname)}</h1>

      <div className="flex flex-1 items-center justify-end gap-2">
        <StockSearch className="hidden w-full max-w-xs md:block" />

        <button
          onClick={togglePalette}
          className={cn(
            "flex h-9 items-center gap-2 rounded-md border border-border-strong bg-surface px-2.5 text-xs text-fg-subtle hover:text-fg md:hidden",
          )}
          aria-label="Open command palette"
        >
          <SearchIcon className="size-4" />
        </button>

        <button
          onClick={togglePalette}
          className="hidden h-9 items-center gap-1.5 rounded-md border border-border-strong bg-surface px-2.5 text-xs text-fg-subtle hover:text-fg lg:flex"
        >
          <kbd className="tabular">⌘</kbd>
          <kbd className="tabular">K</kbd>
        </button>

        <div className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-warning animate-pulse-dot" />
          <span className="text-[10px] font-medium text-fg-muted">Market: Demo</span>
        </div>

        <button
          className="flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-elevated hover:text-fg"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
