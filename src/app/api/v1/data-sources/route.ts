import { buildDataSources } from "@/lib/mock/datasources";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET() {
  return ok(buildDataSources());
}
