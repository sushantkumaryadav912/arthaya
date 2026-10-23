import { buildOverview } from "@/lib/mock/stocks";
import { fetchLiveQuote } from "@/lib/services/liveMarketService";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const decoded = decodeURIComponent(ticker).trim().toUpperCase();

  try {
    const live = await fetchLiveQuote(decoded);
    if (live) {
      const fallback = buildOverview(decoded);
      return ok({
        ticker: live.ticker,
        name: live.name,
        exchange: live.exchange,
        currency: live.currency,
        price: live.price,
        change: live.change,
        changePercent: live.changePercent,
        marketStatus: "open",
        week52High: Number((live.high * 1.08).toFixed(2)),
        week52Low: Number((live.low * 0.92).toFixed(2)),
        marketCap: live.currency === "INR" ? 3410000000000 : 250000000000,
        peRatio: 17.24,
        eps: Number((live.price / 17.24).toFixed(2)),
        volume: live.volume,
        avgVolume: live.volume,
        beta: 1.12,
        dividendYield: 1.16,
        performance: fallback?.performance ?? [],
        series: live.series.length > 0 ? live.series : fallback?.series ?? [],
        candles: live.candles.length > 0 ? live.candles : fallback?.candles ?? [],
      });
    }
  } catch {
    // fallback
  }

  const data = buildOverview(decoded);
  return data ? ok(data) : notFound(`No overview for "${decoded}"`);
}
