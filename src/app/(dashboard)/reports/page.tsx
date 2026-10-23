"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Sparkles, Filter, TrendingUp, History, Plus } from "lucide-react";
import { PageIntro, SectionHeading } from "@/components/common/Headings";
import { DemoBadge } from "@/components/common/ProvenanceTag";
import { EmptyState } from "@/components/common/States";
import { ReportCard } from "@/components/reports/ReportCard";
import { getReports } from "@/lib/api/reportApi";
import { getSearchedStocks, recordSearchedStock } from "@/lib/utils/searchHistory";
import { buildReportSummaryForTicker } from "@/lib/mock/reports";
import type { ReportSummary } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export default function ReportsPage() {
  const [reports, setReports] = React.useState<ReportSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [searchedTickers, setSearchedTickers] = React.useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<
    "all" | "india" | "us" | "bullish" | "bearish"
  >("all");

  React.useEffect(() => {
    let active = true;
    getReports().then((data) => {
      if (!active) return;
      setReports(data);
      setLoading(false);
    });

    const updateSearched = () => {
      setSearchedTickers(getSearchedStocks());
    };
    updateSearched();

    window.addEventListener("arthaya:searched_stocks_updated", updateSearched);
    return () => {
      active = false;
      window.removeEventListener("arthaya:searched_stocks_updated", updateSearched);
    };
  }, []);

  // Compute reports for all searched stocks
  const searchedReports = React.useMemo(() => {
    const list: ReportSummary[] = [];
    for (const ticker of searchedTickers) {
      const existing = reports.find((r) => r.ticker.toUpperCase() === ticker.toUpperCase());
      if (existing) {
        list.push(existing);
      } else {
        list.push(buildReportSummaryForTicker(ticker));
      }
    }
    return list;
  }, [searchedTickers, reports]);

  // Combine and deduplicate reports
  const allAvailableReports = React.useMemo(() => {
    const map = new Map<string, ReportSummary>();
    for (const r of searchedReports) {
      map.set(r.ticker.toUpperCase(), r);
    }
    for (const r of reports) {
      if (!map.has(r.ticker.toUpperCase())) {
        map.set(r.ticker.toUpperCase(), r);
      }
    }
    return Array.from(map.values());
  }, [searchedReports, reports]);

  // Filter based on search query and category pill
  const filteredReports = React.useMemo(() => {
    return allAvailableReports.filter((r) => {
      const q = query.trim().toUpperCase();
      const matchesQuery =
        !q ||
        r.ticker.toUpperCase().includes(q) ||
        r.company.toUpperCase().includes(q);

      if (!matchesQuery) return false;

      const isIndia =
        ["M&M", "RELIANCE", "TCS", "INFY", "HDFCBANK", "TATAMOTORS", "BAJFINANCE"].includes(
          r.ticker.toUpperCase(),
        ) ||
        r.ticker.endsWith(".NS") ||
        r.ticker.endsWith(".BO");

      if (selectedFilter === "india") return isIndia;
      if (selectedFilter === "us") return !isIndia;
      if (selectedFilter === "bullish") return r.overallSignal === "UP";
      if (selectedFilter === "bearish") return r.overallSignal === "DOWN";

      return true;
    });
  }, [allAvailableReports, query, selectedFilter]);

  const handleAddCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) return;
    recordSearchedStock(clean);
    setQuery("");
  };

  const isQueryNew =
    query.trim().length > 0 &&
    !allAvailableReports.some(
      (r) => r.ticker.toUpperCase() === query.trim().toUpperCase(),
    );

  return (
    <div className="space-y-6">
      <PageIntro
        title="Research Reports"
        description="Comprehensive multi-agent intelligence dossiers, calibrated Quant ML ensembles, and risk audits."
        disclaimer="Multi-agent quantitative research — probabilistic estimates. Not investment advice."
        actions={<DemoBadge />}
      />

      {/* Search & Custom Stock Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-surface/80 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleAddCustomReport} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter reports or search any stock (e.g. M&M, AAPL, TSLA, NVDA)..."
            className="w-full rounded-lg border border-border-strong bg-bg/80 py-2 pl-9 pr-24 text-sm text-fg placeholder:text-fg-subtle focus:border-accent focus:outline-none"
          />
          {isQueryNew && (
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-accent px-2.5 py-1 text-xs font-semibold text-accent-fg hover:opacity-90 transition-opacity"
            >
              <Plus className="size-3" /> Add {query.trim().toUpperCase()}
            </button>
          )}
        </form>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {(
            [
              { id: "all", label: "All Markets" },
              { id: "india", label: "Indian Equities (NSE)" },
              { id: "us", label: "US Equities" },
              { id: "bullish", label: "Bullish Signals" },
              { id: "bearish", label: "Bearish Signals" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={cn(
                "rounded-md px-2.5 py-1 font-medium transition-colors",
                selectedFilter === tab.id
                  ? "bg-accent text-accent-fg"
                  : "bg-elevated text-fg-muted hover:text-fg",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Searched Stocks & Analyses Highlight Section */}
      {searchedReports.length > 0 && !query && selectedFilter === "all" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="size-4 text-accent" />
              <h2 className="text-sm font-semibold tracking-tight text-fg">
                Your Searched Stocks & Intelligence Reports ({searchedReports.length})
              </h2>
            </div>
            <span className="text-xs text-fg-subtle">
              Persisted across your workspace sessions
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchedReports.map((r) => (
              <ReportCard key={`searched-${r.id}`} report={r} />
            ))}
          </div>
        </section>
      )}

      {/* All Filtered Reports Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionHeading
            title={`All Intelligence Reports (${filteredReports.length})`}
            description="Complete multi-agent dossiers generated across equities, technicals, and Quant ML."
          />
        </div>

        {filteredReports.length === 0 ? (
          <EmptyState
            title="No reports matching your criteria"
            description={
              isQueryNew
                ? `Click "Add ${query.trim().toUpperCase()}" above to generate a research report for this ticker.`
                : "Try a different search term or select another category filter."
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
