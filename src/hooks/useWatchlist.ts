
"use client";

import * as React from "react";
import { DEFAULT_WATCHLIST } from "@/lib/api/watchlistApi";

const KEY = "arthaya:watchlist";

/** LocalStorage-backed watchlist with client-side persistence. */
export function useWatchlist() {
  const [tickers, setTickers] = React.useState<string[]>(DEFAULT_WATCHLIST);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    let storedTickers: string[] | null = null;

    try {
      const raw = window.localStorage.getItem(KEY);

      if (raw) {
        const parsed: unknown = JSON.parse(raw);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (ticker): ticker is string => typeof ticker === "string",
          )
        ) {
          storedTickers = parsed.map((ticker) => ticker.toUpperCase());
        }
      }
    } catch {
      // Ignore unavailable storage or invalid JSON.
    }

    const frame = window.requestAnimationFrame(() => {
      if (storedTickers !== null) {
        setTickers(storedTickers);
      }

      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setTickers(next);

    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Ignore unavailable storage.
    }
  }, []);

  const add = React.useCallback((ticker: string) => {
    const normalized = ticker.toUpperCase();

    setTickers((previous) => {
      if (previous.includes(normalized)) {
        return previous;
      }

      const next = [...previous, normalized];

      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Ignore unavailable storage.
      }

      return next;
    });
  }, []);

  const remove = React.useCallback((ticker: string) => {
    const normalized = ticker.toUpperCase();

    setTickers((previous) => {
      const next = previous.filter((item) => item !== normalized);

      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Ignore unavailable storage.
      }

      return next;
    });
  }, []);

  const has = React.useCallback(
    (ticker: string) => tickers.includes(ticker.toUpperCase()),
    [tickers],
  );

  const toggle = React.useCallback(
    (ticker: string) => {
      if (has(ticker)) {
        remove(ticker);
      } else {
        add(ticker);
      }
    },
    [has, remove, add],
  );

  return { tickers, hydrated, add, remove, has, toggle, set: persist };
}
