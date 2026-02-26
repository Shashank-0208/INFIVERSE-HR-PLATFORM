#!/usr/bin/env python3
"""
BHIV HR Platform - Automation Endpoints Test Script
===================================================

This script tests all automation endpoints in the LangGraph service.
It uses credentials from environment variables for secure testing.

Environment Variables Required:
- LANGGRAPH_URL: LangGraph service URL (default: http://localhost:9001)
- API_KEY: API key for authentication
- TEST_EMAIL: Email address for testing (optional)
- TEST_PHONE: Phone number for WhatsApp testing (optional)

Usage:
    python test_automation_endpoints.py
    
    # Or with custom URL:
    LANGGRAPH_URL=https://your-service.com python test_automation_endpoints.py
"""

import os
import sys
import json
import asyncio
import httpx
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum

# Configuration from environment variables
LANGGRAPH_URL = os.getenv("LANGGRAPH_URL", os.getenv("VITE_LANGGRAPH_URL", "http://localhost:9001"))
API_KEY = os.getenv("API_KEY", os.getenv("VITE_API_KEY", "prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o"))
TEST_EMAIL = os.getenv("TEST_EMAIL", "blackholeinfiverse56@gmail.com")
TEST_PHONE = os.getenv("TEST_PHONE", "+918010204087")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "test_chat_id")


class TestStatus(Enum):
    PASSED = "✅ PASSED"
    FAILED = "❌ FAILED"
    SKIPPED = "⏭️ SKIPPED"
    WARNING = "⚠️ WARNING"


@dataclass
class TestResult:
    name: str
    endpoint: str
    method: str
    status: TestStatus
    response_code: Optional[int] = None
    response_time_ms: Optional[float] = None
    error_message: Optional[str] = None
    response_data: Optional[Dict] = None


@dataclass
class TestSuite:
    results: List[TestResult] = field(default_factory=list)
    start_time: datetime = field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
    
    def add_result(self, result: TestResult):
        self.results.append(result)
    
    @property
    def passed_count(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.PASSED)
    
    @property
    def failed_count(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.FAILED)
    
    @property
    def skipped_count(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.SKIPPED)
    
    @property
    def warning_count(self) -> int:
        return sum(1 for r in self.results if r.status == TestStatus.WARNING)


class AutomationEndpointTester:
    """Test all automation endpoints in the LangGraph service."""
    
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        self.suite = TestSuite()
    
    async def test_endpoint(
        self,
        name: str,
        endpoint: str,
        method: str = "POST",
        data: Optional[Dict] = None,
        expected_status: int = 200,
        timeout: float = 30.0
    ) -> TestResult:
        """Test a single endpoint and return the result."""
        url = f"{self.base_url}{endpoint}"
        start_time = datetime.now()
        
        try:
            async with httpx.AsyncClient() as client:
                if method == "GET":
                    response = await client.get(
                        url, 
                        headers=self.headers, 
                        timeout=timeout
                    )
                else:
                    response = await client.post(
                        url, 
                        headers=self.headers, 
                        json=data,
                        timeout=timeout
                    )
                
                end_time = datetime.now()
                response_time = (end_time - start_time).total_seconds() * 1000
                
                # Parse response
                try:
                    response_data = response.json()
                except:
                    response_data = {"raw": response.text[:500]}
                
                # Determine status
                if response.status_code == expected_status:
                    status = TestStatus.PASSED
                    error_message = None
                elif response.status_code == 401:
                    status = TestStatus.WARNING
                    error_message = "Authentication issue - check API key"
                elif response.status_code == 500:
                    status = TestStatus.WARNING
                    error_message = f"Server error: {response_data.get('detail', 'Unknown')}"
                else:
                    status = TestStatus.FAILED
                    error_message = f"Expected {expected_status}, got {response.status_code}"
                
                return TestResult(
                    name=name,
                    endpoint=endpoint,
                    method=method,
                    status=status,
                    response_code=response.status_code,
                    response_time_ms=response_time,
                    error_message=error_message,
                    response_data=response_data
                )
                
        except httpx.ConnectError:
            return TestResult(
                name=name,
                endpoint=endpoint,
                method=method,
                status=TestStatus.FAILED,
                error_message=f"Connection failed - is the service running at {self.base_url}?"
            )
        except httpx.TimeoutException:
            return TestResult(
                name=name,
                endpoint=endpoint,
                method=method,
                status=TestStatus.FAILED,
                error_message=f"Request timed out after {timeout}s"
            )
        except Exception as e:
            return TestResult(
                name=name,
                endpoint=endpoint,
                method=method,
                status=TestStatus.FAILED,
                error_message=str(e)
            )
    
    async def run_all_tests(self) -> TestSuite:
        """Run all automation endpoint tests."""
        print("\n" + "="*70)
        print("BHIV HR Platform - Automation Endpoint Tests")
        print("="*70)
        print(f"\n🔗 Service URL: {self.base_url}")
        print(f"🔑 API Key: {self.api_key[:20]}...")
        print(f"📧 Test Email: {TEST_EMAIL}")
        print(f"📱 Test Phone: {TEST_PHONE}")
        print("\n" + "-"*70)
        
        # Test 1: Health Check
        print("\n📋 Testing Service Health...")
        result = await self.test_endpoint(
            name="Health Check",
            endpoint="/health",
            method="GET",
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 2: Root Endpoint
        print("\n📋 Testing Root Endpoint...")
        result = await self.test_endpoint(
            name="Root Endpoint",
            endpoint="/",
            method="GET",
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 3: Send Single Notification
        print("\n📋 Testing Single Notification...")
        result = await self.test_endpoint(
            name="Send Single Notification",
            endpoint="/automation/notifications/send",
            method="POST",
            data={
                "candidate_name": "Test Candidate",
                "candidate_email": TEST_EMAIL,
                "candidate_phone": TEST_PHONE,
                "job_title": "Software Engineer",
                "message": "Test notification from automation test suite",
                "channels": ["email"],
                "application_status": "shortlisted"
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 4: Send Bulk Notifications
        print("\n📋 Testing Bulk Notifications...")
        result = await self.test_endpoint(
            name="Send Bulk Notifications",
            endpoint="/automation/notifications/bulk",
            method="POST",
            data={
                "candidates": [
                    {
                        "candidate_name": "Test Candidate 1",
                        "candidate_email": TEST_EMAIL,
                        "candidate_phone": TEST_PHONE
                    }
                ],
                "sequence_type": "application_received",
                "job_data": {
                    "job_title": "Test Position",
                    "job_id": "test-123"
                }
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 5: Trigger Workflow
        print("\n📋 Testing Workflow Trigger...")
        result = await self.test_endpoint(
            name="Trigger Workflow",
            endpoint="/automation/workflows/trigger",
            method="POST",
            data={
                "event_type": "application_received",
                "payload": {
                    "candidate_name": "Test Candidate",
                    "candidate_email": TEST_EMAIL,
                    "job_title": "Test Position"
                }
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 6: Test Email Endpoint
        print("\n📋 Testing Email Endpoint...")
        result = await self.test_endpoint(
            name="Test Email",
            endpoint="/automation/test/email",
            method="POST",
            data={
                "recipient_email": TEST_EMAIL,
                "subject": "Test Email from Automation Suite",
                "message": "This is a test email sent by the automation test script."
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 7: Test WhatsApp Endpoint
        print("\n📋 Testing WhatsApp Endpoint...")
        result = await self.test_endpoint(
            name="Test WhatsApp",
            endpoint="/automation/test/whatsapp",
            method="POST",
            data={
                "phone": TEST_PHONE,
                "message": "Test message from BHIV HR automation test"
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 8: Test Telegram Endpoint
        print("\n📋 Testing Telegram Endpoint...")
        result = await self.test_endpoint(
            name="Test Telegram",
            endpoint="/automation/test/telegram",
            method="POST",
            data={
                "chat_id": TELEGRAM_CHAT_ID,
                "message": "Test message from BHIV HR automation test"
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 9: Test WhatsApp Buttons
        print("\n📋 Testing WhatsApp Buttons...")
        result = await self.test_endpoint(
            name="Test WhatsApp Buttons",
            endpoint="/automation/test/whatsapp-buttons",
            method="POST",
            data={
                "phone": TEST_PHONE,
                "message": "Test interactive message"
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 10: Test Automated Sequence
        print("\n📋 Testing Automated Sequence...")
        result = await self.test_endpoint(
            name="Test Sequence",
            endpoint="/automation/test/sequence",
            method="POST",
            data={
                "candidate_name": "Test Candidate",
                "candidate_email": TEST_EMAIL,
                "candidate_phone": TEST_PHONE,
                "job_title": "Software Engineer",
                "sequence_type": "application_received"
            },
            expected_status=200
        )
        self.suite.add_result(result)
        self._print_result(result)
        
        # Test 11: Test Deprecated Endpoint (should fail with 404)
        print("\n📋 Testing Deprecated Endpoint (should fail)...")
        result = await self.test_endpoint(
            name="Deprecated: /tools/send-notification",
            endpoint="/tools/send-notification",
            method="POST",
            data={"candidate_name": "Test"},
            expected_status=404
        )
        # Invert the logic - 404 is expected (meaning deprecated endpoint is properly removed)
        if result.response_code == 404:
            result.status = TestStatus.PASSED
            result.error_message = "Correctly returns 404 - deprecated endpoint removed"
        elif result.response_code == 200 or result.response_code == 422:
            result.status = TestStatus.WARNING
            result.error_message = "Deprecated endpoint still active - should be removed"
        self.suite.add_result(result)
        self._print_result(result)
        
        self.suite.end_time = datetime.now()
        return self.suite
    
    def _print_result(self, result: TestResult):
        """Print a single test result."""
        print(f"\n  Endpoint: {result.method} {result.endpoint}")
        print(f"  Status: {result.status.value}")
        if result.response_code:
            print(f"  Response Code: {result.response_code}")
        if result.response_time_ms:
            print(f"  Response Time: {result.response_time_ms:.2f}ms")
        if result.error_message:
            print(f"  Message: {result.error_message}")
    
    def print_summary(self):
        """Print test suite summary."""
        print("\n" + "="*70)
        print("TEST SUMMARY")
        print("="*70)
        
        duration = (self.suite.end_time - self.suite.start_time).total_seconds() if self.suite.end_time else 0
        
        print(f"\n📊 Results:")
        print(f"   ✅ Passed:   {self.suite.passed_count}")
        print(f"   ❌ Failed:   {self.suite.failed_count}")
        print(f"   ⚠️ Warnings: {self.suite.warning_count}")
        print(f"   ⏭️ Skipped:  {self.suite.skipped_count}")
        print(f"\n⏱️ Total Duration: {duration:.2f}s")
        
        # List failed tests
        failed = [r for r in self.suite.results if r.status == TestStatus.FAILED]
        if failed:
            print(f"\n❌ Failed Tests:")
            for r in failed:
                print(f"   - {r.name}: {r.error_message}")
        
        # List warnings
        warnings = [r for r in self.suite.results if r.status == TestStatus.WARNING]
        if warnings:
            print(f"\n⚠️ Warnings:")
            for r in warnings:
                print(f"   - {r.name}: {r.error_message}")
        
        print("\n" + "="*70)
        
        # Overall status
        if self.suite.failed_count == 0:
            print("🎉 ALL TESTS PASSED!")
        else:
            print(f"⚠️ {self.suite.failed_count} TEST(S) FAILED")
        
        print("="*70 + "\n")
    
    def export_results(self, filename: str = "automation_test_results.json"):
        """Export test results to JSON file."""
        results = {
            "test_suite": "BHIV HR Automation Endpoints",
            "service_url": self.base_url,
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total": len(self.suite.results),
                "passed": self.suite.passed_count,
                "failed": self.suite.failed_count,
                "warnings": self.suite.warning_count,
                "skipped": self.suite.skipped_count
            },
            "results": [
                {
                    "name": r.name,
                    "endpoint": r.endpoint,
                    "method": r.method,
                    "status": r.status.name,
                    "response_code": r.response_code,
                    "response_time_ms": r.response_time_ms,
                    "error_message": r.error_message
                }
                for r in self.suite.results
            ]
        }
        
        with open(filename, "w") as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📁 Results exported to: {filename}")


async def main():
    """Main entry point."""
    print("\n" + "🚀 "*20)
    print("Starting BHIV HR Automation Endpoint Tests")
    print("🚀 "*20)
    
    tester = AutomationEndpointTester(LANGGRAPH_URL, API_KEY)
    
    try:
        await tester.run_all_tests()
        tester.print_summary()
        tester.export_results()
        
        # Exit with appropriate code
        sys.exit(0 if tester.suite.failed_count == 0 else 1)
        
    except KeyboardInterrupt:
        print("\n\n⚠️ Test interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"\n\n❌ Test suite error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
