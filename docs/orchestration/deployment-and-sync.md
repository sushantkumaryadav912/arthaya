# Orchestration Deployment & Synchronization

## 1. Automated Workflow Deployment Script

The repository includes an automated deployment script in [n8n/scripts/deploy_workflow.py](file:///home/sushant/Projects/Agentic/FinanceAgent/n8n/scripts/deploy_workflow.py) to publish workflow definitions to the remote n8n instance via its REST API.

### Script Execution:
```bash
# From workspace root
python3 n8n/scripts/deploy_workflow.py
```

### Script Mechanics:
1. **Environment Resolution**: Dynamically reads `backend/.env` to extract `N8N_BASE_URL` (default: `https://n8n.sushantkumaryadav.com.np`) and `N8N_API_KEY`.
2. **Payload Compilation**: Parses `n8n/workflows/arthaya_analysis_orchestrator.json` and serializes `name`, `nodes`, `connections`, and `settings`.
3. **API Dispatch**: Sends an HTTP POST request to `{N8N_BASE_URL}/api/v1/workflows` using standard Python `urllib.request`.
4. **Resilient Feedback**: If the remote instance rejects the request (e.g. HTTP 401 Unauthorized due to a missing API key), the script outputs a clear notice that the local JSON file is saved and ready for manual import via the n8n web UI.

---

## 2. Webhook Callback & Synchronization Contract

When the backend invokes n8n, it passes a callback contract enabling bi-directional synchronization ([backend/app/services/n8n_client.py:L17-25](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/n8n_client.py#L17-L25)):

### Outbound Webhook Request Payload:
```json
{
  "analysis_id": "ana_7f9b20e14a",
  "ticker": "AAPL",
  "horizon": "5D",
  "depth": "standard",
  "gateway_provider": "claude",
  "callback_url": "http://0.0.0.0:8000/api/v1/analysis/ana_7f9b20e14a/webhook"
}
```

### Response Processing:
- If n8n returns `200`, `201`, or `202`, the response is recognized as `triggered: true`.
- If an HTTP error occurs, `N8NClient` returns:
  ```json
  {
    "triggered": true,
    "mode": "local_orchestrator"
  }
  ```

---

## 3. Local Fallback Orchestrator Mechanics

To ensure that the platform remains fully functional when disconnected from n8n or operating in offline testing environments:
- The backend's `_execute_pipeline` method ([backend/app/api/v1/analysis.py:L145-223](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L145-L223)) functions as an autonomous in-process orchestrator.
- It directly invokes `MarketService`, `TechnicalService`, `FundamentalService`, `NewsService`, `HistoricalService`, `FeatureBuilder`, `MLEngine`, `CriticService`, and `ModelGateway` within a unified Python async event loop.
- The pipeline yields identically structured results and persists them to SQLite, maintaining parity with distributed n8n runs.
