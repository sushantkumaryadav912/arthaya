# Environment & Configuration Guide

This guide catalogs all configuration parameters supported across the backend and frontend.

> [!CAUTION]
> Never commit actual API keys, private passwords, or access tokens to version control. Use `.env.example` templates and keep your `.env` and `.env.local` files in `.gitignore`.

---

## 1. Backend Configuration (`backend/.env`)

Managed by Pydantic Settings in [backend/app/config.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/config.py):

| Variable Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **Server Settings** | | | |
| `ENV` | `string` | `"development"` | Application environment mode (`"development"`, `"production"`, `"test"`). |
| `HOST` | `string` | `"0.0.0.0"` | Network interface to bind the Uvicorn server to. |
| `PORT` | `integer`| `8000` | Port for the FastAPI HTTP server. |
| `CORS_ORIGINS` | `list[str]` | `["http://localhost:3000", "http://127.0.0.1:3000"]` | JSON array of permitted Cross-Origin Resource Sharing (CORS) origins. |
| **Database Settings** | | | |
| `DATABASE_URL` | `string` | `"sqlite+aiosqlite:///./arthaya.db"` | SQLAlchemy async connection URI. To use PostgreSQL: `postgresql+asyncpg://user:pass@localhost:5432/arthaya_db`. |
| `POSTGRES_USER` | `string` | `postgres` (example) | PostgreSQL username (used when provisioning external DB). |
| `POSTGRES_PASSWORD` | `string` | `postgres` (example) | PostgreSQL user password. |
| `POSTGRES_HOST` | `string` | `localhost` | PostgreSQL host address. |
| `POSTGRES_PORT` | `integer`| `5432` | PostgreSQL server port. |
| `POSTGRES_DB` | `string` | `arthaya_db` | Target PostgreSQL database name. |
| **n8n Orchestrator** | | | |
| `N8N_BASE_URL` | `string` | `"https://n8n.sushantkumaryadav.com.np"` | Base URL of the deployed n8n workflow server. |
| `N8N_WEBHOOK_URL` | `string` | `"https://n8n.sushantkumaryadav.com.np/webhook/arthaya-orchestrator"` | Webhook URL triggered by `POST /api/v1/analysis`. |
| `N8N_API_KEY` | `string` | `""` | Optional API key for authenticating workflow deployments via `deploy_workflow.py`. |
| **LLM Model Gateway Keys** | | | |
| `ANTHROPIC_API_KEY` | `string` | `""` | Anthropic Claude API key for model synthesis. |
| `GEMINI_API_KEY` | `string` | `""` | Google Gemini API key. |
| `MISTRAL_API_KEY` | `string` | `""` | Mistral AI API key. |
| `GROQ_API_KEY` | `string` | `""` | Groq high-speed inference API key. |
| `OPENROUTER_API_KEY`| `string` | `""` | OpenRouter unified LLM API key. |

---

## 2. Frontend Configuration (`arthaya/.env.local`)

Managed in [arthaya/src/lib/utils/env.ts](file:///home/sushant/Projects/Agentic/FinanceAgent/arthaya/src/lib/utils/env.ts):

| Variable Name | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_DEMO_MODE` | `string` | `"true"` | When `"true"`, the frontend serves illustrative mock repositories from `src/lib/mock/` and local route handlers. When `"false"`, network calls route to the live FastAPI backend. |
| `NEXT_PUBLIC_API_BASE` | `string` | `""` (same origin) | Base URL of the backend API. In local full-stack mode, set to `http://localhost:8000`. |

---

## 3. Configuration Profiles

### Profile A: Standalone Demo Mode (Zero Dependencies)
Run only the frontend without backend, Python, or database requirements:
- `NEXT_PUBLIC_DEMO_MODE=true`
- `NEXT_PUBLIC_API_BASE=""`

### Profile B: Local Full-Stack (Default Development)
Run Python FastAPI with SQLite and Next.js frontend:
- **Backend `.env`**:
  - `DATABASE_URL=sqlite+aiosqlite:///./arthaya.db`
  - `N8N_WEBHOOK_URL=https://n8n.sushantkumaryadav.com.np/webhook/arthaya-orchestrator`
- **Frontend `.env.local`**:
  - `NEXT_PUBLIC_DEMO_MODE=false`
  - `NEXT_PUBLIC_API_BASE=http://localhost:8000`

### Profile C: Production Containerized Stack
- **Backend `.env`**:
  - `ENV=production`
  - `DATABASE_URL=postgresql+asyncpg://<db_user>:<db_pass>@<db_host>:5432/<db_name>`
- **Frontend**:
  - `NEXT_PUBLIC_DEMO_MODE=false`
  - `NEXT_PUBLIC_API_BASE=https://api.yourdomain.com`
