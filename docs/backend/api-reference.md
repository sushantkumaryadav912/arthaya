# Backend API Reference

Base URL: `http://localhost:8000` (or `NEXT_PUBLIC_API_BASE`)  
Prefix: `/api/v1`

---

## 1. System Health

### `GET /health`
Checks application health, reporting connectivity URLs for n8n orchestrator instances.

- **Method**: `GET`
- **Path**: `/health`
- **Request Parameters**: None
- **Response**: `200 OK`
  ```json
  {
    "status": "healthy",
    "service": "Arthaya Financial Intelligence Backend",
    "n8n_orchestrator": "https://n8n.sushantkumaryadav.com.np",
    "n8n_webhook": "https://n8n.sushantkumaryadav.com.np/webhook/arthaya-orchestrator",
    "version": "1.0.0"
  }
  ```
- **Source**: [main.py:L37-46](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/main.py#L37-L46)

---

## 2. Analysis & Multi-Agent Pipeline

### `POST /api/v1/analysis`
Dispatches an analysis job, triggering the remote n8n orchestrator webhook and initializing the in-memory cache.

- **Method**: `POST`
- **Path**: `/api/v1/analysis`
- **Request Body**:
  ```json
  {
    "ticker": "AAPL",
    "horizon": "5D",
    "depth": "standard",
    "gateway_provider": "claude"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "analysis_id": "ana_7f9b20e14a",
    "status": "queued",
    "n8n": {
      "triggered": true,
      "n8n_status": 200,
      "data": {}
    }
  }
  ```
- **Source**: [analysis.py:L32-56](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L32-L56)

---

### `GET /api/v1/analysis/{analysis_id}/stream`
Establishes a Server-Sent Events (SSE) stream delivering real-time agent execution progress, followed by the complete final analysis payload.

- **Method**: `GET`
- **Path**: `/api/v1/analysis/{analysis_id}/stream`
- **Query Parameters**:
  - `ticker` (str, default: `"AAPL"`): Target stock ticker symbol.
  - `horizon` (str, default: `"5D"`): Forecast horizon (`"1D"`, `"5D"`, `"20D"`).
  - `depth` (str, default: `"standard"`): Pipeline depth (`"quick"`, `"standard"`, `"deep"`).
  - `gateway` (str, default: `"claude"`): Selected LLM Model Gateway provider.
- **Content-Type**: `text/event-stream`
- **Stream Event Format**:
  ```text
  data: {"analysisId": "ana_7f9b20e14a", "agent": "technical", "status": "completed", "message": "Calculating RSI, MACD, SMAs, & Bollinger bands", "progress": 33, "timestamp": "2026-10-11T16:00:00Z", "clock": "00:03"}

  data: {"analysisId": "ana_7f9b20e14a", "status": "completed", "run": { ... }}
  ```
- **Source**: [analysis.py:L67-102](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L67-L102)

---

### `GET /api/v1/analysis/{analysis_id}`
Retrieves the cached or executed analysis result.

- **Method**: `GET`
- **Path**: `/api/v1/analysis/{analysis_id}`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "analysisId": "ana_7f9b20e14a",
      "ticker": "AAPL",
      "horizon": "5D",
      "depth": "standard",
      "status": "completed",
      "createdAt": "2026-10-11T16:00:00Z",
      "completedAt": "2026-10-11T16:00:05Z",
      "prediction": { ... },
      "critic": { ... },
      "summary": { ... }
    },
    "demo": true,
    "generatedAt": "2026-10-11T16:00:05Z"
  }
  ```
- **Source**: [analysis.py:L58-66](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L58-L66)

---

### `POST /api/v1/analysis/critic-validate`
Invokes the Adversarial Critic Agent directly on demand.

- **Method**: `POST`
- **Path**: `/api/v1/analysis/critic-validate`
- **Request Body**:
  ```json
  {
    "analysis_id": "ana_7f9b20e14a",
    "ticker": "AAPL"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "dataQuality": 0.92,
      "modelQuality": 0.88,
      "sourceQuality": 0.95,
      "signalAgreement": 0.80,
      "modelCalibration": 0.86,
      "potentialLeakage": "none",
      "missingData": [],
      "staleData": [],
      "notes": [
        "Data cutoff timestamp validated — zero forward leakage detected."
      ]
    },
    "status": "completed"
  }
  ```
- **Source**: [analysis.py:L113-123](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L113-L123)

---

### `POST /api/v1/analysis/synthesis`
Executes qualitative multi-agent synthesis via the Model Gateway.

- **Method**: `POST`
- **Path**: `/api/v1/analysis/synthesis`
- **Request Body**:
  ```json
  {
    "analysis_id": "ana_7f9b20e14a",
    "ticker": "AAPL",
    "gateway_provider": "claude"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "overall_signal": "UP",
      "probability": 0.68,
      "horizon_days": 5,
      "confidence": "Medium-High",
      "market_context": "AAPL trades at $224.50...",
      "technical_view": "...",
      "fundamental_view": "...",
      "news_view": "...",
      "risk_factors": ["Macro interest rate sensitivity"],
      "conflicting_signals": []
    },
    "status": "completed"
  }
  ```
- **Source**: [analysis.py:L125-138](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L125-L138)

---

## 3. Stock Domain Endpoints

### `GET /api/v1/stocks/{ticker}`
Retrieves real-time market overview, price, capitalization, and trailing P/E.

- **Method**: `GET`
- **Path**: `/api/v1/stocks/{ticker}`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "ticker": "AAPL",
      "name": "Apple Inc.",
      "exchange": "NASDAQ",
      "sector": "Technology",
      "industry": "Consumer Electronics",
      "current_price": 224.50,
      "change_pct": 1.25,
      "volume": 45200000,
      "market_cap": 3450000000000,
      "pe_ratio": 31.4
    },
    "demo": true,
    "generatedAt": "2026-10-08T09:00:00Z"
  }
  ```
- **Source**: [stocks.py:L10-13](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/stocks.py#L10-L13)

---

### `GET /api/v1/stocks/{ticker}/technical`
Calculates RSI-14, MACD, SMAs (20/50/200), ATR-14, Bollinger Bands, and momentum.

- **Method**: `GET`
- **Path**: `/api/v1/stocks/{ticker}/technical`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "rsi_14": 62.4,
      "sma_20": 224.4,
      "sma_50": 219.7,
      "sma_200": 205.1,
      "macd": 2.13,
      "macd_signal": 1.85,
      "atr_14": 4.21,
      "bollinger_upper": 232.0,
      "bollinger_lower": 216.5,
      "momentum_20d": 0.074,
      "interpretation": "Real-time technical calculation for AAPL: RSI-14 at 62.4..."
    },
    "demo": true,
    "generatedAt": "2026-10-08T09:00:00Z"
  }
  ```
- **Source**: [stocks.py:L15-18](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/stocks.py#L15-L18)

---

### `GET /api/v1/stocks/{ticker}/fundamentals`
Returns balance sheet items, income statements, profitability, and valuation ratios.

- **Method**: `GET`
- **Path**: `/api/v1/stocks/{ticker}/fundamentals`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "revenue": 385000000000.0,
      "net_income": 97000000000.0,
      "eps": 6.42,
      "pe_ratio": 31.4,
      "pb_ratio": 48.2,
      "ps_ratio": 7.8,
      "roe": 147.2,
      "roa": 28.4,
      "debt_to_equity": 1.45,
      "free_cash_flow": 108000000000.0,
      "revenue_growth_yoy": 0.054,
      "eps_growth_yoy": 0.082,
      "interpretation": "Fundamental analysis for AAPL: Revenue stands at $385.0B..."
    },
    "demo": true,
    "generatedAt": "2026-10-08T09:00:00Z"
  }
  ```
- **Source**: [stocks.py:L20-23](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/stocks.py#L20-L23)

---

### `GET /api/v1/stocks/{ticker}/news`
Extracts recent news articles, sentiment score, event classification, and polarity distribution.

- **Method**: `GET`
- **Path**: `/api/v1/stocks/{ticker}/news`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "sentiment_score": 0.68,
      "overall_sentiment": "Positive",
      "article_count": 6,
      "positive_events": 4,
      "negative_events": 1,
      "neutral_events": 1,
      "articles": [ ... ],
      "interpretation": "Web news sentiment score for AAPL: 0.68 (Positive)..."
    },
    "demo": true,
    "generatedAt": "2026-10-08T09:00:00Z"
  }
  ```
- **Source**: [stocks.py:L25-28](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/stocks.py#L25-L28)

---

### `GET /api/v1/stocks/{ticker}/historical`
Finds historical market analogue periods and computes forward return distributions.

- **Method**: `GET`
- **Path**: `/api/v1/stocks/{ticker}/historical`
- **Response**: `200 OK`
  ```json
  {
    "data": {
      "analogues": [
        { "date": "2025-04-10", "similarity": 0.91, "return_1d": "+0.8%", "return_5d": "+3.1%", "return_20d": "+5.4%" }
      ],
      "mean_return_5d": 0.0205,
      "up_frequency_5d": 0.75,
      "interpretation": "Historical pattern matching identified 4 closely aligned market regimes..."
    },
    "demo": true,
    "generatedAt": "2026-10-08T09:00:00Z"
  }
  ```
- **Source**: [stocks.py:L30-33](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/stocks.py#L30-L33)

---

## 4. Quantitative & Platform Auxiliary Endpoints

### `GET /api/v1/predictions/{ticker}`
Runs the quantitative ML ensemble directly for a symbol and returns probability and votes.

- **Method**: `GET`
- **Path**: `/api/v1/predictions/{ticker}`
- **Query Parameters**: `horizon` (str, default: `"5D"`)
- **Response**: `200 OK` ([predictions.py:L7-16](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/predictions.py#L7-L16))

---

### `GET /api/v1/models/performance`
Returns backtest evaluation metrics across models (XGBoost, Random Forest, Logistic Regression), walk-forward validation folds, and baselines.

- **Method**: `GET`
- **Path**: `/api/v1/models/performance`
- **Response**: `200 OK` ([models.py:L5-44](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/models.py#L5-L44))

---

### `GET /api/v1/agents`
Returns operational status for all nine pipeline agents.

- **Method**: `GET`
- **Path**: `/api/v1/agents`
- **Response**: `200 OK` ([agents.py:L5-22](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/agents.py#L5-L22))

---

### `GET /api/v1/reports` & `GET /api/v1/reports/{report_id}`
Lists recent synthesized research reports and retrieves complete Markdown report details.

- **Method**: `GET`
- **Path**: `/api/v1/reports`, `/api/v1/reports/{report_id}`
- **Response**: `200 OK` ([reports.py:L5-66](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/reports.py#L5-L66))

---

### `GET /api/v1/watchlist`
Retrieves tracked symbols with current price and directional signals.

- **Method**: `GET`
- **Path**: `/api/v1/watchlist`
- **Response**: `200 OK` ([watchlist.py:L5-17](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/watchlist.py#L5-L17))

---

### `GET /api/v1/data-sources`
Lists connected and configured external data providers (yfinance, SEC EDGAR, n8n Orchestrator, Model Gateway).

- **Method**: `GET`
- **Path**: `/api/v1/data-sources`
- **Response**: `200 OK` ([data_sources.py:L5-19](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/data_sources.py#L5-L19))
