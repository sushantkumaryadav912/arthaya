import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { StockOverview, StockSummary } from "@/lib/types";
import { allSummaries, buildOverview, searchUniverse, toSummary } from "@/lib/mock/stocks";

export async function searchStocks(q: string): Promise<StockSummary[]> {
  if (DEMO_MODE) return searchUniverse(q).map(toSummary);
  return apiGet<StockSummary[]>(`/stocks?q=${encodeURIComponent(q)}`);
}

export async function listStocks(): Promise<StockSummary[]> {
  if (DEMO_MODE) return allSummaries();
  return apiGet<StockSummary[]>("/stocks");
}

export async function getStockOverview(ticker: string): Promise<StockOverview | null> {
  if (DEMO_MODE) return buildOverview(ticker);
  return apiGet<StockOverview>(`/stocks/${ticker}`);
}
