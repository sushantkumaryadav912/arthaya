import test from "node:test";
import assert from "node:assert/strict";
import { validateAnalysisInput } from "../src/lib/utils/analysisValidation.ts";

test("Analysis Validation: accepts valid ticker, horizon, and depth", () => {
  const result = validateAnalysisInput("AAPL", "5D", "standard");
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.ticker, "AAPL");
    assert.equal(result.value.horizon, "5D");
    assert.equal(result.value.depth, "standard");
  }
});

test("Analysis Validation: defaults horizon to 5D and depth to standard if null", () => {
  const result = validateAnalysisInput("nvda", null, null);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.ticker, "NVDA");
    assert.equal(result.value.horizon, "5D");
    assert.equal(result.value.depth, "standard");
  }
});

test("Analysis Validation: rejects invalid horizon", () => {
  const result = validateAnalysisInput("AAPL", "99D", "standard");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /Invalid horizon/i);
  }
});

test("Analysis Validation: rejects invalid depth", () => {
  const result = validateAnalysisInput("AAPL", "5D", "extreme");
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /Invalid depth/i);
  }
});

test("Analysis Validation: rejects empty or malformed tickers", () => {
  const result = validateAnalysisInput("", "5D", "standard");
  assert.equal(result.ok, false);

  const invalidResult = validateAnalysisInput("INVALID@@@SYMBOL", "5D", "standard");
  assert.equal(invalidResult.ok, false);
});
