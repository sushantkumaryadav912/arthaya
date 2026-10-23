import type { DataSourceInfo } from "@/lib/types";

/** Transparency page data. Reflects active live intelligence pipelines. */
export function buildDataSources(): { group: string; sources: DataSourceInfo[] }[] {
  return [
    {
      group: "Live Quantitative & Agentic Data Infrastructure",
      sources: [
        {
          provider: "yfinance",
          dataType: "Market Data & OHLCV",
          coverage: "Global Equities & Indices",
          lastUpdate: "Live Connection",
          status: "connected",
        },
        {
          provider: "SEC EDGAR",
          dataType: "Financial Filings & 10-K/10-Q",
          coverage: "US Public Companies",
          lastUpdate: "Live Connection",
          status: "connected",
        },
        {
          provider: "n8n Orchestrator",
          dataType: "Agentic Workflow Trigger (n8n.sushantkumaryadav.com.np)",
          coverage: "Parallel Agent Grid",
          lastUpdate: "Live Connection",
          status: "connected",
        },
        {
          provider: "Firecrawl",
          dataType: "Clean Web Crawling & Article Markdown",
          coverage: "Financial News Sites",
          lastUpdate: "Live Connection",
          status: "connected",
        },
        {
          provider: "Apify",
          dataType: "Structured Actor Scraper",
          coverage: "Web Intelligence",
          lastUpdate: "Live Connection",
          status: "connected",
        },
        {
          provider: "Model Gateway",
          dataType: "Claude / Gemini / Mistral / Groq / OpenRouter",
          coverage: "Multi-Model LLM Synthesis",
          lastUpdate: "Live Connection",
          status: "connected",
        },
      ],
    },
  ];
}
