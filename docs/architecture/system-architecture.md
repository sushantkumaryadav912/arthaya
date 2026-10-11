# System Architecture & Monorepo Topology

## 1. Monorepo Structural Overview

The **FinanceAgent (Arthaya)** project is structured as a multi-tier repository consisting of three core application domains and workspace configuration roots:

```text
FinanceAgent/
├── backend/                  # FastAPI Python backend engine & ML layer
│   ├── app/
│   │   ├── api/v1/          # REST & SSE route controllers
│   │   ├── models/          # SQLAlchemy 2.0 ORM database models
│   │   ├── schemas/         # Pydantic v2 validation contracts
│   │   ├── services/        # Quant, technical, and LLM services
│   │   ├── config.py        # Centralized settings & environment loading
│   │   ├── database.py      # Async SQLAlchemy engine & session factory
│   │   ├── main.py          # FastAPI application initialization & lifespan
│   │   └── test_run.py      # End-to-end integration validation script
│   ├── arthaya.db           # Active SQLite persistent database
│   ├── Dockerfile           # Python 3.13 container definition
│   └── requirements.txt     # Python dependencies
├── arthaya/                  # Next.js 16 App Router web frontend
│   ├── src/
│   │   ├── app/             # App Router layout and page hierarchy
│   │   │   ├── (auth)/      # Authentication route group (login, register)
│   │   │   ├── (dashboard)/ # Main dashboard views (12 distinct pages)
│   │   │   └── api/v1/      # Standalone Next.js route handlers (demo mode)
│   │   ├── components/      # UI component hierarchy (shadcn-inspired)
│   │   ├── hooks/           # Custom React hooks (SSE streaming, watchlist)
│   │   ├── lib/             # API client, types, constants, mock data
│   │   └── services/        # Auth and user service abstractions
│   ├── package.json         # Frontend dependencies & scripts
│   └── tsconfig.json        # TypeScript configuration
├── n8n/                      # Workflow automation & agent orchestration
│   ├── scripts/             # Python automation scripts (deploy_workflow.py)
│   └── workflows/           # Orchestrator JSON definitions (v1 and fixed)
├── project.md                # Original architectural specification prompt
└── docs/                     # Technical documentation suite
```

---

## 2. C4 Architecture Model

### Level 1: System Context Diagram

```mermaid
C4Context
    title System Context - Arthaya Financial Intelligence Platform

    Person(analyst, "Equity Analyst / Quant", "Researches stocks, evaluates multi-agent intelligence, and inspects ML model predictions.")

    System(arthaya_platform, "Arthaya Platform", "Provides multi-agent equity analysis, technical indicators, ML prediction ensembles, and structured research synthesis.")

    System_Ext(yfinance_api, "Yahoo Finance (yfinance)", "Provides equity quotes, historical OHLCV data, balance sheets, and market news.")
    System_Ext(n8n_hub, "n8n Workflow Hub", "Coordinates asynchronous agent execution via hosted workflow automation.")
    System_Ext(llm_providers, "LLM Model Providers", "Anthropic Claude, Google Gemini, Mistral AI, Groq, and OpenRouter.")

    Rel(analyst, arthaya_platform, "Configures analyses, views forecasts, and monitors agents via Web UI", "HTTPS / SSE")
    Rel(arthaya_platform, yfinance_api, "Ingests quotes, indicators, statements, and news", "HTTPS")
    Rel(arthaya_platform, n8n_hub, "Dispatches analysis requests via Webhook", "HTTPS / JSON")
    Rel(arthaya_platform, llm_providers, "Synthesizes multi-agent thesis via Model Gateway", "HTTPS")
```

---

### Level 2: Container Diagram

```mermaid
C4Container
    title Container Diagram - Arthaya Architecture

    Person(user, "User", "Equity Analyst")

    Container(frontend, "Next.js Web Application", "Next.js 16, React 19, Tailwind v4", "Delivers responsive terminal UI, interactive charts, and consumes SSE live streams.")

    Container(backend, "FastAPI Backend API", "Python 3.13, FastAPI, Uvicorn", "Serves REST endpoints, streams agent lifecycle events via SSE, executes quant ML models.")

    Container(n8n, "n8n Orchestrator", "n8n Instance (Cloud)", "Orchestrates parallel data fetching, feature extraction, and agent stages.")

    ContainerDb(database, "SQL Database", "SQLite (Active) / PostgreSQL", "Stores completed analysis runs, prediction records, research reports, and stock metadata.")

    Container_Ext(yfinance, "Yahoo Finance API", "External Service", "Supplies live equities, financials, and news.")

    Rel(user, frontend, "Interacts with", "Browser / HTTPS")
    Rel(frontend, backend, "Dispatches analysis & queries data", "REST / HTTP JSON")
    Rel(frontend, backend, "Listens to live agent events", "Server-Sent Events (SSE)")
    Rel(backend, n8n, "Triggers workflow via Webhook", "HTTP POST")
    Rel(n8n, backend, "Invokes individual agent endpoints", "HTTP GET / POST")
    Rel(backend, database, "Reads and writes records", "SQLAlchemy 2.0 Async")
    Rel(backend, yfinance, "Fetches market data", "HTTPS")
```

---

### Level 3: Component Diagram (FastAPI Backend)

```mermaid
graph TD
    subgraph FastAPI Application ["FastAPI Application (app.main:app)"]
        Router["APIRouter (/api/v1)"]
        Lifespan["Lifespan Context (Database Initialization)"]

        subgraph Route Controllers ["Route Controllers (app.api.v1)"]
            StocksCtrl["stocks.py"]
            AnalysisCtrl["analysis.py (REST & SSE Stream)"]
            PredCtrl["predictions.py"]
            ModelsCtrl["models.py"]
            AgentsCtrl["agents.py"]
            ReportsCtrl["reports.py"]
            WatchCtrl["watchlist.py"]
            DataCtrl["data_sources.py"]
        end

        subgraph Core Services ["Core Services (app.services)"]
            MarketSvc["MarketService (yfinance)"]
            TechSvc["TechnicalService (Pandas/NumPy)"]
            FundSvc["FundamentalService (Financials)"]
            NewsSvc["NewsService (NLP Sentiment)"]
            HistSvc["HistoricalService (Analogue Regimes)"]
            FeatBuilder["FeatureBuilder (Zero Leakage)"]
            MLEngine["MLEngine (LR / RF / XGBoost)"]
            CriticSvc["CriticService (Adversarial Quality)"]
            GatewaySvc["ModelGateway (Multi-LLM Router)"]
            N8NClient["N8NClient (Webhook Dispatcher)"]
        end

        subgraph Persistence Layer ["Persistence Layer"]
            DBFactory["database.py (AsyncSessionLocal)"]
            AnalysisModel["AnalysisRun & AgentStepLog"]
            PredModel["PredictionRecord"]
            ReportModel["ResearchReport"]
        end
    end

    Router --> AnalysisCtrl & StocksCtrl & PredCtrl & ModelsCtrl & AgentsCtrl & ReportsCtrl & WatchCtrl & DataCtrl
    AnalysisCtrl --> N8NClient
    AnalysisCtrl --> MarketSvc & TechSvc & FundSvc & NewsSvc & HistSvc
    AnalysisCtrl --> FeatBuilder --> MLEngine --> CriticSvc --> GatewaySvc
    AnalysisCtrl --> DBFactory
    DBFactory --> AnalysisModel & PredModel & ReportModel
```

---

## 3. Communication Protocols & Boundaries

| Channel | Source | Destination | Protocol | Payload Format | Evidence in Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Client REST API** | Next.js Frontend | FastAPI Backend | HTTP/1.1 | JSON (`Accept: application/json`) | [client.ts:L8-34](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/lib/api/client.ts#L8-L34) |
| **Live Stream** | FastAPI Backend | Next.js Frontend | Server-Sent Events | `text/event-stream` (SSE) | [analysis.py:L68-102](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L68-L102), [useAnalysisStream.ts](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/hooks/useAnalysisStream.ts) |
| **Workflow Trigger** | FastAPI Backend | n8n Orchestrator | HTTP POST Webhook | JSON (`X-N8N-API-KEY` if set) | [n8n_client.py:L16-46](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/services/n8n_client.py#L16-L46) |
| **Agent Dispatches** | n8n Orchestrator | FastAPI Backend | HTTP GET / POST | JSON | [arthaya_analysis_orchestrator_fixed.json](file:///home/sushant/Projects/Agentic/FinanceAgent/n8n/workflows/arthaya_analysis_orchestrator_fixed.json) |
| **Market Ingestion** | FastAPI Backend | Yahoo Finance | HTTPS / TLS | JSON / Binary | `yfinance` internal network client |
| **Database I/O** | FastAPI Backend | SQLite / Postgres | Async DB-API | Binary / SQL | [database.py:L8-18](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/database.py#L8-L18) |

---

## 4. Key Architectural Attributes

### 1. Dual-Path Execution Model
The system supports two independent execution paths:
- **Distributed Mode**: The Next.js frontend calls the FastAPI backend, which initiates the remote n8n orchestrator at `https://n8n.sushantkumaryadav.com.np`. The n8n orchestrator coordinates parallel calls back to the backend data agents and gathers the shared state.
- **Local Fallback Mode**: If n8n is unreachable, the backend's internal `_execute_pipeline` method executes the 9-stage sequence in-process, guaranteeing reliable execution without external orchestrator dependencies ([analysis.py:L145-223](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/api/v1/analysis.py#L145-L223)).

### 2. Standalone Frontend Demo Mode
The Next.js frontend includes a complete client-side mock repository ([arthaya/src/lib/mock/](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/lib/mock/)) and Next.js route handlers (`src/app/api/v1/`). When `NEXT_PUBLIC_DEMO_MODE=true` (the default), the frontend runs entirely in isolation without requiring the Python backend to be active.

### 3. Asynchronous Database Lifespan
Database tables are verified and initialized automatically on application startup via FastAPI's `lifespan` context manager using SQLAlchemy's async connection pool ([main.py:L9-24](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/main.py#L9-L24)).
