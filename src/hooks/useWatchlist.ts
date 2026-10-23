
"use client";

import * as React from "react";
import { DEFAULT_WATCHLIST, addToWatchlist, removeFromWatchlist } from "@/lib/api/watchlistApi";

const KEY = "arthaya:watchlist";

/** LocalStorage-backed watchlist with client-side persistence and backend synchronization. */
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

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (Array.isArray(customEvent.detail)) {
        setTickers(customEvent.detail);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setTickers(parsed);
        } catch {}
      }
    };

    window.addEventListener("arthaya:watchlist_updated", handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("arthaya:watchlist_updated", handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const persist = React.useCallback((next: string[]) => {
    setTickers(next);

    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent("arthaya:watchlist_updated", { detail: next }));
    } catch {
      // Ignore unavailable storage.
    }
  }, []);

  const add = React.useCallback((ticker: string) => {
    const normalized = ticker.trim().toUpperCase();
    if (!normalized) return;

    setTickers((previous) => {
      if (previous.includes(normalized)) {
        return previous;
      }

      const next = [...previous, normalized];

      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("arthaya:watchlist_updated", { detail: next }));
      } catch {
        // Ignore unavailable storage.
      }

      return next;
    });

    addToWatchlist(normalized).catch(() => {});
  }, []);

  const remove = React.useCallback((ticker: string) => {
    const normalized = ticker.trim().toUpperCase();
    if (!normalized) return;

    setTickers((previous) => {
      const next = previous.filter((item) => item !== normalized);

      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
        window.dispatchEvent(new CustomEvent("arthaya:watchlist_updated", { detail: next }));
      } catch {
        // Ignore unavailable storage.
      }

      return next;
    });

    removeFromWatchlist(normalized).catch(() => {});
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
