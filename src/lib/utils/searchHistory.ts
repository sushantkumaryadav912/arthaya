"use client";

const STORAGE_KEY = "arthaya:searched_stocks";
const DEFAULT_SEARCHED = ["M&M", "AAPL", "NVDA", "TSLA", "RELIANCE"];

/**
 * Retrieves the list of recently searched or analyzed stock tickers from localStorage.
 */
export function getSearchedStocks(): string[] {
  if (typeof window === "undefined") return DEFAULT_SEARCHED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SEARCHED;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((t) => String(t).toUpperCase().trim());
    }
  } catch {
    // ignore parsing errors
  }
  return DEFAULT_SEARCHED;
}

/**
 * Records a stock ticker into localStorage search history.
 */
export function recordSearchedStock(ticker: string): void {
  if (typeof window === "undefined") return;
  const normalized = ticker.trim().toUpperCase();
  if (!normalized) return;

  try {
    const current = getSearchedStocks();
    const updated = [normalized, ...current.filter((t) => t !== normalized)].slice(0, 15);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("arthaya:searched_stocks_updated", { detail: updated }));
  } catch {
    // ignore storage quota errors
  }
}
