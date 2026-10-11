# Local Setup & Development Guide

## 1. Prerequisites

Ensure your system satisfies the following runtime requirements:
- **Operating System**: Linux (Ubuntu 22.04+ recommended), macOS, or WSL2.
- **Python**: Version 3.11 or higher (Python 3.13 recommended; matches `backend/Dockerfile`).
- **Node.js**: Version 20.x or higher (Node 20+ required for Next.js 16).
- **Package Managers**: `pip`, `npm` (or `pnpm` / `yarn`).
- **Build Tools**: `build-essential`, `libpq-dev` (if compiling postgres drivers).

---

## 2. Backend Setup (`backend/`)

### Step 1: Create and Activate Virtual Environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

> [!NOTE]
> `requirements.txt` installs FastAPI, Uvicorn, SQLAlchemy, Pydantic, yfinance, Pandas, NumPy, Scikit-Learn, XGBoost, and HTTPX.

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` as required (see [Configuration Guide](file:///home/sushant/Projects/Agentic/FinanceAgent/docs/deployment-and-operations/configuration-guide.md)).

### Step 4: Run the Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Server API: `http://localhost:8000`
- Interactive OpenAPI Swagger UI: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Step 5: Verify Pipeline via Test Script
In a separate terminal (with virtual environment active):
```bash
python3 app/test_run.py
```
This script executes a full real-data pipeline run for `AAPL`, verifying all 9 agents, feature engineering, ML models, and model gateway synthesis ([backend/app/test_run.py](file:///home/sushant/Projects/Agentic/FinanceAgent/backend/app/test_run.py)).

---

## 3. Frontend Setup (`arthaya/`)

### Step 1: Install Node Dependencies
```bash
cd arthaya
npm install
```

### Step 2: Configure Environment
Create `.env.local` if custom values are needed:
```bash
# To run standalone with mock data (default):
NEXT_PUBLIC_DEMO_MODE=true

# To connect to the live Python backend:
# NEXT_PUBLIC_DEMO_MODE=false
# NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Step 3: Start Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Running the Complete System Together

For full-stack live operation:
1. Terminal 1: Launch backend on port 8000:
   ```bash
   cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000
   ```
2. Terminal 2: Set frontend to connect to the live backend and start:
   ```bash
   cd arthaya && NEXT_PUBLIC_DEMO_MODE=false NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run dev
   ```
3. Open `http://localhost:3000/analyze` and run an analysis to observe real-time SSE streaming from the Python engine.
