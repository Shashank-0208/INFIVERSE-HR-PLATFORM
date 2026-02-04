# Docker & Environment Variable Audit

This document summarizes the mapping between `backend/.env`, `backend/.env.example`, and Docker configuration for correct loading and authentication.

## 1. Required env files

| File | Purpose |
|------|--------|
| `backend/.env` | Real values (never commit). Copy from `.env.example` and fill placeholders. |
| `backend/.env.example` | Placeholders and documentation. Safe to commit. |

**Docker Compose** (run from `backend/`):
- `docker-compose -f docker-compose.production.yml up --build`
- Uses `env_file: .env` so `backend/.env` is loaded.
- All `${VAR}` in the compose file resolve from the host environment (and from `.env` when using `docker-compose`’s default env loading).

## 2. Authentication & secrets mapping

| Variable | .env.example | docker-compose.production.yml | Used by |
|----------|--------------|-------------------------------|---------|
| `JWT_SECRET_KEY` | ✅ `<YOUR_JWT_SECRET_KEY>` | ✅ gateway, agent, langgraph, portal, client_portal, candidate_portal | Gateway/agent/langgraph jwt_auth, config |
| `CANDIDATE_JWT_SECRET_KEY` | ✅ | ✅ all 6 services | Same |
| `API_KEY_SECRET` | ✅ | ✅ all 6 services | Same |
| `GATEWAY_SECRET_KEY` | ✅ | ✅ gateway | README / future use |
| `DATABASE_URL` | ✅ | ✅ gateway, agent, langgraph, client_portal, candidate_portal | config.py, db code |
| `MONGODB_DB_NAME` | (optional) | ✅ `${MONGODB_DB_NAME:-bhiv_hr}` | Same |
| `HF_TOKEN` | ✅ `<YOUR_HF_TOKEN>` | ✅ agent only | Agent app.py, phase3_engine |
| `GEMINI_API_KEY` | ✅ | ✅ agent, langgraph | Agent, LangGraph |
| `GMAIL_EMAIL` | ✅ | ✅ langgraph | communication.py |
| `GMAIL_APP_PASSWORD` | ✅ (was `GMAIL_APP_PASSWORD_SECRET_KEY`) | ✅ langgraph | communication.py |
| `TWILIO_ACCOUNT_SID` | ✅ | ✅ langgraph | communication.py |
| `TWILIO_AUTH_TOKEN` | ✅ (was `TWILIO_AUTH_TOKEN_SECRET_KEY`) | ✅ langgraph | communication.py |
| `TWILIO_WHATSAPP_NUMBER` | ✅ | ✅ langgraph | communication.py |
| `TELEGRAM_BOT_TOKEN` | ✅ (was `TELEGRAM_BOT_TOKEN_SECRET_KEY`) | ✅ langgraph | communication.py |
| `TELEGRAM_BOT_USERNAME` | ✅ | ✅ langgraph | communication.py |

All auth-related variables are read via `os.getenv()` in code; no secrets are hardcoded in Dockerfiles.

## 3. Dockerfiles

| Service | Dockerfile | Env at build | Env at runtime |
|---------|------------|--------------|----------------|
| gateway | `services/gateway/Dockerfile` | None | From compose `env_file` + `environment` |
| agent | `services/agent/Dockerfile` | None | From compose (includes `HF_TOKEN`, `GEMINI_API_KEY`, JWT/API secrets) |
| langgraph | `services/langgraph/Dockerfile` | None | From compose (fixed port 9001 in CMD) |
| portal | `services/portal/Dockerfile` | None | From compose |
| client_portal | `services/client_portal/Dockerfile` | None | From compose |
| candidate_portal | `services/candidate_portal/Dockerfile` | None | From compose |
| db | `services/db/Dockerfile` | Postgres only | Not used in production compose (MongoDB Atlas) |
| runtime-core | `runtime-core/Dockerfile` | None | Standalone SAR; not part of main BHIV stack |

None of the Dockerfiles embed secrets; they rely on runtime env from compose and `.env`.

## 4. Docker Compose files

### `backend/docker-compose.production.yml`

- **env_file:** ` .env` (relative to `backend/`).
- **environment:** Explicit list of variables with `${VAR}` or `${VAR:-default}`.
- **Service URLs inside containers:** Use Docker service names (e.g. `http://agent:9000`, `http://gateway:8000`), not localhost.
- **MongoDB:** Uses `DATABASE_URL` from `.env` (e.g. MongoDB Atlas); no local DB container.

### `backend/runtime-core/docker-compose.yml`

- **Separate product** (Sovereign Application Runtime). Not used by main BHIV HR stack.
- **Uses hardcoded placeholder secrets** in `environment:` (e.g. `JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production`). For production, this should be switched to `env_file` and real secrets in a `.env` (see `runtime-core/.env.example`).

## 5. Configuration files using env vars

- **Gateway:** `services/gateway/config.py`, `jwt_auth.py` — `DATABASE_URL`, `API_KEY_SECRET`, `JWT_SECRET_KEY`, `CANDIDATE_JWT_SECRET_KEY`, `AGENT_SERVICE_URL`, `LANGGRAPH_SERVICE_URL`.
- **Agent:** `services/agent/config.py`, `jwt_auth.py`, `app.py`, `semantic_engine/phase3_engine.py` — same secrets plus `HF_TOKEN`, `GEMINI_API_KEY`.
- **LangGraph:** `app/main.py`, `jwt_auth.py`, `app/communication.py`, mongodb adapters — same secrets plus `GMAIL_*`, `TWILIO_*`, `TELEGRAM_*`, `GEMINI_*`.

All use `os.getenv()` only; no hardcoded credentials.

## 6. run_services.py (local non-Docker)

- **No hardcoded secrets.** All values come from `os.getenv()` or from `backend/.env` via `load_env_file()`.
- Ensures that when running without Docker, the same `.env` is used and authentication stays consistent.

## 7. Checklist

- [x] All required auth variables are in `backend/.env.example` with placeholders.
- [x] Variable names in `.env.example` match docker-compose and code (e.g. `GMAIL_APP_PASSWORD`, `TWILIO_AUTH_TOKEN`, `TELEGRAM_BOT_TOKEN`, `HF_TOKEN`).
- [x] Docker Compose uses `env_file: .env` and explicit `environment:` with `${VAR}`.
- [x] No secrets hardcoded in Dockerfiles or in `run_services.py`.
- [x] LangGraph Dockerfile uses fixed port 9001 in CMD (no shell expansion).
- [ ] **runtime-core:** For production, replace hardcoded secrets in `runtime-core/docker-compose.yml` with `env_file` and vars from `runtime-core/.env`.

**Note:** Some test files (e.g. `tests/comprehensive_endpoint_tests.py`) use fallback values in `os.getenv(..., "default")` for local runs only. Do not rely on these in production; set real env vars or use `.env`.
