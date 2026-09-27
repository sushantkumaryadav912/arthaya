import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet, apiSend } from "./client";
import type { StockSummary } from "@/lib/types";
import { toSummary, findSeed } from "@/lib/mock/stocks";

/** Default demo watchlist tickers. Client persistence handled by useWatchlist. */
export const DEFAULT_WATCHLIST = ["AAPL", "NVDA", "MSFT", "TSLA", "RELIANCE"];

export function summariesForTickers(tickers: string[]): StockSummary[] {
  return tickers
    .map((t) => findSeed(t))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map(toSummary);
}

export async function getWatchlist(tickers: string[]): Promise<StockSummary[]> {
  if (DEMO_MODE) return summariesForTickers(tickers);
  return apiGet<StockSummary[]>("/watchlist");
}

export async function addToWatchlist(ticker: string): Promise<void> {
  if (DEMO_MODE) return;
  await apiSend("/watchlist", "POST", { ticker });
}

export async function removeFromWatchlist(ticker: string): Promise<void> {
  if (DEMO_MODE) return;
  await apiSend(`/watchlist/${ticker}`, "DELETE");
}
