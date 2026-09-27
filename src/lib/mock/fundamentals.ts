import type { FundamentalAnalysis, MetricValue, StatementRow } from "@/lib/types";
import { findSeed } from "./stocks";
import { mulberry32, round, seedFrom } from "./generators";

export function buildFundamentals(ticker: string): FundamentalAnalysis | null {
  const seed = findSeed(ticker);
  if (!seed) return null;
  const rand = mulberry32(seedFrom(seed.ticker + "fund"));
  const labels = ["FY2022", "FY2023", "FY2024"];

  const scale = seed.currency === "INR" ? 1e9 : 1e9;
  const rev0 = (80 + rand() * 300) * scale;
  const grow = 1.08 + rand() * 0.12;

  const revenue = labels.map((_, i) => round(rev0 * grow ** i, 0));
  const row = (label: string, factor: number, emphasis = false): StatementRow => ({
    label,
    emphasis,
    values: Object.fromEntries(
      labels.map((l, i) => [l, round(revenue[i] * factor, 0)]),
    ),
  });

  const incomeStatement: StatementRow[] = [
    row("Revenue", 1, true),
    row("Cost of Revenue", -0.58),
    row("Gross Profit", 0.42, true),
    row("Operating Expenses", -0.18),
    row("Operating Income", 0.24, true),
    row("EBIT", 0.24),
    row("EBT", 0.225),
    row("Net Income", 0.19, true),
    {
      label: "EPS (diluted)",
      values: Object.fromEntries(labels.map((l, i) => [l, round(3 + i * 0.6 + rand(), 2)])),
    },
  ];

  const balanceSheet: StatementRow[] = [
    row("Total Assets", 2.4, true),
    row("Cash & Equivalents", 0.5),
    row("Total Liabilities", 1.3, true),
    row("Total Debt", 0.6),
    {
      label: "Total Equity",
      emphasis: true,
      // demonstrate graceful N/A for one period
      values: { FY2022: round(revenue[0] * 1.1, 0), FY2023: round(revenue[1] * 1.1, 0), FY2024: null },
    },
  ];

  const cashFlow: StatementRow[] = [
    row("Operating Cash Flow", 0.26, true),
    row("Capital Expenditure", -0.07),
    row("Free Cash Flow", 0.19, true),
    row("Financing Cash Flow", -0.09),
  ];

  const m = (label: string, value: number | null, unit?: MetricValue["unit"], note?: string): MetricValue => ({ label, value, unit, note });

  return {
    ticker: seed.ticker,
    reportPeriod: "annual",
    periodLabels: labels,
    incomeStatement,
    balanceSheet,
    cashFlow,
    growth: [
      m("Revenue Growth", round((grow - 1) * 100, 1), "%"),
      m("Profit Growth", round((grow - 1) * 100 + rand() * 4, 1), "%"),
      m("EPS Growth", round((grow - 1) * 100 + rand() * 3, 1), "%"),
      m("Gross Margin", 42, "%"),
      m("Operating Margin", 24, "%"),
      m("Net Margin", 19, "%"),
    ],
    profitability: [
      m("ROE", round(18 + rand() * 20, 1), "%"),
      m("ROA", round(8 + rand() * 10, 1), "%"),
      m("ROIC", round(12 + rand() * 12, 1), "%"),
    ],
    leverage: [
      m("Debt / Equity", round(0.3 + rand() * 0.9, 2), "x"),
      m("Total Debt", round(revenue[2] * 0.6, 0), "currency"),
      m("Interest Coverage", round(6 + rand() * 12, 1), "x"),
    ],
    valuation: [
      m("P/E", round(18 + rand() * 20, 1), "x"),
      m("P/B", round(3 + rand() * 8, 1), "x"),
      m("P/S", round(3 + rand() * 7, 1), "x"),
      m("EV / EBITDA", seed.sector === "Banking" ? null : round(12 + rand() * 12, 1), "x", seed.sector === "Banking" ? "Not meaningful for banks" : undefined),
    ],
  };
}
