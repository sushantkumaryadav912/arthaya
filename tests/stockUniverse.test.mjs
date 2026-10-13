import test from "node:test";
import assert from "node:assert/strict";
import { findSeed, searchUniverse, UNIVERSE } from "../src/lib/mock/stocks.ts";

test("Stock Universe: retrieves listed seed data accurately", () => {
  const aapl = findSeed("AAPL");
  assert.equal(aapl.ticker, "AAPL");
  assert.equal(aapl.exchange, "NASDAQ");
  assert.equal(aapl.currency, "USD");

  const reliance = findSeed("RELIANCE");
  assert.equal(reliance.ticker, "RELIANCE");
  assert.equal(reliance.exchange, "NSE");
  assert.equal(reliance.currency, "INR");
});

test("Stock Universe: handles unlisted tickers with deterministic fallback seed", () => {
  const meta = findSeed("META");
  assert.equal(meta.ticker, "META");
  assert.ok(meta.base > 0, "Base price must be positive");
  assert.ok(meta.name.includes("META"), "Name should incorporate ticker");

  const custom = findSeed("XYZTECH");
  assert.equal(custom.ticker, "XYZTECH");
  assert.ok(custom.base > 0);
});

test("Stock Universe: searches universe by partial query", () => {
  const results = searchUniverse("app");
  assert.ok(results.some((r) => r.ticker === "AAPL"));

  const all = searchUniverse("");
  assert.equal(all.length, UNIVERSE.length);
});
