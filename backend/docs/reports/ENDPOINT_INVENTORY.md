# BHIV HR Platform - Complete Endpoint Inventory (89 Total)

## Gateway Service (80 endpoints)

### Core API Endpoints (5)
1. `GET /openapi.json` - OpenAPI Schema
2. `GET /docs` - API Documentation  
3. `GET /` - API Root Information
4. `GET /health` - Health Check
5. `GET /v1/test-candidates` - Database Connectivity Test

### Job Management (2)
6. `POST /v1/jobs` - Create New Job Posting
7. `GET /v1/jobs` - List All Active Jobs

### Candidate Management (5)
8. `GET /v1/candidates` - Get All Candidates with Pagination
9. `GET /v1/candidates/search` - Search & Filter Candidates
10. `GET /v1/candidates/job/{job_id}` - Get Candidates by Job
11. `GET /v1/candidates/{candidate_id}` - Get Specific Candidate by ID
12. `POST /v1/candidates/bulk` - Bulk Upload Candidates

### AI Matching Engine (2)
13. `GET /v1/match/{job_id}/top` - AI-powered Candidate Matching
14. `POST /v1/match/batch` - Batch AI Matching

### Assessment & Workflow (5)
15. `POST /v1/feedback` - Values Assessment
16. `GET /v1/feedback` - Get All Feedback Records
17. `GET /v1/interviews` - Get All Interviews
18. `POST /v1/interviews` - Schedule Interview
19. `POST /v1/offers` - Job Offers Management
20. `GET /v1/offers` - Get All Job Offers

### Analytics & Statistics (3)
21. `GET /v1/candidates/stats` - Candidate Statistics
22. `GET /v1/database/schema` - Database Schema Information
23. `GET /v1/reports/job/{job_id}/export.csv` - Export Job Report

### Client Portal API (2)
24. `POST /v1/client/register` - Client Registration
25. `POST /v1/client/login` - Client Authentication

### Security Testing (11)
26. `GET /v1/security/rate-limit-status` - Check Rate Limit Status
27. `GET /v1/security/blocked-ips` - View Blocked IPs
28. `POST /v1/security/test-input-validation` - Test Input Validation
29. `POST /v1/security/validate-email` - Email Validation
30. `POST /v1/security/test-email-validation` - Test Email Validation
31. `POST /v1/security/validate-phone` - Phone Validation
32. `POST /v1/security/test-phone-validation` - Test Phone Validation
33. `GET /v1/security/test-headers` - Security Headers Test
34. `GET /v1/security/security-headers-test` - Test Security Headers Legacy
35. `POST /v1/security/penetration-test` - Penetration Test
36. `GET /v1/security/test-auth` - Test Authentication
37. `GET /v1/security/penetration-test-endpoints` - Penetration Testing Endpoints

### CSP Management (4)
38. `POST /v1/security/csp-report` - CSP Violation Reporting
39. `GET /v1/security/csp-violations` - View CSP Violations
40. `GET /v1/security/csp-policies` - Current CSP Policies
41. `POST /v1/security/test-csp-policy` - Test CSP Policy

### Two-Factor Authentication (8)
42. `POST /v1/auth/2fa/setup` - Setup 2FA
43. `POST /v1/auth/2fa/verify` - Verify 2FA
44. `POST /v1/auth/2fa/login` - 2FA Login
45. `GET /v1/auth/2fa/status/{user_id}` - 2FA Status
46. `POST /v1/auth/2fa/disable` - Disable 2FA
47. `POST /v1/auth/2fa/backup-codes` - Generate Backup Codes
48. `POST /v1/auth/2fa/test-token` - Test 2FA Token
49. `GET /v1/auth/2fa/qr/{user_id}` - QR Code Generation

### Password Management (6)
50. `POST /v1/auth/password/validate` - Validate Password
51. `GET /v1/auth/password/generate` - Generate Password
52. `GET /v1/auth/password/policy` - Password Policy
53. `POST /v1/auth/password/change` - Change Password
54. `POST /v1/auth/password/strength` - Test Password Strength
55. `GET /v1/auth/password/security-tips` - Security Tips

### Candidate Portal (5)
56. `POST /v1/candidate/register` - Candidate Registration
57. `POST /v1/candidate/login` - Candidate Login
58. `PUT /v1/candidate/profile/{candidate_id}` - Update Candidate Profile
59. `POST /v1/candidate/apply` - Apply for Job
60. `GET /v1/candidate/applications/{candidate_id}` - Get Candidate Applications

### Monitoring (3)
61. `GET /metrics` - Prometheus Metrics Export
62. `GET /health/detailed` - Detailed Health Check with Metrics
63. `GET /metrics/dashboard` - Metrics Dashboard Data

### LangGraph Integration (11)
64. `POST /api/v1/workflow/trigger` - Trigger Workflow
65. `GET /api/v1/workflow/status/{workflow_id}` - Get Workflow Status
66. `GET /api/v1/workflow/list` - List Workflows
67. `GET /api/v1/workflow/health` - Check LangGraph Health
68. `POST /api/v1/webhooks/candidate-applied` - Webhook Candidate Applied
69. `POST /api/v1/webhooks/candidate-shortlisted` - Webhook Candidate Shortlisted
70. `POST /api/v1/webhooks/interview-scheduled` - Webhook Interview Scheduled
71. `GET /api/v1/workflows` - List All Workflows
72. `POST /api/v1/workflows/start` - Start New Workflow
73. `GET /api/v1/workflows/{workflow_id}` - Get Workflow Details
74. `POST /api/v1/workflows/{workflow_id}/resume` - Resume Workflow

## Agent Service (6 endpoints)

### Core API Endpoints (2)
75. `GET /` - AI Service Information
76. `GET /health` - Health Check

### AI Matching Engine (2)
77. `POST /match` - AI-Powered Candidate Matching
78. `POST /batch-match` - Batch AI Matching for Multiple Jobs

### Candidate Analysis (1)
79. `GET /analyze/{candidate_id}` - Detailed Candidate Analysis

### System Diagnostics (1)
80. `GET /test-db` - Database Connectivity Test

## LangGraph Service (9 endpoints)

### Core API Endpoints (2)
81. `GET /` - LangGraph Service Information
82. `GET /health` - Health Check

### Workflow Management (2)
83. `POST /workflows/application/start` - Start Application Workflow
84. `POST /workflows/{workflow_id}/resume` - Resume Workflow

### Workflow Monitoring (3)
85. `GET /workflows/{workflow_id}/status` - Get Workflow Status
86. `GET /workflows` - List Workflows
87. `GET /workflows/stats` - Get Workflow Stats

### Communication Tools (1)
88. `POST /tools/send-notification` - Send Notification

### System Diagnostics (1)
89. `GET /test-integration` - Test Integration

---

## Summary by Service

| Service | Endpoints | Status |
|---------|-----------|--------|
| **Gateway** | 74 | ✅ All implemented |
| **Agent** | 6 | ✅ All implemented |
| **LangGraph** | 9 | ✅ All implemented |
| **Total** | **89** | ✅ **Complete** |

## Authentication Requirements

- **API Key Required**: 83 endpoints (93%)
- **JWT Token Compatible**: 6 endpoints (7%)
- **No Auth Required**: 0 endpoints (0%)

All endpoints require proper authentication for security.