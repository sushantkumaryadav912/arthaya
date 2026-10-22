import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet, apiSend } from "./client";
import type { StockSummary } from "@/lib/types";
import { toSummary, findSeed } from "@/lib/mock/stocks";

/** Default watchlist tickers. */
export const DEFAULT_WATCHLIST = ["AAPL", "NVDA", "MSFT", "TSLA", "RELIANCE"];

export function summariesForTickers(tickers: string[]): StockSummary[] {
  return tickers
    .map((t) => findSeed(t))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map(toSummary);
}

export async function getWatchlist(tickers: string[]): Promise<StockSummary[]> {
  if (DEMO_MODE) return summariesForTickers(tickers);

  try {
    const rawList = await apiGet<any[]>("/watchlist");
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item) => {
        const seed = findSeed(item.ticker);
        const price = Number(item.price ?? seed?.base ?? 150);
        const change = Number(item.change ?? 0.85);
        const pct = price ? (change / price) * 100 : 0;
        return {
          ticker: item.ticker,
          name: item.name || seed?.name || item.ticker,
          exchange: seed?.exchange || "NASDAQ",
          price,
          change,
          changePercent: Number(pct.toFixed(2)),
          trend: change >= 0 ? "up" : "down",
          prediction: item.direction || (change >= 0 ? "UP" : "DOWN"),
          probability: Number(item.probability ?? 0.65),
          lastAnalysis: new Date().toISOString(),
        } as StockSummary;
      });
    }
  } catch (err) {
    console.warn("Could not load /watchlist from backend:", err);
  }

  return summariesForTickers(tickers);
}

export async function addToWatchlist(ticker: string): Promise<void> {
  if (DEMO_MODE) return;
  try {
    await apiSend("/watchlist", "POST", { ticker });
  } catch (err) {
    console.warn(`Could not add ${ticker} to backend watchlist:`, err);
  }
}

export async function removeFromWatchlist(ticker: string): Promise<void> {
  if (DEMO_MODE) return;
  try {
    await apiSend(`/watchlist/${ticker}`, "DELETE");
  } catch (err) {
    console.warn(`Could not remove ${ticker} from backend watchlist:`, err);
  }
}
