import { getPrediction } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PredictionCard } from "@/components/predictions/PredictionCard";
import { ModelBreakdown } from "@/components/predictions/ModelBreakdown";
import { SectionHeading } from "@/components/common/Headings";

export default async function PredictionPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const p = await getPrediction(ticker);
  if (!p) return <EmptyState title="No prediction available" />;

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Model prediction"
        description="Probabilistic ML output — not investment advice or a guarantee of any outcome."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <PredictionCard prediction={p} />
        <Card>
          <CardHeader>
            <CardTitle>Model breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ModelBreakdown votes={p.breakdown} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
