# API Contract — Part 2: Gateway Core Features (18-35 of 111)

**Continued from:** [API_CONTRACT_PART1.md](./API_CONTRACT_PART1.md)

**Version:** 4.1.0  
**Last Updated:** January 22, 2026  
**Total Endpoints:** 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Database:** MongoDB Atlas  
**Analysis Source:** Comprehensive endpoint analysis from services directories

---

## Gateway Job Management

### 18. GET /v1/jobs

**Purpose:** List all active job postings

**Authentication:** Bearer token required (API key or JWT)

**Implementation:** `services/gateway/app/main.py` → `list_jobs()`

**Timeout:** 15s

**Request:**
```http
GET /v1/jobs
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "jobs": [
    {
      "id": 123,
      "title": "Senior Software Engineer",
      "department": "Engineering",
      "location": "Remote",
      "experience_level": "senior",
      "requirements": "5+ years Python, FastAPI, PostgreSQL",
      "description": "Join our team to build scalable HR solutions",
      "created_at": "2026-01-22T13:37:00Z"
    },
    {
      "id": 124,
      "title": "Product Manager",
      "department": "Product",
      "location": "San Francisco",
      "experience_level": "mid",
      "requirements": "3+ years product management",
      "description": "Lead product strategy for HR platform",
      "created_at": "2026-01-21T10:00:00Z"
    }
  ],
  "count": 2
}
```

**Error Responses:**
- 401 Unauthorized: Invalid authentication

**When Called:** Dashboard loads job list, candidate browses jobs

**Database Impact:** SELECT from jobs collection WHERE status='active'

---

### 19. POST /v1/jobs

**Purpose:** Create new job posting

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `create_job()`

**Timeout:** 10s

**Request:**
```http
POST /v1/jobs
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "location": "Remote",
  "experience_level": "senior",
  "requirements": "5+ years Python, FastAPI, PostgreSQL",
  "description": "Join our team to build scalable HR solutions",
  "employment_type": "Full-time"
}
```

**Response (201 Created):**
```json
{
  "message": "Job created successfully",
  "job_id": 123,
  "created_at": "2026-01-22T13:37:00Z"
}
```

**Sequence:**
1. Validate required fields (title, department, location, experience_level)
2. Insert into jobs collection with status='active'
3. Return job_id
4. Trigger job.created event for notifications

**Error Responses:**
- 400 Bad Request: Missing required fields
- 422 Unprocessable Entity: Invalid experience_level

**When Called:** Client creates job posting in portal

**Database Impact:** INSERT into jobs collection

---

## Gateway Candidate Management

### 20. GET /v1/candidates

**Purpose:** Get all candidates with pagination

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_all_candidates()`

**Timeout:** 15s

**Request:**
```http
GET /v1/candidates?limit=50&offset=0
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "experience_years": 5,
      "technical_skills": "Python, FastAPI, PostgreSQL, Docker",
      "seniority_level": "Senior",
      "education_level": "Bachelor",
      "created_at": "2026-01-22T13:37:00Z"
    }
  ],
  "total": 1234,
  "limit": 50,
  "offset": 0,
  "count": 1
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** HR dashboard loads candidate list

**Database Impact:** SELECT from candidates collection with LIMIT/OFFSET

---

### 21. POST /v1/candidates/bulk

**Purpose:** Bulk upload multiple candidates

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `bulk_upload_candidates()`

**Timeout:** 120s

**Request:**
```http
POST /v1/candidates/bulk
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "candidates": [
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1234567890",
      "location": "New York, NY",
      "experience_years": 3,
      "technical_skills": "JavaScript, React, Node.js",
      "seniority_level": "Mid",
      "education_level": "Bachelor",
      "resume_path": "/resumes/jane_smith.pdf",
      "status": "applied"
    },
    {
      "name": "Bob Johnson",
      "email": "bob.johnson@example.com",
      "phone": "+0987654321",
      "location": "Austin, TX",
      "experience_years": 7,
      "technical_skills": "Java, Spring Boot, Microservices",
      "seniority_level": "Senior",
      "education_level": "Master",
      "resume_path": "/resumes/bob_johnson.pdf",
      "status": "applied"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "Bulk upload completed",
  "candidates_received": 2,
  "candidates_inserted": 2,
  "errors": [],
  "total_errors": 0,
  "status": "success"
}
```

**Validation:**
- Email uniqueness check
- Required field: email
- Experience years: Non-negative integer
- Duplicate emails skipped with error message

**Error Responses:**
- 400 Bad Request: Invalid candidate data
- 409 Conflict: Duplicate emails

**When Called:** HR imports candidates from CSV/Excel

**Database Impact:** Multiple INSERT into candidates collection with transaction

---

### 22. GET /v1/candidates/{candidate_id}

**Purpose:** Get specific candidate by ID with full details

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidate_by_id()`

**Timeout:** 10s

**Request:**
```http
GET /v1/candidates/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidate": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "experience_years": 5,
    "technical_skills": "Python, FastAPI, PostgreSQL, Docker, Kubernetes",
    "seniority_level": "Senior",
    "education_level": "Bachelor of Science in Computer Science",
    "resume_path": "/resumes/john_doe_resume.pdf",
    "created_at": "2026-01-01T10:00:00Z",
    "updated_at": "2026-01-22T13:37:00Z"
  }
}
```

**Error Responses:**
- 404 Not Found: Candidate not found
- 401 Unauthorized: Invalid API key

**When Called:** HR views candidate profile details

**Database Impact:** SELECT from candidates collection WHERE id = candidate_id

---

### 23. GET /v1/candidates/search

**Purpose:** Search and filter candidates by criteria

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `search_candidates()`

**Timeout:** 20s

**Request:**
```http
GET /v1/candidates/search?skills=Python&location=San Francisco&experience_min=3
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "technical_skills": "Python, FastAPI, PostgreSQL",
      "experience_years": 5,
      "seniority_level": "Senior",
      "education_level": "Bachelor",
      "status": "active"
    }
  ],
  "filters": {
    "skills": "Python",
    "location": "San Francisco",
    "experience_min": 3
  },
  "count": 1
}
```

**Input Validation:**
- skills: Max 200 chars, alphanumeric + comma/space only
- location: Max 100 chars, alphanumeric + comma/space only
- experience_min: Non-negative integer

**Error Responses:**
- 400 Bad Request: Invalid filter format
- 401 Unauthorized: Invalid API key

**When Called:** HR searches for candidates matching criteria

**Database Impact:** SELECT with WHERE clauses using ILIKE for fuzzy matching

---

### 24. GET /v1/candidates/job/{job_id}

**Purpose:** Get candidates for specific job (dynamic matching)

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidates_by_job()`

**Timeout:** 15s

**Request:**
```http
GET /v1/candidates/job/123
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "candidates": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "skills": "Python, FastAPI, PostgreSQL",
      "experience": 5
    }
  ],
  "job_id": 123,
  "count": 1
}
```

**Error Responses:**
- 400 Bad Request: Invalid job_id (< 1)
- 404 Not Found: Job not found

**When Called:** HR views candidates for specific job

**Database Impact:** SELECT from candidates collection (limited to 10)

---

### 25. GET /v1/candidates/stats

**Purpose:** Get dynamic candidate statistics for dashboard

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_candidate_stats()`

**Timeout:** 20s

**Request:**
```http
GET /v1/candidates/stats
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "total_candidates": 1234,
  "active_jobs": 45,
  "recent_matches": 89,
  "pending_interviews": 23,
  "new_candidates_this_week": 67,
  "total_feedback_submissions": 456,
  "statistics_generated_at": "2026-01-22T13:37:00Z",
  "data_source": "real_time_database",
  "dashboard_ready": true
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key

**When Called:** Dashboard loads analytics panel

**Database Impact:** Multiple COUNT queries on candidates, jobs, matching_cache, interviews, feedback collections

---

## Gateway Analytics & Statistics

### 26. GET /v1/database/schema

**Purpose:** Get database schema information and version

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `get_database_schema()`

**Timeout:** 15s

**Request:**
```http
GET /v1/database/schema
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "schema_version": "1.0.0-mongodb",
  "applied_at": "2026-01-01T10:00:00Z",
  "total_collections": 18,
  "collections": [
    "candidates",
    "jobs",
    "feedback",
    "interviews",
    "offers",
    "users",
    "clients",
    "matching_cache",
    "audit_logs",
    "rate_limits",
    "csp_violations",
    "company_scoring_preferences",
    "workflows",
    "rl_predictions",
    "rl_feedback",
    "rl_model_performance",
    "rl_training_data",
    "job_applications"
  ],
  "phase3_enabled": true,
  "core_collections": [
    "candidates",
    "jobs",
    "feedback",
    "interviews",
    "offers",
    "users",
    "clients",
    "matching_cache",
    "audit_logs",
    "rate_limits",
    "csp_violations",
    "company_scoring_preferences"
  ],
  "checked_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid API key
- 500 Internal Server Error: Database connection failed

**When Called:** Admin checks database status, deployment verification

**Database Impact:** Query information_schema.collections, schema_version collection

---

### 27. GET /v1/reports/job/{job_id}/export.csv

**Purpose:** Export job report as CSV

**Authentication:** Bearer token required

**Implementation:** `services/gateway/app/main.py` → `export_job_report()`

**Timeout:** 30s

**Request:**
```http
GET /v1/reports/job/123/export.csv
Authorization: Bearer YOUR_API_KEY
```

**Response (200 OK):**
```json
{
  "message": "Job report export",
  "job_id": 123,
  "format": "CSV",
  "download_url": "/downloads/job_123_report.csv",
  "generated_at": "2026-01-22T13:37:00Z"
}
```

**Error Responses:**
- 404 Not Found: Job not found
- 401 Unauthorized: Invalid API key

**When Called:** HR exports job analytics report

**Database Impact:** Query job applications and related data

---

## Summary Table - Part 2

| Endpoint | Method | Category | Purpose | Auth Required | Timeout |
|----------|--------|----------|---------|---------------|---------|
| /v1/jobs | GET | Job Management | List jobs | Yes | 15s |
| /v1/jobs | POST | Job Management | Create job | Yes | 10s |
| /v1/candidates | GET | Candidate Mgmt | List candidates | Yes | 15s |
| /v1/candidates/bulk | POST | Candidate Mgmt | Bulk upload | Yes | 120s |
| /v1/candidates/{id} | GET | Candidate Mgmt | Get candidate | Yes | 10s |
| /v1/candidates/search | GET | Candidate Mgmt | Search candidates | Yes | 20s |
| /v1/candidates/job/{job_id} | GET | Candidate Mgmt | Get candidates by job | Yes | 15s |
| /v1/candidates/stats | GET | Analytics | Get statistics | Yes | 20s |
| /v1/database/schema | GET | Analytics | Get schema info | Yes | 15s |
| /v1/reports/job/{job_id}/export.csv | GET | Analytics | Export report | Yes | 30s |

**Total Endpoints in Part 2:** 18 (18-35 of 111)

---

**Continue to:** [API_CONTRACT_PART3.md](./API_CONTRACT_PART3.md) for Gateway Advanced Features