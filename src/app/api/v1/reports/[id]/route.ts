import { buildReport } from "@/lib/mock/reports";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const data = buildReport(decodedId);
  return data ? ok(data) : notFound(`No report "${decodedId}"`);
}
