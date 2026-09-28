import type { NextRequest } from "next/server";
import { allPredictions } from "@/lib/mock/predictions";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET(req: NextRequest) {
  const h = Number(new URL(req.url).searchParams.get("horizonDays") ?? "5");
  return ok(allPredictions(Number.isFinite(h) ? h : 5));
}
