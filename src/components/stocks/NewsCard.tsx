import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SentimentBadge } from "./SentimentBadge";
import { timeAgo } from "@/lib/utils/format";
import type { NewsArticle } from "@/lib/types";

/** Single news item. Sources are fictional demo providers (never impersonate real outlets). */
export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="transition-colors hover:border-border-strong">
      <CardContent className="space-y-2 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="neutral">{article.category}</Badge>
            <SentimentBadge sentiment={article.sentiment} />
          </div>
          <span className="text-[10px] text-fg-subtle">{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-medium leading-snug text-fg">{article.title}</h3>
        <p className="text-xs text-fg-muted">{article.summary}</p>
        <div className="flex items-center justify-between border-t border-border pt-2">
          <span className="text-[10px] text-fg-subtle">{article.source}</span>
          <span className="flex items-center gap-1 text-[10px] text-fg-subtle">
            <ExternalLink className="size-3" /> Demo link
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
