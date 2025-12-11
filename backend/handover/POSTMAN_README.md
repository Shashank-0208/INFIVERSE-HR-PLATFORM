# BHIV HR Platform - Postman Collection

## Overview
Complete Postman collection with all **111 endpoints** organized by service.

**File**: `postman_collection.json`

## Endpoints Breakdown
- **Gateway API**: 80 endpoints
- **AI Agent API**: 6 endpoints  
- **LangGraph API**: 25 endpoints

## Collection Structure

### Gateway API (80 endpoints)
1. **GW-Auth** (4): Setup 2FA, Verify 2FA, Login, 2FA Status
2. **GW-AI** (2): Test Communication, Gemini Analyze
3. **GW-Workflows** (7): Trigger, Status, List, Health, 3 Webhooks
4. **GW-RL** (4): Predict, Feedback, Analytics, Performance
5. **GW-Monitor** (3): Metrics, Health Detail, Dashboard
6. **GW-Core** (5): OpenAPI, Docs, Root, Health, Test DB
7. **GW-Jobs** (2): Create, List
8. **GW-Candidates** (6): List, Stats, Search, By Job, By ID, Bulk
9. **GW-Analytics** (2): Schema, Export
10. **GW-Matching** (2): Top Matches, Batch
11. **GW-Assessment** (6): Submit/Get Feedback, List/Schedule Interviews, Create/List Offers
12. **GW-Client** (2): Register, Login
13. **GW-Security** (12): Rate Limit, Blocked IPs, Input Validation, Email/Phone Validation, Headers, Pentest
14. **GW-CSP** (4): Report, Violations, Policies, Test Policy
15. **GW-2FA** (8): Setup, Verify, Login, Status, Disable, Backup Codes, Test Token, QR Code
16. **GW-Password** (6): Validate, Generate, Policy, Change, Strength, Tips
17. **GW-Candidate Portal** (5): Register, Login, Update Profile, Apply, Applications

### AI Agent API (6 endpoints)
1. **Agent-Core** (3): Root, Health, Test DB
2. **Agent-Matching** (3): Match, Batch Match, Analyze

### LangGraph API (25 endpoints)
1. **LangGraph-Core** (2): Root, Health
2. **LangGraph-Workflows** (5): Start, Status, Resume, List, Stats
3. **LangGraph-Notifications** (9): Send, Email, WhatsApp, Telegram, WA Buttons, Auto Sequence, Trigger WF, Bulk, WH WhatsApp
4. **LangGraph-RL** (8): Predict, Feedback, Analytics, Performance, History, Retrain, Perf All, Monitor
5. **LangGraph-Test** (1): Integration

## Import Instructions
1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json`
4. Collection will appear in sidebar with 23 folders
5. All 111 endpoints will be organized and ready to use

## Environment Variables
The collection includes these pre-configured variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `gw` | https://bhiv-hr-gateway-ltg0.onrender.com | Gateway URL |
| `ag` | https://bhiv-hr-agent-nhgg.onrender.com | Agent URL |
| `lg` | https://bhiv-hr-langgraph.onrender.com | LangGraph URL |
| `api_key` | YOUR_API_KEY | Replace with actual API key |

**To use local environment**: Edit variables and change URLs to:
- `gw`: http://localhost:8000
- `ag`: http://localhost:9000
- `lg`: http://localhost:9001

## Authentication Methods

### 1. API Key (Primary)
```
Authorization: Bearer {{api_key}}
```
Used for most endpoints.

### 2. Client JWT
```
Authorization: Bearer {{client_jwt}}
```
Get token from `/v1/client/login` endpoint.

### 3. Candidate JWT
```
Authorization: Bearer {{candidate_jwt}}
```
Get token from `/v1/candidate/login` endpoint.

## Quick Start

### Test System Health
1. Run `Gateway - Core API > Health Check`
2. Expected: `{"status": "healthy"}`

### Create Job
1. Run `Gateway - Jobs > Create Job`
2. Note the `job_id` from response

### List Candidates
1. Run `Gateway - Candidates > List Candidates`
2. View all candidates with pagination

### AI Matching
1. Run `Gateway - AI Matching > Get Top Matches`
2. Replace `{job_id}` with actual job ID
3. View AI-ranked candidates

## Endpoint Categories

### Gateway (80)
**Authentication & Security** (30): Auth (4), 2FA (8), Password (6), Security (12)
**Core Operations** (23): Monitor (3), Core (5), Jobs (2), Candidates (6), Analytics (2), Matching (2), Assessment (6)
**Portals** (9): Client (2), Candidate Portal (5), CSP (4)
**Integrations** (18): AI (2), Workflows (7), RL (4)

### Agent (6)
**Service Management** (3): Core endpoints
**AI Matching** (3): Match, Batch, Analyze

### LangGraph (25)
**Orchestration** (7): Core (2), Workflows (5)
**Communication** (9): Multi-channel notifications
**ML/RL** (8): Reinforcement learning
**Testing** (1): Integration test

## Common Use Cases

### 1. Complete Hiring Flow
```
1. POST /v1/jobs - Create job
2. POST /v1/candidates/bulk - Import candidates
3. GET /v1/match/{job_id}/top - Get AI matches
4. POST /v1/interviews - Schedule interview
5. POST /v1/feedback - Submit feedback
6. POST /v1/offers - Extend offer
```

### 2. Client Portal Flow
```
1. POST /v1/client/register - Register company
2. POST /v1/client/login - Get JWT token
3. POST /v1/jobs - Create job posting
4. GET /v1/match/{job_id}/top - View matches
```

### 3. Candidate Portal Flow
```
1. POST /v1/candidate/register - Register account
2. POST /v1/candidate/login - Get JWT token
3. GET /v1/jobs - Browse jobs
4. POST /v1/candidate/apply - Apply for job
5. GET /v1/candidate/applications/{id} - Track status
```

### 4. AI Workflow Automation
```
1. POST /api/v1/webhooks/candidate-applied - Trigger workflow
2. GET /api/v1/workflow/status/{id} - Monitor progress
3. POST /tools/send-notification - Send notifications
```

## Testing Endpoints

### Security Testing
- Run all endpoints in `Gateway - Security` folder
- Tests XSS, SQL injection, input validation

### Performance Testing
- Use Postman Runner for load testing
- Set iterations: 100+
- Monitor response times

### Integration Testing
- Run `LangGraph - Integration > Test Integration`
- Validates all services connected

## Rate Limits
- Default: 60 requests/minute
- Premium: 300 requests/minute
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Error Handling
All endpoints return standard format:
```json
{
  "status": "error",
  "error": "Error message",
  "detail": "Detailed description",
  "timestamp": "2024-12-09T13:37:00Z"
}
```

## Verification

After import, verify the collection:
```bash
# Count folders (should be 23)
Gateway: 17 folders
Agent: 2 folders
LangGraph: 5 folders

# Count endpoints (should be 111)
Gateway: 80 endpoints
Agent: 6 endpoints
LangGraph: 25 endpoints
```

## Support
- **API Documentation**: https://bhiv-hr-gateway-ltg0.onrender.com/docs
- **GitHub**: https://github.com/Shashank-0208/BHIV-HR-PLATFORM
- **Issues**: Create GitHub issue with `[API]` tag

## Version History
- **v3.0.0** (2024-12-09): Complete 111 endpoints, RL integration, 23 organized folders
- **v2.0.0** (2024-11-15): LangGraph workflows added
- **v1.0.0** (2024-10-01): Initial release
