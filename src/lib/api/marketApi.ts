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
    const data = await apiGet<any>("/market/intelligence");
    if (data && typeof data === "object") {
      const observations =
        Array.isArray(data.observations) && data.observations.length > 0
          ? data.observations
          : [
              ...(data.marketBreadth ? [`Market breadth: ${data.marketBreadth}.`] : []),
              ...(data.sentimentLabel ? [`Overall market sentiment: ${data.sentimentLabel}.`] : []),
              ...(fallback.observations || []),
            ];

      return {
        ...fallback,
        ...data,
        regime: data.regime || fallback.regime,
        momentum:
          data.momentum ||
          (typeof data.sectorMomentum === "object" ? "Positive (Tech led)" : fallback.momentum),
        volatility: data.volatility || fallback.volatility,
        newsSentiment: data.newsSentiment || data.sentimentLabel || fallback.newsSentiment,
        observations: observations.slice(0, 3),
      };
    }
  } catch {
    // Backend doesn't define market intelligence; use computed intelligence
  }

  return fallback;
}
