"use client";

import * as React from "react";
import { DEFAULT_WATCHLIST } from "@/lib/api/watchlistApi";

const KEY = "arthaya:watchlist";

/** localStorage-backed watchlist (client-only persistence in demo mode). */
export function useWatchlist() {
  const [tickers, setTickers] = React.useState<string[]>(DEFAULT_WATCHLIST);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTickers(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setTickers(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const add = React.useCallback(
    (ticker: string) => {
      const t = ticker.toUpperCase();
      setTickers((prev) => {
        if (prev.includes(t)) return prev;
        const next = [...prev, t];
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [],
  );

  const remove = React.useCallback((ticker: string) => {
    const t = ticker.toUpperCase();
    setTickers((prev) => {
      const next = prev.filter((x) => x !== t);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const has = React.useCallback((ticker: string) => tickers.includes(ticker.toUpperCase()), [tickers]);

  const toggle = React.useCallback(
    (ticker: string) => (has(ticker) ? remove(ticker) : add(ticker)),
    [has, remove, add],
  );

  return { tickers, hydrated, add, remove, has, toggle, set: persist };
}
