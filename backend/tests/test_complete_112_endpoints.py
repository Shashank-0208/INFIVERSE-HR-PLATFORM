#!/usr/bin/env python3
"""BHIV HR Platform - Complete 112 Endpoint Test Suite"""
import requests, json, time, os
from datetime import datetime

BASE_URLS = {
    "gw": os.getenv("GATEWAY_SERVICE_URL", "http://localhost:8000"),
    "ag": os.getenv("AGENT_URL", "http://localhost:9000"),
    "lg": os.getenv("LANGGRAPH_URL", "http://localhost:9001")
}
API_KEY = os.getenv("API_KEY_SECRET", "prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o")
results = []

def test(name, method, url, headers=None, data=None, exp=200):
    try:
        start = time.time()
        r = requests.request(method, url, headers=headers, json=data, timeout=30)
        t = time.time() - start
        ok = r.status_code == exp
        results.append({"name": name, "ok": ok, "time": f"{t:.2f}s", "code": r.status_code})
        return ok, f"{'PASS' if ok else 'FAIL'} {r.status_code}", t
    except Exception as e:
        results.append({"name": name, "ok": False, "time": "ERR", "code": 0})
        return False, f"FAIL ERR", 0

def run():
    gw, ag, lg = BASE_URLS["gw"], BASE_URLS["ag"], BASE_URLS["lg"]
    auth = {"Authorization": f"Bearer {API_KEY}"}
    
    tests = [
        # GW Core (5)
        ("GW-Root", "GET", f"{gw}/", None, None, 200),
        ("GW-Health", "GET", f"{gw}/health", None, None, 200),
        ("GW-OpenAPI", "GET", f"{gw}/openapi.json", None, None, 200),
        ("GW-Docs", "GET", f"{gw}/docs", None, None, 200),
        ("GW-TestDB", "GET", f"{gw}/v1/test-candidates", auth, None, 200),
        # GW Jobs (2)
        ("GW-CreateJob", "POST", f"{gw}/v1/jobs", auth, {"title":"Test","department":"Eng","location":"Remote","experience_level":"senior","requirements":"Python","description":"Test"}, 201),
        ("GW-ListJobs", "GET", f"{gw}/v1/jobs", auth, None, 200),
        # GW Candidates (6)
        ("GW-ListCandidates", "GET", f"{gw}/v1/candidates", auth, None, 200),
        ("GW-CandidateStats", "GET", f"{gw}/v1/candidates/stats", auth, None, 200),
        ("GW-SearchCandidates", "GET", f"{gw}/v1/candidates/search?skills=Python", auth, None, 200),
        ("GW-CandidatesByJob", "GET", f"{gw}/v1/candidates/job/1", auth, None, 200),
        ("GW-CandidateByID", "GET", f"{gw}/v1/candidates/1", auth, None, 200),
        ("GW-BulkUpload", "POST", f"{gw}/v1/candidates/bulk", auth, {"candidates":[{"name":"Test","email":"test@ex.com"}]}, 200),
        # GW Analytics (2)
        ("GW-Schema", "GET", f"{gw}/v1/analytics/schema", auth, None, 200),
        ("GW-Export", "GET", f"{gw}/v1/analytics/export", auth, None, 200),
        # GW AI Matching (2)
        ("GW-TopMatches", "GET", f"{gw}/v1/match/1/top", auth, None, 200),
        ("GW-BatchMatch", "POST", f"{gw}/v1/match/batch", auth, {"job_ids":[1,2]}, 200),
        # GW Assessment (6)
        ("GW-SubmitFeedback", "POST", f"{gw}/v1/feedback", auth, {"candidate_id":1,"job_id":1,"integrity":5,"honesty":5,"discipline":4,"hard_work":5,"gratitude":4}, 200),
        ("GW-GetFeedback", "GET", f"{gw}/v1/feedback", auth, None, 200),
        ("GW-ListInterviews", "GET", f"{gw}/v1/interviews", auth, None, 200),
        ("GW-ScheduleInterview", "POST", f"{gw}/v1/interviews", auth, {"candidate_id":1,"job_id":1,"interview_date":"2025-12-20T10:00:00Z"}, 201),
        ("GW-CreateOffer", "POST", f"{gw}/v1/offers", auth, {"candidate_id":1,"job_id":1,"salary":100000,"start_date":"2026-01-15","terms":"Full-time"}, 201),
        ("GW-ListOffers", "GET", f"{gw}/v1/offers", auth, None, 200),
        # GW Client Portal (2)
        ("GW-ClientRegister", "POST", f"{gw}/v1/client/register", None, {"client_id":"test123","company_name":"Test","password":"Test123!"}, 201),
        ("GW-ClientLogin", "POST", f"{gw}/v1/client/login", None, {"client_id":"TECH001","password":"demo123"}, 200),
        # GW Security (12)
        ("GW-RateLimitStatus", "GET", f"{gw}/v1/security/rate-limit-status", auth, None, 200),
        ("GW-BlockedIPs", "GET", f"{gw}/v1/security/blocked-ips", auth, None, 200),
        ("GW-TestInputValidation", "POST", f"{gw}/v1/security/test-input-validation", auth, {"input_data":"test"}, 200),
        ("GW-ValidateEmail", "POST", f"{gw}/v1/security/validate-email", auth, {"email":"test@example.com"}, 200),
        ("GW-ValidatePhone", "POST", f"{gw}/v1/security/validate-phone", auth, {"phone":"+1234567890"}, 200),
        ("GW-SecurityHeaders", "GET", f"{gw}/v1/security/security-headers-test", None, None, 200),
        ("GW-PentestEndpoints", "GET", f"{gw}/v1/security/penetration-test-endpoints", auth, None, 200),
        ("GW-TestXSS", "POST", f"{gw}/v1/security/test-xss", auth, {"input":"test"}, 200),
        ("GW-TestSQLInjection", "POST", f"{gw}/v1/security/test-sql-injection", auth, {"input":"test"}, 200),
        ("GW-TestCSRF", "GET", f"{gw}/v1/security/test-csrf", auth, None, 200),
        ("GW-SecurityAudit", "GET", f"{gw}/v1/security/audit", auth, None, 200),
        ("GW-SecurityReport", "GET", f"{gw}/v1/security/report", auth, None, 200),
        # GW CSP (4)
        ("GW-CSPReport", "POST", f"{gw}/v1/csp/report", None, {"violated-directive":"test"}, 200),
        ("GW-CSPViolations", "GET", f"{gw}/v1/csp/violations", auth, None, 200),
        ("GW-CSPPolicies", "GET", f"{gw}/v1/csp/policies", auth, None, 200),
        ("GW-CSPTestPolicy", "GET", f"{gw}/v1/csp/test-policy", None, None, 200),
        # GW 2FA (8)
        ("GW-2FASetup", "POST", f"{gw}/v1/auth/2fa/setup", auth, {"user_id":1}, 200),
        ("GW-2FAVerify", "POST", f"{gw}/v1/auth/2fa/verify", auth, {"user_id":1,"code":"123456"}, 200),
        ("GW-2FALogin", "POST", f"{gw}/v1/auth/2fa/login", None, {"username":"test","password":"test"}, 200),
        ("GW-2FAStatus", "GET", f"{gw}/v1/auth/2fa/status/1", auth, None, 200),
        ("GW-2FADisable", "POST", f"{gw}/v1/auth/2fa/disable", auth, {"user_id":1}, 200),
        ("GW-2FABackupCodes", "GET", f"{gw}/v1/auth/2fa/backup-codes/1", auth, None, 200),
        ("GW-2FATestToken", "POST", f"{gw}/v1/auth/2fa/test-token", auth, {"token":"test"}, 200),
        ("GW-2FAQRCode", "GET", f"{gw}/v1/auth/2fa/qr-code/1", auth, None, 200),
        # GW Password (6)
        ("GW-ValidatePassword", "POST", f"{gw}/v1/password/validate", None, {"password":"Test123!"}, 200),
        ("GW-GeneratePassword", "GET", f"{gw}/v1/password/generate", None, None, 200),
        ("GW-PasswordPolicy", "GET", f"{gw}/v1/password/policy", None, None, 200),
        ("GW-ChangePassword", "POST", f"{gw}/v1/password/change", auth, {"old":"test","new":"test"}, 200),
        ("GW-PasswordStrength", "POST", f"{gw}/v1/password/strength", None, {"password":"test"}, 200),
        ("GW-PasswordTips", "GET", f"{gw}/v1/password/tips", None, None, 200),
        # GW Candidate Portal (5)
        ("GW-CandidateRegister", "POST", f"{gw}/v1/candidate/register", None, {"name":"Test","email":"test@ex.com","password":"Test123!"}, 201),
        ("GW-CandidateLogin", "POST", f"{gw}/v1/candidate/login", None, {"email":"test@ex.com","password":"Test123!"}, 200),
        ("GW-CandidateProfile", "PUT", f"{gw}/v1/candidate/profile/1", auth, {"name":"Updated"}, 200),
        ("GW-CandidateApply", "POST", f"{gw}/v1/candidate/apply", auth, {"candidate_id":1,"job_id":1}, 201),
        ("GW-CandidateApplications", "GET", f"{gw}/v1/candidate/applications/1", auth, None, 200),
        # GW Auth (4)
        ("GW-AuthSetup2FA", "POST", f"{gw}/auth/2fa/setup", auth, {"user_id":1}, 200),
        ("GW-AuthVerify2FA", "POST", f"{gw}/auth/2fa/verify", auth, {"user_id":1,"code":"123456"}, 200),
        ("GW-AuthLogin", "POST", f"{gw}/auth/login", None, {"username":"test","password":"test"}, 200),
        ("GW-Auth2FAStatus", "GET", f"{gw}/auth/2fa/status/1", auth, None, 200),
        # GW AI Integration (2)
        ("GW-TestAICommunication", "GET", f"{gw}/v1/ai/test-communication", auth, None, 200),
        ("GW-GeminiAnalyze", "POST", f"{gw}/v1/ai/gemini/analyze", auth, {"text":"test"}, 200),
        # GW Workflows (7)
        ("GW-TriggerWorkflow", "POST", f"{gw}/api/v1/workflow/trigger", auth, {"workflow_type":"candidate_application","candidate_id":1,"job_id":1}, 200),
        ("GW-WorkflowStatus", "GET", f"{gw}/api/v1/workflow/status/wf_test", auth, None, 200),
        ("GW-ListWorkflows", "GET", f"{gw}/api/v1/workflows", auth, None, 200),
        ("GW-WorkflowStats", "GET", f"{gw}/api/v1/workflow/stats", auth, None, 200),
        ("GW-ResumeWorkflow", "POST", f"{gw}/api/v1/workflow/resume/wf_test", auth, None, 200),
        ("GW-CancelWorkflow", "POST", f"{gw}/api/v1/workflow/cancel/wf_test", auth, None, 200),
        ("GW-WorkflowHistory", "GET", f"{gw}/api/v1/workflow/history/1", auth, None, 200),
        # GW RL (4)
        ("GW-RLPredict", "POST", f"{gw}/v1/rl/predict", auth, {"candidate_id":1,"job_id":1}, 200),
        ("GW-RLFeedback", "POST", f"{gw}/v1/rl/feedback", auth, {"prediction_id":1,"actual_outcome":"hired","feedback_score":5.0}, 200),
        ("GW-RLAnalytics", "GET", f"{gw}/v1/rl/analytics", auth, None, 200),
        ("GW-RLPerformance", "GET", f"{gw}/v1/rl/performance", auth, None, 200),
        # GW Monitoring (3)
        ("GW-Metrics", "GET", f"{gw}/metrics", None, None, 200),
        ("GW-MetricsDashboard", "GET", f"{gw}/metrics/dashboard", None, None, 200),
        ("GW-HealthDetailed", "GET", f"{gw}/health/detailed", None, None, 200),
        # Agent (6)
        ("AG-Root", "GET", f"{ag}/", None, None, 200),
        ("AG-Health", "GET", f"{ag}/health", None, None, 200),
        ("AG-TestDB", "GET", f"{ag}/test-db", None, None, 200),
        ("AG-Match", "POST", f"{ag}/match", None, {"job_id":1}, 200),
        ("AG-BatchMatch", "POST", f"{ag}/batch-match", None, {"job_ids":[1,2]}, 200),
        ("AG-Analyze", "GET", f"{ag}/analyze/1", None, None, 200),
        # LangGraph Core (2)
        ("LG-Root", "GET", f"{lg}/", None, None, 200),
        ("LG-Health", "GET", f"{lg}/health", None, None, 200),
        # LangGraph Workflows (5)
        ("LG-StartWorkflow", "POST", f"{lg}/workflows/application/start", None, {"candidate_id":1,"job_id":1}, 200),
        ("LG-ResumeWorkflow", "POST", f"{lg}/workflows/wf_test/resume", None, None, 200),
        ("LG-WorkflowStatus", "GET", f"{lg}/workflows/wf_test/status", None, None, 200),
        ("LG-ListWorkflows", "GET", f"{lg}/workflows", None, None, 200),
        ("LG-WorkflowStats", "GET", f"{lg}/workflows/stats", None, None, 200),
        # LangGraph Communication (9)
        ("LG-SendNotification", "POST", f"{lg}/tools/send-notification", None, {"channel":"email","to":"test@ex.com","message":"Test"}, 200),
        ("LG-TestEmail", "POST", f"{lg}/test/send-email", None, {"to":"test@ex.com","subject":"Test","body":"Test"}, 200),
        ("LG-TestWhatsApp", "POST", f"{lg}/test/send-whatsapp", None, {"to":"+1234567890","message":"Test"}, 200),
        ("LG-TestTelegram", "POST", f"{lg}/test/send-telegram", None, {"chat_id":"123","message":"Test"}, 200),
        ("LG-TestWhatsAppButtons", "POST", f"{lg}/test/send-whatsapp-buttons", None, {"to":"+1234567890","message":"Test","buttons":["Yes","No"]}, 200),
        ("LG-TestAutomatedSequence", "POST", f"{lg}/test/send-automated-sequence", None, {"candidate_id":1,"job_id":1}, 200),
        ("LG-TriggerWorkflow", "POST", f"{lg}/automation/trigger-workflow", None, {"workflow_type":"candidate_application","candidate_id":1}, 200),
        ("LG-BulkNotifications", "POST", f"{lg}/automation/bulk-notifications", None, {"candidate_ids":[1,2],"message":"Test"}, 200),
        ("LG-WhatsAppWebhook", "POST", f"{lg}/webhook/whatsapp", None, {"test":"data"}, 200),
        # LangGraph RL (8)
        ("LG-RLPredict", "POST", f"{lg}/rl/predict", None, {"candidate_id":1,"job_id":1,"features":{}}, 200),
        ("LG-RLFeedback", "POST", f"{lg}/rl/feedback", None, {"prediction_id":1,"actual_outcome":"hired","feedback_score":5.0}, 200),
        ("LG-RLAnalytics", "GET", f"{lg}/rl/analytics", None, None, 200),
        ("LG-RLPerformanceByVersion", "GET", f"{lg}/rl/performance/v1.0.0", None, None, 200),
        ("LG-RLHistory", "GET", f"{lg}/rl/history/1", None, None, 200),
        ("LG-RLRetrain", "POST", f"{lg}/rl/retrain", None, None, 200),
        ("LG-RLPerformance", "GET", f"{lg}/rl/performance", None, None, 200),
        ("LG-RLStartMonitoring", "POST", f"{lg}/rl/start-monitoring", None, None, 200),
        # LangGraph Integration (1)
        ("LG-TestIntegration", "GET", f"{lg}/test-integration", None, None, 200),
    ]
    
    print(f"\n{'='*80}\nBHIV HR Platform - Testing {len(tests)} Endpoints\n{'='*80}\n")
    for i, (name, method, url, headers, data, exp) in enumerate(tests, 1):
        ok, msg, t = test(name, method, url, headers, data, exp)
        print(f"{i:3d}. {msg} {name:30s} ({t:.2f}s)")
        time.sleep(0.1)
    
    total = len(results)
    passed = sum(1 for r in results if r["ok"])
    print(f"\n{'='*80}\nRESULTS: {passed}/{total} passed ({passed/total*100:.1f}%)\n{'='*80}\n")
    
    with open("test_results.json", "w") as f:
        json.dump({"timestamp": datetime.now().isoformat(), "total": total, "passed": passed, "results": results}, f, indent=2)
    print("Report saved: test_results.json\n")

if __name__ == "__main__":
    print(f"\nBHIV HR Platform - Complete Endpoint Test Suite\nStarted: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    run()
    print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
