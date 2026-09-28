import { buildModelReport } from "@/lib/mock/models";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET() {
  return ok(buildModelReport());
}
