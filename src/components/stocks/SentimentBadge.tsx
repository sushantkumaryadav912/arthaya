import { Smile, Meh, Frown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Sentiment } from "@/lib/types";

const MAP: Record<Sentiment, { tone: "positive" | "neutral" | "negative"; icon: React.ReactNode }> = {
  Positive: { tone: "positive", icon: <Smile className="size-3" /> },
  Neutral: { tone: "neutral", icon: <Meh className="size-3" /> },
  Negative: { tone: "negative", icon: <Frown className="size-3" /> },
};

/** Sentiment label with icon (never color-only). */
export function SentimentBadge({ sentiment }: { sentiment: Sentiment }) {
  const s = MAP[sentiment];
  return (
    <Badge tone={s.tone}>
      {s.icon}
      {sentiment}
    </Badge>
  );
}
