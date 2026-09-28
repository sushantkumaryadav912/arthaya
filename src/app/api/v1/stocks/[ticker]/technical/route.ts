import { buildTechnical } from "@/lib/mock/technical";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = buildTechnical(ticker);
  return data ? ok(data) : notFound(`No technical data for "${ticker}"`);
}
