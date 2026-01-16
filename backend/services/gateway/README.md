# Gateway Service

**FastAPI + Python 3.12.7**  
**Purpose:** Central API gateway for routing, authentication, and orchestration between HR platform services.

## Overview
- Central entry point for all backend APIs
- Handles authentication (JWT, API key)
- Orchestrates requests to agent, portal, client, candidate, and langgraph services
- Provides monitoring and logging

## Key Features
- **Routing:** Unified API for HR, client, and candidate portals
- **Authentication:** JWT, API key, and role-based access
- **Service Orchestration:** Connects to microservices (agent, langgraph, etc.)
- **Monitoring:** Health checks, logging, and diagnostics

## Architecture
```
gateway/
├── app/                # FastAPI app, routes, and logic
│   ├── main.py         # Main FastAPI application
│   ├── database.py     # MongoDB integration
│   ├── db_helpers.py   # Database helpers
│   └── ...
├── config.py           # Configuration (env, secrets)
├── dependencies.py     # Dependency injection (auth, API key)
├── routes/             # API route modules
├── requirements.txt    # Python dependencies
├── run.bat             # Windows startup script
└── Dockerfile          # Containerization
```

## Endpoints
- **/auth/**: Authentication and token management
- **/jobs/**: Job posting and management
- **/candidates/**: Candidate management
- **/clients/**: Client company management
- **/health**: Service health check

## Local Development
```bash
cd services/gateway
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Notes
- Requires MongoDB connection (Atlas or local)
- Environment variables managed via `.env` file
- Integrates with all other backend services
