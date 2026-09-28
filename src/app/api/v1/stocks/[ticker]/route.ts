import { buildOverview } from "@/lib/mock/stocks";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = buildOverview(ticker);
  return data ? ok(data) : notFound(`No overview for "${ticker}"`);
}
