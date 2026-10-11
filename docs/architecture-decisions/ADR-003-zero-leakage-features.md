# ADR-003: Strict Zero-Leakage Cutoff in Feature Engineering

## Status
**Accepted & Implemented**

## Context
Financial machine learning systems frequently suffer from **lookahead bias** (data leakage), where retrospective features inadvertently incorporate price movements or events that occurred after the decision timestamp $T$. This produces artificially high backtest accuracy that collapses in live trading.

## Decision
We enforce strict point-in-time timestamp validation in the `FeatureBuilder` ([backend/app/services/feature_builder.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/feature_builder.py)):
1. The method signature demands an explicit `cutoff_timestamp: datetime`.
2. All inputs—market prices, indicators, financial statements, and news articles—must have timestamps $\le T_{\text{cutoff}}$.
3. The `CriticService` independently verifies that `potential_leakage` is evaluated and logged prior to synthesis.
4. Stored `PredictionRecord` entities permanently persist both `predicted_at` and `data_cutoff` timestamps.

## Consequences
- **Positive**: Eliminates subtle data leakage; guarantees research credibility.
- **Negative**: Requires strict timestamp metadata across all upstream data services.
- **Mitigation**: Upstream services automatically attach ISO-8601 timestamps to all items.
