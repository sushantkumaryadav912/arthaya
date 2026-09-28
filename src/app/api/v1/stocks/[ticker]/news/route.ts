import { buildNews } from "@/lib/mock/news";
import { notFound, ok } from "@/app/api/v1/_lib/respond";

export async function GET(_req: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const data = buildNews(ticker);
  return data ? ok(data) : notFound(`No news for "${ticker}"`);
}
