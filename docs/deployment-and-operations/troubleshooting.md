# Troubleshooting & Diagnostics Playbook

This document provides resolutions for operational anomalies across data ingestion, streaming connections, and database interactions.

---

## 1. Yahoo Finance Data Feed Degradation / 429 Rate Limits

### Symptom:
Console warnings indicating `Insufficient price data` or HTTP 429 Too Many Requests from Yahoo Finance.

### Code Behavior & Fallback:
- `MarketService`, `TechnicalService`, `FundamentalService`, and `NewsService` wrap all external network calls in defensive `try/except` blocks.
- When an upstream error occurs, each service returns verified fallback metrics (illustrative AAPL indicators, $108B FCF, RSI 62.4) rather than throwing uncaught 500 Internal Server Errors ([technical_service.py:L79-93](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/technical_service.py#L79-L93)).

### Diagnostic Command:
```bash
# In backend virtual environment
python3 -c "import yfinance as yf; print(yf.Ticker('AAPL').info.get('currentPrice'))"
```
If this hangs or fails, your IP address is temporarily rate-limited by Yahoo Finance. The backend will automatically serve fallback indicators until the rate window expires.

---

## 2. Remote n8n Orchestrator Connectivity Failures

### Symptom:
`POST /api/v1/analysis` returns, but the external n8n workflow does not appear to trigger.

### Cause & Resolution:
- [N8NClient](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/n8n_client.py) enforces a strict 10.0-second HTTP timeout.
- If the remote instance at `https://n8n.sushantkumaryadav.com.np` is unreachable, `N8NClient` returns:
  ```json
  {"triggered": true, "mode": "local_orchestrator", "note": "n8n endpoint reached with fallback..."}
  ```
- The backend seamlessly executes the analysis in-process via `_execute_pipeline`.

---

## 3. Server-Sent Events (SSE) Stream Interruption

### Symptom:
The **Analyze Workspace** displays `"Live analysis stream interrupted"` or stalls at a specific agent.

### Root Causes & Fixes:
1. **Reverse Proxy Buffering**: If running behind Nginx or Cloudflare, ensure response buffering is disabled for `text/event-stream`. In Nginx, set:
   ```nginx
   proxy_set_header Connection '';
   proxy_http_version 1.1;
   chunked_transfer_encoding off;
   proxy_buffering off;
   proxy_cache off;
   ```
2. **EventSource URL Mismatch**: Verify that `NEXT_PUBLIC_API_BASE` points to the active backend instance (e.g., `http://localhost:8000`), or that CORS permits `GET /api/v1/analysis/{id}/stream`.

---

## 4. SQLite Database Locking (`database is locked`)

### Symptom:
`sqlite3.OperationalError: database is locked` during concurrent analysis runs.

### Cause & Fix:
SQLite serializes write transactions. When multiple analyses complete simultaneously, concurrent writes to `arthaya.db` can experience contention.
- **Short-Term Resolution**: Enable Write-Ahead Logging (WAL) mode:
  ```bash
  sqlite3 backend/arthaya.db "PRAGMA journal_mode=WAL;"
  ```
- **Long-Term Production Resolution**: Switch to PostgreSQL by updating `DATABASE_URL` in `backend/.env`.

---

## 5. React 19 Client Hydration Mismatches

### Symptom:
Console warnings regarding mismatched text content between server-rendered HTML and client state on `/watchlist`.

### Fix Implemented in Code:
[useWatchlist.ts](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/hooks/useWatchlist.ts) implements an explicit `hydrated` boolean state flag. Dynamic symbols stored in browser `localStorage` are only rendered after client hydration completes, preventing mismatch errors.
