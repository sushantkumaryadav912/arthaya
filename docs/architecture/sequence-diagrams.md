# Sequence Diagrams & Execution Choreography

## 1. End-to-End Analysis Lifecycle (FastAPI & Server-Sent Events)

This sequence diagram depicts the live execution lifecycle when an equity research run is started from the **Analyze Workspace** (`arthaya/src/app/(dashboard)/analyze/page.tsx`), demonstrating client-server interaction via HTTP POST and persistent Server-Sent Events (SSE):

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as User / Browser
    participant UI as Next.js AnalyzeWorkspace
    participant Hook as useAnalysisStream (Hook)
    participant API as FastAPI Router (/api/v1)
    participant N8N as N8NClient / n8n Webhook
    participant Exec as _execute_pipeline
    participant Services as Domain Services (Market/Tech/etc.)
    participant DB as SQLite DB (AsyncSession)

    Analyst->>UI: Selects Ticker (e.g. AAPL), Horizon (5D), Depth, Provider
    Analyst->>UI: Clicks "Run Analysis"
    UI->>Hook: start({ ticker: "AAPL", horizon: "5D", depth: "standard" })
    
    rect rgb(15, 23, 42)
        Note over Hook,API: Persistent EventSource SSE Connection
        Hook->>API: GET /api/v1/analysis/{id}/stream?ticker=AAPL&horizon=5D
        API-->>Hook: 200 OK (text/event-stream)
    end

    loop For each of 9 Pipeline Agents
        API->>API: Executes stage simulation / delay
        API-->>Hook: data: { agent: "market", status: "completed", progress: 22, ... }
        Hook->>UI: Updates AgentTimeline & LiveExecutionLog
    end

    rect rgb(30, 41, 59)
        Note over API,Exec: Pipeline Execution & Data Aggregation
        API->>Exec: _execute_pipeline(AAPL, 5D, standard, claude, analysis_id)
        Exec->>Services: Fetch Market, Technical, Fundamental, News, Historical
        Services-->>Exec: Aggregated Data Dictionaries
        Exec->>Exec: FeatureBuilder.build_feature_vector (Cutoff Enforced)
        Exec->>Exec: MLEngine.predict (LR / RF / XGBoost Ensemble)
        Exec->>Exec: CriticService.validate (Quality & Leakage Checks)
        Exec->>Exec: ModelGateway.generate_synthesis (Claude / Gemini / etc.)
    end

    rect rgb(16, 185, 129, 0.15)
        Note over Exec,DB: Asynchronous Database Persistence
        Exec->>DB: INSERT AnalysisRun
        Exec->>DB: INSERT PredictionRecord
        Exec->>DB: INSERT ResearchReport
        DB-->>Exec: Commit OK
    end

    API-->>Hook: data: { status: "completed", run: { prediction, critic, summary } }
    Hook->>UI: Transition phase to "completed"
    UI-->>Analyst: Render PredictionCard, Confidence, and AIResearchSummary
    Hook->>API: Close EventSource Stream
```

---

## 2. Remote n8n Orchestrator Workflow Choreography

When a job is queued via `POST /api/v1/analysis`, the FastAPI server communicates with the deployed n8n workflow at `https://n8n.sushantkumaryadav.com.np`:

```mermaid
sequenceDiagram
    autonumber
    participant Backend as FastAPI Backend
    participant N8NClient as N8NClient (Python)
    participant N8NHub as n8n Webhook (/webhook/arthaya-orchestrator)
    participant N8NInit as Init Shared State Node
    participant Workers as Parallel Worker Nodes (Market, Tech, Fund, News, Hist)
    participant N8NFeat as Feature Builder Node
    participant N8NML as Quant ML Engine Node
    participant N8NCritic as Critic Agent Node
    participant N8NSynth as Synthesis Agent Node
    participant N8NResp as Assemble Final Output Node

    Backend->>N8NClient: trigger_analysis_workflow(analysis_id, AAPL, 5D, standard, claude)
    N8NClient->>N8NHub: POST /webhook/arthaya-orchestrator (JSON Payload)
    
    alt Remote n8n Responds (HTTP 200/201/202)
        N8NHub->>N8NInit: Validate inputs & sanitize backend URLs (SSRF Guard)
        par Parallel Data Collection
            N8NInit->>Workers: GET /api/v1/stocks/AAPL
            N8NInit->>Workers: GET /api/v1/stocks/AAPL/technical
            N8NInit->>Workers: GET /api/v1/stocks/AAPL/fundamentals
            N8NInit->>Workers: GET /api/v1/stocks/AAPL/news
            N8NInit->>Workers: GET /api/v1/stocks/AAPL/historical
        end
        Workers-->>N8NFeat: Merge outputs into unified dictionary
        N8NFeat->>N8NML: GET /api/v1/predictions/AAPL?horizon=5D
        N8NML-->>N8NCritic: POST /api/v1/analysis/critic-validate
        N8NCritic-->>N8NSynth: POST /api/v1/analysis/synthesis
        N8NSynth-->>N8NResp: Aggregate ML + Critic + LLM Thesis
        N8NResp-->>N8NClient: Return completed run payload
    else Remote n8n Unreachable or Fails
        N8NHub--xN8NClient: Timeout / Network Failure
        N8NClient-->>Backend: Graceful fallback: { triggered: true, mode: "local_orchestrator" }
        Backend->>Backend: Fallback directly to in-process _execute_pipeline
    end
```

---

## 3. Standalone Frontend Demo Mode Sequence

When the frontend is executed in isolated demo mode (`NEXT_PUBLIC_DEMO_MODE=true`), the browser bypasses external server connections and runs entirely within Next.js:

```mermaid
sequenceDiagram
    autonumber
    actor Analyst as User / Browser
    participant Page as AnalyzeWorkspace Component
    participant Hook as useAnalysisStream Hook
    participant RouteHandler as Next.js Route Handler (/api/v1/analysis/stream)
    participant MockRepo as Mock Analysis Builder (lib/mock/analysis.ts)

    Analyst->>Page: Configure analysis and submit form
    Page->>Hook: start({ ticker, horizon, depth })
    Hook->>RouteHandler: GET /api/v1/analysis/stream?ticker=AAPL...
    RouteHandler->>MockRepo: buildCompletedRun(ticker, horizon, depth, analysisId)
    MockRepo-->>RouteHandler: Synthetic completed AnalysisRun record

    loop Sequential Delay per Agent (120ms - 420ms based on depth)
        RouteHandler-->>Hook: data: { type: "event", status: "running", message: "..." }
        Hook->>Page: Update UI progress
        RouteHandler-->>Hook: data: { type: "event", status: "completed", message: "..." }
        Hook->>Page: Update completed agent badge
    end

    RouteHandler-->>Hook: data: { type: "complete", run: completedRun }
    RouteHandler->>RouteHandler: Close stream
    Hook->>Page: Render full AI Research Summary
```
