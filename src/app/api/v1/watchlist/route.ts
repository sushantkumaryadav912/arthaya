import type { NextRequest } from "next/server";
import { summariesForTickers, DEFAULT_WATCHLIST } from "@/lib/api/watchlistApi";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET(req: NextRequest) {
  const raw = new URL(req.url).searchParams.get("tickers");
  const tickers = raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : DEFAULT_WATCHLIST;
  return ok(summariesForTickers(tickers));
}
