import { buildHistorical } from "@/lib/mock/predictions";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = buildHistorical(ticker);
  return data ? ok(data) : notFound(`No historical data for "${ticker}"`);
}
