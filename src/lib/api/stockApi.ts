import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { StockOverview, StockSummary } from "@/lib/types";
import { allSummaries, buildOverview, searchUniverse, toSummary } from "@/lib/mock/stocks";

interface BackendStockResponse {
  ticker?: string;
  name?: string;
  exchange?: string;
  sector?: string;
  industry?: string;
  current_price?: number;
  price?: number;
  change_pct?: number;
  changePercent?: number;
  change?: number;
  volume?: number;
  market_cap?: number;
  marketCap?: number;
  pe_ratio?: number;
  peRatio?: number;
  [key: string]: unknown;
}

export async function searchStocks(q: string): Promise<StockSummary[]> {
  if (DEMO_MODE) return searchUniverse(q).map(toSummary);
  try {
    return await apiGet<StockSummary[]>(`/stocks?q=${encodeURIComponent(q)}`);
  } catch {
    return searchUniverse(q).map(toSummary);
  }
}

export async function listStocks(): Promise<StockSummary[]> {
  if (DEMO_MODE) return allSummaries();
  try {
    const data = await apiGet<StockSummary[]>("/stocks");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // If backend only exposes single ticker endpoints, return universe list
  }
  return allSummaries();
}

export async function getStockOverview(ticker: string): Promise<StockOverview | null> {
  const fallback = buildOverview(ticker);
  if (DEMO_MODE) return fallback;

  try {
    const raw = await apiGet<BackendStockResponse>(`/stocks/${ticker}`);
    if (!raw) return fallback;

    // Merge backend metrics with base overview structure
    const price = raw.current_price ?? raw.price ?? fallback?.price ?? 150;
    const changePercent = raw.change_pct ?? raw.changePercent ?? fallback?.changePercent ?? 0;
    const change = raw.change ?? ((price * changePercent) / 100);
    const marketCap = raw.market_cap ?? raw.marketCap ?? fallback?.marketCap ?? null;
    const peRatio = raw.pe_ratio ?? raw.peRatio ?? fallback?.peRatio ?? null;
    const volume = raw.volume ?? fallback?.volume ?? null;

    return {
      ...(fallback || {}),
      ticker: raw.ticker || ticker.toUpperCase(),
      name: raw.name || fallback?.name || ticker.toUpperCase(),
      exchange: (raw.exchange as StockOverview["exchange"]) || fallback?.exchange || "NASDAQ",
      currency: fallback?.currency || "USD",
      price,
      change,
      changePercent,
      marketStatus: fallback?.marketStatus || "open",
      week52High: fallback?.week52High ?? price * 1.15,
      week52Low: fallback?.week52Low ?? price * 0.85,
      marketCap,
      peRatio,
      eps: fallback?.eps ?? null,
      volume,
      avgVolume: fallback?.avgVolume ?? volume,
      beta: fallback?.beta ?? 1.1,
      dividendYield: fallback?.dividendYield ?? null,
      performance: fallback?.performance ?? [],
      series: fallback?.series ?? [],
      candles: fallback?.candles ?? [],
    } as StockOverview;
  } catch (err) {
    console.warn(`Could not load /stocks/${ticker} from backend, using fallback:`, err);
    return fallback;
  }
}
