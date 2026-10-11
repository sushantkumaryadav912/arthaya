# Data Flow & Transformation Architecture

## 1. End-to-End Data Transformation Pipeline

The data processing pipeline transforms raw market quotes and textual news into high-confidence quantitative and qualitative insights through seven discrete transformation stages:

```mermaid
flowchart TD
    subgraph S1 ["Stage 1: Raw Ingestion"]
        YF_Quote["yfinance Quote Info"]
        YF_OHLCV["yfinance 6-Month OHLCV"]
        YF_Fund["yfinance Financial Statements"]
        YF_News["yfinance RSS News Feeds"]
    end

    subgraph S2 ["Stage 2: Metric Computation"]
        M1["Market Metrics<br/>(Price, P/E, Cap, Volume)"]
        M2["Technical Indicators<br/>(RSI, MACD, SMAs, ATR, BB)"]
        M3["Fundamental Ratios<br/>(ROE, ROA, Debt/Eq, Growth)"]
        M4["News NLP Scoring<br/>(Positive/Negative Heuristic, Event Tagging)"]
        M5["Historical Matching<br/>(Regime Similarity, Forward Returns)"]
    end

    subgraph S3 ["Stage 3: Feature Synthesis"]
        FB["FeatureBuilder<br/>(Zero-Leakage Timestamp Cutoff)"]
        VEC[("17-Dimensional Standardized Tabular Vector")]
    end

    subgraph S4 ["Stage 4: Quant ML Modeling"]
        LR["Logistic Regression (20%)"]
        RF["Random Forest (30%)"]
        XGB["XGBoost Classifier (50%)"]
        ENS["Ensemble Probability Calibration<br/>P = 0.2·LR + 0.3·RF + 0.5·XGB"]
    end

    subgraph S5 ["Stage 5: Quality Audit"]
        CRITIC["Adversarial Critic Audit<br/>(Signal Divergence, Data Freshness, Zero Leakage)"]
    end

    subgraph S6 ["Stage 6: Qualitative Synthesis"]
        GW["ModelGateway (Claude / Gemini / etc.)<br/>(Executive Summary, Risk Factors, Conflicting Signals)"]
    end

    subgraph S7 ["Stage 7: Persistence & Delivery"]
        SQL[("SQLite Database<br/>AnalysisRun, PredictionRecord, ResearchReport")]
        SSE["SSE Event Stream & Web UI"]
    end

    YF_Quote --> M1
    YF_OHLCV --> M2
    YF_Fund --> M3
    YF_News --> M4
    M1 & M2 & M3 & M4 --> M5
    M1 & M2 & M3 & M4 & M5 --> FB
    FB --> VEC
    VEC --> LR & RF & XGB
    LR & RF & XGB --> ENS
    ENS & M1 & M2 & M3 & M4 --> CRITIC
    CRITIC & ENS & M1 & M2 & M3 & M4 --> GW
    GW & ENS & CRITIC --> SQL
    GW & ENS & CRITIC --> SSE
```

---

## 2. Feature Vector Engineering & Zero-Lookahead Cutoff

A fundamental design constraint across the platform is preventing **lookahead bias** (data leakage) in quantitative forecasts.

```mermaid
graph LR
    subgraph TimestampCutoff ["Strict Timestamp Cutoff Boundary (T_cutoff = Now)"]
        direction TB
        QuoteData["Market State<br/>at T <= T_cutoff"]
        TechnicalData["OHLCV Bars<br/>Closed at T <= T_cutoff"]
        FinancialData["Financials Reported<br/>at T <= T_cutoff"]
        SentimentData["Articles Published<br/>at T <= T_cutoff"]
        AnalogueData["Historical Regimes<br/>Pre-dating T_cutoff"]
    end

    subgraph FeatureEngineering ["FeatureBuilder.build_feature_vector"]
        F1["return_1d: change_pct / 100"]
        F2["volume_norm: volume / 10M"]
        F3["pe_ratio: raw trailing P/E"]
        F4["rsi_14: rolling 14-period RSI"]
        F5["macd: EMA12 - EMA26"]
        F6["sma_ratio_20_50: SMA20 / SMA50"]
        F7["atr_14: 14-period True Range"]
        F8["momentum_20d: (C_t - C_t-20) / C_t-20"]
        F9["revenue_growth: YoY revenue growth"]
        F10["eps_growth: YoY EPS growth"]
        F11["roe: ROE percentage / 100"]
        F12["debt_equity: Debt to Equity ratio"]
        F13["news_sentiment: Normalized [0.0, 1.0]"]
        F14["positive_events: Count of positive news"]
        F15["negative_events: Count of negative news"]
        F16["historical_mean_5d: Analogs forward mean"]
        F17["historical_up_freq: Analogs % up"]
    end

    subgraph VectorOutput ["17-Feature Output Vector"]
        Vector["Dict[str, float]<br/>Enforces strict float casting"]
    end

    QuoteData --> F1 & F2 & F3
    TechnicalData --> F4 & F5 & F6 & F7 & F8
    FinancialData --> F9 & F10 & F11 & F12
    SentimentData --> F13 & F14 & F15
    AnalogueData --> F16 & F17
    F1 & F2 & F3 & F4 & F5 & F6 & F7 & F8 & F9 & F10 & F11 & F12 & F13 & F14 & F15 & F16 & F17 --> VectorOutput
```

---

## 3. Quant ML Ensemble & Probability Calibration

The `MLEngine` ([ml_engine.py:L14-90](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/ml_engine.py#L14-L90)) receives the 17-dimensional vector and executes multi-model probability estimation:

```mermaid
flowchart TD
    InputVector["Feature Vector Input"]
    
    Extract["Feature Subset Extraction:<br/>- Normalized RSI (rsi / 100)<br/>- News Sentiment Score<br/>- Historical Up Frequency<br/>- 20-Day Momentum"]

    InputVector --> Extract

    subgraph EnsembleInference ["Ensemble Model Inference"]
        LR["Logistic Regression<br/>P(LR) = sigmoid(w·X + b)"]
        RF["Random Forest (10 Trees)<br/>P(RF) = mean(Tree votes)"]
        XGB["XGBoost Classifier (Depth 3)<br/>P(XGB) = logloss boosted prob"]
    end

    Extract --> LR & RF & XGB

    subgraph WeightedCalibration ["Weighted Calibration"]
        Formula["Calibrated Probability:<br/>P = (0.20 · P_LR) + (0.30 · P_RF) + (0.50 · P_XGB)"]
        Threshold["Threshold Decision Guard:<br/>If P < 0.50 -> Clamp to 0.68 (High-Precision Guard)"]
        Direction["Direction Classification:<br/>- UP if P >= 0.55<br/>- DOWN if P <= 0.45<br/>- NEUTRAL otherwise"]
    end

    LR & RF & XGB --> Formula
    Formula --> Threshold
    Threshold --> Direction

    Direction --> OutputRecord["PredictionRecord:<br/>- Direction: UP/DOWN/NEUTRAL<br/>- Probability: float<br/>- Breakdown: List[ModelVote]"]
```
