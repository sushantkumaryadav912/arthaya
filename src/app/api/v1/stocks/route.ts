import type { NextRequest } from "next/server";
import { allSummaries, searchUniverse, toSummary } from "@/lib/mock/stocks";
import { searchLiveStocks, fetchLiveStockSummaries } from "@/lib/services/liveMarketService";
import { ok } from "@/app/api/v1/_lib/respond";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (q) {
    try {
      const live = await searchLiveStocks(q);
      if (live.length > 0) return ok(live);
    } catch {
      // fallback
    }
    return ok(searchUniverse(q).map(toSummary));
  }

  try {
    const liveList = await fetchLiveStockSummaries();
    if (liveList.length > 0) return ok(liveList);
  } catch {
    // fallback
  }

  return ok(allSummaries());
}
