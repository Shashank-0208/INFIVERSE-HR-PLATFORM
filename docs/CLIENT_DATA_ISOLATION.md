# Client Data Isolation (client_id) – Analysis & Implementation

This document describes how **recruiter** data isolation works via `recruiter_id`, and how **client** isolation is implemented in a similar way using `client_id`.

---

## 1. How recruiter_id is used (database and API)

### Database schema
- **jobs**: Has `recruiter_id` (string). Set when a job is created by a recruiter (JWT); used to scope “this recruiter’s jobs.”
- **job_applications**: No `recruiter_id`. Isolation is via `job_id` → only jobs with matching `recruiter_id` are considered “recruiter’s jobs.”
- **interviews**, **offers**, **feedback**: No `recruiter_id`. Isolation is via `job_id` (job must belong to recruiter).

### API pattern
- **Auth**: Recruiter uses **CANDIDATE_JWT_SECRET_KEY**; payload has `role: "recruiter"` and `user_id` = recruiter id. Endpoints use `auth.get("type") == "jwt_token"` and `auth.get("role") == "recruiter"` and `auth.get("user_id")` as `recruiter_id`.
- **Helper**: `_recruiter_applicant_ids(db, recruiter_id, job_id=None)` returns candidate IDs that applied to recruiter’s jobs (optionally for one `job_id`). Implemented by:
  1. Getting job IDs: `jobs.find({"status": "active", "recruiter_id": recruiter_id})`
  2. Aggregating `job_applications` by `job_id` to get `candidate_id`s.
- **Endpoints that enforce recruiter isolation**:
  - **GET /v1/recruiter/jobs** – jobs where `recruiter_id` = auth user.
  - **GET /v1/recruiter/stats** – counts (applicants, shortlisted, interviews, offers, hired) only for recruiter’s jobs.
  - **GET /v1/candidates/autocomplete** – only candidates in `_recruiter_applicant_ids`.
  - **GET /v1/candidates/search** – only candidates in `_recruiter_applicant_ids` (optionally for one job).
  - **GET /v1/match/{job_id}/top** – only candidates who applied to recruiter’s jobs; response filtered to that set.
  - **GET /v1/interviews** – `match_filter["job_id"] in recruiter’s job_ids`.
  - **POST /v1/interviews** – `interview.job_id` must be in recruiter’s job_ids (403 otherwise).
  - **POST /v1/jobs** – sets `document["recruiter_id"] = auth.user_id` when role is recruiter.

---

## 2. How the system restricts recruiters to their own data

- **Jobs**: Only jobs with `recruiter_id` = JWT `user_id` are “theirs.” Listed via **GET /v1/recruiter/jobs** (not the public **GET /v1/jobs**).
- **Candidates**: Only candidates who appear in `job_applications` for those job IDs (via `_recruiter_applicant_ids`). Search/autocomplete/match are limited to this set.
- **Interviews / offers**: Filtered by `job_id in recruiter_job_ids` in GET endpoints; POST (e.g. schedule interview) checks that `job_id` is in recruiter’s jobs.

No schema change is required on `job_applications`, `interviews`, or `offers`; isolation is by `job_id` → `jobs.recruiter_id`.

---

## 3. How client_id is implemented (same idea as recruiter_id)

- **Auth**: Client uses **JWT_SECRET_KEY**; payload has `role: "client"` and `client_id` / `user_id` from client login. Endpoints use `auth.get("type") == "jwt_token"` and `auth.get("role") == "client"` and `auth.get("user_id")` as `client_id`.
- **Jobs**: **jobs** already has optional `client_id`. When a client creates a job, backend sets `document["client_id"] = auth.user_id`. Client sees only jobs where `client_id` = their id (via **GET /v1/client/jobs**).
- **Helper**: `_client_job_ids(db, client_id)` returns list of job IDs where `jobs.client_id == client_id` (and e.g. `status == "active"`). All other client scoping is “only data for these job_ids.”
- **Applications, interviews, offers**: No `client_id` on these collections; isolation is via `job_id` in `_client_job_ids`, same pattern as recruiter.

---

## 4. Database collections and client_id

| Collection          | Change for client isolation |
|---------------------|-----------------------------|
| **jobs**            | Already has optional `client_id`. Ensure it is set when a client creates a job (backend). No new field. |
| **job_applications**| No change. Isolated by `job_id` ∈ client’s job_ids. |
| **interviews**      | No change. Isolated by `job_id` ∈ client’s job_ids. |
| **offers**          | No change. Isolated by `job_id` ∈ client’s job_ids. |
| **candidates**      | No change. Client sees candidates only via applications/matches for their jobs. |
| **clients**         | Already exists (client login/register). No schema change. |

So: **no new tables or new columns**; only consistent use of `jobs.client_id` and scoping by client’s job_ids in APIs.

---

## 5. API endpoints updated for client isolation

| Endpoint | Change |
|----------|--------|
| **POST /v1/jobs** | When auth is client, set `document["client_id"] = str(auth.get("user_id"))`. |
| **GET /v1/client/jobs** | **New.** Like **GET /v1/recruiter/jobs**: return only jobs where `client_id` = auth user; include applicant/shortlist counts. |
| **GET /v1/client/stats** | When auth is client, compute stats only for `_client_job_ids(db, client_id)`. API key can keep “all jobs” for backward compatibility. |
| **GET /v1/jobs** | Left as **public** (all active jobs) for candidate job search. Client portal uses **GET /v1/client/jobs** instead. |
| **GET /v1/jobs/{job_id}** | When auth is client, return 403 if `job_id` not in `_client_job_ids`. |
| **GET /v1/match/{job_id}/top** | When auth is client, require `job_id` ∈ client’s job_ids; else 403. |
| **GET /v1/interviews** | When auth is client, add `match_filter["job_id"] in _client_job_ids`. |
| **GET /v1/offers** | When auth is client, add filter by client’s job_ids (and optionally recruiter’s job_ids when auth is recruiter). |
| **GET /v1/candidates/job/{job_id}** | When auth is client, require `job_id` in client’s job_ids; else 403. |
| **POST /v1/jobs/{job_id}/shortlist** | When auth is client, require `job_id` in client’s job_ids; else 403. |
| **POST /v1/interviews** | When auth is client, require `interview.job_id` in client’s job_ids; else 403. |

---

## 6. Authentication and client_id in JWT

- **Client login** (e.g. **POST /v1/client/login**): Issues JWT with **JWT_SECRET_KEY**, payload includes:
  - `sub`, `client_id`, `user_id` = client id
  - `role: "client"`
- **Gateway get_auth** (e.g. in `jwt_auth.py`): For that token, validates with **JWT_SECRET_KEY** and returns:
  - `type: "jwt_token"`
  - `user_id` from payload (client_id)
  - `role` from payload (`"client"`)
- **Enforcement**: Any endpoint that should be client-scoped checks `auth.get("role") == "client"` and uses `auth.get("user_id")` as `client_id` for `_client_job_ids` and ownership checks. No extra “client_id claim” logic is needed beyond the existing JWT and get_auth.

---

## 7. Frontend changes for client-specific data

- **New API**: Add `getClientJobs()` that calls **GET /v1/client/jobs** (with client JWT). Returns only that client’s jobs.
- **Client portal usage**: In client-only flows, use **client-scoped jobs** instead of the public list:
  - **Dashboard** – use `getClientJobs()` (and existing `getClientStats()` which is now client-scoped).
  - **Match Results** – use `getClientJobs()` for the job dropdown and only allow match for those jobs (backend already enforces).
  - **Client Candidates** – use `getClientJobs()` for job selection.
  - **Client Reports** – use `getClientJobs()` and client-scoped stats/interviews/offers (backend enforces).
  - **Job Posting (list)** – use `getClientJobs()` so they see only their jobs after create.
- **Auth**: Client portal already uses client login and sends JWT; no change to auth flow. Backend enforces isolation even if frontend called public endpoints by mistake.
- **Recruiter vs client**: Recruiter portal keeps using `getRecruiterJobs()` and recruiter-scoped endpoints; candidate job search keeps using `getJobs()` (public). Only client portal switches to `getClientJobs()` for listing their jobs.

---

## 8. Connection_id sync and client dashboard

- **Recruiter posts with connection_id**: Backend sets `job.client_id` to that client, so the job is in the client’s pool immediately.
- **Client dashboard**: **GET /v1/client/jobs** and **GET /v1/client/stats** use the authenticated client’s `client_id` from JWT. No client_id param; 403 for non-client on stats.

---

## 9. Connected recruiters (multi-recruiter per client): blended job set

A **client can have multiple recruiters connected** at the same time. Each connection is one document in `client_connected_recruiter` with composite key `(client_id, recruiter_id)`. A recruiter can be connected to only one client at a time (confirming a new client disconnects them from the previous one).

- **Helpers**:
  - `_client_connected_recruiter_ids(db, client_id)` – returns the list of recruiter_ids connected to this client (all documents with that `client_id`).
  - `_client_job_ids_for_dashboard(db, client_id)` – active job IDs = client’s own jobs **union** all active jobs where `recruiter_id` is in the connected recruiter list. When no recruiters connected, returns only client’s jobs.
  - `_client_all_job_ids_for_dashboard(db, client_id)` – same for all statuses (used for stats).

- **When connected (one or more recruiters)**: **GET /v1/client/jobs**, **GET /v1/client/stats**, and all client-scoped job access use the dashboard job set (client jobs + all connected recruiters’ jobs), so the client sees and can act on every connected recruiter’s jobs with proper isolation per recruiter-client pair.
- **When disconnected**: Endpoints use only jobs where `client_id` = logged-in client; recruiter jobs drop out when that recruiter disconnects. Data isolation is preserved by recomputing from `client_connected_recruiter` on each request.
- **Client sidebar**: **GET /v1/client/connected-recruiter** returns `connected_count` and `status`; the UI shows the number of recruiters connected (e.g. “2 recruiters connected”), not individual names.

---

## Summary

- **Recruiter isolation**: `recruiter_id` on **jobs**; helper `_recruiter_applicant_ids`; all relevant endpoints filter by recruiter’s job_ids or applicant set.
- **Client isolation**: `client_id` on **jobs**; helper `_client_job_ids`; same pattern: scope jobs, then applications/interviews/offers by those job_ids. JWT already carries `role: "client"` and `user_id` (client_id).
- **DB**: Only **jobs** needs `client_id` (already present); no other schema changes.
- **Frontend**: One new function `getClientJobs()` and use it everywhere in the client portal where “list my jobs” is needed.
