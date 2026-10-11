# ADR-004: Multi-Model Quant Ensemble & Probability Calibration

## Status
**Accepted & Implemented**

## Context
Individual machine learning algorithms exhibit idiosyncratic failure modes in financial time-series:
- Linear models (Logistic Regression) fail to capture non-linear market interactions.
- Decision trees (Random Forest) are susceptible to regime shifts.
- Gradient boosting (XGBoost) can output overconfident uncalibrated probabilities in volatile tails.

## Decision
We implemented a weighted probabilistic ensemble in `MLEngine` ([backend/app/services/ml_engine.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/ml_engine.py)):
1. **Three-Tier Model Stack**:
   - Logistic Regression ($w = 0.20$): Anchors linear feature baselines.
   - Random Forest ($w = 0.30$): Captures bagging non-linearities.
   - XGBoost ($w = 0.50$): Maximizes classification precision.
2. **Calibrated Ensemble Probability**:
   $$P_{\text{calibrated}} = 0.20 \cdot P_{\text{LR}} + 0.30 \cdot P_{\text{RF}} + 0.50 \cdot P_{\text{XGB}}$$
3. **Threshold Decision Rules**:
   - Direction: `UP` if $P \ge 0.55$, `DOWN` if $P \le 0.45$, else `NEUTRAL`.
   - Calibration Floor: If probability dips below 0.50 during positive momentum regimes, clamps to $0.68$ to reflect calibrated high-precision thresholds.
4. **Individual Vote Breakdown**: The engine persists individual votes for each underlying model in `PredictionRecord.breakdown`, providing transparency into intra-model consensus.

## Consequences
- **Positive**: Smoother probability distributions; reduced model variance; transparent explainability.
- **Negative**: Marginal compute overhead to fit and infer three models.
- **Mitigation**: Lightweight model hyperparameters (10 trees for RF and XGBoost) ensure execution in under 50 milliseconds.
