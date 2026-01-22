
# AI Agent Service

AI-powered semantic candidate matching and learning engine for the BHIV HR Platform, built with FastAPI and Python 3.12.7.

---

## Overview
Provides advanced candidate-job matching, batch processing, and company-specific learning using NLP and RL techniques. All data is stored in MongoDB (no SQL required).

## Key Features
- **Semantic Engine:** Production-grade NLP for candidate-job matching
- **Batch Processing:** Optimize multiple job/candidate matches
- **Learning Algorithms:** Company preference tracking, RL-based scoring
- **Real-Time Analysis:** Fast response for live HR workflows

## Architecture
```
agent/
├── app.py              # FastAPI AI service
├── semantic_engine/    # Phase 3 AI engine
│   ├── __init__.py
│   └── phase3_engine.py
└── requirements.txt    # AI/ML dependencies
```

## API Endpoints
- `GET /` — Service root
- `GET /health` — Health check
- `POST /match` — AI-powered candidate-job matching
- `POST /batch-match` — Batch matching
- `GET /analyze/{candidate_id}` — Candidate analysis
- `GET /test-db` — Database diagnostics

## AI/ML Features
- **Semantic Matching:** Sentence transformers, advanced NLP
- **Adaptive Scoring:** RL-based, company-specific optimization
- **Cultural Fit Analysis:** Feedback-based alignment

## Environment
- Requires MongoDB connection (Atlas or local)
- All secrets and keys from environment variables

## Local Development
```bash
cd services/agent
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 9002 --reload
```

## Notes
- No SQL/PostgreSQL dependencies
- Integrates with other platform services via API
- **Multi-Factor Scoring**: Semantic (40%), Experience (30%), Skills (20%), Location (10%)

## Local Development

```bash
cd services/agent
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 9000 --reload
```
