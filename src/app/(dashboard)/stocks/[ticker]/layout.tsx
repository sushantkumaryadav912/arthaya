import { notFound } from "next/navigation";
import { getStockOverview } from "@/lib/api";
import { StockHeader } from "@/components/stocks/StockHeader";
import { StockTabs } from "@/components/stocks/StockTabs";
import { DemoBadge } from "@/components/common/ProvenanceTag";

export default async function StockLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const overview = await getStockOverview(ticker);
  if (!overview) notFound();

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <DemoBadge />
      </div>
      <StockHeader overview={overview} />
      <StockTabs ticker={overview.ticker} />
      <div>{children}</div>
    </div>
  );
}
