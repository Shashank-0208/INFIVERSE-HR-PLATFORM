#!/usr/bin/env python3
"""
BHIV HR Platform - Postman Collection Input/Output Validation
Validates request payloads and expected responses for all 119 endpoints
"""

import json
import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

@dataclass
class EndpointTest:
    name: str
    method: str
    url: str
    payload: Optional[Dict] = None
    expected_status: int = 200
    auth_required: bool = True
    validation_rules: List[str] = None

class PostmanTestGenerator:
    def __init__(self, collection_path: str):
        self.collection_path = collection_path
        self.collection = None
        self.test_cases = []
        self.validation_errors = []

    def load_collection(self) -> bool:
        """Load the Postman collection"""
        try:
            with open(self.collection_path, 'r', encoding='utf-8') as f:
                self.collection = json.load(f)
            return True
        except Exception as e:
            print(f"Error loading collection: {e}")
            return False

    def generate_test_cases(self):
        """Generate comprehensive test cases for all endpoints"""
        if not self.collection:
            return

        self._process_items(self.collection['item'])

    def _process_items(self, items: List[Dict], parent_name: str = ""):
        """Process collection items recursively"""
        for item in items:
            if 'item' in item:  # Folder
                self._process_items(item['item'], item['name'])
            elif 'request' in item:  # Request
                test_case = self._create_test_case(item, parent_name)
                if test_case:
                    self.test_cases.append(test_case)

    def _create_test_case(self, item: Dict, parent_name: str) -> Optional[EndpointTest]:
        """Create test case from Postman request"""
        request = item['request']
        name = f"{parent_name} - {item['name']}" if parent_name else item['name']
        
        # Extract method and URL
        method = request.get('method', 'GET')
        url = request.get('url', '')
        if isinstance(url, dict):
            url = url.get('raw', '')

        # Extract payload
        payload = None
        if 'body' in request and request['body'].get('mode') == 'raw':
            try:
                payload = json.loads(request['body']['raw'])
            except json.JSONDecodeError:
                self.validation_errors.append(f"Invalid JSON payload in {name}")

        # Determine auth requirement
        auth_required = True
        if 'auth' in request and request['auth'].get('type') == 'noauth':
            auth_required = False

        # Create validation rules
        validation_rules = self._create_validation_rules(method, url, payload)

        return EndpointTest(
            name=name,
            method=method,
            url=url,
            payload=payload,
            auth_required=auth_required,
            validation_rules=validation_rules
        )

    def _create_validation_rules(self, method: str, url: str, payload: Optional[Dict]) -> List[str]:
        """Create validation rules based on endpoint characteristics"""
        rules = []

        # URL validation
        if '{{' in url:
            rules.append("URL contains variables - ensure they are properly substituted")
        
        # Method-specific rules
        if method == 'POST':
            rules.append("POST request should return 201 for creation or 200 for processing")
            if payload:
                rules.append("Validate all required fields in request payload")
        elif method == 'GET':
            rules.append("GET request should return 200 with data or 404 if not found")
        elif method == 'PUT':
            rules.append("PUT request should return 200 for update or 404 if not found")
        elif method == 'DELETE':
            rules.append("DELETE request should return 204 for success or 404 if not found")

        # Endpoint-specific rules
        if '/auth/' in url:
            rules.append("Auth endpoints should return JWT token on success")
        elif '/2fa/' in url:
            rules.append("2FA endpoints should handle TOTP validation")
        elif '/security/' in url:
            rules.append("Security endpoints should validate input sanitization")
        elif '/rl/' in url:
            rules.append("RL endpoints should return prediction scores or feedback confirmation")

        return rules

    def validate_payloads(self) -> Dict[str, List[str]]:
        """Validate request payloads for common issues"""
        payload_issues = {}

        for test_case in self.test_cases:
            issues = []
            
            if test_case.payload:
                # Check for required fields based on endpoint type
                if '/register' in test_case.url:
                    required_fields = ['email', 'password']
                    for field in required_fields:
                        if field not in test_case.payload:
                            issues.append(f"Missing required field: {field}")

                elif '/login' in test_case.url:
                    required_fields = ['password']
                    for field in required_fields:
                        if field not in test_case.payload:
                            issues.append(f"Missing required field: {field}")

                elif '/feedback' in test_case.url:
                    if 'candidate_id' not in test_case.payload:
                        issues.append("Missing candidate_id for feedback")

                # Validate data types
                for key, value in test_case.payload.items():
                    if key.endswith('_id') and not isinstance(value, int):
                        issues.append(f"ID field {key} should be integer, got {type(value)}")
                    elif key == 'email' and '@' not in str(value):
                        issues.append(f"Invalid email format: {value}")

            if issues:
                payload_issues[test_case.name] = issues

        return payload_issues

    def generate_test_script(self) -> str:
        """Generate Postman test script for validation"""
        script = """
// BHIV HR Platform - Postman Test Script
// Auto-generated validation tests for all 119 endpoints

pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has valid status code", function () {
    const validCodes = [200, 201, 204, 400, 401, 403, 404, 422, 500];
    pm.expect(validCodes).to.include(pm.response.code);
});

pm.test("Response has JSON content type", function () {
    const contentType = pm.response.headers.get("Content-Type");
    if (contentType) {
        pm.expect(contentType).to.include("application/json");
    }
});

// Auth endpoint specific tests
if (pm.request.url.toString().includes("/auth/")) {
    pm.test("Auth endpoint returns token on success", function () {
        if (pm.response.code === 200) {
            const jsonData = pm.response.json();
            pm.expect(jsonData).to.have.property("access_token");
        }
    });
}

// Security endpoint tests
if (pm.request.url.toString().includes("/security/")) {
    pm.test("Security headers are present", function () {
        pm.expect(pm.response.headers.has("X-Content-Type-Options")).to.be.true;
    });
}

// RL endpoint tests
if (pm.request.url.toString().includes("/rl/")) {
    pm.test("RL endpoint returns valid prediction", function () {
        if (pm.response.code === 200 && pm.request.url.toString().includes("/predict")) {
            const jsonData = pm.response.json();
            pm.expect(jsonData).to.have.property("prediction_score");
        }
    });
}

// Candidate endpoint tests
if (pm.request.url.toString().includes("/candidates")) {
    pm.test("Candidate data has required fields", function () {
        if (pm.response.code === 200) {
            const jsonData = pm.response.json();
            if (Array.isArray(jsonData)) {
                jsonData.forEach(candidate => {
                    pm.expect(candidate).to.have.property("id");
                    pm.expect(candidate).to.have.property("name");
                });
            }
        }
    });
}

// Job endpoint tests
if (pm.request.url.toString().includes("/jobs")) {
    pm.test("Job data has required fields", function () {
        if (pm.response.code === 200) {
            const jsonData = pm.response.json();
            if (Array.isArray(jsonData)) {
                jsonData.forEach(job => {
                    pm.expect(job).to.have.property("id");
                    pm.expect(job).to.have.property("title");
                });
            }
        }
    });
}
"""
        return script.strip()

    def create_test_report(self) -> str:
        """Create comprehensive test report"""
        report = []
        report.append("BHIV HR PLATFORM - POSTMAN COLLECTION TEST REPORT")
        report.append("=" * 60)
        report.append(f"Total Endpoints: {len(self.test_cases)}")
        report.append(f"Validation Errors: {len(self.validation_errors)}")
        report.append("")

        # Group by service
        services = {}
        for test_case in self.test_cases:
            service = "Unknown"
            if "GW-" in test_case.name:
                service = "Gateway"
            elif "Agent-" in test_case.name:
                service = "Agent"
            elif "LangGraph-" in test_case.name:
                service = "LangGraph"
            
            if service not in services:
                services[service] = []
            services[service].append(test_case)

        for service, cases in services.items():
            report.append(f"{service.upper()} SERVICE ({len(cases)} endpoints)")
            report.append("-" * 40)
            
            for case in cases:
                report.append(f"  {case.method:6} {case.name}")
                if case.payload:
                    report.append(f"         Payload: {json.dumps(case.payload, separators=(',', ':'))}")
                if case.validation_rules:
                    for rule in case.validation_rules[:2]:  # Show first 2 rules
                        report.append(f"         Rule: {rule}")
                report.append("")

        # Validation errors
        if self.validation_errors:
            report.append("VALIDATION ERRORS")
            report.append("-" * 40)
            for error in self.validation_errors:
                report.append(f"  - {error}")
            report.append("")

        # Payload validation
        payload_issues = self.validate_payloads()
        if payload_issues:
            report.append("PAYLOAD VALIDATION ISSUES")
            report.append("-" * 40)
            for endpoint, issues in payload_issues.items():
                report.append(f"  {endpoint}:")
                for issue in issues:
                    report.append(f"    - {issue}")
            report.append("")

        return "\n".join(report)

def main():
    """Main execution function"""
    collection_path = r"c:\BHIV HR PLATFORM\handover\postman_collection.json"
    
    print("Starting Postman Collection Input/Output Validation...")
    
    generator = PostmanTestGenerator(collection_path)
    
    if not generator.load_collection():
        print("Failed to load collection")
        return 1

    generator.generate_test_cases()
    
    # Generate test report
    report = generator.create_test_report()
    
    # Save test report
    with open(r"c:\BHIV HR PLATFORM\postman_test_report.txt", 'w', encoding='utf-8') as f:
        f.write(report)
    
    # Generate test script
    test_script = generator.generate_test_script()
    with open(r"c:\BHIV HR PLATFORM\postman_test_script.js", 'w', encoding='utf-8') as f:
        f.write(test_script)
    
    print(f"Generated test cases for {len(generator.test_cases)} endpoints")
    print(f"Found {len(generator.validation_errors)} validation errors")
    print("Test report saved to: postman_test_report.txt")
    print("Test script saved to: postman_test_script.js")
    
    # Print summary
    print("\nTEST SUMMARY:")
    print("-" * 40)
    
    methods = {}
    auth_required = 0
    
    for test_case in generator.test_cases:
        methods[test_case.method] = methods.get(test_case.method, 0) + 1
        if test_case.auth_required:
            auth_required += 1
    
    for method, count in sorted(methods.items()):
        print(f"{method:6}: {count:3} endpoints")
    
    print(f"Auth Required: {auth_required}/{len(generator.test_cases)} endpoints")
    
    return 0 if len(generator.validation_errors) == 0 else 1

if __name__ == "__main__":
    exit(main())