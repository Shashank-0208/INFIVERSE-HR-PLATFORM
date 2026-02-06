# Connection ID and Client ID – Frontend Exposure Analysis

This document summarizes where `connection_id` and `client_id` appear in the frontend and confirms they are only used in intended contexts.

## Intended exposure

- **connection_id** may appear only in:
  1. **Recruiter – Job Creation page**: Entered/pasted for job posting and displayed when locked.
  2. **Recruiter – Sidebar**: Shown as connection status below “API Online” when a connection is established (company name or “Connection no longer valid”).
  3. **Client – Dashboard**: Displayed for the client to copy and share with recruiters.

- **client_id** (internal identifier) may appear in:
  - Client auth (session/storage) and client-only APIs.
  - Recruiter views that need to associate jobs with a client (e.g. Live Client Jobs Monitor), using the job’s `client_id` for grouping/labels only.

## Analysis results

### connection_id / connectionId

| Location | Role | Purpose | Status |
|----------|------|---------|--------|
| `JobCreation.tsx` | Recruiter | Input, lock, display when locked | ✓ Intended |
| `RecruiterSidebar.tsx` | Recruiter | Connection status block below API Online | ✓ Intended |
| `RecruiterConnectionContext.tsx` | Recruiter | Persist and revalidate connection; feeds sidebar | ✓ Intended |
| `ClientDashboard.tsx` | Client | Show connection_id for copying | ✓ Intended |
| `api.ts` | – | `getClientByConnectionId`, `ClientProfile.connection_id` | ✓ Backend/API only |

- **Candidates**: No references to `connection_id` or `connectionId` in candidate pages or candidate-specific components. **No exposure.**
- **Other client pages**: Only `ClientDashboard` uses `connection_id` (via `getClientProfile()`). Other client pages do not display or use it. **No leakage.**

### client_id / clientId

| Location | Role | Purpose | Status |
|----------|------|---------|--------|
| `authStorage.ts`, `authService.ts`, `AuthContext.tsx` | Client | Store/use client identity after login/register | ✓ Auth only |
| `ClientJobsMonitor.tsx` | Recruiter | Group jobs by `job.client_id`, show “Client &lt;id&gt;” in dropdown/cards | ✓ Intended (recruiter view of job–client link) |
| `api.ts` | – | `getShortlistedCandidates(clientId?)`, `getClientByConnectionId` return value | ✓ API only |

- **Candidates**: No use of `client_id` in candidate UI. **No exposure.**
- **Recruiters**: See `client_id` only in Live Client Jobs Monitor to group and label jobs by client. No `connection_id` is shown there. **Appropriate.**

## Conclusion

- **connection_id** is only used and displayed in the three intended places: recruiter Job Creation, recruiter sidebar, and client dashboard. It is not exposed to candidates or on other client/recruiter pages.
- **client_id** is used for client auth and for recruiter job–client grouping (Client Jobs Monitor) only. No inappropriate exposure or leakage was found.

## Recommendations

- Keep `connection_id` out of URLs and logs in production.
- Ensure `/v1/client/profile` and `/v1/client/by-connection/:id` remain protected so only the correct roles (client for profile, recruiter for by-connection) can access them.
