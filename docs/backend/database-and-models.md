# Database Schema & ORM Reference

## 1. Database Architecture & Engine Configuration

The persistence layer is managed using **SQLAlchemy 2.0 Async** ([backend/app/database.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/database.py)).

### Configuration Environments:
- **Active Runtime Database**: SQLite async driver (`sqlite+aiosqlite:///./arthaya.db`), storing application data locally in `backend/arthaya.db`.
- **Configured Target Database**: PostgreSQL with `asyncpg` (`postgresql+asyncpg://postgres:postgres@localhost:5432/arthaya_db`) documented in `.env.example` and supported via `requirements.txt`.
- **Schema Management**: Tables are auto-created at application launch via `Base.metadata.create_all` inside the FastAPI lifespan handler.

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    ANALYSIS_RUN ||--o{ AGENT_STEP_LOG : "contains"
    ANALYSIS_RUN ||--o{ PREDICTION_RECORD : "generates"
    ANALYSIS_RUN ||--o{ RESEARCH_REPORT : "produces"
    STOCK ||--o{ WATCHLIST_ITEM : "tracks"

    ANALYSIS_RUN {
        string id PK
        string ticker
        string horizon
        string depth
        string status
        string gateway_provider
        string n8n_execution_id
        json critic_validation
        json ai_summary
        datetime created_at
        datetime completed_at
    }

    AGENT_STEP_LOG {
        int id PK
        string analysis_id FK
        string agent_id
        string status
        string message
        int progress
        datetime timestamp
    }

    PREDICTION_RECORD {
        string id PK
        string analysis_id FK
        string ticker
        string horizon
        string direction
        float probability
        string model
        string model_version
        json breakdown
        json features_used
        datetime predicted_at
        datetime data_cutoff
    }

    RESEARCH_REPORT {
        string id PK
        string analysis_id
        string ticker
        string company_name
        string title
        text summary
        text content_markdown
        string overall_signal
        float probability
        string confidence
        string model_name
        json sections
        json sources
        datetime created_at
    }

    STOCK {
        string ticker PK
        string name
        string exchange
        string sector
        string industry
        float current_price
        float change_pct
        int volume
        float market_cap
        float pe_ratio
        datetime updated_at
    }

    WATCHLIST_ITEM {
        int id PK
        string ticker
        string name
        float added_price
        datetime added_at
    }

    MODEL_PERFORMANCE_RECORD {
        int id PK
        string model_name
        float accuracy
        float precision
        float recall
        float f1
        float roc_auc
        float log_loss
        float brier
        datetime evaluated_at
    }
```

---

## 3. Database Table Specifications

### 1. `analysis_runs` Table
Defined in [app/models/analysis.py:L6-25](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/analysis.py#L6-L25).

| Column Name | SQL Type | Nullable | Primary Key | Default / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | No | Yes | Indexed unique string (`ana_{hex_10}`). |
| `ticker` | `VARCHAR(20)` | No | No | Indexed equity ticker symbol. |
| `horizon` | `VARCHAR(10)` | No | No | Forecast timeframe (e.g. `"5D"`). |
| `depth` | `VARCHAR(20)` | No | No | Execution depth (`"standard"`). |
| `status` | `VARCHAR(20)` | No | No | State (`"queued"`, `"running"`, `"completed"`, `"failed"`). |
| `gateway_provider` | `VARCHAR(50)` | No | No | Selected LLM provider (default: `"claude"`). |
| `n8n_execution_id` | `VARCHAR(100)`| Yes | No | External n8n orchestrator execution identifier. |
| `critic_validation` | `JSON` | Yes | No | Structured validation dictionary from CriticService. |
| `ai_summary` | `JSON` | Yes | No | Structured synthesis output from ModelGateway. |
| `created_at` | `DATETIME` | Yes | No | Record generation timestamp (`datetime.utcnow`). |
| `completed_at` | `DATETIME` | Yes | No | Timestamp of completion. |

---

### 2. `agent_step_logs` Table
Defined in [app/models/analysis.py:L26-38](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/analysis.py#L26-L38).

| Column Name | SQL Type | Nullable | Primary Key | Foreign Key | Default / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | No | Yes | No | Auto-incrementing identifier. |
| `analysis_id` | `VARCHAR(50)` | No | No | `analysis_runs.id` | Foreign key referencing parent run. |
| `agent_id` | `VARCHAR(50)` | No | No | No | Identifier of agent (`market`, `technical`, etc.). |
| `status` | `VARCHAR(20)` | No | No | No | Agent status (`idle`, `running`, `completed`). |
| `message` | `VARCHAR(500)`| Yes | No | No | Status message or task description. |
| `progress` | `INTEGER` | Yes | No | No | Progress percentage integer (0–100). |
| `timestamp` | `DATETIME` | Yes | No | No | Step execution timestamp. |

---

### 3. `prediction_records` Table
Defined in [app/models/prediction.py:L5-23](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/prediction.py#L5-L23).

| Column Name | SQL Type | Nullable | Primary Key | Default / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | No | Yes | Indexed prediction ID (`pred_{hex_10}`). |
| `analysis_id` | `VARCHAR(50)` | Yes | No | Foreign key referencing `analysis_runs.id`. |
| `ticker` | `VARCHAR(20)` | No | No | Indexed equity ticker symbol. |
| `horizon` | `VARCHAR(10)` | No | No | Horizon (e.g. `"5D"`). |
| `direction` | `VARCHAR(10)` | No | No | Forecast direction: `"UP"`, `"DOWN"`, `"NEUTRAL"`. |
| `probability` | `FLOAT` | No | No | Calibrated probabilistic confidence score. |
| `model` | `VARCHAR(50)` | No | No | Model descriptor (default: `"XGBoost"`). |
| `model_version` | `VARCHAR(20)` | No | No | Model version tag (default: `"xgb_1.3"`). |
| `breakdown` | `JSON` | Yes | No | Per-model probability votes array. |
| `features_used` | `JSON` | Yes | No | Serialized 17-dimensional input feature vector. |
| `predicted_at` | `DATETIME` | Yes | No | Timestamp of prediction generation. |
| `data_cutoff` | `DATETIME` | Yes | No | Point-in-time boundary verifying zero leakage. |

---

### 4. `research_reports` Table
Defined in [app/models/report.py:L5-25](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/report.py#L5-L25).

| Column Name | SQL Type | Nullable | Primary Key | Default / Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(50)` | No | Yes | Indexed unique report ID (`rep_{hex_10}`). |
| `analysis_id` | `VARCHAR(50)` | Yes | No | Referencing analysis run. |
| `ticker` | `VARCHAR(20)` | No | No | Indexed equity ticker symbol. |
| `company_name` | `VARCHAR(255)`| No | No | Company legal or short name. |
| `title` | `VARCHAR(255)`| No | No | Title of research report. |
| `summary` | `TEXT` | No | No | Executive market context summary. |
| `content_markdown` | `TEXT` | No | No | Full research analysis in GitHub Markdown. |
| `overall_signal` | `VARCHAR(20)` | No | No | Directional signal (`"UP"`, `"DOWN"`). |
| `probability` | `FLOAT` | No | No | Calibrated confidence probability. |
| `confidence` | `VARCHAR(25)` | No | No | Qualitative confidence grade (`"Medium-High"`). |
| `model_name` | `VARCHAR(50)` | No | No | LLM Gateway model descriptor. |
| `sections` | `JSON` | Yes | No | Report sub-sections array. |
| `sources` | `JSON` | Yes | No | Attributed citation sources. |
| `created_at` | `DATETIME` | Yes | No | Creation timestamp. |

---

### 5. `stocks` Table
Defined in [app/models/stock.py:L5-19](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/stock.py#L5-L19).

| Column Name | SQL Type | Nullable | Primary Key | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `ticker` | `VARCHAR(20)` | No | Yes | Primary key ticker symbol. |
| `name` | `VARCHAR(255)`| No | No | Full company name. |
| `exchange` | `VARCHAR(50)` | No | No | Exchange (default: `"NASDAQ"`). |
| `sector` | `VARCHAR(100)`| Yes | No | Market sector. |
| `industry` | `VARCHAR(100)`| Yes | No | Market industry. |
| `current_price` | `FLOAT` | Yes | No | Last closing price. |
| `change_pct` | `FLOAT` | Yes | No | 24-hour percentage change. |
| `volume` | `INTEGER` | Yes | No | Trading volume. |
| `market_cap` | `FLOAT` | Yes | No | Market capitalization. |
| `pe_ratio` | `FLOAT` | Yes | No | Trailing price-to-earnings ratio. |
| `updated_at` | `DATETIME` | Yes | No | Auto-updating timestamp. |

---

### 6. `watchlist_items` & `model_performance_records`
- **`watchlist_items`** ([watchlist.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/watchlist.py)): `id` (int PK), `ticker` (indexed string), `name` (string), `added_price` (float), `added_at` (datetime).
- **`model_performance_records`** ([prediction.py:L24-37](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/models/prediction.py#L24-L37)): `id` (int PK), `model_name` (string), `accuracy`, `precision`, `recall`, `f1`, `roc_auc`, `log_loss`, `brier` (floats), and `evaluated_at` (datetime).
