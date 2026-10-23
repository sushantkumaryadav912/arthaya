import { isDemoSessionAsync } from "@/lib/utils/env";
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
  // If the user's watchlist is explicitly empty, return empty list
  if (Array.isArray(tickers) && tickers.length === 0) {
    return [];
  }

  const requestedTickers = (tickers && tickers.length > 0 ? tickers : DEFAULT_WATCHLIST).map((t) => t.toUpperCase());

  // If in demo mode, generate dynamic mock summaries directly
  if (await isDemoSessionAsync()) {
    return summariesForTickers(requestedTickers);
  }

  try {
    const raw = await apiGet<any>("/watchlist");
    const rawList = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];

    const backendMap = new Map<string, any>();
    if (Array.isArray(rawList)) {
      for (const item of rawList) {
        if (item?.ticker) {
          backendMap.set(item.ticker.toUpperCase(), item);
        }
      }
    }

    // Build summaries for all requested tickers, incorporating backend live prices where available
    return requestedTickers.map((t) => {
      const item = backendMap.get(t);
      const seed = findSeed(t);
      const price = Number(item?.price ?? seed?.base ?? 150);
      const change = Number(item?.change ?? 0.85);
      const pct = price ? (change / price) * 100 : 0;
      return {
        ticker: t,
        name: item?.name || seed?.name || `${t} Corp.`,
        exchange: seed?.exchange || "NASDAQ",
        price,
        change,
        changePercent: Number(pct.toFixed(2)),
        trend: change >= 0 ? "up" : "down",
        prediction: item?.direction || (change >= 0 ? "UP" : "DOWN"),
        probability: Number(item?.probability ?? 0.65),
        lastAnalysis: new Date().toISOString(),
      } as StockSummary;
    });
  } catch (err) {
    console.warn("Could not load /watchlist from backend:", err);
  }

  return summariesForTickers(requestedTickers);
}

export async function addToWatchlist(ticker: string): Promise<void> {
  try {
    await apiSend("/watchlist", "POST", { ticker: ticker.toUpperCase() });
  } catch (err) {
    console.warn(`Could not add ${ticker} to backend watchlist:`, err);
  }
}

export async function removeFromWatchlist(ticker: string): Promise<void> {
  try {
    await apiSend(`/watchlist/${ticker.toUpperCase()}`, "DELETE");
  } catch (err) {
    console.warn(`Could not remove ${ticker} from backend watchlist:`, err);
  }
}
