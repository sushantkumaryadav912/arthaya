import { buildIndices } from "@/lib/mock/market";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET() {
  return ok(buildIndices());
}
