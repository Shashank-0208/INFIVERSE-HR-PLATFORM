# HR Platform Handover — Complete Implementation Guide
**Duration:** 1 Day (Hard Stop)  
**Objective:** Complete system handover for BHIV HR Platform with all documentation, APIs, and operational guides

---

## PHASE 1: MORNING (First Half) — SYSTEM EXTRACTION & STRUCTURE DOCUMENTATION
*Expected Completion: 4-6 hours*

### STEP 1: Create Architecture Blueprint
**Deliverable:** `handover/architecture/ARCHITECTURE.md`

#### Prompt:
```
Generate a comprehensive system architecture document for an HR Platform with:
- Backend services (FastAPI/Node.js)
- AI/RL brain decision engine
- Automation layer
- Communication agents (WhatsApp/Email/SMS)
- Dashboard frontend
- Database schema
- Microservice boundaries
- Event-driven triggers

Format:
1. System Overview (ASCII diagram)
2. Core Modules (list with descriptions)
3. Service Dependencies (which calls what)
4. Workflow Pipelines (candidate flow, feedback flow, automation flow)
5. Event Triggers (when things happen, what triggers)

Make it enterprise-ready and self-sufficient.
```

#### Expected Output Structure:
```markdown
# BHIV HR Platform — System Architecture

## 1. System Overview
[ASCII Diagram showing all services]
- HR Platform Core
- AI/RL Brain
- Automation Engine
- Communication Layer
- Dashboard
- Database

## 2. Core Modules
### Candidate Management Module
- Purpose: Handle candidate CRUD
- Files: candidates.py, candidate_service.py
- Endpoints: [list]
- Database: candidates table

### AI/RL Brain Module
- Purpose: Decision-making engine
- Logic: Reinforcement learning-based candidate ranking
- Dependencies: Candidate data, feedback signals

[Continue for all modules...]

## 3. Internal Dependencies
Candidate Module → AI Brain → Automation Engine → Communication Agents
                 ↓
                Dashboard (read-only from core)

## 4. Event Triggers
- Candidate added → AI decides rank
- Feedback received → RL model updates
- Automation trigger → Send communication

## 5. Microservice Boundaries
[Clear separation of concerns]
```

---

### STEP 2: API Contract Documentation
**Deliverable:** `handover/api_contract/api_contract_complete.md`

#### Prompt:
```
Create an enterprise API contract document for HR Platform covering:

For EACH endpoint:
- URL path
- HTTP method
- Request payload (with types)
- Response payload (with types)
- Status codes
- Sample input (real example)
- Sample output (real example)
- Error responses (common failures)
- When/why it's called
- Which file implements it

Endpoint Categories:
1. Candidate Management (GET, POST, PATCH, DELETE)
2. Triggers & Automations
3. Feedback Collection
4. AI Brain APIs
5. Notification Hooks
6. Dashboard APIs

Format: Markdown with code blocks for JSON payloads
Style: Match Stripe API documentation (gold standard)
```

#### Expected Output Structure:
```markdown
# API Contract — BHIV HR Platform

## Authentication
- Bearer Token required in Authorization header
- All requests must include API key

## Response Format (Standard)
```json
{
  "status": "success|error",
  "data": {},
  "error": null,
  "timestamp": "ISO8601"
}
```

## Candidate Management APIs

### 1. GET /api/candidates
**Purpose:** Fetch all candidates with pagination and filters

**Request:**
```json
GET /api/candidates?page=1&limit=20&status=active
Headers:
  Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "candidates": [
      {
        "id": "cand_123",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "active",
        "ai_rank": 85,
        "created_at": "2025-12-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

**Error Responses:**
- 401 Unauthorized: Invalid token
- 500 Server Error: Database connection failed

**When Called:**
- Dashboard loads candidate list
- UI needs to display all candidates

**Implemented In:** `routes/candidates.py` → `CandidateService.get_all()`

### 2. POST /api/candidates
**Purpose:** Add new candidate and trigger AI ranking

**Request:**
```json
POST /api/candidates
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "position": "Software Engineer",
  "resume_url": "https://...",
  "skills": ["Python", "FastAPI", "Docker"]
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "cand_456",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "pending_ai_review",
    "ai_rank": null,
    "created_at": "2025-12-09T13:37:00Z"
  }
}
```

**Sequence:**
1. Validate input
2. Create candidate record
3. Emit event: candidate.created
4. AI Brain picks up event → calculates rank
5. Automation layer sends confirmation email

**Error Responses:**
- 400 Bad Request: Missing required fields
- 409 Conflict: Duplicate email
- 422 Unprocessable Entity: Invalid email format

**Implemented In:** `routes/candidates.py` → `CandidateService.create()`

[Continue for all endpoints: PATCH, DELETE, Feedback, Automations, AI Brain, Notifications...]

## AI/RL Brain APIs

### GET /api/ai/decision
**Purpose:** Get AI decision for candidate
**When Called:** After candidate added, or manual request
**Implementation:** `routes/ai_brain.py`

### POST /api/feedback
**Purpose:** Submit feedback to update RL model
**When Called:** After hiring decision made
**Implementation:** `routes/feedback.py`

## Automation APIs

### POST /api/automation/trigger
**Purpose:** Manually trigger automation
**When Called:** Admin action or scheduled
**Implementation:** `routes/automation.py`

## Notification Hooks

### POST /api/webhooks/whatsapp
### POST /api/webhooks/email
### POST /api/webhooks/sms
**Purpose:** Receive delivery confirmations
**When Called:** Communication service calls back
**Implementation:** `routes/webhooks.py`

## Dashboard APIs

### GET /api/dashboard/stats
**Purpose:** Fetch dashboard KPIs
**When Called:** Dashboard page load
**Implementation:** `routes/dashboard.py`

---

## Summary Table

| Endpoint | Method | Purpose | File |
|----------|--------|---------|------|
| /api/candidates | GET | List all candidates | candidates.py |
| /api/candidates | POST | Add new candidate | candidates.py |
| /api/candidates/{id} | GET | Get single candidate | candidates.py |
| /api/candidates/{id} | PATCH | Update candidate | candidates.py |
| /api/candidates/{id} | DELETE | Remove candidate | candidates.py |
| /api/ai/decision | GET | Get AI ranking | ai_brain.py |
| /api/feedback | POST | Submit feedback | feedback.py |
| /api/automation/trigger | POST | Trigger automation | automation.py |
| /api/dashboard/stats | GET | Get stats | dashboard.py |
| /api/webhooks/whatsapp | POST | WhatsApp callback | webhooks.py |
```

---

### STEP 3: Data Model Documentation
**Deliverable:** `handover/api_contract/DATA_MODELS.md`

#### Prompt:
```
Document all data models for the HR Platform:

For EACH model:
- JSON schema
- Field descriptions
- Data types
- Validation rules
- Constraints
- Example valid record
- Edge cases
- What breaks if schema changes

Models to cover:
1. Candidate
2. Feedback
3. AutomationTrigger
4. CommunicationLog
5. AIDecision
6. User
7. Dashboard Config
```

#### Expected Output Structure:
```markdown
# Data Models — BHIV HR Platform

## 1. Candidate Model

**Schema:**
```json
{
  "id": "string (uuid, auto-generated)",
  "name": "string (1-255 chars)",
  "email": "string (valid email format)",
  "phone": "string (E.164 format, optional)",
  "position": "string (enum: SDE, PM, Designer, etc.)",
  "status": "string (enum: pending, active, rejected, hired)",
  "ai_rank": "integer (0-100, null if not yet evaluated)",
  "skills": "array of strings",
  "resume_url": "string (https URL)",
  "created_at": "ISO8601 timestamp",
  "updated_at": "ISO8601 timestamp",
  "deleted_at": "ISO8601 timestamp (soft delete)"
}
```

**Field Descriptions:**
- `id`: Unique identifier, auto-generated on creation
- `name`: Full name, required, 1-255 characters
- `email`: Unique email, required, must be valid format
- `phone`: Optional, E.164 format (+1234567890)
- `position`: Job position applied for, must exist in enum
- `status`: Current state in pipeline
- `ai_rank`: AI engine score, null until first evaluation
- `skills`: Array of technical/soft skills
- `resume_url`: Link to uploaded resume/CV
- `created_at`: Record creation timestamp (server-set)
- `updated_at`: Last modification timestamp
- `deleted_at`: For soft deletes, null if not deleted

**Validation Rules:**
```
- name: non-empty, max 255 chars
- email: valid email regex, unique in database
- phone: null OR matches E.164 format
- position: value must exist in JobPosition enum
- status: value must exist in CandidateStatus enum
- ai_rank: null OR integer between 0-100
- skills: array of max 20 items, each max 50 chars
- resume_url: valid HTTPS URL
- created_at: immutable after creation
- updated_at: automatically set to current time on any change
```

**Constraints:**
```sql
PRIMARY KEY: id
UNIQUE: email
NOT NULL: name, email, position, status, created_at
CHECK: ai_rank >= 0 AND ai_rank <= 100 OR ai_rank IS NULL
CHECK: status IN ('pending', 'active', 'rejected', 'hired')
INDEX: email (for fast lookups)
INDEX: status (for filtering)
INDEX: created_at (for sorting)
FOREIGN KEY: position_id → JobPositions table
```

**Example Valid Record:**
```json
{
  "id": "cand_f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-0101",
  "position": "SDE",
  "status": "active",
  "ai_rank": 87,
  "skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
  "resume_url": "https://cdn.example.com/resumes/alice_johnson.pdf",
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-08T15:30:00Z",
  "deleted_at": null
}
```

**Edge Cases:**
1. Candidate added but AI hasn't ranked yet → ai_rank is null, handle gracefully in UI
2. Duplicate email in import → validation error, rollback transaction
3. Position type changes globally → existing candidates with old position type need migration
4. Resume URL expires → need refresh logic
5. Candidate deleted but referenced in feedback → use soft delete, maintain referential integrity

**What Breaks If Schema Changes:**
- Adding required field without default → existing records fail validation
- Removing field → any code querying that field crashes
- Changing ai_rank type to string → all comparisons (ai_rank > 50) fail
- Email uniqueness removed → bulk update logic breaks
- Changing status enum → validation logic needs update

---

## 2. Feedback Model

**Schema:**
```json
{
  "id": "string (uuid)",
  "candidate_id": "string (uuid, foreign key)",
  "hired": "boolean",
  "rating": "integer (1-5)",
  "notes": "string (optional)",
  "feedback_date": "ISO8601",
  "created_at": "ISO8601"
}
```

**Validation Rules:**
```
- candidate_id: must reference existing Candidate
- hired: true OR false (required)
- rating: integer 1-5 (required)
- notes: max 500 chars (optional)
```

[Continue for all models...]
```

---

### STEP 4: Integration Maps
**Deliverable:** `handover/integration_maps/INTEGRATION_MAPS.md`

#### Prompt:
```
Create 3 detailed integration maps with Mermaid diagrams and explanations:

Map 1: HR Platform → AI Brain
- How candidate data flows in
- How AI ranks candidates
- Feedback loop back

Map 2: Automation Layer → Communication Agents
- How automation triggers fire
- How messages get sent (WhatsApp, Email, SMS)
- Delivery tracking

Map 3: Dashboard → Backend
- Dashboard calls API
- Real-time updates
- Error handling

For each map, include:
- Mermaid sequence diagram
- Data flow explanation
- Failure points & recovery
- Latency expectations
```

#### Expected Output Structure:
```markdown
# Integration Maps — BHIV HR Platform

## Map 1: HR Platform → AI Brain Data Flow

### Sequence Diagram
```mermaid
sequenceDiagram
    participant Dashboard as Dashboard (Nikhil)
    participant Backend as Backend API
    participant CandidateService as Candidate Service
    participant Queue as Event Queue (Redis/RabbitMQ)
    participant AIBrain as AI/RL Brain
    participant DB as Database

    Dashboard->>Backend: POST /api/candidates
    activate Backend
    Backend->>CandidateService: create_candidate()
    activate CandidateService
    
    CandidateService->>DB: INSERT candidate record
    activate DB
    DB-->>CandidateService: candidate_id
    deactivate DB
    
    CandidateService->>Queue: emit('candidate.created', {id, data})
    CandidateService-->>Backend: 201 Created
    deactivate CandidateService
    
    Backend-->>Dashboard: {id, status: pending}
    deactivate Backend
    
    Queue-->>AIBrain: picked up event
    activate AIBrain
    AIBrain->>AIBrain: process candidate (ranking, scoring)
    AIBrain->>DB: UPDATE candidate SET ai_rank=87
    AIBrain->>Queue: emit('candidate.ranked')
    deactivate AIBrain
    
    Queue-->>Dashboard: WebSocket push new rank
    Dashboard->>Dashboard: refresh candidate card
```

### Data Flow Explanation
1. **Initiation:** Dashboard sends new candidate via POST /api/candidates
2. **Creation:** Backend validates and creates candidate record (status=pending)
3. **Event Emission:** Candidate service emits `candidate.created` event to message queue
4. **AI Processing:** AI Brain consumer picks up event from queue (async)
5. **Ranking:** AI/RL model processes candidate data, outputs rank (0-100)
6. **Database Update:** Rank stored back in database
7. **Real-time Notification:** Dashboard notified via WebSocket, UI updates immediately

### Failure Points & Recovery

**Failure: POST /api/candidates fails (validation error)**
- **Detection:** 400 Bad Request returned
- **Recovery:** Dashboard shows error toast, user corrects input and retries

**Failure: Event not picked up by AI Brain**
- **Detection:** Candidate rank not updated after 5 minutes
- **Recovery:** Manual trigger button in UI, or admin runs: `python scripts/reprocess_candidates.py`

**Failure: Database UPDATE ai_rank fails**
- **Detection:** AI Brain logs error, event goes to dead-letter queue
- **Recovery:** DBA checks database, clears DLQ, reprocesses events

**Failure: WebSocket connection drops**
- **Detection:** Dashboard loses real-time updates
- **Recovery:** Dashboard polls /api/candidates?updated_since=timestamp every 10s as fallback

### Latency Expectations
- Candidate creation: < 100ms
- Event in queue: < 10ms
- AI processing: 1-5 seconds (depends on model complexity)
- Database update: < 50ms
- WebSocket push: < 100ms
- **Total E2E:** ~2-6 seconds from submission to UI update (acceptable for ranking)

### Live Example
**Request:**
```bash
curl -X POST http://localhost:8000/api/candidates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com",
    "position": "SDE",
    "skills": ["Go", "Kubernetes"]
  }'
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "cand_789",
    "name": "Bob Smith",
    "status": "pending_ai_review",
    "ai_rank": null,
    "created_at": "2025-12-09T13:37:00Z"
  }
}
```

**After 3-5 seconds (AI finishes):**
- Database updated: `ai_rank = 92`
- Dashboard gets WebSocket: `{"type": "candidate.ranked", "id": "cand_789", "rank": 92}`
- UI refreshes candidate card to show rank

---

## Map 2: Automation Layer → Communication Agents

### Sequence Diagram
```mermaid
sequenceDiagram
    participant AutoEngine as Automation Engine
    participant Queue as Message Queue
    participant WhatsApp as WhatsApp Agent
    participant Email as Email Agent
    participant SMS as SMS Agent
    participant ExternalAPI as WhatsApp/Email/SMS APIs
    participant Webhooks as Webhook Receiver

    AutoEngine->>Queue: emit('send_message', {type: whatsapp, to, text})
    activate Queue
    
    WhatsApp-->>Queue: consume message
    activate WhatsApp
    WhatsApp->>WhatsApp: format message
    WhatsApp->>ExternalAPI: POST send WhatsApp message
    activate ExternalAPI
    ExternalAPI-->>WhatsApp: {message_id, status: queued}
    deactivate ExternalAPI
    
    WhatsApp->>Queue: emit('message.sent', {message_id})
    deactivate WhatsApp
    
    ExternalAPI-->>Webhooks: POST /api/webhooks/whatsapp {message_id, status: delivered}
    activate Webhooks
    Webhooks->>Webhooks: log delivery
    Webhooks-->>ExternalAPI: 200 OK
    deactivate Webhooks
```

### Agent Separation
- **WhatsApp Agent:** Handles WhatsApp Business API integration, rate limiting, template management
- **Email Agent:** SMTP/SendGrid integration, HTML rendering, bounce handling
- **SMS Agent:** Twilio integration, character limit handling, delivery reports

### Failure Handling
- **Message queue full:** AutoEngine waits with exponential backoff
- **External API timeout:** Retry with jitter, max 3 attempts
- **Webhook delivery failure:** Store in database, manual retry from admin UI

### Configuration
Each agent reads from env variables:
```bash
WHATSAPP_API_KEY=***
WHATSAPP_PHONE_ID=***
EMAIL_SMTP_HOST=smtp.gmail.com
SMS_TWILIO_SID=***
```

---

## Map 3: Dashboard → Backend (Ishan & Nikhil)

### Architecture
```
Dashboard (React)
    ↓
API Gateway (rate limiting, auth)
    ↓
FastAPI Backend
    ↓
Services (Candidate, AI, Feedback, etc.)
    ↓
Database
```

### Key Endpoints for Dashboard
1. `GET /api/candidates` — List view with pagination
2. `GET /api/candidates/{id}` — Detail view
3. `POST /api/feedback` — Submit rating after hiring decision
4. `GET /api/dashboard/stats` — KPIs (hired%, rejection%, avg_rank)
5. `WebSocket /ws/candidates` — Real-time updates

### Error Handling in Dashboard
```javascript
// Example: Retry on 500
async function fetchCandidates() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await fetch('/api/candidates');
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(2 ** attempt * 1000); // Exponential backoff
    }
  }
}
```

---

## Summary: Who Talks to Whom

| From | To | Protocol | Purpose |
|------|----|-----------| --------|
| Dashboard | Backend API | HTTP/REST | CRUD operations |
| Backend | AI Brain | Event Queue | Candidate ranking |
| AI Brain | Database | Direct | Write ranks |
| Backend | Communication Agents | Message Queue | Send messages |
| Communication Agents | External APIs | HTTP/API | Deliver messages |
| External APIs | Backend Webhooks | HTTP POST | Delivery status |
| Dashboard | Backend | WebSocket | Real-time updates |
```

---

### STEP 5: Known Issues & Limitations
**Deliverable:** `handover/issues/ISSUES_AND_LIMITATIONS.md`

#### Prompt:
```
Document all known issues, bugs, and limitations:

For EACH issue:
- Bug ID (BUG-001, etc.)
- Title
- Severity (Critical, High, Medium, Low)
- Current Status (Active, Workaround, Blocked)
- Description
- Root Cause
- Affected Components
- Workaround (if any)
- Fix (planned or in progress)
- Who reported it
- Next Steps

Also list:
- Deprecated code (with migration path)
- Code that MUST NOT be changed
- Incomplete functions
- Performance bottlenecks
- Security concerns
```

#### Expected Output Structure:
```markdown
# Known Issues & Limitations — BHIV HR Platform

## Critical Issues

### BUG-001: AI Brain Returns Null on Empty Skills Array
**Severity:** Critical  
**Status:** Active (Workaround available)  
**Reported By:** Shashank (2025-12-05)  
**Reported Date:** 2025-12-05

**Description:**
When a candidate is added with an empty skills array, the AI Brain raises a NullPointerException during ranking, causing the entire ranking process to fail.

**Root Cause:**
In `ai_brain.py`, the `calculate_rank()` function assumes skills array has at least 1 item. No null/empty check exists.

```python
# BROKEN CODE in ai_brain.py:45-50
def calculate_rank(candidate):
    skills = candidate['skills']  # Can be []
    skill_vectors = [skill_embedding(s) for s in skills]  # IndexError if empty
    return compute_score(skill_vectors)
```

**Affected Components:**
- POST /api/candidates (returns 500 error)
- Dashboard candidate creation flow (crashes)
- Automation layer (can't trigger for this candidate)

**Workaround:**
1. Always provide at least 1 skill in POST /api/candidates
2. Validate on frontend before sending

**Permanent Fix (In Progress):**
Update `calculate_rank()` to handle empty skills:
```python
def calculate_rank(candidate):
    skills = candidate.get('skills', [])
    if not skills:
        return {'rank': 0, 'confidence': 0.1, 'reason': 'No skills provided'}
    skill_vectors = [skill_embedding(s) for s in skills]
    return compute_score(skill_vectors)
```

**Next Steps:**
1. Ishan: Test with 50 candidates with empty skills
2. Merge fix to main branch
3. Update API contract to document this
4. Deploy to staging

**Estimated Fix Time:** 2 hours

---

### BUG-002: WhatsApp Agent Rate Limiting Not Implemented
**Severity:** Critical  
**Status:** Blocked (Waiting for Twilio upgrade)

**Description:**
WhatsApp API allows max 100 messages/hour. System sends without queuing, causing API rejections after threshold.

**Affected:** Bulk messaging, automated notifications

**Workaround:**
Manually space out messages in UI, or contact support for higher tier

---

### BUG-003: Database Connection Pool Leaks on Long-Running Queries
**Severity:** High  
**Status:** Active (Partial workaround)

**Description:**
After 8+ hours of continuous operation, database connections aren't properly released, eventually blocking new queries.

**Root Cause:**
In `database.py`, SQLAlchemy session not closed in some error paths.

**Affected:** Long-running processes, batch jobs

**Workaround:**
Restart backend every 6 hours using cron: `0 */6 * * * /scripts/restart_backend.sh`

**Permanent Fix:**
Use context managers for all database sessions:
```python
# BEFORE (leaks connection)
session = get_session()
result = session.query(Candidate).all()
# session never closed if exception occurs

# AFTER (guaranteed cleanup)
with get_session() as session:
    result = session.query(Candidate).all()
    # Always closed, even on exception
```

---

## High Priority Issues

### BUG-004: Feedback Processing Slow (2+ seconds per feedback)
**Severity:** High  
**Status:** Active (Performance optimization needed)

**Description:**
Submitting feedback takes 2-5 seconds, blocking UI

**Root Cause:**
`POST /api/feedback` synchronously:
1. Validates input (10ms)
2. Updates candidate record (50ms)
3. Retrains AI model (2000-4000ms) ← BOTTLENECK
4. Updates dashboard cache (100ms)

**Solution:** Move AI retraining to background job

**Affected:** Users submitting feedback, dashboard responsiveness

**Next Steps:**
Move step 3 to async queue, return 202 Accepted immediately

---

## Low Priority Issues

### BUG-005: Dashboard Shows Stale Data After Bulk Updates
**Severity:** Low  
**Status:** Design change planned

**Description:**
When admin bulk-updates candidates, dashboard may show outdated info for 5-10 seconds

**Root Cause:**
Cache TTL set to 10 seconds, bulk update doesn't invalidate

**Workaround:**
Manually refresh page (F5)

---

## Deprecated Code (DO NOT USE)

### Module: `old_ranking_engine.py` (DEPRECATED)
- **Reason:** Replaced by new AI/RL brain
- **Last Used:** 2025-11-15
- **Removal Date:** 2025-12-31
- **Migration Path:** All imports changed to `ai_brain.py`
- **Action:** Remove from codebase after 2025-12-31

### Function: `candidates.get_old_format()` (DEPRECATED)
- **Reason:** Returns old JSON schema, new schema in place
- **Migration:** Use `get()` instead
- **Last Used:** v1.2.3
- **Status:** Returns error in v2.0+

---

## Code That MUST NOT Be Changed

### File: `database.py` — Database Connection Manager
**Why:** Core to entire system, changes can crash everything  
**Last Modified:** 2025-10-12  
**Critical Points:**
- Connection pool size: Don't change without load testing
- Retry logic: Carefully tested, fragile
- Timeout values: Tuned for production

**If you MUST change:**
1. Get approval from Shashank
2. Test thoroughly on staging (24 hours minimum)
3. Have rollback plan ready

### File: `ai_brain.py` — Core ML Model
**Why:** Production model, any bug loses predictions  
**Protection:**
- Versioned model files (don't overwrite)
- All changes require ML expert review
- Rollback procedure documented

### API Endpoints (Stable)
- `POST /api/candidates` — Don't change request schema
- `GET /api/candidates/{id}` — Don't change response schema
- `POST /api/feedback` — Don't remove any fields

**Why:** External integrations (Ishan's RL system) depend on exact format

---

## Incomplete Functions

### Function: `automation_engine.py:auto_send_email_template()`
**Status:** 70% complete  
**Missing:**
- HTML email rendering
- Attachment support
- A/B testing fields

**What works:** Basic text emails only

**Usage:** Don't use for complex email campaigns yet

**ETA for Completion:** 2025-12-20

---

## Performance Bottlenecks (To Be Fixed)

1. **AI Brain ranking** — 2-4s per candidate (use batching)
2. **Dashboard stats query** — Scans all feedback records (add index)
3. **Bulk imports** — No parallelization (implement batch processing)

---

## Security Concerns

### Missing: API Rate Limiting
- Currently no rate limit on `/api/candidates`
- Risk: DDoS, brute force
- Fix: Add `python-ratelimit` middleware
- Timeline: Before production release

### Missing: Input Validation on File Uploads
- Resume URLs not validated for malware
- Risk: Malicious file execution
- Fix: Add file scanning service (ClamAV)

---

## Summary: Action Items for Team

| Issue | Severity | Owner | Deadline |
|-------|----------|-------|----------|
| BUG-001: AI null on empty skills | Critical | Ishan | 2025-12-10 |
| BUG-002: WhatsApp rate limiting | Critical | Nikhil | Blocked |
| BUG-003: DB connection leak | High | Shashank | 2025-12-12 |
| BUG-004: Feedback slow | High | Ishan | 2025-12-15 |
| Add rate limiting | Security | Team | 2025-12-20 |
```

---

**END OF PHASE 1 DELIVERABLES**

Folder structure at end of Phase 1:
```
handover/
├── architecture/
│   ├── ARCHITECTURE.md
│   └── [Mermaid diagrams]
├── api_contract/
│   ├── api_contract_complete.md
│   └── DATA_MODELS.md
├── integration_maps/
│   └── INTEGRATION_MAPS.md
└── issues/
    └── ISSUES_AND_LIMITATIONS.md
```

---

## PHASE 2: AFTERNOON (Second Half) — HANDOVER PACK COMPLETION & TESTING
*Expected Completion: 3-4 hours*

### STEP 6: FAQ Operations Sheet
**Deliverable:** `handover/FAQ_OPERATIONS.md`

#### Prompt:
```
Create a practical troubleshooting FAQ for operations team (Ishan, Vinayak).

Format: "If X happens, do Y"

Cover:
- Candidate list fails to load
- AI brain returns null/error
- WhatsApp message not sent
- Email bounces
- Dashboard shows old data
- Bulk import fails
- System won't start
- Database is down
- Performance is slow
- Memory usage high
- All tests fail
- Deployment failed
- Emergency: rollback

For each FAQ:
- Problem symptom
- Root cause (likely)
- Diagnostic steps
- Solution steps
- Prevention tips
- Escalation (when to call Shashank)
```

#### Expected Output Structure:
```markdown
# FAQ & Troubleshooting — Operations Guide

## Candidate Management Issues

### Q1: "Candidate list fails to load in dashboard"
**Symptoms:**
- Dashboard shows blank page or spinner forever
- Network tab shows `/api/candidates` returning 500 or timing out
- Logs show "Connection refused" or "Timeout after 30s"

**Root Causes:**
1. Backend service is down
2. Database connection lost
3. API rate limiting (too many requests)
4. Query too slow (missing indexes)

**Diagnostic Steps:**
```bash
# Step 1: Check if backend is running
curl http://localhost:8000/health
# If 503 or no response → backend is down

# Step 2: Check database connection
psql -h localhost -U hr_user -d hr_platform -c "SELECT 1"
# If fails → database unreachable

# Step 3: Check query performance
psql -h localhost -U hr_user -d hr_platform \
  -c "EXPLAIN ANALYZE SELECT * FROM candidates WHERE status='active'"
# If > 5s → add index

# Step 4: Check system resources
top -b -n 1 | head -20
free -m
df -h
# If CPU >90% or Memory >85% → resource shortage
```

**Solution Steps:**
```bash
# If backend down:
cd /path/to/hr-platform
docker restart hr-backend
sleep 5
curl http://localhost:8000/health  # Verify

# If database down:
docker-compose -f docker-compose.prod.yml restart postgres
psql -h localhost -U hr_user -d hr_platform -c "SELECT 1"

# If missing indexes:
psql -h localhost -U hr_user -d hr_platform \
  -f scripts/create_indexes.sql

# If rate limited:
Check env var: RATE_LIMIT_ENABLED
If true, increase: RATE_LIMIT_PER_MINUTE=1000

# If slow query, restart with cache clear:
/scripts/restart_backend.sh --clear-cache
```

**Prevention:**
- Monitor `/health` endpoint every 1 minute (add to monitoring)
- Run `VACUUM ANALYZE` on database every night
- Keep database indexes updated
- Monitor API response times (SLA: <500ms for list endpoint)

**When to Escalate:**
- If issue persists after all steps → contact Shashank
- If database won't restart → call DBA
- If permanent data loss suspected → immediate escalation

---

### Q2: "AI brain returns null or error when ranking candidate"
**Symptoms:**
- POST /api/candidates succeeds but ai_rank stays null after 5+ minutes
- Logs show: "NullPointerException in calculate_rank()"
- No entry in candidate_rankings table

**Root Causes:**
1. Empty skills array (BUG-001 — known issue)
2. AI Brain service crashed
3. Message queue not working
4. Model file corrupted

**Diagnostic Steps:**
```bash
# Check if AI Brain consumer is running
docker logs ai-brain-consumer | tail -20

# Check message queue backlog
docker exec redis redis-cli LLEN candidate.created
# If > 100 → backlog building up

# Check AI model file exists and is valid
ls -la /models/
file /models/ranking_model_v2.pkl
# Should show non-zero size

# Check last AI processing timestamp
psql -c "SELECT id, created_at, updated_at FROM candidates 
         WHERE ai_rank IS NOT NULL ORDER BY updated_at DESC LIMIT 1"
# Compare with current time
```

**Solution Steps:**
```bash
# If AI Brain crashed:
docker restart ai-brain-consumer
docker logs ai-brain-consumer --follow  # Watch startup

# If message queue backlogged:
# Manually trigger reprocessing:
python scripts/reprocess_candidates.py --status=pending_ai_review

# If model file corrupted:
# Restore from backup:
cp /backups/models/ranking_model_v2.pkl.backup /models/ranking_model_v2.pkl
docker restart ai-brain-consumer

# If candidate has empty skills (BUG-001):
# Workaround: Add a default skill
UPDATE candidates SET skills = ['General'] WHERE skills = '[]' AND ai_rank IS NULL;
# Then reprocess:
python scripts/reprocess_candidates.py --id=cand_123
```

**Prevention:**
- Add validation: require >= 1 skill before candidate creation
- Monitor AI Brain consumer continuously
- Weekly backup of model files
- Log all model inference errors

---

### Q3: "WhatsApp message not sent to candidate"
**Symptoms:**
- Dashboard shows message status as "pending" or "failed"
- Candidate didn't receive message
- Logs show: "WhatsApp API returned 400" or timeout

**Root Causes:**
1. WhatsApp Agent service down
2. Rate limit hit (100 msgs/hour per account) — see BUG-002
3. Invalid phone number format
4. WhatsApp API credentials expired/invalid
5. Message template not approved

**Diagnostic Steps:**
```bash
# Check WhatsApp Agent logs
docker logs whatsapp-agent | grep -i error | tail -20

# Check WhatsApp API connectivity
curl -X GET "https://graph.instagram.com/v18.0/me/conversations" \
  -H "Authorization: Bearer $WHATSAPP_API_TOKEN"
# Should return conversation list, not auth error

# Check rate limit status
psql -c "SELECT COUNT(*) FROM communication_logs 
         WHERE created_at > NOW() - INTERVAL '1 hour' 
         AND service='whatsapp' AND status='sent'"
# If > 95 → near limit

# Check phone number format
psql -c "SELECT phone FROM candidates WHERE id='cand_123'"
# Should be E.164 format: +1234567890, no spaces/dashes

# Check message template status
# WhatsApp Business account → Message Templates → Find template
# Status should be "APPROVED", not "PENDING_REVIEW" or "REJECTED"
```

**Solution Steps:**
```bash
# If Agent service down:
docker restart whatsapp-agent
sleep 3
curl http://localhost:8001/health

# If rate limited (BUG-002):
# Workaround: stagger sends
python scripts/send_whatsapp_delayed.py --batch_size=10 --delay=30
# Sends 10 msgs, waits 30s, repeats

# If invalid phone number:
# Fix in database
UPDATE candidates SET phone='+1-555-0101' 
WHERE id='cand_123' AND phone='5550101'

# If API credentials expired:
# Update in environment:
export WHATSAPP_API_TOKEN="new_token_from_dashboard"
docker restart whatsapp-agent

# If message template not approved:
# Go to Meta Business Suite → Message Templates
# Click template, verify it's APPROVED
# If still pending, request acceleration or use generic template
```

**Prevention:**
- Validate phone numbers on form submission (regex check)
- Monitor WhatsApp API quota
- Set up alerts when rate limit hits 80%
- Test message templates in staging first

**When to Escalate:**
- WhatsApp account suspended → contact Meta support
- API quota permanently reduced → contact Shashank

---

### Q4: "Dashboard shows old/stale data"
**Symptoms:**
- Candidate rank updated but UI shows old rank
- New candidates not showing in list
- Feedback data delayed 5-10 minutes

**Root Cause:**
- Dashboard cache not invalidated
- WebSocket connection lost
- Frontend polling interval too high

**Solution:**
```bash
# Option 1: Manual refresh (client-side)
# User presses Ctrl+Shift+R (hard refresh)
# Or F5 → Chrome will reload assets

# Option 2: Clear server cache (backend)
docker exec hr-backend python -c "import redis; r=redis.Redis(); r.flushdb()"
# Then refresh page

# Option 3: Restart WebSocket (if using)
# Close DevTools, refresh page
# Or restart backend which resets all WebSocket connections
docker restart hr-backend

# Option 4: Check polling interval setting (if polling instead of WebSocket)
# Should be <= 5 seconds for candidate list
# Edit: /backend/config.py
# DASHBOARD_POLL_INTERVAL = 3  # seconds
```

---

### Q5: "Bulk import of candidates fails halfway through"
**Symptoms:**
- Uploading CSV with 500 candidates
- Process stops at row 150
- Error: "Internal server error" or "Service timeout"

**Root Causes:**
1. No transaction management (partial import on failure)
2. Timeout (request takes >300s)
3. Memory overflow (processing too many at once)
4. Database constraint violation (duplicate emails)

**Solution:**
```bash
# Use bulk import script with proper error handling:
python scripts/bulk_import_candidates.py \
  --file=candidates.csv \
  --batch_size=50 \
  --on_error=rollback  # Options: rollback, skip, halt

# This script:
# - Processes in batches of 50
# - Has proper transaction management
# - Logs errors per row
# - Reports success/failure count at end

# Check results:
tail -100 /logs/bulk_import.log

# If partial success (some rows imported, others failed):
# Fix CSV, rerun with flag:
python scripts/bulk_import_candidates.py \
  --file=candidates_fixed.csv \
  --skip_existing  # Skip if email already exists
```

---

## System & Infrastructure Issues

### Q6: "Backend service won't start / crashes immediately"
**Diagnostic:**
```bash
docker logs hr-backend --tail=50
# Look for:
# - Port already in use
# - Database connection error
# - Missing environment variable
# - Import error (broken code)
```

**Solution:**
```bash
# Free port if in use:
lsof -i :8000
kill -9 <PID>

# Restart:
docker restart hr-backend
docker logs hr-backend --follow

# If still fails, try from scratch:
cd /path/to/hr-platform
docker-compose down
docker-compose up -d

# Check health:
sleep 5
curl http://localhost:8000/health
```

### Q7: "All tests fail with 'Connection refused'"
**Solution:**
```bash
# Start test database:
docker-compose -f docker-compose.test.yml up -d

# Run tests with proper timeout:
pytest tests/ -v --timeout=30

# Or run specific test:
pytest tests/test_candidates.py::test_create_candidate -v
```

### Q8: "Deployment to production failed"
**Root Cause:** Usually environment mismatch  
**Solution:**
```bash
# 1. Check staging first
docker pull hr-platform:latest
docker run -e ENV=staging ... # Full test
# If staging works, production will

# 2. If production fails
docker images | grep hr-platform
docker pull hr-platform:latest  # Fresh pull
docker stack deploy -c docker-compose.prod.yml hr-system

# 3. Monitor rollout
docker service logs hr-system_backend
```

### Q9: "Memory usage climbing, system slowing down"
**Diagnostic:**
```bash
docker stats --no-stream
free -m
# If free memory < 500MB → issue

# Find memory leak:
docker exec hr-backend python -c "
import psutil
p = psutil.Process()
print(f'Memory: {p.memory_info().rss / 1024 / 1024:.2f} MB')
print('Top memory objects:', p.get_memory_maps()[:5])
"
```

**Solution:**
Restart backend with memory limit:
```bash
docker update --memory=2g hr-backend
docker restart hr-backend
```

---

## When to Escalate to Shashank

| Issue | When to Escalate |
|-------|-----------------|
| Unknown error in logs | Immediate (within 30 mins) |
| Multiple services down | Immediate |
| Data corruption suspected | Immediate |
| Network/infrastructure issue | After 15 mins of troubleshooting |
| Production outage > 5 mins | Immediate |
| All troubleshooting steps failed | After exhausting all steps |

**Contact Shashank:**
- Phone: [number]
- Email: [email]
- Slack: @shashank-mishra
- GitHub Issues: tag @shashank-mishra with [URGENT]

**Always provide:**
- Error logs (full stack trace)
- Steps you've already tried
- System metrics (CPU, memory, disk)
- Last successful state (when did it work last?)
```

---

### STEP 7: Debugging Playbook & Runbook
**Deliverable:** `handover/RUNBOOK.md`

#### Prompt:
```
Create an operational runbook covering:

1. System Startup Procedures
- Prerequisites (ports, disk space, secrets)
- Startup order (database → backend → workers → frontend)
- Health checks
- Verification steps

2. System Shutdown
- Graceful shutdown procedure
- Timeout handling
- Data consistency checks

3. Restart Procedures
- Full restart
- Partial restart (individual services)
- Rolling restart (zero-downtime)

4. Emergency Restart
- Force restart if hung
- Recovery from corrupted state
- Rollback procedure

5. Data Management
- Database backups (when, how, where)
- Restore procedures
- Point-in-time recovery
- Test restores

6. Log Management
- Log locations
- Log rotation
- Log cleanup
- Log analysis tools

7. Performance Optimization
- Caching strategies
- Database optimization (VACUUM, ANALYZE)
- Index management
- Query optimization

8. Monitoring & Alerting
- What to monitor
- Alert thresholds
- Dashboard setup
- Log aggregation

Include: exact commands, expected output, troubleshooting
```

#### Expected Output Structure:
```markdown
# System Runbook — Operations Manual

## 1. Prerequisites Before Startup

### System Requirements
- **CPU:** 4+ cores
- **RAM:** 8GB minimum (16GB recommended)
- **Disk:** 50GB free space (for data and logs)
- **OS:** Ubuntu 20.04 LTS or Docker Desktop

### Port Availability Check
```bash
# Check if required ports are free:
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis
lsof -i :8000  # FastAPI backend
lsof -i :3000  # Dashboard frontend

# If any are in use, kill them:
kill -9 <PID>  # Or restart the service using that port
```

### Environment Setup
```bash
# Set environment variables before startup
export ENVIRONMENT=production
export DATABASE_URL=postgresql://user:pass@localhost:5432/hr_platform
export REDIS_URL=redis://localhost:6379/0
export WHATSAPP_API_TOKEN=***
export AI_BRAIN_MODEL_PATH=/models/ranking_model_v2.pkl
export JWT_SECRET=***

# Or load from .env file:
set -a
source .env.production
set +a

# Verify:
echo $ENVIRONMENT
```

### Secrets Check
```bash
# Ensure all required secrets exist:
[ -z "$DATABASE_URL" ] && echo "ERROR: DATABASE_URL not set" && exit 1
[ -z "$JWT_SECRET" ] && echo "ERROR: JWT_SECRET not set" && exit 1

# Or use script:
bash scripts/verify_secrets.sh
```

---

## 2. Full System Startup

### Startup Order (Critical)
Database → Redis → Backend → AI Brain → Workers → Frontend

```bash
# Step 1: Start Database
docker-compose -f docker-compose.prod.yml up -d postgres
sleep 10  # Wait for database to be ready
echo "✓ Database started"

# Verify database is accepting connections:
psql -h localhost -U hr_user -d hr_platform -c "SELECT 1"
# Expected output: 1

# Step 2: Start Redis (message queue & cache)
docker-compose -f docker-compose.prod.yml up -d redis
sleep 3
echo "✓ Redis started"

# Verify:
docker exec redis redis-cli ping
# Expected output: PONG

# Step 3: Run Database Migrations
python -m alembic upgrade head
echo "✓ Database migrations complete"

# Step 4: Start FastAPI Backend
docker-compose -f docker-compose.prod.yml up -d hr-backend
sleep 5
echo "✓ Backend started"

# Health check (retry up to 10 times):
for i in {1..10}; do
  curl -s http://localhost:8000/health && echo "✓ Backend healthy" && break
  echo "Waiting for backend... ($i/10)"
  sleep 2
done

# Step 5: Start AI Brain Consumer (background job)
docker-compose -f docker-compose.prod.yml up -d ai-brain-consumer
sleep 3
echo "✓ AI Brain consumer started"

# Step 6: Start Communication Workers (WhatsApp, Email, SMS)
docker-compose -f docker-compose.prod.yml up -d whatsapp-agent
docker-compose -f docker-compose.prod.yml up -d email-agent
docker-compose -f docker-compose.prod.yml up -d sms-agent
sleep 3
echo "✓ Communication agents started"

# Step 7: Start Dashboard (React frontend)
docker-compose -f docker-compose.prod.yml up -d dashboard
sleep 5
echo "✓ Dashboard started"

# Final health check:
curl -s http://localhost:8000/health
curl -s http://localhost:3000/  # Dashboard
echo "✓ All services operational"
```

### Full Startup Script
```bash
#!/bin/bash
# scripts/startup.sh

set -e  # Exit on error

echo "=== HR Platform Full Startup ==="

# Verify prerequisites
bash scripts/verify_secrets.sh
bash scripts/check_ports.sh

# Start services in order
docker-compose -f docker-compose.prod.yml up -d postgres redis
sleep 10

python -m alembic upgrade head

docker-compose -f docker-compose.prod.yml up -d \
  hr-backend ai-brain-consumer \
  whatsapp-agent email-agent sms-agent \
  dashboard

sleep 5

# Health check
echo "Running health checks..."
curl -f http://localhost:8000/health || exit 1
curl -f http://localhost:3000/ || exit 1

echo "✓ All services started successfully!"
echo "Dashboard: http://localhost:3000"
echo "API: http://localhost:8000"
```

### Expected Output
```
=== HR Platform Full Startup ===
Running prerequisite checks... ✓
Starting database... ✓
Waiting for database (1/10)
✓ Database healthy
Running migrations... ✓
Starting backend... ✓
✓ Backend healthy
Starting AI Brain... ✓
Starting communication agents... ✓
Starting dashboard... ✓
Running health checks...
✓ Database: responsive
✓ Backend: /health returns 200
✓ Dashboard: loads in < 2s
✓ All services started successfully!
```

---

## 3. System Shutdown

### Graceful Shutdown (Recommended)
```bash
# This gives services time to finish current operations

# Step 1: Stop accepting new requests (optional, for zero-downtime)
# Set backend to "draining" mode:
touch /tmp/hr-system.draining
# This tells load balancer to stop routing new requests

# Step 2: Give existing requests 30 seconds to finish
sleep 30

# Step 3: Stop services in reverse order
docker-compose -f docker-compose.prod.yml down --timeout=30

# Expected output:
# Stopping dashboard... done
# Stopping whatsapp-agent... done
# Stopping hr-backend... done
# Removing postgres... done

echo "✓ Graceful shutdown complete"
```

### Emergency Shutdown (if graceful hangs)
```bash
# Force stop all containers:
docker-compose -f docker-compose.prod.yml kill

# Or kill specific service:
docker kill hr-backend

# Verify all stopped:
docker ps | grep hr-platform  # Should return nothing
```

---

## 4. Restart Procedures

### Option A: Full Restart (Safe, but has downtime)
```bash
bash scripts/shutdown.sh
sleep 5
bash scripts/startup.sh
# Downtime: ~15-30 seconds
```

### Option B: Partial Restart (Individual Service)
```bash
# Restart only the backend (others keep running):
docker-compose -f docker-compose.prod.yml restart hr-backend
sleep 3
curl http://localhost:8000/health  # Verify

# Restart only AI Brain:
docker-compose -f docker-compose.prod.yml restart ai-brain-consumer

# Restart database (RISKY - brief data unavailability):
docker-compose -f docker-compose.prod.yml restart postgres
# Waits until database is responsive
```

### Option C: Rolling Restart (Zero Downtime - for multiple instances)
If running multiple instances of backend:
```bash
# Instance 1: Restart
docker restart hr-backend-1
# Wait until healthy
curl http://instance-1:8000/health

# Instance 2: Restart (load balancer routes to instance-1)
docker restart hr-backend-2
curl http://instance-2:8000/health

# Instance 3: Restart
docker restart hr-backend-3

echo "✓ Zero-downtime rolling restart complete"
```

---

## 5. Emergency Recovery

### If System Won't Start
```bash
# Step 1: Check logs for root cause
docker logs hr-backend | grep -i error | tail -20

# Common issues:
# - "Port 8000 already in use" → kill lsof -i :8000
# - "Database connection refused" → check postgres is running
# - "Out of memory" → reduce container limits, check for leaks
# - "File not found" → check volume mounts

# Step 2: If database corruption suspected:
docker-compose down
docker-compose up -d postgres
# Wait for database to start and recover

# Step 3: If still failing, restore from backup:
bash scripts/restore_database.sh backup_2025_12_09.sql
```

### Data Corruption Recovery
```bash
# Stop backend (to avoid further writes):
docker-compose down

# Check database integrity:
docker exec postgres pg_dump -h localhost -U hr_user hr_platform | pg_restore --validate
# Shows any corruption

# Restore from last known good backup:
bash scripts/restore_database.sh /backups/hr_platform_2025_12_08_clean.sql

# Restart:
bash scripts/startup.sh
```

### Rollback to Previous Version
```bash
# If latest version has critical bug:

# Step 1: Note current image version:
docker images hr-platform:*

# Step 2: Stop current version:
docker-compose -f docker-compose.prod.yml down

# Step 3: Use previous image:
export IMAGE_TAG=1.2.3  # Previous stable version
docker-compose -f docker-compose.prod.yml up -d

# Step 4: Verify:
curl http://localhost:8000/health
curl http://localhost:3000
```

---

## 6. Data Management

### Backup Procedures
```bash
# Daily automated backup (run in cron at midnight):
0 0 * * * bash /scripts/backup_database.sh

# Backup script:
#!/bin/bash
TIMESTAMP=$(date +%Y_%m_%d_%H%M%S)
BACKUP_FILE="/backups/hr_platform_$TIMESTAMP.sql"

# Dump database:
docker exec postgres pg_dump \
  -h localhost -U hr_user \
  --no-password \
  hr_platform > $BACKUP_FILE

# Compress:
gzip $BACKUP_FILE

# Upload to S3:
aws s3 cp ${BACKUP_FILE}.gz s3://backups-bucket/

# Keep only last 30 days:
find /backups -name "*.sql.gz" -mtime +30 -delete

echo "Backup complete: $BACKUP_FILE"
```

### Restore from Backup
```bash
# List available backups:
ls -lah /backups/

# Restore specific backup:
BACKUP_FILE="/backups/hr_platform_2025_12_09_0000.sql.gz"

# Stop backend to avoid conflicts:
docker-compose -f docker-compose.prod.yml down

# Drop and recreate database:
docker exec postgres dropdb -U hr_user hr_platform
docker exec postgres createdb -U hr_user hr_platform

# Restore from backup:
gunzip -c $BACKUP_FILE | docker exec -i postgres psql -U hr_user hr_platform

# Verify restore:
docker exec postgres psql -U hr_user hr_platform -c "SELECT COUNT(*) FROM candidates"

# Restart backend:
bash scripts/startup.sh
```

### Point-in-Time Recovery (if specific moment needed)
```bash
# Requires WAL (Write-Ahead Logging) enabled
# Check if enabled:
docker exec postgres psql -U hr_user hr_platform \
  -c "SHOW wal_level"  # Should be 'replica' or 'logical'

# Restore to specific time:
# This requires PostgreSQL Point-in-Time Recovery setup
# Contact DBA for implementation
```

---

## 7. Log Management

### Log Locations
```bash
Backend logs:
  - Container: docker logs hr-backend
  - File: /var/log/hr-platform/backend.log
  - Real-time: docker logs -f hr-backend

Database logs:
  - docker logs postgres
  - File: /var/lib/postgresql/data/pg_log/

Dashboard logs:
  - docker logs dashboard
  - Browser console: DevTools → Console

Message queue (Redis):
  - docker logs redis
  - Monitor: docker exec redis redis-cli MONITOR

AI Brain:
  - docker logs ai-brain-consumer
  - Model logs: /logs/ai_brain.log
```

### Log Rotation
```bash
# Configure Docker log rotation:
cat <<EOF > /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  }
}
EOF

# Restart Docker:
systemctl restart docker
```

### Log Analysis
```bash
# Find errors in last hour:
docker logs hr-backend --since 1h 2>&1 | grep -i error

# Follow logs in real-time:
docker logs -f hr-backend

# Search for specific transaction:
docker logs hr-backend 2>&1 | grep "txn_id_123"

# Count errors by type:
docker logs hr-backend 2>&1 | grep ERROR | cut -d' ' -f1-3 | sort | uniq -c
```

---

## 8. Performance Optimization

### Database Optimization
```bash
# Regular maintenance (run weekly):
docker exec postgres psql -U hr_user hr_platform \
  -c "VACUUM ANALYZE"
# Removes dead rows, updates stats

# Check table sizes:
docker exec postgres psql -U hr_user hr_platform \
  -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
       FROM pg_tables ORDER BY pg_total_relation_size DESC"

# Create missing indexes:
docker exec postgres psql -U hr_user hr_platform \
  -f scripts/create_indexes.sql

# Monitor slow queries:
docker exec postgres psql -U hr_user hr_platform \
  -c "SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10"
```

### Memory Optimization
```bash
# Check memory usage:
docker stats --no-stream hr-backend

# If memory creeping up (memory leak):
# 1. Identify leaking object:
#    Add memory profiler to backend:
#    pip install memory-profiler
#    python -m memory_profiler backend.py

# 2. Restart service to free memory:
docker restart hr-backend

# 3. Set memory limit to prevent crash:
docker update --memory=2g hr-backend
```

### Caching Strategy
```bash
# Warm cache on startup:
docker exec hr-backend python -c "
from cache import warm_cache
warm_cache()
print('Cache warmed')
"

# Monitor cache hit rate:
docker exec redis redis-cli INFO stats | grep keyspace_hits
```

---

## 9. Monitoring & Alerting

### Health Check Endpoints
```bash
# Backend health:
curl http://localhost:8000/health
# Returns: {"status": "healthy", "timestamp": "ISO8601"}

# Detailed health:
curl http://localhost:8000/health/detailed
# Returns: database_ok, redis_ok, ai_brain_ok, etc.

# Dashboard health:
curl http://localhost:3000/health
```

### Setup Prometheus Monitoring
```bash
# Docker Compose adds metrics:
# Add to docker-compose.prod.yml:
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - 9090:9090

# Access: http://localhost:9090
# Query: rate(http_requests_total[5m])  # Request rate
```

### Alert Thresholds
```bash
# Setup alerts in Prometheus/Grafana:
- CPU > 80% for 5 min → Page on-call
- Memory > 85% → Auto-restart
- API response time > 1s → Alert
- Database connections > 80% of pool → Alert
- Error rate > 1% → Alert
- Disk space < 10GB → Alert
```

---

## Quick Reference

### Start System
```bash
bash scripts/startup.sh
```

### Stop System
```bash
docker-compose -f docker-compose.prod.yml down
```

### Restart Service
```bash
docker-compose -f docker-compose.prod.yml restart <service_name>
```

### View Logs
```bash
docker logs -f <service_name>
```

### Check Health
```bash
curl http://localhost:8000/health
```

### Backup Database
```bash
bash scripts/backup_database.sh
```

### Restore Database
```bash
bash scripts/restore_database.sh /path/to/backup.sql.gz
```

### Run Database Migration
```bash
python -m alembic upgrade head
```

### Emergency Contact
**Shashank:** [contact info]  
**On-call:** [rotation schedule]  
**War Room:** [Slack channel]
```

---

### STEP 8: QA Test Checklist
**Deliverable:** `handover/QA_TEST_CHECKLIST.md`

#### Prompt:
```
Create comprehensive QA checklist for Vinayak covering:

1. Endpoint Tests
- All CRUD operations
- Status codes
- Error responses
- Request validation

2. Functional Tests
- End-to-end workflows
- Candidate creation to hiring
- Feedback loop
- Automation trigger

3. Broken Flow Tests (negative tests)
- Missing fields
- Invalid data types
- Boundary values
- Null/empty inputs

4. Error Injection Tests
- Simulate database down
- API timeout
- Message queue failure
- External service failure

5. RL Brain Tests
- Ranking accuracy
- Feedback model updates
- Edge cases (few candidates, identical candidates)

6. Regression Tests
- Previous bugs don't reappear
- Performance doesn't degrade

7. Load Tests
- 100 concurrent users
- 1000 candidates in database
- Bulk import 500 candidates

Format: Checklist with exact test steps, expected results, pass/fail
```

#### Expected Output Structure:
```markdown
# QA Test Checklist — Integration & System Tests

## Test Environment Setup
```bash
# Start test database:
docker-compose -f docker-compose.test.yml up -d

# Run migrations:
python -m alembic upgrade head --sql-file test

# Load test data:
python scripts/load_test_data.py --count=100

# Verify setup:
curl http://localhost:8000/health
```

---

## 1. Endpoint Tests

### Test Suite 1.1: GET /api/candidates

**Test 1.1.1: List all candidates (happy path)**
```
Steps:
1. GET /api/candidates
2. Include valid JWT token in Authorization header
3. Expect 200 OK

Expected Response:
{
  "status": "success",
  "data": {
    "candidates": [...],
    "pagination": {"page": 1, "limit": 20, "total": 100}
  }
}

Assertions:
✓ Status code = 200
✓ Response contains "candidates" array
✓ Response contains "pagination" object
✓ Each candidate has id, name, email, status, ai_rank
✓ Response time < 500ms

Test Case: test_get_candidates_success
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.1.2: List with pagination**
```
Steps:
1. GET /api/candidates?page=2&limit=10
2. Expect 200 OK with 10 items on page 2

Assertions:
✓ pagination.page = 2
✓ pagination.limit = 10
✓ candidates array has <= 10 items
✓ No duplicates from page 1

Test Case: test_get_candidates_pagination
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.1.3: Filter by status**
```
Steps:
1. GET /api/candidates?status=active
2. Expect all candidates to have status='active'

Assertions:
✓ All returned candidates have status='active'
✓ No 'rejected' or 'hired' candidates returned
✓ Response time < 200ms (index used)

Test Case: test_get_candidates_filter_status
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.1.4: Missing authentication**
```
Steps:
1. GET /api/candidates without Authorization header
2. Expect 401 Unauthorized

Assertions:
✓ Status code = 401
✓ Response body contains "Unauthorized"

Test Case: test_get_candidates_no_auth
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.1.5: Invalid token**
```
Steps:
1. GET /api/candidates with Authorization: Bearer invalid_token
2. Expect 401 Unauthorized

Assertions:
✓ Status code = 401
✓ Response contains "Invalid token"

Test Case: test_get_candidates_invalid_token
Pass/Fail: [ ] PASS [ ] FAIL
```

---

### Test Suite 1.2: POST /api/candidates

**Test 1.2.1: Create candidate (happy path)**
```
Steps:
1. POST /api/candidates with valid payload:
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "position": "SDE",
  "skills": ["Python", "Docker"]
}
2. Expect 201 Created

Expected Response:
{
  "status": "success",
  "data": {
    "id": "cand_...",
    "name": "Alice Johnson",
    "status": "pending_ai_review",
    "ai_rank": null,
    "created_at": "ISO8601"
  }
}

Assertions:
✓ Status code = 201
✓ Response contains unique id
✓ status = 'pending_ai_review'
✓ ai_rank = null (not yet evaluated)
✓ created_at is ISO8601 timestamp
✓ Candidate exists in database with same data

Validation:
✓ Verify in database:
  psql -c "SELECT * FROM candidates WHERE email='alice@example.com'"

Post-Test:
✓ AI Brain should rank candidate within 5 seconds
✓ After ranking, ai_rank should update (run: SELECT * FROM candidates WHERE id='cand_...')

Test Case: test_create_candidate_success
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.2.2: Duplicate email validation**
```
Steps:
1. Create candidate with email: john@example.com
2. Try to create another with same email
3. Expect 409 Conflict

Assertions:
✓ Status code = 409
✓ Response contains "Email already exists" or "Duplicate"
✓ Second candidate not created in database

Test Case: test_create_candidate_duplicate_email
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.2.3: Missing required fields**
```
Steps:
1. POST /api/candidates with missing "name" field:
{
  "email": "bob@example.com",
  "position": "SDE"
}
2. Expect 422 Unprocessable Entity

Assertions:
✓ Status code = 422
✓ Error message mentions "name" field
✓ Candidate not created

Repeat for: email, position

Test Case: test_create_candidate_missing_fields
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.2.4: Invalid email format**
```
Steps:
1. POST /api/candidates with email = "not-an-email"
2. Expect 422 Unprocessable Entity

Assertions:
✓ Status code = 422
✓ Error mentions "email" field invalid
✓ Candidate not created

Test Case: test_create_candidate_invalid_email
Pass/Fail: [ ] PASS [ ] FAIL
```

**Test 1.2.5: Empty skills array (BUG-001 check)**
```
Steps:
1. POST /api/candidates with skills = []
2. Monitor for 5 seconds

Expected Behavior (after fix):
✓ Candidate created successfully
✓ AI Brain handles gracefully
✓ ai_rank = 0 or default value
✓ No errors in AI Brain logs

If still broken:
✓ Status code = 201 (but ai_rank stays null)
✓ Known issue BUG-001

Test Case: test_create_candidate_empty_skills
Pass/Fail: [ ] PASS [ ] FAIL
Note: This tests for BUG-001 fix
```

---

### Test Suite 1.3: PATCH /api/candidates/{id}

**Test 1.3.1: Update candidate status**
```
Steps:
1. Create candidate with status='pending'
2. PATCH /api/candidates/{id}:
{
  "status": "active"
}
3. Expect 200 OK

Assertions:
✓ Status updated in database
✓ updated_at timestamp changed
✓ Other fields unchanged

Test Case: test_update_candidate_status
Pass/Fail: [ ] PASS [ ] FAIL
```

---

### Test Suite 1.4: DELETE /api/candidates/{id}

**Test 1.4.1: Soft delete candidate**
```
Steps:
1. Create candidate
2. DELETE /api/candidates/{id}
3. Expect 204 No Content (or 200)

Assertions:
✓ deleted_at timestamp is set
✓ Candidate still in database (soft delete)
✓ GET /api/candidates?include_deleted=false doesn't return it

Test Case: test_delete_candidate_soft_delete
Pass/Fail: [ ] PASS [ ] FAIL
```

---

## 2. Functional Workflow Tests

### Test 2.1: Candidate Creation → AI Ranking → Feedback → RL Update

```
Scenario: End-to-end hiring workflow

Step 1: Create Candidate
POST /api/candidates {name, email, position, skills}
Expected: 201, candidate.status='pending_ai_review', ai_rank=null
Assertion: ✓ [ ]

Step 2: Wait for AI Ranking (max 10 seconds)
Poll: GET /api/candidates/{id}
Expected: ai_rank should become non-null
Assertion: ✓ ai_rank > 0 and ai_rank <= 100 [ ]

Step 3: Verify AI Rank Makes Sense
Check: High-ranked candidates should have matching skills
Example: SDE candidates with ["Python", "Docker"] should rank higher than
         SDE candidates with ["PowerPoint"]
Assertion: ✓ Ranking order is reasonable [ ]

Step 4: Interview & Feedback
POST /api/feedback {candidate_id, hired, rating, notes}
Expected: 200 OK, feedback recorded
Assertion: ✓ Feedback in database [ ]

Step 5: AI Model Should Update
Post-update, candidates with similar profiles to hired candidates
should rank slightly higher (RL improvement)
Verify: Check that model version incremented
Assertion: ✓ Model learning happening [ ]

Test Case: test_end_to_end_hiring_workflow
Pass/Fail: [ ] PASS [ ] FAIL
```

---

### Test 2.2: Bulk Candidate Import

```
Scenario: Recruit provides CSV with 100 candidates

Step 1: Prepare CSV
File: test_data/candidates_100.csv
Format: name,email,position,skills
Row count: 100

Step 2: Bulk Import
POST /api/candidates/bulk {file}
Expected: 202 Accepted, job_id returned

Step 3: Monitor Job Progress
Poll: GET /api/candidates/bulk/job/{job_id}
Expected: status progresses from 'processing' to 'completed'

Step 4: Verify Import Results
GET /api/candidates/bulk/job/{job_id}/results
Expected: 
{
  "total": 100,
  "successful": 98,
  "failed": 2,
  "errors": [...]
}

Step 5: Check Ranking
After 2 minutes, all 100 candidates should be ranked
Query: SELECT COUNT(*) FROM candidates WHERE ai_rank IS NOT NULL AND created_at > NOW() - INTERVAL '5 min'
Expected: ~100

Test Case: test_bulk_import_workflow
Pass/Fail: [ ] PASS [ ] FAIL
```

---

## 3. Error Injection & Failure Tests

### Test 3.1: Database Connection Failure

```
Scenario: Database becomes unavailable mid-operation

Setup:
1. docker-compose pause postgres

Trigger:
1. POST /api/candidates
Expected: 500 Server Error or 503 Service Unavailable
Assertion: ✓ Graceful error message [ ]

Recovery:
1. docker-compose unpause postgres
2. Retry POST /api/candidates
Expected: 201 OK
Assertion: ✓ System recovers [ ]

Test Case: test_db_connection_failure_recovery
Pass/Fail: [ ] PASS [ ] FAIL
```

### Test 3.2: Message Queue Failure

```
Scenario: Redis (message queue) down, affecting AI ranking

Setup:
1. docker pause redis

Trigger:
1. POST /api/candidates
Expected: 201 Created (accepts candidate)
But: ai_rank won't update, event stuck in queue

Recovery:
1. docker unpause redis
2. System should reprocess event
Expected: ai_rank eventually updates

Assertion: ✓ System handles queue failure gracefully [ ]

Test Case: test_message_queue_failure
Pass/Fail: [ ] PASS [ ] FAIL
```

### Test 3.3: AI Brain Service Timeout

```
Scenario: AI Brain takes too long or crashes

Setup:
1. docker pause ai-brain-consumer

Trigger:
1. POST /api/candidates (with empty skills, triggers slow ranking)
Expected: 201 Created

Wait:
2. After 10 seconds, check ai_rank
Expected: Still null (AI didn't finish)

Recovery:
1. docker unpause ai-brain-consumer
Expected: AI resumes processing, ai_rank updates

Assertion: ✓ System doesn't crash, handles async gracefully [ ]

Test Case: test_ai_brain_timeout_recovery
Pass/Fail: [ ] PASS [ ] FAIL
```

---

## 4. Load Testing

### Test 4.1: High Concurrent Load

```
Scenario: 100 users simultaneously accessing system

Tool: Apache JMeter or k6

Test:
1. 100 concurrent users
2. Each creates 5 candidates = 500 total candidates
3. Each polls GET /api/candidates every 2 seconds
4. Duration: 5 minutes

Expected Results:
- No errors (error rate < 0.1%)
- 99th percentile response time < 1000ms
- Database handles load (check CPU, memory)
- No memory leaks (memory stable)

Assertions:
✓ Error rate < 0.1% [ ]
✓ P99 latency < 1s [ ]
✓ CPU < 80% [ ]
✓ Memory < 85% [ ]
✓ No database connection exhaustion [ ]

Test Case: test_load_100_concurrent_users
Pass/Fail: [ ] PASS [ ] FAIL
```

---

## 5. Regression Tests (Check Previous Fixes Still Work)

### Test 5.1: BUG-001 Not Reappeared

```
Test: Empty skills array handling
POST /api/candidates with skills=[]
Expected: 201 Created (or 200 with ai_rank=0)

Assertion: ✓ No crash, no NullPointerException [ ]

Test Case: test_regression_bug_001_empty_skills
Pass/Fail: [ ] PASS [ ] FAIL
```

---

## Test Summary Template

```
=== QA Test Results ===
Date: [YYYY-MM-DD]
Tester: [Name]
Build: [Version]

Total Tests: 30
Passed: 28
Failed: 2
Blocked: 0
Not Tested: 0

Failed Tests:
1. test_create_candidate_empty_skills [BUG-001 still present]
2. test_whatsapp_rate_limiting [BUG-002 rate limit hit]

Blockers:
- None

Recommendations:
- Merge fix for BUG-001 before production
- Implement rate limiting for WhatsApp before launch
- Load test with 500+ concurrent users

Sign-Off:
✓ Ready for staging
✗ NOT ready for production

Tester Signature: ________________ Date: ________
```

---

## Automated Test Execution

```bash
#!/bin/bash
# Run all tests automatically

pytest tests/ -v --tb=short

# Or specific test suite:
pytest tests/test_endpoints.py -v
pytest tests/test_workflows.py -v
pytest tests/test_errors.py -v
pytest tests/test_load.py -v

# With coverage:
pytest tests/ --cov=backend --cov-report=html

# View report:
open htmlcov/index.html
```
```

---

### STEP 9: Postman Collection Export
**Deliverable:** `handover/postman_collection.json`

Create and export Postman collection with all API endpoints, sample requests, and test scripts.

```bash
# In Postman:
# 1. Create collection "HR Platform API"
# 2. Add all endpoints with examples
# 3. Click "..." → Export → JSON
# 4. Save to: handover/postman_collection.json

# Import in another instance:
# Postman → Import → Select postman_collection.json
```

---

### STEP 10: Video Walkthrough
**Deliverable:** `handover/video/overview.mp4` (3-5 minutes)

**Script for Video:**
```
[0:00-0:30] Intro
"This is the BHIV HR Platform system walkthrough. I'll show you the 
architecture, how the APIs work, the decision flow, and how to test."

[0:30-1:30] Folder Structure & Files
- Show GitHub repo structure
- Point out key directories: backend/, frontend/, scripts/
- Show documentation folder (handover/)
- Highlight runbook, FAQ, and API docs

[1:30-3:00] System Architecture
- Show architecture diagram
- Explain how Candidate → AI Brain → Feedback → RL Update works
- Show integration with Dashboard
- Show Communication Agents

[3:00-4:00] API Walkthrough
- Postman: Show POST /api/candidates example
- Show sample request and response
- Explain status codes and error handling
- Show GET /api/candidates with pagination

[4:00-4:30] How to Test & Verify
- Run test suite: pytest tests/
- Check health: curl /health
- Monitor logs: docker logs -f hr-backend

[4:30-5:00] Quick Start & Contact
- Quick start command: bash scripts/startup.sh
- Where to find help: README_FIRST.md
- Contact info: For issues, contact Shashank
```

**Recording Tools:**
- ScreenFlow (Mac), OBS Studio (Windows/Linux), or Loom
- Record at 1080p, MP4 format
- Add captions/subtitles

---

### STEP 11: Final README (Human-Friendly Summary)
**Deliverable:** `handover/READ_THIS_FIRST.md`

#### Prompt:
```
Create a one-page human-friendly README covering:
- What the system does in plain English
- Where the major files/folders are
- How to run the system
- What NOT to touch
- Who to contact if stuck
- Quick reference for common tasks

Audience: Ishan, Nikhil, Vinayak (technical but possibly new to system)
Length: Max 1 page (or 2 with quick reference)
```

#### Expected Output Structure:
```markdown
# 🚀 BHIV HR Platform — Read This First

## What Does This System Do?

The **HR Platform** automates hiring by:
1. **Accepting candidates** via dashboard or bulk import
2. **Ranking candidates** using AI/ML (trained on hiring feedback)
3. **Tracking feedback** after each hiring decision
4. **Improving ranking** via reinforcement learning (smarter each hire)
5. **Automating communication** (WhatsApp, Email, SMS notifications)

Think of it as a "smart recruiter" that learns from past hiring decisions.

---

## Quick Start (5 minutes)

### Start the System
```bash
cd /path/to/bhiv-hr-platform
bash scripts/startup.sh
# Opens: Dashboard at http://localhost:3000
#        API at http://localhost:8000
```

### Stop the System
```bash
docker-compose -f docker-compose.prod.yml down
```

### Check Health
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}
```

---

## File Locations

| What | Where | Who Cares |
|------|-------|----------|
| **Backend Code** | `backend/` | Ishan (RL brain), Everyone (APIs) |
| **Frontend Code** | `frontend/` | Nikhil (dashboard UI) |
| **Database Schema** | `database/migrations/` | Ishan (data models) |
| **API Docs** | `handover/api_contract/` | Everyone |
| **Architecture** | `handover/architecture/` | Ishan (decision flow) |
| **Runbook** | `handover/RUNBOOK.md` | Ops/Nikhil |
| **FAQ** | `handover/FAQ_OPERATIONS.md` | Troubleshooting |
| **Tests** | `tests/` | Vinayak (QA) |
| **Docker Config** | `docker-compose.prod.yml` | Deployment |
| **Secrets** | `.env.production` | Ops (keep secret!) |

---

## Common Tasks

### Task 1: Add a New Candidate
- **Via Dashboard:** Click "Add Candidate" button, fill form, submit
- **Via API:** `POST http://localhost:8000/api/candidates` (see API docs)
- **Bulk Import:** Upload CSV file to dashboard
- **How Long?** Candidate created instantly, ranking happens in 2-5 seconds
- **Verify:** GET `/api/candidates` to see new candidate with `ai_rank`

### Task 2: See Ranked Candidates
- **Dashboard:** Candidates list shows all with rankings
- **API:** `GET http://localhost:8000/api/candidates?status=active`
- **SQL Query:** `SELECT * FROM candidates ORDER BY ai_rank DESC`

### Task 3: View AI Ranking Logic
- **File:** `backend/ai_brain.py`
- **Function:** `calculate_rank(candidate)`
- **How It Works:** Reads skills, position, prior feedback → outputs score 0-100
- **Don't Change:** Without testing on 50+ candidates first

### Task 4: Submit Hiring Feedback
- **Via Dashboard:** Click candidate → "Hired/Rejected" → Submit feedback
- **Via API:** `POST /api/feedback` with hired=true/false and rating
- **Why?** Helps RL model improve future rankings

### Task 5: Troubleshoot a Problem
1. Check **FAQ_OPERATIONS.md** for your issue
2. If not there, check **RUNBOOK.md** for diagnostics
3. If still stuck, see **"Who to Contact"** below

### Task 6: Run All Tests
```bash
cd backend/
pytest tests/ -v
# All tests should pass before deployment
```

### Task 7: View Logs
```bash
docker logs -f hr-backend  # Backend logs
docker logs -f dashboard   # Dashboard logs
docker logs -f ai-brain-consumer  # AI ranking logs
```

### Task 8: Restart a Service
```bash
docker-compose -f docker-compose.prod.yml restart hr-backend
docker-compose -f docker-compose.prod.yml restart dashboard
```

---

## What NOT to Touch

### 🚫 DO NOT MODIFY These Files (Without Permission)

1. **database.py** — Core database layer
   - Changes can break everything
   - If you MUST change it, get approval and test thoroughly
   
2. **ai_brain.py** — ML ranking model
   - Production model, any bug loses ranking intelligence
   - Version controlled, rollback procedure documented
   
3. **API Response Schemas** (in api_contract)
   - External integrations depend on exact format
   - Changes need coordination with Ishan (RL brain)

4. **docker-compose.prod.yml** — Production config
   - Controls all services
   - One wrong setting can crash system

5. **.env.production** — Secrets file
   - Contains API keys, passwords, tokens
   - Never commit to Git
   - Only ops/admin should access

### ✅ SAFE to Modify These

- Frontend UI code (dashboard/)
- Test files (tests/)
- Documentation
- Utility scripts in scripts/
- Configuration in config.py (non-secrets)

---

## Who to Contact

### For Different Issues:

| Issue | Contact | Time |
|-------|---------|------|
| Dashboard UI bug | Nikhil | 5 min response |
| API/backend error | Ishan | 10 min response |
| Database/data issue | Shashank | 15 min response |
| Deployment problem | Ops/Shashank | ASAP |
| System down (production) | Shashank → On-call | Immediate |
| Feature request | Team meeting | Next sprint |

### Contact Details:
- **Ishan** (Backend/RL): ishan@example.com, Slack: @ishan-mishra
- **Nikhil** (Frontend): nikhil@example.com, Slack: @nikhil-patel
- **Vinayak** (QA): vinayak@example.com, Slack: @vinayak-sharma
- **Shashank** (Architect): shashank@example.com, Phone: [number], Slack: @shashank-mishra
- **War Room**: #hr-platform-incidents (Slack)

---

## Key Concepts

### Candidate Status Flow
```
pending_ai_review → active → hired/rejected
```
- **pending_ai_review:** Newly added, waiting for AI to rank
- **active:** Ranked, ready for review
- **hired/rejected:** Final decision made, feedback submitted

### Ranking Process (What Happens When You Add a Candidate)
```
1. Dashboard → POST /api/candidates
2. Backend creates record, emits event to message queue
3. AI Brain consumer picks up event (async)
4. AI/RL model processes candidate data
5. Ranking stored in database
6. Dashboard notified via WebSocket → UI updates
7. Entire process: 2-5 seconds
```

### Feedback Loop (How AI Improves)
```
Hiring Decision (hired/rejected with rating)
           ↓
Feedback submitted to backend
           ↓
RL model re-trained with new signals
           ↓
Model version incremented
           ↓
Next candidates ranked slightly better (if pattern matches)
```

---

## Monitoring

### Key Metrics to Watch

```bash
# Every hour, check:
curl http://localhost:8000/health  # Backend status
curl http://localhost:3000/health   # Dashboard status
docker stats --no-stream            # Resource usage
docker logs hr-backend | grep ERROR # Any errors?

# If anything ↑ looks red, check FAQ_OPERATIONS.md
```

### Performance Targets
- Candidate creation: < 100ms
- AI ranking: 2-5 seconds
- Dashboard page load: < 1 second
- API response (list): < 500ms

---

## Before Asking for Help

1. **Check if system is running:** `bash scripts/startup.sh`
2. **Check health:** `curl http://localhost:8000/health`
3. **Check logs:** `docker logs -f <service_name>`
4. **Check FAQ:** `handover/FAQ_OPERATIONS.md`
5. **Check RUNBOOK:** `handover/RUNBOOK.md`

---

## Next Steps (After Reading This)

1. ✅ Start the system: `bash scripts/startup.sh`
2. ✅ Open dashboard: http://localhost:3000
3. ✅ Add a test candidate via dashboard UI
4. ✅ Watch it rank in 2-5 seconds
5. ✅ Read `architecture/ARCHITECTURE.md` to understand flow
6. ✅ Read `api_contract/api_contract_complete.md` for API details
7. ✅ Bookmark `FAQ_OPERATIONS.md` for when things break

---

## Emergency Contacts

**System Down / Critical Issue:**
- Call Shashank: [phone number]
- Slack: @shashank-mishra
- War Room: #hr-platform-incidents

**Everything else:**
- Ishan, Nikhil, Vinayak based on issue type

---

**Last Updated:** 2025-12-09  
**System Owner:** Shashank Mishra  
**Questions?** Read handover/ folder, check FAQ, then contact team
```

---

### STEP 12: Final Submission & Notification
**Deliverable:** All files pushed to `/handover/` directory

```bash
# Create organized folder structure:
mkdir -p handover/{architecture,api_contract,integration_maps,issues,video}

# Copy all deliverables:
cp ARCHITECTURE.md handover/architecture/
cp api_contract_complete.md handover/api_contract/
cp DATA_MODELS.md handover/api_contract/
cp INTEGRATION_MAPS.md handover/integration_maps/
cp ISSUES_AND_LIMITATIONS.md handover/issues/
cp FAQ_OPERATIONS.md handover/
cp RUNBOOK.md handover/
cp QA_TEST_CHECKLIST.md handover/
cp postman_collection.json handover/
cp overview.mp4 handover/video/
cp READ_THIS_FIRST.md handover/

# Git commit and push:
git add handover/
git commit -m "chore: complete HR platform handover documentation"
git push origin main

# Send notification:
echo "HR Platform handover complete!" | mail \
  -s "Handover Package Ready" \
  ishan@example.com nikhil@example.com vinayak@example.com

# Slack notification:
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"🎉 HR Platform handover documentation complete! All files in /handover/ folder. Start with READ_THIS_FIRST.md"}' \
  $SLACK_WEBHOOK_URL
```

---

## DELIVERABLES SUMMARY

**Phase 1 (Morning):**
- ✓ ARCHITECTURE.md (system overview + diagrams)
- ✓ api_contract_complete.md (all endpoints)
- ✓ DATA_MODELS.md (database schemas)
- ✓ INTEGRATION_MAPS.md (data flows)
- ✓ ISSUES_AND_LIMITATIONS.md (bugs & fixes)

**Phase 2 (Afternoon):**
- ✓ FAQ_OPERATIONS.md (troubleshooting)
- ✓ RUNBOOK.md (operational procedures)
- ✓ QA_TEST_CHECKLIST.md (testing guide)
- ✓ postman_collection.json (API testing)
- ✓ overview.mp4 (3-5 min video walkthrough)
- ✓ READ_THIS_FIRST.md (quick start)
- ✓ Git push & team notification

---

## Final Folder Structure

```
handover/
├── README.md (or READ_THIS_FIRST.md at root)
├── architecture/
│   ├── ARCHITECTURE.md
│   ├── system_diagram.md (Mermaid)
│   └── microservice_boundaries.md
├── api_contract/
│   ├── api_contract_complete.md
│   ├── DATA_MODELS.md
│   └── request_response_examples.json
├── integration_maps/
│   ├── INTEGRATION_MAPS.md
│   ├── hr_platform_to_ai_brain_flow.md
│   ├── automation_to_comms_flow.md
│   └── dashboard_to_backend_flow.md
├── issues/
│   ├── ISSUES_AND_LIMITATIONS.md
│   ├── BUG_TRACKER.md
│   └── known_issues_summary.txt
├── FAQ_OPERATIONS.md
├── RUNBOOK.md
├── QA_TEST_CHECKLIST.md
├── postman_collection.json
├── video/
│   └── overview.mp4 (3-5 minutes)
└── READ_THIS_FIRST.md (link/copy at root)
```

---

## Success Criteria (Before Handing Over)

- ✓ Every endpoint documented with examples
- ✓ All data models explained with schemas
- ✓ Architecture clear without asking questions
- ✓ FAQ covers top 10 operations issues
- ✓ Runbook has exact commands to execute
- ✓ QA checklist is step-by-step, testable
- ✓ Video shows system in action
- ✓ README is scannable in < 2 minutes
- ✓ Ishan can integrate without asking backend questions
- ✓ Nikhil can build dashboard without missing APIs
- ✓ Vinayak can test everything from checklist
- ✓ Nothing in someone's head — all documented
- ✓ All files in version control (Git)
- ✓ Team notified with access links

---

**Estimated Timeline:**
- **Phase 1:** 4-6 hours (extraction + documentation)
- **Phase 2:** 3-4 hours (completion + submission)
- **Total:** 7-10 hours ✓ Achievable in 1 day with focus

**Success = Team can operate system without asking you a single question** ✅
```

---

Now, let me create this as a comprehensive markdown file for you:
<function_calls>
<invoke name="create_text_file">
<parameter name="content"># HR Platform Handover — Complete Implementation Guide
**Duration:** 1 Day (Hard Stop)  
**Objective:** Complete system handover for BHIV HR Platform with all documentation, APIs, and operational guides

---

## PHASE 1: MORNING (First Half) — SYSTEM EXTRACTION & STRUCTURE DOCUMENTATION
*Expected Completion: 4-6 hours*

### STEP 1: Create Architecture Blueprint
**Deliverable:** `handover/architecture/ARCHITECTURE.md`

#### What to Include:
```markdown
# BHIV HR Platform — System Architecture

## 1. System Overview
[Create ASCII Diagram showing all services]
- HR Platform Core (Backend)
- AI/RL Brain (Decision Engine)
- Automation Engine
- Communication Layer (WhatsApp, Email, SMS)
- Dashboard (Frontend)
- Database (PostgreSQL)
- Message Queue (Redis)

## 2. Core Modules
### Candidate Management Module
- Purpose: Handle candidate CRUD operations
- Key Files: candidates.py, candidate_service.py
- Database Tables: candidates
- Endpoints: GET, POST, PATCH, DELETE /api/candidates

### AI/RL Brain Module
- Purpose: Decision-making and ranking engine
- Logic: Reinforcement learning-based candidate ranking
- Input: Candidate data, historical feedback
- Output: Rank score (0-100), confidence level
- Dependencies: Candidate data, feedback signals

### Feedback Module
- Purpose: Collect hiring decisions and ratings
- Triggers: RL model retraining after new feedback
- Data Flow: Feedback → RL Brain → Model Update

### Automation & Communication Module
- Purpose: Send notifications via WhatsApp, Email, SMS
- Triggers: Specific events (candidate ranked, hired, rejected)
- External Services: Twilio, SendGrid, WhatsApp Business API

## 3. Service Dependencies
[Show dependency graph]
- Candidate Module → AI Brain → Automation Engine → Communication Agents
- Dashboard (read-only from all modules)
- Database (shared by all)
- Redis Queue (async processing)

## 4. Event-Driven Architecture
Events flow through Redis message queue:
- candidate.created → AI Brain picks up and ranks
- candidate.ranked → Dashboard notified via WebSocket
- feedback.submitted → RL Brain retrains model
- automation.trigger → Communication agents send messages
- message.sent → Webhooks confirm delivery

## 5. API Boundaries
- **Internal APIs:** Services talk via message queue (async)
- **External APIs:** Dashboard ↔ Backend via REST (sync)
- **Webhooks:** External services → Backend for confirmations

## 6. Data Flow
1. Dashboard submits new candidate
2. Backend validates and creates record
3. Event emitted to queue
4. AI Brain consumer processes asynchronously
5. Rank stored in database
6. WebSocket notifies dashboard
7. UI updates with new rank
```

**Key Point:** Don't include every technical detail. Focus on "what talks to what" and "why."

---

### STEP 2: API Contract Documentation
**Deliverable:** `handover/api_contract/api_contract_complete.md`

#### Template for Each Endpoint:
```markdown
## Endpoint: [METHOD] /api/[resource]/[action]
**Purpose:** [Brief description of what it does]

**Authentication:** Bearer token (JWT) required

**Request:**
- **URL Parameters:** [if any]
- **Query Parameters:** [if any]
- **Request Body Schema:**
\`\`\`json
{
  "field1": "type - description",
  "field2": "type - description"
}
\`\`\`

**Example Request:**
\`\`\`bash
curl -X POST http://localhost:8000/api/candidates \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "position": "SDE",
    "skills": ["Python", "Docker"]
  }'
\`\`\`

**Response:**
- **Status Code:** 201 Created
- **Response Body Schema:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "cand_123",
    "name": "string",
    "email": "string",
    "status": "enum: pending_ai_review, active, hired, rejected",
    "ai_rank": "integer (0-100) or null",
    "created_at": "ISO8601 timestamp"
  }
}
\`\`\`

**Example Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "cand_f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending_ai_review",
    "ai_rank": null,
    "created_at": "2025-12-09T13:37:00Z"
  }
}
\`\`\`

**Error Responses:**
- **400 Bad Request:** [Conditions that trigger this]
  - Example: Missing required field "name"
- **401 Unauthorized:** [Invalid/missing auth]
- **409 Conflict:** [Duplicate email]
- **500 Server Error:** [Unexpected error]

**When This Endpoint is Called:**
- Dashboard: User clicks "Add Candidate" button
- API: External system bulk imports candidates

**Implementation Details:**
- **File:** backend/routes/candidates.py
- **Function:** create_candidate()
- **Database Table:** candidates
- **Dependencies:** Email validation, AI Brain trigger

**Related Endpoints:**
- GET /api/candidates (list all)
- GET /api/candidates/{id} (get single)
- PATCH /api/candidates/{id} (update)
- DELETE /api/candidates/{id} (delete)
```

**For Your HR Platform, cover:**
1. Candidate Management (GET, POST, PATCH, DELETE)
2. AI Brain APIs (GET ranking, trigger reranking)
3. Feedback APIs (POST feedback, GET feedback history)
4. Automation APIs (trigger automations)
5. Notification Hooks (WhatsApp callback, Email bounce, SMS status)
6. Dashboard APIs (KPIs, statistics)

---

### STEP 3: Data Model Documentation
**Deliverable:** `handover/api_contract/DATA_MODELS.md`

#### Template:
```markdown
## Model: Candidate

**JSON Schema:**
\`\`\`json
{
  "id": "string (uuid, auto-generated)",
  "name": "string (1-255 chars, required)",
  "email": "string (valid email, unique, required)",
  "phone": "string (E.164 format, optional)",
  "position": "string (enum: SDE, PM, Designer, etc., required)",
  "status": "string (enum: pending, active, rejected, hired)",
  "ai_rank": "integer (0-100, null before evaluation)",
  "skills": "array of strings (max 20 items)",
  "resume_url": "string (https URL, optional)",
  "created_at": "ISO8601 timestamp (server-set, immutable)",
  "updated_at": "ISO8601 timestamp (auto-updated)",
  "deleted_at": "ISO8601 timestamp or null (soft delete)"
}
\`\`\`

**Field Descriptions:**
- **id:** Unique identifier, auto-generated UUID4
- **name:** Full name, required, 1-255 chars
- **email:** Must be valid email format, unique in system
- **phone:** Optional, must be E.164 format if provided
- **status:** Candidate state in hiring pipeline
- **ai_rank:** AI engine score, null until first evaluation
- **created_at:** Immutable creation timestamp
- **updated_at:** Auto-updated on any change
- **deleted_at:** For soft deletes, null if not deleted

**Validation Rules:**
\`\`\`
- name: non-empty, max 255 chars, no special chars
- email: must pass email regex, must be unique
- position: must exist in JobPosition enum
- status: must be one of: pending, active, rejected, hired
- ai_rank: null OR integer 0-100
- skills: array of max 20 items, each max 50 chars
- resume_url: must be valid HTTPS URL
\`\`\`

**Database Constraints:**
\`\`\`sql
PRIMARY KEY: id
UNIQUE: email
NOT NULL: name, email, position, status, created_at
CHECK: ai_rank IS NULL OR (ai_rank >= 0 AND ai_rank <= 100)
INDEX: email (for lookups)
INDEX: status (for filtering)
INDEX: created_at (for sorting)
\`\`\`

**Example Valid Record:**
\`\`\`json
{
  "id": "cand_f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-0101",
  "position": "SDE",
  "status": "active",
  "ai_rank": 87,
  "skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
  "resume_url": "https://cdn.example.com/resumes/alice_johnson.pdf",
  "created_at": "2025-12-01T10:00:00Z",
  "updated_at": "2025-12-08T15:30:00Z",
  "deleted_at": null
}
\`\`\`

**Edge Cases:**
1. Empty skills array → AI ranking fails (BUG-001)
2. Duplicate email in bulk import → validation error
3. Status changes to "hired" but no feedback → allow, flag for follow-up
4. Very long resume URL → may exceed column length
5. Null ai_rank in UI → show "Pending ranking" state

**What Breaks If Schema Changes:**
- Remove required field → existing records invalid
- Change ai_rank type to string → comparison queries fail
- Remove uniqueness on email → bulk operations break
- Change status enum → validation breaks
```

**For your platform, document:**
1. Candidate model
2. Feedback model
3. AutomationTrigger model
4. CommunicationLog model
5. User/Admin model
6. AIDecision model
7. Dashboard configuration model

---

### STEP 4: Integration Maps with Diagrams
**Deliverable:** `handover/integration_maps/INTEGRATION_MAPS.md`

#### Template:
```markdown
## Integration Map 1: HR Platform → AI Brain → Database

**Sequence:**
\`\`\`
Dashboard               Backend              Queue           AI Brain         Database
   |                      |                  |                |                |
   +-- POST /candidates --|                  |                |                |
   |                      |                  |                |                |
   |        create & validate                |                |                |
   |                      |                  |                |                |
   |              emit event                 |                |                |
   |                      +-- candidate.created --> 
   |                      |                  |                |                |
   |                      |        (async)    |                |                |
   |         201 OK ------+                   |           process ranking      |
   |                      |                  |                |                |
   |                      |                  |           store rank ---------> INSERT
   |                      |                  |                |                |
   |  <-- WebSocket Push (new rank) --------+                |                |
   |                      |                  |                |                |
\`\`\`

**Data Flow:**
1. Dashboard submits POST /api/candidates with candidate data
2. Backend validates input, creates candidate record (status=pending)
3. Backend emits event to Redis queue: candidate.created
4. AI Brain consumer picks up event (async, within seconds)
5. AI model processes candidate data (reads skills, position, etc.)
6. AI calculates rank (0-100 score)
7. Rank stored back in database
8. Dashboard notified via WebSocket with new rank
9. Frontend updates UI to show ranking

**Failure Points & Recovery:**
- If event not picked up (AI Brain down): Manual retry via admin button
- If ranking fails (empty skills): Known bug BUG-001, see FAQ
- If WebSocket fails: Dashboard polls GET /api/candidates every 5s as fallback

**Latency Expectations:**
- Creation: < 100ms
- AI processing: 2-5 seconds
- Total E2E: ~2-6 seconds

**Dependencies:**
- Redis must be running (for message queue)
- AI Brain service must be running
- Database must be responsive
\`\`\`

**Create 3 maps:**
1. **HR Platform → AI Brain:** Candidate creation, ranking, feedback loop
2. **Automation Layer → Communication Agents:** Event triggers, message sending, delivery
3. **Dashboard → Backend:** API calls, real-time updates, error handling

---

### STEP 5: Known Issues & Limitations
**Deliverable:** `handover/issues/ISSUES_AND_LIMITATIONS.md`

#### For Each Issue:
```markdown
## BUG-001: AI Brain Returns Null on Empty Skills Array

**Severity:** Critical  
**Status:** Active (Workaround exists)  
**Reported:** 2025-12-05 by Shashank

**Description:**
When candidate has empty skills array, AI ranking crashes with NullPointerException.

**Root Cause:**
In `ai_brain.py:calculate_rank()`, assumes skills array has >= 1 item:
\`\`\`python
def calculate_rank(candidate):
    skills = candidate['skills']  # Can be []
    skill_vectors = [embedding(s) for s in skills]  # ERROR if empty
    return score(skill_vectors)
\`\`\`

**Affected Components:**
- POST /api/candidates returns 500 error
- Dashboard candidate creation fails
- AI ranking breaks

**Workaround:**
Require >= 1 skill in form validation before submit

**Permanent Fix (In Progress):**
\`\`\`python
def calculate_rank(candidate):
    skills = candidate.get('skills', [])
    if not skills:
        return {'rank': 0, 'confidence': 0.1}
    # ... rest of code
\`\`\`

**Next Steps:**
1. Test fix with 50 edge cases
2. Merge to main
3. Deploy to staging
4. Update API docs

**When to Escalate:**
If error still appears after fix → contact Ishan
```

**For your platform, also document:**
- Deprecated code (with migration path)
- Incomplete functions (mark as TODOs)
- Performance bottlenecks
- Security concerns
- Temporary workarounds
- Code that MUST NOT be changed

---

**END OF PHASE 1**

Folder structure after Phase 1:
```
handover/
├── architecture/
│   └── ARCHITECTURE.md
├── api_contract/
│   ├── api_contract_complete.md
│   └── DATA_MODELS.md
├── integration_maps/
│   └── INTEGRATION_MAPS.md
└── issues/
    └── ISSUES_AND_LIMITATIONS.md
```

---

## PHASE 2: AFTERNOON (Second Half) — HANDOVER PACK COMPLETION

### STEP 6: FAQ Operations Sheet
**Deliverable:** `handover/FAQ_OPERATIONS.md`

#### Format: "If X, then do Y"
```markdown
# FAQ & Troubleshooting Guide

## Q1: "Candidate list fails to load in dashboard"

**Symptoms:**
- Dashboard shows blank or loading spinner forever
- Network tab shows GET /api/candidates → 500 error or timeout

**Diagnosis Steps:**
\`\`\`bash
# Step 1: Check if backend running
curl http://localhost:8000/health

# Step 2: Check database connection
psql -h localhost -U hr_user -d hr_platform -c "SELECT 1"

# Step 3: Check database query performance
EXPLAIN ANALYZE SELECT * FROM candidates;
# If > 5s → missing index
\`\`\`

**Solution:**
\`\`\`bash
# Restart backend
docker restart hr-backend
sleep 3
curl http://localhost:8000/health  # Verify

# If database issue
docker restart postgres

# If missing indexes
psql -h localhost -U hr_user -d hr_platform -f scripts/create_indexes.sql
\`\`\`

**Prevention:**
- Monitor /health endpoint every minute
- Run VACUUM ANALYZE nightly on database
- Keep indexes updated

---

## Q2: "AI Brain returns null after 5+ minutes"

**Cause:** Usually empty skills array (BUG-001) or AI service crashed

**Fix:**
\`\`\`bash
# Check if AI Brain running
docker logs ai-brain-consumer | tail -20

# If crashed, restart
docker restart ai-brain-consumer

# If BUG-001 (empty skills):
# Add default skill to candidate
UPDATE candidates SET skills = ['General'] 
WHERE skills = '[]' AND ai_rank IS NULL;

# Then reprocess
python scripts/reprocess_candidates.py --status=pending_ai_review
\`\`\`

---

## Q3: "WhatsApp message not sending"

**Check:**
\`\`\`bash
# Verify WhatsApp Agent running
docker logs whatsapp-agent | grep -i error

# Check rate limit
SELECT COUNT(*) FROM communication_logs 
WHERE created_at > NOW() - INTERVAL '1 hour' 
AND status='sent' AND service='whatsapp';
# Should be < 95 (limit is 100/hour)

# Verify phone format
SELECT phone FROM candidates WHERE id='cand_123';
# Should be: +1234567890 (E.164 format)
\`\`\`

**Fix:**
\`\`\`bash
# If rate limited
python scripts/send_delayed.py --batch_size=10 --delay=30

# If bad phone format
UPDATE candidates SET phone='+15550101' 
WHERE id='cand_123';

# Resend message
python scripts/resend_notification.py --candidate_id=cand_123
\`\`\`

---

[Continue with 5-10 more common issues...]
```

**Cover:**
- Candidate operations (create, list, update, delete)
- AI Brain issues (null, timeout, crash)
- Communication failures (WhatsApp, Email, SMS)
- Dashboard issues (slow, old data, won't load)
- Database issues (connection, locked tables)
- Bulk import failures
- System startup issues

---

### STEP 7: Runbook (Operations Manual)
**Deliverable:** `handover/RUNBOOK.md`

#### Key Sections:
```markdown
# System Runbook

## 1. Full Startup Sequence

\`\`\`bash
# Prerequisites: ports 5432, 6379, 8000, 3000 are free

# Start in order:
docker-compose -f docker-compose.prod.yml up -d postgres
sleep 10  # Wait for database

docker-compose -f docker-compose.prod.yml up -d redis
sleep 3

python -m alembic upgrade head  # Run migrations

docker-compose -f docker-compose.prod.yml up -d \
  hr-backend ai-brain-consumer \
  whatsapp-agent email-agent sms-agent \
  dashboard

sleep 5

# Health check
curl http://localhost:8000/health
curl http://localhost:3000
\`\`\`

## 2. Graceful Shutdown

\`\`\`bash
# Stops accepting new requests, finishes current ones
docker-compose -f docker-compose.prod.yml down --timeout=30
\`\`\`

## 3. Restart Single Service

\`\`\`bash
# Restart only backend (others keep running)
docker-compose -f docker-compose.prod.yml restart hr-backend

# Restart database
docker-compose -f docker-compose.prod.yml restart postgres

# Verify service healthy
curl http://localhost:8000/health
\`\`\`

## 4. Database Backup & Restore

**Backup:**
\`\`\`bash
docker exec postgres pg_dump -U hr_user hr_platform > backup_2025_12_09.sql
gzip backup_2025_12_09.sql
# Upload to S3 or backup storage
\`\`\`

**Restore:**
\`\`\`bash
docker-compose down  # Stop everything
gunzip backup_2025_12_09.sql.gz
docker exec -i postgres psql -U hr_user hr_platform < backup_2025_12_09.sql
docker-compose up -d  # Restart
\`\`\`

## 5. Log Management

\`\`\`bash
# View logs
docker logs -f hr-backend          # Backend logs
docker logs -f ai-brain-consumer   # AI ranking logs
docker logs -f dashboard           # Frontend logs

# Search for errors
docker logs hr-backend 2>&1 | grep ERROR | tail -20

# Monitor in real-time
docker logs -f --timestamps hr-backend
\`\`\`

## 6. Performance Optimization

\`\`\`bash
# Run database maintenance (weekly)
docker exec postgres psql -U hr_user hr_platform \
  -c "VACUUM ANALYZE"

# Check table sizes
docker exec postgres psql -U hr_user hr_platform \
  -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(...)) 
       FROM pg_tables ORDER BY pg_total_relation_size DESC"

# Create indexes if missing
docker exec postgres psql -U hr_user hr_platform -f scripts/create_indexes.sql
\`\`\`

## 7. Emergency Recovery

**If system won't start:**
1. Check logs: `docker logs hr-backend | grep -i error`
2. Check ports: `lsof -i :8000` (kill if needed)
3. Check database: `psql -h localhost -c "SELECT 1"`
4. Restart everything: `docker-compose down && docker-compose up -d`

**If data corrupted:**
1. Stop backend: `docker-compose down`
2. Restore backup: `docker exec -i postgres psql -U hr_user hr_platform < backup.sql`
3. Restart: `docker-compose up -d`

**If specific service crashes repeatedly:**
1. Check logs: `docker logs <service_name>`
2. Identify error
3. Check FAQ_OPERATIONS.md for solution
4. Escalate to relevant person if stuck
```

---

### STEP 8: QA Test Checklist
**Deliverable:** `handover/QA_TEST_CHECKLIST.md`

```markdown
# QA Test Checklist

## Test 1: GET /api/candidates
- [ ] Returns 200 OK
- [ ] Response contains candidate array
- [ ] Pagination works (page=2, limit=10)
- [ ] Filter by status works
- [ ] Missing auth returns 401
- [ ] Response time < 500ms

## Test 2: POST /api/candidates
- [ ] Valid input returns 201 Created
- [ ] Duplicate email returns 409
- [ ] Missing field returns 400
- [ ] Invalid email returns 422
- [ ] Empty skills array: handled gracefully (BUG-001 check)

## Test 3: AI Ranking Flow
- [ ] Candidate created → status = pending_ai_review
- [ ] Wait 5 seconds
- [ ] Candidate ranked → ai_rank populated (0-100)
- [ ] Ranking is reasonable (high skills = high rank)

## Test 4: Feedback & RL Update
- [ ] POST /api/feedback accepted
- [ ] Model version increments
- [ ] RL retrains with new feedback signal

## Test 5: Bulk Import
- [ ] Upload CSV with 100 candidates
- [ ] All imported successfully
- [ ] All ranked within 2 minutes
- [ ] Error handling on duplicate emails

## Test 6: Error Handling
- [ ] Database down → graceful error
- [ ] AI Brain down → event queued, retries later
- [ ] WhatsApp API rate limited → queues messages
- [ ] WebSocket disconnects → fallback to polling

## Test 7: Load Testing
- [ ] 100 concurrent users
- [ ] Create 500 candidates total
- [ ] No errors or data corruption
- [ ] P99 latency < 1 second

## Test Results
Total: 50+ test cases
Passed: [ ] / [ ]
Failed: [ ] / [ ]
Blocker: [ ] Yes [ ] No

Ready for production: [ ] Yes [ ] No
```

---

### STEP 9: Postman Collection
**Deliverable:** `handover/postman_collection.json`

In Postman:
1. Create collection "HR Platform API"
2. Add folders: Candidates, Feedback, AI Brain, Notifications
3. For each endpoint: add request + sample response
4. Add pre-request scripts for auth token
5. Export → JSON → Save to handover/

---

### STEP 10: Video Walkthrough
**Deliverable:** `handover/video/overview.mp4` (3-5 min)

**What to show:**
- System architecture diagram
- Folder structure
- Creating a candidate via API (Postman)
- Watching AI rank it
- Submitting feedback
- Checking logs
- How to run tests

**Tools:** OBS Studio, Loom, ScreenFlow

---

### STEP 11: Final README
**Deliverable:** `handover/READ_THIS_FIRST.md`

```markdown
# 🚀 HR Platform — Start Here

## What Does This System Do?
HR Platform automates candidate ranking using AI/ML that learns from hiring feedback.

1. Add candidates (dashboard or API)
2. AI ranks them (2-5 seconds)
3. Team provides feedback (hired/rejected)
4. RL model improves future rankings

## Quick Start
\`\`\`bash
bash scripts/startup.sh
# Dashboard: http://localhost:3000
# API: http://localhost:8000
\`\`\`

## Where Everything Is
- Backend code: `backend/`
- Frontend code: `frontend/`
- API docs: `handover/api_contract/`
- Architecture: `handover/architecture/`
- Troubleshooting: `handover/FAQ_OPERATIONS.md`
- How to run/restart: `handover/RUNBOOK.md`
- Tests: `handover/QA_TEST_CHECKLIST.md`

## Common Tasks
- **Add candidate:** Click "Add Candidate" in dashboard or `POST /api/candidates`
- **View rankings:** Dashboard list shows all candidates sorted by rank
- **Submit feedback:** Click candidate → Hired/Rejected → Submit
- **Troubleshoot:** Check FAQ_OPERATIONS.md

## What NOT to Touch
- `database.py` (core db layer)
- `ai_brain.py` (ML model)
- `.env.production` (secrets)
- `docker-compose.prod.yml` (production config)

## Who to Contact
| Issue | Contact |
|-------|---------|
| API/Backend | Ishan |
| Dashboard UI | Nikhil |
| Database | Shashank |
| System down | Shashank (urgent) |

## Before Asking for Help
1. Run `bash scripts/startup.sh`
2. Check `curl http://localhost:8000/health`
3. Read `handover/FAQ_OPERATIONS.md`
4. Then contact person from "Who to Contact" table

## Next Steps
1. Start system: `bash scripts/startup.sh`
2. Read `handover/architecture/ARCHITECTURE.md`
3. Create test candidate via dashboard
4. Check it ranks in 2-5 seconds
5. Book

k: RUNBOOK.md and FAQ_OPERATIONS.md
```

---

### STEP 12: Final Submission

```bash
# Push to Git
git add handover/
git commit -m "chore: complete HR platform handover documentation"
git push origin main

# Send notifications
echo "Handover complete! See /handover/ folder" | \
  mail -s "HR Platform Handover" ishan@example.com nikhil@example.com vinayak@example.com

# Slack notification
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"✅ HR Platform handover documentation ready in /handover/"}' \
  $SLACK_WEBHOOK_URL
```

---

## Final Folder Structure

```
handover/
├── READ_THIS_FIRST.md
├── architecture/
│   └── ARCHITECTURE.md
├── api_contract/
│   ├── api_contract_complete.md
│   └── DATA_MODELS.md
├── integration_maps/
│   └── INTEGRATION_MAPS.md
├── issues/
│   └── ISSUES_AND_LIMITATIONS.md
├── FAQ_OPERATIONS.md
├── RUNBOOK.md
├── QA_TEST_CHECKLIST.md
├── postman_collection.json
└── video/
    └── overview.mp4
```

---

## Success Checklist

✓ Every endpoint documented with examples  
✓ All data models explained  
✓ Architecture is clear  
✓ FAQ covers top 10 issues  
✓ Runbook has exact commands  
✓ QA checklist is testable  
✓ Video shows system in action  
✓ README scannable in < 2 min  
✓ All in version control (Git)  
✓ Team notified  

**=== Handover Complete ===**

---

**Estimated Timeline:** 8-10 hours (achievable in 1 day with focus)  
**Success = Team operates system without asking you questions** ✅
