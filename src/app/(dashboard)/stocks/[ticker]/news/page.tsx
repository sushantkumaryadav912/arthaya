import { getNews } from "@/lib/api";
import { EmptyState } from "@/components/common/States";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsCard } from "@/components/stocks/NewsCard";
import { ProvenanceTag } from "@/components/common/ProvenanceTag";
import { SectionHeading } from "@/components/common/Headings";

export default async function NewsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const n = await getNews(ticker);
  if (!n || n.articles.length === 0) return <EmptyState title="No news available" />;

  const d = n.distribution;
  const total = Math.max(1, d.positive + d.neutral + d.negative);
  const bars = [
    { label: "Positive", value: d.positive, tone: "bg-positive" },
    { label: "Neutral", value: d.neutral, tone: "bg-fg-subtle" },
    { label: "Negative", value: d.negative, tone: "bg-negative" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Sentiment distribution</CardTitle>
          <ProvenanceTag kind="ai-interpretation" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-elevated">
            {bars.map((b) => (
              <div
                key={b.label}
                className={b.tone}
                style={{ width: `${(b.value / total) * 100}%` }}
                title={`${b.label}: ${b.value}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-fg-muted">
            {bars.map((b) => (
              <span key={b.label} className="tabular">
                {b.label}: {b.value}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-fg-subtle">
            Sentiment is model-derived from demo articles — illustrative, not a market signal.
          </p>
        </CardContent>
      </Card>

      <div>
        <SectionHeading title="Latest news" description="Sources are fictional demo providers." />
        <div className="grid gap-3 sm:grid-cols-2">
          {n.articles.map((a) => (
            <NewsCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
