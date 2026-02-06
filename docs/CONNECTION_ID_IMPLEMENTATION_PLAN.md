# Connection ID – Implementation Plan (Client–Recruiter Real-Time Link)

This document describes how **connection_id** is used to link recruiters to clients for job posting and live monitoring, replacing the previous **client_id** input on the Recruiter Job Posting page.

---

## 1. connection_id Generation and Format

- **Format**: 24-character hexadecimal string (same style as MongoDB ObjectId string representation), e.g. `69820a17e7a0f72f1ead7aca`.
- **Generation**: One-time, at **client registration** only. Generate using a cryptographically safe 24-hex value, e.g. `ObjectId().hex` (bson) or `secrets.token_hex(12)`.
- **Uniqueness**: Must be unique across all clients. Stored in `clients.connection_id` with a unique index (or enforce uniqueness in application logic on insert).
- **Immutability**: Once set at registration, it is not changed. Clients share this single ID with recruiters.

---

## 2. Where connection_id Is Stored

| Location | Purpose |
|----------|---------|
| **clients** collection | New field `connection_id` (string, unique). Set once on client registration. |
| **jobs** collection | No change: jobs continue to store **client_id** (string). When a recruiter creates a job with **connection_id**, the backend resolves `connection_id` → `client_id` (via clients collection) and saves `client_id` on the job. So existing data isolation and ClientJobsMonitor logic remain unchanged. |

No new collections. No change to job_applications, interviews, or offers.

---

## 3. Client Dashboard: Display connection_id

- **Data source**: Authenticated client’s profile. New endpoint **GET /v1/client/profile** (or include in existing client/stats) returning `connection_id` for the logged-in client.
- **UI**: Add a “Recruiter connection” (or “Connection ID”) card/section on the Client Dashboard that:
  - Shows the **connection_id** clearly.
  - Explains that the client should share this ID with recruiters so they can post jobs for them.
  - Provides a **Copy** button to copy the ID to the clipboard.
- **When**: Fetched on dashboard load (e.g. with existing stats or a dedicated profile call). No need to show it on other client pages unless product wants it elsewhere.

---

## 4. Recruiter Job Posting: Replace client_id with connection_id

- **Current behavior**: Recruiter Job Posting page has a numeric **Client ID** field (e.g. 1, 2, …). Job is created with that value (or mapped) and stored as `client_id` on the job.
- **New behavior**:
  - **Remove** the numeric Client ID field (and +/- buttons).
  - **Add** a single text field: **Connection ID** (required when posting on behalf of a client).
  - Field is **editable**: recruiter can paste or type the ID, and correct it if wrong.
  - **Validation**:
    - Format: 24 hex characters (optional: allow with or without separators; normalize before sending).
    - Existence: Before submit (and optionally on blur), call an API that checks whether the connection_id exists (e.g. **GET /v1/client/by-connection/{connection_id}**). If invalid: show a **popup/warning** (e.g. “Invalid Connection ID. Please ask your client for the correct ID.”). Optionally show company name when valid (“Linked to: Acme Corp”).
  - **Submit**: Send **connection_id** in the job creation payload. Backend resolves to **client_id** and stores **client_id** on the job. No **client_id** in the recruiter form anymore.
- **Logic change**: Recruiter no longer chooses “which client” by a numeric id; they choose by the client’s **connection_id**. Backend is the single source of truth for mapping connection_id → client_id.

---

## 5. Real-Time Monitoring Logic (connection_id vs job_id)

- **Existing behavior**: Client sees “their” jobs and stats because jobs are stored with **client_id** and the client is identified by JWT (client_id). Client dashboard and reports use **getClientJobs()** / **getClientStats()** which are already scoped by client.
- **After introducing connection_id**:
  - Recruiter enters **connection_id** when creating a job → backend resolves to **client_id** and saves **client_id** on the job.
  - So the **link** is: connection_id (shared by client) → client_id (stored on job). Client continues to see all jobs where `job.client_id` = their own client_id.
  - **No change** to how “real-time” data is fetched for the client: same 30s refresh, same endpoints (getClientJobs, getClientStats, etc.). The only change is **how** the job gets associated with the client (via connection_id at job creation time).
- **Recruiter-side “Client Jobs Monitor”**: Continues to group/filter by **job.client_id**. Since jobs still have **client_id** (resolved from connection_id), no change needed. If desired, the UI could later show “connection_id” or “company name” by looking up the client from job.client_id; that’s an optional enhancement.
- **Summary**: No change to real-time *fetching* logic; only the **input** on the Recruiter Job Posting page changes from client_id to connection_id, with backend resolving connection_id → client_id once at job creation.

---

## 6. API Endpoint Changes

| Endpoint | Change |
|----------|--------|
| **POST /v1/client/register** | Generate **connection_id** (24-hex, unique), store in `clients.connection_id`, return it in the registration response so the client (or frontend) can display it. |
| **GET /v1/client/profile** (new) | Returns `{ client_id, company_name, connection_id }` for the authenticated client (JWT). Used by Client Dashboard to show and copy connection_id. |
| **GET /v1/client/by-connection/{connection_id}** (new) | Returns minimal client info (e.g. `client_id`, `company_name`) if the connection_id exists; otherwise 404. Used by the recruiter form to validate the ID and optionally show “Linked to: Company Name”. Can require recruiter or API key auth. |
| **POST /v1/jobs** | Accept optional **connection_id** (string). If present: resolve to client_id via `clients.find_one({"connection_id": connection_id})`; if not found, return 400 with a clear error (“Invalid connection ID”); if found, set `document["client_id"] = client["client_id"]`. If **connection_id** is not provided, keep existing behavior (optional client_id from body or from recruiter JWT if applicable). |

---

## 7. Frontend Component Changes

### Client interface
- **ClientDashboard**
  - Call **GET /v1/client/profile** (or get connection_id from an extended stats/profile response).
  - Add a “Connection ID” or “Recruiter connection” card that displays the ID and a Copy button; short helper text that the client should share this with recruiters.

### Recruiter interface
- **JobCreation (Job Posting)**
  - Remove the Client ID number input and +/- buttons.
  - Add a required **Connection ID** text input (placeholder e.g. “Paste connection ID from your client”).
  - Optional: on Blur, call **GET /v1/client/by-connection/{connection_id}**; if 404 or error, show a **popup/warning** (“Invalid Connection ID. Please check and try again.”). If 200, optionally show a small success message or “Linked to: &lt;company_name&gt;”.
  - On submit, send **connection_id** (and other job fields) to **POST /v1/jobs**. On 400 “Invalid connection ID”, show the same popup/warning and do not navigate away.
- **ClientJobsMonitor**
  - No change required; it still groups by `job.client_id`. Jobs will still have client_id set (from backend resolution of connection_id).

### API layer (frontend)
- Add `getClientProfile()` → GET /v1/client/profile.
- Add `validateConnectionId(connectionId: string)` or `getClientByConnectionId(connectionId: string)` → GET /v1/client/by-connection/{id}.
- **createJob** payload: send **connection_id** instead of **client_id** (or send both if backend accepts connection_id and prefers it).

---

## 8. Error Handling and Popup Warnings (Recruiter)

- **Invalid format**: If the connection_id is not 24 hex characters, show inline or popup: “Connection ID must be 24 characters (letters and numbers).”
- **Not found**: When validation API returns 404 (or job create returns 400 for invalid connection_id), show popup: “Invalid Connection ID. Please ask your client for the correct ID from their dashboard.”
- **Network/API error**: “Could not verify Connection ID. Please check your connection and try again.”
- Recruiter can correct the field and retry without leaving the page.

---

## 9. Summary

- **connection_id**: Generated once at client registration; 24-hex, unique; stored in **clients.connection_id**.
- **Client dashboard**: Shows connection_id and offers a copy button; data from GET /v1/client/profile.
- **Recruiter job posting**: Single Connection ID text field (replacing Client ID); validated via GET /v1/client/by-connection/{id}; errors shown with popup warnings; payload sends connection_id to POST /v1/jobs.
- **Backend**: Resolves connection_id → client_id when creating a job; jobs still store client_id; no change to client-side real-time fetching or recruiter Client Jobs Monitor logic.
- **APIs**: POST /v1/client/register (generate + return connection_id), GET /v1/client/profile, GET /v1/client/by-connection/{id}, POST /v1/jobs (accept connection_id and resolve to client_id).
