import { DEMO_MODE } from "@/lib/utils/env";
import { apiGet } from "./client";
import type { MarketIndex } from "@/lib/types";
import { buildIndices, marketIntelligence } from "@/lib/mock/market";

export async function getMarketIndices(): Promise<MarketIndex[]> {
  if (DEMO_MODE) return buildIndices();
  return apiGet<MarketIndex[]>("/market/indices");
}

export async function getMarketIntelligence() {
  if (DEMO_MODE) return marketIntelligence();
  return apiGet<ReturnType<typeof marketIntelligence>>("/market/intelligence");
}
