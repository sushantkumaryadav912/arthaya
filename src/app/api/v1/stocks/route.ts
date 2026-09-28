import type { NextRequest } from "next/server";
import { allSummaries, searchUniverse, toSummary } from "@/lib/mock/stocks";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (q) return ok(searchUniverse(q).map(toSummary));
  return ok(allSummaries());
}
