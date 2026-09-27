import type { DataSourceInfo } from "@/lib/types";
import { isoHoursAgo } from "./generators";

/** Transparency page data (project.md §21). Reflects DEMO configuration only. */
export function buildDataSources(): { group: string; sources: DataSourceInfo[] }[] {
  return [
    {
      group: "Market Data",
      sources: [
        { provider: "Yahoo Finance / yfinance", dataType: "Prices, volume, OHLC", lastUpdate: isoHoursAgo(1), status: "configured", coverage: "US + India equities" },
        { provider: "Alpha Vantage", dataType: "Prices, indicators", status: "not-configured", coverage: "Requires backend API key" },
      ],
    },
    {
      group: "Fundamentals",
      sources: [
        { provider: "Company filings", dataType: "Income / balance / cash flow", lastUpdate: isoHoursAgo(24), status: "configured", coverage: "Annual + quarterly (demo)" },
        { provider: "Financial APIs", dataType: "Ratios, valuation", status: "not-configured" },
      ],
    },
    {
      group: "News",
      sources: [
        { provider: "Configured news providers", dataType: "Headlines, sentiment", status: "not-configured", coverage: "Backend-side only" },
      ],
    },
    {
      group: "Documents",
      sources: [
        { provider: "Official filings / reports", dataType: "PDF / HTML filings", status: "not-configured", coverage: "RAG store (backend)" },
      ],
    },
  ];
}
