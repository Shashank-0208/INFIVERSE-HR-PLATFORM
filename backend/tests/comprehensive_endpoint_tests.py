#!/usr/bin/env python3
"""
BHIV HR Platform - Comprehensive Endpoint Test Suite

This test suite covers all endpoints across gateway, agent, and langgraph services
with appropriate timeouts, proper error handling, and comprehensive validation.
"""

import asyncio
import aiohttp
import requests
import json
import time
import os
import sys
from datetime import datetime
from typing import Dict, List, Tuple, Any
import logging


# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class ComprehensiveEndpointTester:
    """Comprehensive endpoint tester for all HR platform services."""
    
    def __init__(self):
        # Load configuration from environment variables
        self.config = {
            "gateway_url": os.getenv("GATEWAY_SERVICE_URL", "http://localhost:8000"),
            "agent_url": os.getenv("AGENT_SERVICE_URL", "http://localhost:9000"),
            "langgraph_url": os.getenv("LANGGRAPH_SERVICE_URL", "http://localhost:9001"),
            "api_key": os.getenv("API_KEY_SECRET", "prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"),
            "jwt_secret": os.getenv("JWT_SECRET_KEY", "dev_jwt_secret"),
            "timeout_short": float(os.getenv("TIMEOUT_SHORT", "5")),
            "timeout_medium": float(os.getenv("TIMEOUT_MEDIUM", "15")),
            "timeout_long": float(os.getenv("TIMEOUT_LONG", "30")),
            "timeout_xlong": float(os.getenv("TIMEOUT_XLONG", "60"))
        }
        
        # Authentication headers
        self.auth_headers = {
            "Authorization": f"Bearer {self.config['api_key']}",
            "Content-Type": "application/json"
        }
        
        # Define endpoints with appropriate timeouts and authentication requirements
        self.endpoints = self._define_endpoints()
        
        # Results storage
        self.results = []
        self.test_summary = {
            "total_tests": 0,
            "passed_tests": 0,
            "failed_tests": 0,
            "skipped_tests": 0
        }
    
    def _define_endpoints(self) -> List[Dict[str, Any]]:
        """Define all endpoints with their configurations."""
        return [
            # Gateway Core API Endpoints
            {
                "name": "GW-Root",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "gateway",
                "category": "core"
            },
            {
                "name": "GW-Health",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/health",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "gateway",
                "category": "monitoring"
            },
            {
                "name": "GW-DetailedHealth",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/health/detailed",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "monitoring"
            },
            {
                "name": "GW-OpenAPI",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/openapi.json",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "gateway",
                "category": "documentation"
            },
            {
                "name": "GW-Docs",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/docs",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "gateway",
                "category": "documentation"
            },
            
            # Gateway Jobs Management
            {
                "name": "GW-ListJobs",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/jobs",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "jobs"
            },
            {
                "name": "GW-CreateJob",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/jobs",
                "headers": self.auth_headers,
                "data": {
                    "title": "Test Job",
                    "department": "Engineering",
                    "location": "Remote",
                    "experience_level": "Senior",
                    "requirements": ["Python", "FastAPI"],
                    "description": "Test job description for comprehensive testing"
                },
                "expected_status": 201,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "jobs"
            },
            
            # Gateway Candidates Management
            {
                "name": "GW-ListCandidates",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/candidates",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "candidates"
            },
            {
                "name": "GW-SearchCandidates",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/candidates/search?skills=Python",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "candidates"
            },
            {
                "name": "GW-CandidateStats",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/candidates/stats",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "analytics"
            },
            
            # Gateway AI Matching Engine
            {
                "name": "GW-TopMatches",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/match/1/top",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_xlong"],
                "requires_auth": True,
                "service": "gateway",
                "category": "matching"
            },
            {
                "name": "GW-BatchMatch",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/match/batch",
                "headers": self.auth_headers,
                "data": {"job_ids": [1, 2]},
                "expected_status": 200,
                "timeout": self.config["timeout_xlong"],
                "requires_auth": True,
                "service": "gateway",
                "category": "matching"
            },
            
            # Gateway Assessment & Feedback
            {
                "name": "GW-GetFeedback",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/feedback",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "assessment"
            },
            {
                "name": "GW-SubmitFeedback",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/feedback",
                "headers": self.auth_headers,
                "data": {
                    "candidate_id": 1,
                    "job_id": 1,
                    "integrity": 5,
                    "honesty": 5,
                    "discipline": 4,
                    "hard_work": 5,
                    "gratitude": 4
                },
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "assessment"
            },
            
            # Gateway Security Endpoints
            {
                "name": "GW-RateLimitStatus",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/security/rate-limit-status",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "security"
            },
            {
                "name": "GW-BlockedIPs",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/security/blocked-ips",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "security"
            },
            {
                "name": "GW-ValidateEmail",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/security/validate-email",
                "headers": self.auth_headers,
                "data": {"email": "test@example.com"},
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "security"
            },
            
            # Gateway Two-Factor Authentication
            {
                "name": "GW-2FASetup",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/auth/2fa/setup",
                "headers": self.auth_headers,
                "data": {"user_id": 1},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "auth"
            },
            {
                "name": "GW-2FAStatus",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/auth/2fa/status/1",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "auth"
            },
            
            # Gateway Password Management
            {
                "name": "GW-ValidatePassword",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/auth/password/validate",
                "headers": self.auth_headers,
                "data": {"password": "TestPassword123!"},
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "auth"
            },
            {
                "name": "GW-GeneratePassword",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/auth/password/generate",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": True,
                "service": "gateway",
                "category": "auth"
            },
            
            # Gateway Candidate Portal
            {
                "name": "GW-CandidateRegister",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/candidate/register",
                "headers": None,
                "data": {
                    "name": "Test Candidate",
                    "email": "test@example.com",
                    "password": "SecurePass123!",
                    "phone": "+1234567890"
                },
                "expected_status": 201,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "gateway",
                "category": "candidate"
            },
            {
                "name": "GW-CandidateLogin",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/candidate/login",
                "headers": None,
                "data": {"email": "test@example.com", "password": "SecurePass123!"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "gateway",
                "category": "candidate"
            },
            {
                "name": "GW-CandidateApplications",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/v1/candidate/applications/1",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "candidate"
            },
            
            # Gateway Client Portal
            {
                "name": "GW-ClientRegister",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/client/register",
                "headers": None,
                "data": {
                    "client_id": "test_client",
                    "company_name": "Test Company",
                    "contact_email": "contact@test.com",
                    "password": "SecurePass123!"
                },
                "expected_status": 201,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "gateway",
                "category": "client"
            },
            {
                "name": "GW-ClientLogin",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/v1/client/login",
                "headers": None,
                "data": {"client_id": "test_client", "password": "SecurePass123!"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "gateway",
                "category": "client"
            },
            
            # Gateway AI Integration
            {
                "name": "GW-TestCommunication",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/api/v1/test-communication",
                "headers": self.auth_headers,
                "data": {"message": "test"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "ai"
            },
            {
                "name": "GW-GeminiAnalyze",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/api/v1/gemini/analyze",
                "headers": self.auth_headers,
                "data": {"text": "Analyze this text"},
                "expected_status": 200,
                "timeout": self.config["timeout_xlong"],
                "requires_auth": True,
                "service": "gateway",
                "category": "ai"
            },
            
            # Gateway Workflows
            {
                "name": "GW-TriggerWorkflow",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/api/v1/workflow/trigger",
                "headers": self.auth_headers,
                "data": {"workflow_type": "candidate_application", "candidate_id": 1, "job_id": 1},
                "expected_status": 200,
                "timeout": self.config["timeout_long"],
                "requires_auth": True,
                "service": "gateway",
                "category": "workflows"
            },
            {
                "name": "GW-ListWorkflows",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/api/v1/workflows",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "workflows"
            },
            {
                "name": "GW-WorkflowStatus",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/api/v1/workflow/status/test_workflow",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "workflows"
            },
            
            # Gateway Reinforcement Learning
            {
                "name": "GW-RLPredict",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/api/v1/rl/predict",
                "headers": self.auth_headers,
                "data": {"candidate_id": 1, "job_id": 1},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "rl"
            },
            {
                "name": "GW-RLFeedback",
                "method": "POST",
                "url": f"{self.config['gateway_url']}/api/v1/rl/feedback",
                "headers": self.auth_headers,
                "data": {"prediction_id": 1, "actual_outcome": "hired", "feedback_score": 5.0},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "rl"
            },
            {
                "name": "GW-RLAnalytics",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/api/v1/rl/analytics",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "gateway",
                "category": "rl"
            },
            
            # Gateway Monitoring
            {
                "name": "GW-Metrics",
                "method": "GET",
                "url": f"{self.config['gateway_url']}/metrics",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "gateway",
                "category": "monitoring"
            },
            
            # Agent Core API Endpoints
            {
                "name": "AG-Root",
                "method": "GET",
                "url": f"{self.config['agent_url']}/",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "agent",
                "category": "core"
            },
            {
                "name": "AG-Health",
                "method": "GET",
                "url": f"{self.config['agent_url']}/health",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "agent",
                "category": "monitoring"
            },
            
            # Agent AI Matching Engine
            {
                "name": "AG-Match",
                "method": "POST",
                "url": f"{self.config['agent_url']}/match",
                "headers": self.auth_headers,
                "data": {"job_id": "1"},
                "expected_status": 200,
                "timeout": self.config["timeout_xlong"],
                "requires_auth": True,
                "service": "agent",
                "category": "matching"
            },
            {
                "name": "AG-BatchMatch",
                "method": "POST",
                "url": f"{self.config['agent_url']}/batch-match",
                "headers": self.auth_headers,
                "data": {"job_ids": ["1", "2"]},
                "expected_status": 200,
                "timeout": self.config["timeout_xlong"],
                "requires_auth": True,
                "service": "agent",
                "category": "matching"
            },
            
            # Agent Analysis
            {
                "name": "AG-Analyze",
                "method": "GET",
                "url": f"{self.config['agent_url']}/analyze/1",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_long"],
                "requires_auth": True,
                "service": "agent",
                "category": "analysis"
            },
            
            # Agent System Diagnostics
            {
                "name": "AG-TestDB",
                "method": "GET",
                "url": f"{self.config['agent_url']}/test-db",
                "headers": self.auth_headers,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": True,
                "service": "agent",
                "category": "diagnostics"
            },
            
            # LangGraph Core API Endpoints
            {
                "name": "LG-Root",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "core"
            },
            {
                "name": "LG-Health",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/health",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_short"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "monitoring"
            },
            
            # LangGraph Workflows
            {
                "name": "LG-StartWorkflow",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/workflows/application/start",
                "headers": None,
                "data": {"candidate_id": 1, "job_id": 1},
                "expected_status": 200,
                "timeout": self.config["timeout_long"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "workflows"
            },
            {
                "name": "LG-ResumeWorkflow",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/workflows/test_workflow/resume",
                "headers": None,
                "data": {},
                "expected_status": 200,
                "timeout": self.config["timeout_long"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "workflows"
            },
            {
                "name": "LG-WorkflowStatus",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/workflows/test_workflow/status",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "workflows"
            },
            {
                "name": "LG-ListWorkflows",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/workflows",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "workflows"
            },
            {
                "name": "LG-WorkflowStats",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/workflows/stats",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "workflows"
            },
            
            # LangGraph Communication Tools
            {
                "name": "LG-SendNotification",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/tools/send-notification",
                "headers": None,
                "data": {"channel": "email", "to": "test@example.com", "message": "Test notification"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "communication"
            },
            {
                "name": "LG-TestEmail",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/test/send-email",
                "headers": None,
                "data": {"to": "test@example.com", "subject": "Test", "body": "Test email body"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "communication"
            },
            {
                "name": "LG-TestWhatsApp",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/test/send-whatsapp",
                "headers": None,
                "data": {"to": "+1234567890", "message": "Test WhatsApp message"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "communication"
            },
            {
                "name": "LG-TestTelegram",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/test/send-telegram",
                "headers": None,
                "data": {"chat_id": "123456", "message": "Test Telegram message"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "communication"
            },
            {
                "name": "LG-WhatsAppWebhook",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/webhook/whatsapp",
                "headers": None,
                "data": {"Body": "test", "From": "+1234567890"},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "communication"
            },
            
            # LangGraph Reinforcement Learning
            {
                "name": "LG-RLPredict",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/rl/predict",
                "headers": None,
                "data": {"candidate_id": 1, "job_id": 1, "features": {}},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            {
                "name": "LG-RLFeedback",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/rl/feedback",
                "headers": None,
                "data": {"prediction_id": 1, "actual_outcome": "hired", "feedback_score": 5.0},
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            {
                "name": "LG-RLAnalytics",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/rl/analytics",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            {
                "name": "LG-RLPerformance",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/rl/performance",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            {
                "name": "LG-RLHistory",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/rl/history/1",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            {
                "name": "LG-RLRetrain",
                "method": "POST",
                "url": f"{self.config['langgraph_url']}/rl/retrain",
                "headers": None,
                "data": {},
                "expected_status": 200,
                "timeout": self.config["timeout_long"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "rl"
            },
            
            # LangGraph System Diagnostics
            {
                "name": "LG-TestIntegration",
                "method": "GET",
                "url": f"{self.config['langgraph_url']}/test-integration",
                "headers": None,
                "data": None,
                "expected_status": 200,
                "timeout": self.config["timeout_medium"],
                "requires_auth": False,
                "service": "langgraph",
                "category": "diagnostics"
            },
        ]
    
    def _create_request_headers(self, requires_auth: bool) -> Dict[str, str]:
        """Create appropriate headers for the request."""
        if requires_auth:
            return self.auth_headers.copy()
        else:
            return {"Content-Type": "application/json"}
    
    def _validate_response_format(self, response: requests.Response, endpoint_config: Dict[str, Any]) -> bool:
        """Validate response format based on endpoint expectations."""
        try:
            # Check if response is JSON for JSON endpoints
            content_type = response.headers.get('Content-Type', '')
            if 'application/json' in content_type:
                json_data = response.json()
                
                # Basic validation for most endpoints
                if endpoint_config['expected_status'] == 200:
                    # For successful responses, check if there's some content
                    return json_data is not None
                
                # For error responses, check if there's an error message
                elif 400 <= response.status_code < 600:
                    return json_data is not None and ('error' in json_data or 'detail' in json_data)
                    
            # For non-JSON responses, just check status
            return True
            
        except ValueError:
            # If response is not JSON, return True if status code matches expectation
            return True
    
    def _test_single_endpoint(self, endpoint_config: Dict[str, Any]) -> Dict[str, Any]:
        """Test a single endpoint and return result."""
        name = endpoint_config["name"]
        method = endpoint_config["method"]
        url = endpoint_config["url"]
        headers = endpoint_config["headers"]
        data = endpoint_config["data"]
        expected_status = endpoint_config["expected_status"]
        timeout = endpoint_config["timeout"]
        requires_auth = endpoint_config["requires_auth"]
        
        start_time = time.time()
        
        try:
            # Create appropriate headers
            request_headers = self._create_request_headers(requires_auth)
            if headers:
                request_headers.update(headers)
            
            # Make the request
            response = requests.request(
                method=method,
                url=url,
                headers=request_headers,
                json=data,
                timeout=timeout
            )
            
            elapsed_time = time.time() - start_time
            success = response.status_code == expected_status
            
            # Validate response format
            format_valid = self._validate_response_format(response, endpoint_config)
            
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": response.status_code,
                "expected_status": expected_status,
                "success": success,
                "format_valid": format_valid,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": None
            }
            
            if not success:
                result["error_message"] = f"Expected {expected_status}, got {response.status_code}"
            elif not format_valid:
                result["error_message"] = "Response format validation failed"
                
        except requests.exceptions.Timeout:
            elapsed_time = time.time() - start_time
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": "TIMEOUT",
                "expected_status": expected_status,
                "success": False,
                "format_valid": False,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": f"Request timed out after {timeout}s"
            }
        except requests.exceptions.ConnectionError:
            elapsed_time = time.time() - start_time
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": "CONNECTION_ERROR",
                "expected_status": expected_status,
                "success": False,
                "format_valid": False,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": "Connection error - service may be down"
            }
        except Exception as e:
            elapsed_time = time.time() - start_time
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": "EXCEPTION",
                "expected_status": expected_status,
                "success": False,
                "format_valid": False,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": f"Exception occurred: {str(e)}"
            }
        
        return result
    
    def run_sync_tests(self):
        """Run all endpoint tests synchronously."""
        logger.info(f"Starting comprehensive endpoint testing for {len(self.endpoints)} endpoints...")
        print(f"\n{'='*100}")
        print("BHIV HR Platform - Comprehensive Endpoint Test Suite")
        print(f"{'='*100}")
        print(f"Testing {len(self.endpoints)} endpoints across gateway, agent, and langgraph services")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*100}")
        
        # Run tests
        for i, endpoint_config in enumerate(self.endpoints, 1):
            result = self._test_single_endpoint(endpoint_config)
            self.results.append(result)
            
            # Update summary
            if result["success"] and result["format_valid"]:
                self.test_summary["passed_tests"] += 1
            else:
                self.test_summary["failed_tests"] += 1
            
            # Print progress
            status = "PASS" if result["success"] and result["format_valid"] else "FAIL"
            print(f"{i:3d}. [{status}] {result['name']:30s} | {result['status_code']} | {result['elapsed_time']:5.2f}s | {result['service']}")
        
        self.test_summary["total_tests"] = len(self.results)
        
        # Print summary
        print(f"\n{'='*100}")
        print("TEST RESULTS SUMMARY:")
        print(f"  Total Tests: {self.test_summary['total_tests']}")
        print(f"  Passed:      {self.test_summary['passed_tests']}")
        print(f"  Failed:      {self.test_summary['failed_tests']}")
        print(f"  Success Rate: {self.test_summary['passed_tests']/self.test_summary['total_tests']*100:.1f}%")
        print(f"{'='*100}")
        
        # Print breakdown by service
        service_breakdown = {}
        for result in self.results:
            service = result['service']
            if service not in service_breakdown:
                service_breakdown[service] = {'total': 0, 'passed': 0}
            service_breakdown[service]['total'] += 1
            if result['success'] and result['format_valid']:
                service_breakdown[service]['passed'] += 1
        
        print("\nSERVICE BREAKDOWN:")
        for service, stats in service_breakdown.items():
            rate = stats['passed']/stats['total']*100 if stats['total'] > 0 else 0
            print(f"  {service.upper()}: {stats['passed']}/{stats['total']} ({rate:.1f}%)")
        
        # Save results to file
        timestamp = datetime.now().isoformat()
        report_data = {
            "timestamp": timestamp,
            "summary": self.test_summary,
            "breakdown_by_service": service_breakdown,
            "results": self.results
        }
        
        with open("comprehensive_test_results.json", "w") as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\nDetailed report saved: comprehensive_test_results.json")
        print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    async def run_async_test(self, session: aiohttp.ClientSession, endpoint_config: Dict[str, Any]) -> Dict[str, Any]:
        """Run a single endpoint test asynchronously."""
        name = endpoint_config["name"]
        method = endpoint_config["method"]
        url = endpoint_config["url"]
        headers = endpoint_config["headers"]
        data = endpoint_config["data"]
        expected_status = endpoint_config["expected_status"]
        timeout = endpoint_config["timeout"]
        requires_auth = endpoint_config["requires_auth"]
        
        start_time = time.time()
        
        try:
            # Create appropriate headers
            request_headers = self._create_request_headers(requires_auth)
            if headers:
                request_headers.update(headers)
            
            # Make the async request
            timeout_obj = aiohttp.ClientTimeout(total=timeout)
            
            if method.upper() == "GET":
                async with session.get(url, headers=request_headers, timeout=timeout_obj) as response:
                    response_text = await response.text()
            elif method.upper() == "POST":
                async with session.post(url, headers=request_headers, json=data, timeout=timeout_obj) as response:
                    response_text = await response.text()
            elif method.upper() == "PUT":
                async with session.put(url, headers=request_headers, json=data, timeout=timeout_obj) as response:
                    response_text = await response.text()
            elif method.upper() == "DELETE":
                async with session.delete(url, headers=request_headers, timeout=timeout_obj) as response:
                    response_text = await response.text()
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response_status = response.status
            elapsed_time = time.time() - start_time
            success = response_status == expected_status
            
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": response_status,
                "expected_status": expected_status,
                "success": success,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": None
            }
            
            if not success:
                result["error_message"] = f"Expected {expected_status}, got {response_status}"
                
        except asyncio.TimeoutError:
            elapsed_time = time.time() - start_time
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": "TIMEOUT",
                "expected_status": expected_status,
                "success": False,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": f"Request timed out after {timeout}s"
            }
        except Exception as e:
            elapsed_time = time.time() - start_time
            result = {
                "name": name,
                "method": method,
                "url": url,
                "status_code": "EXCEPTION",
                "expected_status": expected_status,
                "success": False,
                "elapsed_time": round(elapsed_time, 2),
                "timeout_used": timeout,
                "service": endpoint_config["service"],
                "category": endpoint_config["category"],
                "error_message": f"Exception occurred: {str(e)}"
            }
        
        return result
    
    async def run_async_tests(self):
        """Run all endpoint tests asynchronously."""
        logger.info(f"Starting comprehensive endpoint testing (async) for {len(self.endpoints)} endpoints...")
        print(f"\n{'='*100}")
        print("BHIV HR Platform - Comprehensive Endpoint Test Suite (ASYNC)")
        print(f"{'='*100}")
        print(f"Testing {len(self.endpoints)} endpoints across gateway, agent, and langgraph services")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*100}")
        
        # Create async session
        connector = aiohttp.TCPConnector(limit=50, limit_per_host=10)
        timeout = aiohttp.ClientTimeout(total=60)
        
        async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
            # Run all tests concurrently
            tasks = [self.run_async_test(session, endpoint_config) for endpoint_config in self.endpoints]
            results = await asyncio.gather(*tasks)
        
        # Process results
        self.results = results
        for result in results:
            if result["success"]:
                self.test_summary["passed_tests"] += 1
            else:
                self.test_summary["failed_tests"] += 1
        
        self.test_summary["total_tests"] = len(results)
        
        # Print results
        for i, result in enumerate(results, 1):
            status = "PASS" if result["success"] else "FAIL"
            print(f"{i:3d}. [{status}] {result['name']:30s} | {result['status_code']} | {result['elapsed_time']:5.2f}s | {result['service']}")
        
        # Print summary
        print(f"\n{'='*100}")
        print("TEST RESULTS SUMMARY:")
        print(f"  Total Tests: {self.test_summary['total_tests']}")
        print(f"  Passed:      {self.test_summary['passed_tests']}")
        print(f"  Failed:      {self.test_summary['failed_tests']}")
        print(f"  Success Rate: {self.test_summary['passed_tests']/self.test_summary['total_tests']*100:.1f}%")
        print(f"{'='*100}")
        
        # Save results to file
        timestamp = datetime.now().isoformat()
        report_data = {
            "timestamp": timestamp,
            "summary": self.test_summary,
            "results": self.results
        }
        
        with open("comprehensive_test_results.json", "w") as f:
            json.dump(report_data, f, indent=2)
        
        print(f"\nDetailed report saved: comprehensive_test_results.json")
        print(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


def main():
    """Main function to run the comprehensive endpoint tests."""
    print("BHIV HR Platform - Comprehensive Endpoint Testing Suite")
    print("="*60)
    
    # Ask user for test type
    print("\nSelect test type:")
    print("1. Synchronous tests (one by one)")
    print("2. Asynchronous tests (concurrent)")
    
    choice = input("\nEnter your choice (1 or 2, default 1): ").strip()
    
    if choice == "2":
        tester = ComprehensiveEndpointTester()
        asyncio.run(tester.run_async_tests())
    else:
        tester = ComprehensiveEndpointTester()
        tester.run_sync_tests()


if __name__ == "__main__":
    main()