import { isDemoSessionAsync } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { MarketIndex } from "@/lib/types";
import { buildIndices, marketIntelligence } from "@/lib/mock/market";

export async function getMarketIndices(): Promise<MarketIndex[]> {
  const fallback = buildIndices();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const data = await apiGet<MarketIndex[]>("/market/indices");
    if (Array.isArray(data) && data.length > 0) return data;
  } catch {
    // Backend doesn't define market indices; use computed indices
  }

  return fallback;
}

export async function getMarketIntelligence() {
  const fallback = marketIntelligence();
  if (await isDemoSessionAsync()) return fallback;

  try {
    const data = await apiGet<ReturnType<typeof marketIntelligence>>("/market/intelligence");
    if (data) return data;
  } catch {
    // Backend doesn't define market intelligence; use computed intelligence
  }

  return fallback;
}
