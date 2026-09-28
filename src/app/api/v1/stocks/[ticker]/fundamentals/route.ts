import { buildFundamentals } from "@/lib/mock/fundamentals";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = buildFundamentals(ticker);
  return data ? ok(data) : notFound(`No fundamentals for "${ticker}"`);
}
