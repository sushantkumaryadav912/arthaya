import type { NextRequest } from "next/server";
import { buildPrediction } from "@/lib/mock/predictions";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(req: NextRequest, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const h = Number(new URL(req.url).searchParams.get("horizonDays") ?? "5");
  const data = buildPrediction(ticker, Number.isFinite(h) ? h : 5);
  return data ? ok(data) : notFound(`No prediction for "${ticker}"`);
}
