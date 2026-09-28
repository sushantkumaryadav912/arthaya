import { buildAgentStatuses } from "@/lib/mock/agents";
import { ok } from "@/app/api/v1/_lib/respond";

export function GET() {
  return ok(buildAgentStatuses());
}
