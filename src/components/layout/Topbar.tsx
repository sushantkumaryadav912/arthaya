
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  Moon,
  Search as SearchIcon,
  Sun,
  Sparkles,
} from "lucide-react";
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
  const [initialized, setInitialized] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("arthaya:theme");
    const isLight = stored === "light";

    document.documentElement.classList.toggle("light", isLight);

    // Defer state synchronization until after the effect callback.
    const frame = window.requestAnimationFrame(() => {
      setLight(isLight);
      setInitialized(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = !light;

    setLight(next);
    setInitialized(true);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("arthaya:theme", next ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      disabled={!initialized}
      className="flex size-9 items-center justify-center rounded-lg border border-transparent text-fg-muted hover:border-border-strong hover:bg-elevated hover:text-accent transition-all duration-200 active:scale-95 disabled:opacity-60"
      aria-label="Toggle theme"
      aria-pressed={light}
    >
      {light ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { toggle: togglePalette } = useCommandPalette();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/80 bg-surface/85 px-4 sm:px-6 backdrop-blur-md transition-all shadow-sm">
      <button
        onClick={onMenu}
        className="flex size-9 items-center justify-center rounded-lg border border-border/60 text-fg-muted hover:border-accent/40 hover:bg-elevated hover:text-accent lg:hidden transition-all"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
      </button>

      {/* Mobile Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
        <div className="relative flex size-7 items-center justify-center rounded-md border border-accent/30 bg-bg p-0.5 shadow-sm">
          <Image
            src="/arthaya_logo.png"
            alt="Arthaya"
            width={22}
            height={22}
            className="rounded object-contain"
          />
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <h1 className="font-display text-base font-bold text-fg tracking-tight">
          {titleFor(pathname)}
        </h1>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2.5">
        <StockSearch className="hidden w-full max-w-xs md:block" />

        <button
          onClick={togglePalette}
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg border border-border-strong bg-bg/60 px-3 text-xs text-fg-subtle hover:border-accent/40 hover:text-fg md:hidden transition-all",
          )}
          aria-label="Open command palette"
        >
          <SearchIcon className="size-4 text-accent" />
        </button>

        <button
          onClick={togglePalette}
          className="hidden h-9 items-center gap-2 rounded-lg border border-border-strong/80 bg-surface px-3 text-xs text-fg-subtle hover:border-accent/40 hover:text-fg lg:flex transition-all hover:shadow-[0_0_12px_rgba(16,185,129,0.1)]"
          aria-label="Search ticker"
        >
          <SearchIcon className="size-3.5 text-accent" />
          <span className="text-[11px] font-medium">Search Ticker...</span>
          <div className="flex items-center gap-0.5 ml-2 font-mono text-[10px] text-fg-subtle border border-border px-1.5 py-0.5 rounded bg-elevated">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </div>
        </button>

        <div className="hidden items-center gap-2 rounded-lg border border-positive/30 bg-positive/10 px-2.5 py-1 sm:flex shadow-[0_0_10px_rgba(16,185,129,0.12)]">
          <span className="size-2 rounded-full bg-positive animate-pulse-dot" />
          <span className="text-[11px] font-semibold text-positive flex items-center gap-1">
            <Sparkles className="size-3" />
            AI Grid: Active
          </span>
        </div>

        <button
          className="relative flex size-9 items-center justify-center rounded-lg border border-transparent text-fg-muted hover:border-border-strong hover:bg-elevated hover:text-fg transition-all active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-accent ring-2 ring-surface" />
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}
