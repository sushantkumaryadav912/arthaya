/**
 * Formatting helpers. Every helper degrades gracefully to "N/A" for
 * null/undefined/NaN — the UI must never fabricate a value (see project.md §32).
 */

export const NA = "N/A";

function isMissing(v: unknown): boolean {
  return v === null || v === undefined || (typeof v === "number" && Number.isNaN(v));
}

export function formatPrice(
  value?: number | null,
  currency = "USD",
  opts: { compact?: boolean } = {},
): string {
  if (isMissing(value)) return NA;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: opts.compact ? "compact" : "standard",
    maximumFractionDigits: 2,
  }).format(value as number);
}

export function formatNumber(value?: number | null, digits = 2): string {
  if (isMissing(value)) return NA;
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(value as number);
}

export function formatCompact(value?: number | null): string {
  if (isMissing(value)) return NA;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value as number);
}

/** Signed percentage, e.g. +1.24% / -0.80%. */
export function formatPercent(value?: number | null, digits = 2, signed = true): string {
  if (isMissing(value)) return NA;
  const v = value as number;
  const sign = signed && v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}%`;
}

export function formatSignedNumber(value?: number | null, digits = 2): string {
  if (isMissing(value)) return NA;
  const v = value as number;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}`;
}

export function formatDate(value?: string | number | Date | null): string {
  if (isMissing(value as number) || value === "") return NA;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return NA;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value?: string | number | Date | null): string {
  if (isMissing(value as number) || value === "") return NA;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return NA;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Relative time, e.g. "3h ago". */
export function timeAgo(value?: string | number | Date | null): string {
  if (isMissing(value as number) || value === "") return NA;
  const d = new Date(value as string);
  if (Number.isNaN(d.getTime())) return NA;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

/** Directional semantic tone for a numeric delta. */
export function toneForDelta(value?: number | null): "positive" | "negative" | "neutral" {
  if (isMissing(value)) return "neutral";
  const v = value as number;
  if (v > 0) return "positive";
  if (v < 0) return "negative";
  return "neutral";
}
