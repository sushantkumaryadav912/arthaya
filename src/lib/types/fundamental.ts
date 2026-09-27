export type FinancialPeriod = "quarterly" | "annual" | "ttm";

export interface StatementRow {
  label: string;
  /** Values keyed by period label (e.g. "FY2024", "Q3'25"); null = N/A. */
  values: Record<string, number | null>;
  emphasis?: boolean;
}

export interface MetricValue {
  label: string;
  value: number | null;
  unit?: "%" | "x" | "currency" | "ratio";
  note?: string;
}

export interface FundamentalAnalysis {
  ticker: string;
  reportPeriod: FinancialPeriod;
  periodLabels: string[];
  incomeStatement: StatementRow[];
  balanceSheet: StatementRow[];
  cashFlow: StatementRow[];
  growth: MetricValue[];
  profitability: MetricValue[];
  leverage: MetricValue[];
  valuation: MetricValue[];
}
