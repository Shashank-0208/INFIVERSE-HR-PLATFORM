# AI Candidate Shortlist – Timeout, Fallback, and Loading Behavior

**Updated**: January 2026  
**Scope**: AI shortlist tab (ApplicantsMatching), 60s timeout, fallback, candidate data loading, and role redirect on reload.

---

## 1. 60-Second Timeout and Fallback (AI Shortlist Tab)

### Backend (Gateway)
- **Endpoint**: `GET /v1/match/{job_id}/top`
- **Timeout**: Configurable via `AGENT_MATCH_TIMEOUT`; **default is 60 seconds** so the AI shortlist can use full AI/ML matching when the Agent is healthy.
- **Behavior**: Gateway calls the Agent service with this timeout. If the Agent does not respond within the timeout or returns an error, the gateway uses **fallback matching** (DB-based keyword/location scoring) and returns those results so the UI always gets a response.
- **Env**: In `.env`, `AGENT_MATCH_TIMEOUT=60` (default). Set lower (e.g. 20) for faster fallback when the Agent is slow or unreliable.

### Frontend
- **Request timeout**: Match requests use a **70-second** client timeout (`MATCH_REQUEST_TIMEOUT_MS` in `api.ts`) so the gateway’s 60s (or configured) window can complete before the frontend times out.
- **Result**: Both AI-powered matching and DB fallback remain feasible; the user sees either AI results or fallback results without a generic timeout error.

---

## 2. Candidate Data Loading on the AI Shortlist Tab

### Current Behavior (After Fix)
- **Automatic loading**: Candidate data **loads automatically** when:
  1. The user opens the tab **with a job in the URL** (e.g. `/recruiter/applicants/:jobId` or `?jobId=...`).
  2. The user opens the tab **without a job in the URL**: jobs are fetched, the **first job is auto-selected**, and candidates for that job are then loaded automatically.
  3. The user **changes the job** in the dropdown: candidates for the newly selected job load automatically.
- **Manual triggers**: Data is also loaded when the user clicks **“Generate AI Shortlist”** or **“Refresh”** (same underlying `loadData()`).
- **Auto-refresh**: When candidates are already loaded, the list auto-refreshes every **30 seconds** for the current job.

### Alignment with Intended UX
- **Intended**: Candidates should appear automatically after a few seconds when the recruiter is on the AI shortlist tab with a job selected, without requiring a button click.
- **Implementation**: The effect that runs `loadData()` now depends only on `jobId`. Whenever `jobId` is set (from URL, from “first job” auto-selection, or from the dropdown), candidates load automatically. This matches the intended experience.

### Previous Behavior (Before Fix)
- Candidates loaded only when `jobId === effectiveJobId` (i.e. when the selected job matched the job in the URL). Opening the tab without a job in the URL (e.g. `/recruiter/screening`) did not auto-load candidates even after the first job was auto-selected; the user had to click “Generate AI Shortlist” or “Refresh” to see data.

---

## 3. Role Redirect on Page Load (Post-Deployment)

### Issue
After deployment, on full page load, the app was redirecting **all** authenticated users (candidate, recruiter, client) to the **candidate portal** and candidate dashboard, instead of keeping each user in their role-specific portal.

### Cause
On init, auth was restored from `localStorage` (`user_data` + `auth_token`). The **role** used for redirects was taken from `user.role` or `localStorage.getItem('user_role')`. If `user_data` did not contain a role (e.g. older stored shape) or `user_role` was missing/cleared (e.g. after deploy or different origin), the UI could treat the user as having no role or default to candidate.

### Fix (AuthContext)
- On **initial load**, when restoring session from a valid JWT and `user_data`:
  1. **Role is taken from the JWT payload** (`payload.role`).
  2. Only values `candidate`, `recruiter`, or `client` are accepted; otherwise fallback to parsed user role or `user_role` in localStorage.
  3. The restored user object is set with this **role**, and `localStorage.setItem('user_role', role)` is called so subsequent reads are consistent.
- **PublicRoute** and **ProtectedRoute** already redirect by `userRole` to the correct dashboard (`/candidate/dashboard`, `/recruiter`, `/client`). With role now derived from the token on reload, recruiters and clients stay on their portals after a full page load or deployment.

---

## Summary

| Item | Implementation |
|------|-----------------|
| **60s timeout (AI shortlist)** | Gateway default `AGENT_MATCH_TIMEOUT=60`; frontend match timeout 70s. |
| **Fallback** | Gateway uses DB fallback when Agent times out or errors; UI always gets a response. |
| **Candidate data loading** | Auto-loads when a job is selected (URL, first job, or dropdown); no button required. |
| **Role redirect on load** | Role restored from JWT payload on init; recruiter/client stay on correct portal. |
