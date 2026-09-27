/**
 * Deterministic pseudo-random generators for demo data.
 * Seeded by ticker so every page renders stable, realistic-looking series.
 * THIS IS DEMO DATA — clearly marked as such throughout the UI.
 */

export function seedFrom(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function mulberry32(seed: number) {
  let a = Math.floor(seed * 4294967295) || 1;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Geometric-brownian-ish price walk. */
export function priceSeries(
  ticker: string,
  points: number,
  start: number,
  vol = 0.018,
  drift = 0.0004,
): number[] {
  const rand = mulberry32(seedFrom(ticker));
  const out: number[] = [];
  let p = start;
  for (let i = 0; i < points; i++) {
    const shock = (rand() - 0.5) * 2 * vol;
    p = Math.max(1, p * (1 + drift + shock));
    out.push(Number(p.toFixed(2)));
  }
  return out;
}

export function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(16, 0, 0, 0);
  return d.toISOString();
}

export function isoHoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

export function round(n: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}
