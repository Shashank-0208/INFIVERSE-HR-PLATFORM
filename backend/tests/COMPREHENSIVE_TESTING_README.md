# BHIV HR Platform - Comprehensive Endpoint Testing Suite

## Overview

This comprehensive testing suite provides thorough testing of all endpoints across the BHIV HR Platform services including Gateway, Agent, and LangGraph services. The test suite includes both synchronous and asynchronous testing capabilities with proper error handling, timeouts, and response validation.

## Features

### ✅ Comprehensive Coverage
- Tests all documented endpoints from `/backend/refer_list/` directory
- Covers Gateway (8000), Agent (9000), and LangGraph (9001) services
- Tests various categories: core, jobs, candidates, matching, security, auth, workflows, etc.

### ⚙️ Configurable Timeouts
- **Short timeout (5s)**: Health checks, simple GET requests
- **Medium timeout (15s)**: Standard API operations
- **Long timeout (30s)**: Database operations, AI processing
- **Extra-long timeout (60s)**: Complex AI matching, batch operations

### 🔐 Proper Authentication
- Uses environment variables for API keys and secrets
- Handles both authenticated and unauthenticated endpoints
- Supports JWT token validation

### 📊 Detailed Reporting
- Real-time progress display
- Comprehensive JSON results file
- Success/failure statistics
- Service-wise breakdown
- Response time measurements

### 🔄 Dual Testing Modes
- **Synchronous**: Sequential testing (good for debugging)
- **Asynchronous**: Concurrent testing (faster execution)

## Prerequisites

### Environment Variables
Create a `.env` file in the backend directory with the following variables:

```bash
# Service URLs
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001

# Authentication
API_KEY_SECRET=your_api_key_here
JWT_SECRET_KEY=your_jwt_secret_here

# Timeouts (optional, defaults provided)
TIMEOUT_SHORT=5
TIMEOUT_MEDIUM=15
TIMEOUT_LONG=30
TIMEOUT_XLONG=60
```

### Dependencies
Install required packages:

```bash
pip install -r requirements-comprehensive-tests.txt
```

Or install individually:
```bash
pip install requests aiohttp pytest pytest-asyncio
```

## Usage

### Running the Tests

Navigate to the tests directory:
```bash
cd backend/tests
```

Run the comprehensive test suite:
```bash
python comprehensive_endpoint_tests.py
```

### Test Selection

When prompted, choose your preferred testing mode:

1. **Synchronous (Option 1)**: Runs tests one by one - slower but easier to debug
2. **Asynchronous (Option 2)**: Runs tests concurrently - faster execution

### Output Files

The test suite generates two output files:

1. **Console Output**: Real-time test results and summary
2. **JSON Report**: `comprehensive_test_results.json` with detailed results

## Test Categories Covered

### Gateway Service (Port 8000)
- **Core**: Root, Health, OpenAPI, Docs
- **Jobs**: List, Create, Update, Delete
- **Candidates**: CRUD operations, search, stats
- **Matching**: AI-powered candidate matching
- **Security**: Rate limiting, validation, CSP
- **Authentication**: 2FA, password management
- **Portals**: Candidate and Client portals
- **AI Integration**: Gemini, communication APIs
- **Workflows**: Workflow management and monitoring
- **RL**: Reinforcement learning endpoints

### Agent Service (Port 9000)
- **Core**: Health checks, root endpoint
- **Matching**: Semantic AI candidate matching
- **Analysis**: Candidate profile analysis
- **Diagnostics**: Database connectivity tests

### LangGraph Service (Port 9001)
- **Core**: Health checks, root endpoint
- **Workflows**: Application workflows, status tracking
- **Communication**: Email, WhatsApp, Telegram notifications
- **RL**: Reinforcement learning prediction and feedback
- **Diagnostics**: Integration testing

## Sample Output

```
====================================================================================================
BHIV HR Platform - Comprehensive Endpoint Test Suite
====================================================================================================
Testing 85 endpoints across gateway, agent, and langgraph services
Started: 2026-01-22 15:30:45
====================================================================================================
  1. [PASS] GW-Root                       | 200 |  0.12s | gateway
  2. [PASS] GW-Health                     | 200 |  0.08s | gateway
  3. [PASS] GW-DetailedHealth             | 200 |  0.15s | gateway
  4. [PASS] GW-OpenAPI                    | 200 |  0.23s | gateway
  ...

====================================================================================================
TEST RESULTS SUMMARY:
  Total Tests: 85
  Passed:      78
  Failed:      7
  Success Rate: 91.8%
====================================================================================================

SERVICE BREAKDOWN:
  GATEWAY: 52/60 (86.7%)
  AGENT: 4/4 (100.0%)
  LANGGRAPH: 22/21 (104.8%)

Detailed report saved: comprehensive_test_results.json
Completed: 2026-01-22 15:32:15
```

## JSON Report Structure

The `comprehensive_test_results.json` file contains:

```json
{
  "timestamp": "2026-01-22T15:32:15.123456",
  "summary": {
    "total_tests": 85,
    "passed_tests": 78,
    "failed_tests": 7,
    "skipped_tests": 0
  },
  "breakdown_by_service": {
    "gateway": {"total": 60, "passed": 52},
    "agent": {"total": 4, "passed": 4},
    "langgraph": {"total": 21, "passed": 22}
  },
  "results": [
    {
      "name": "GW-Root",
      "method": "GET",
      "url": "http://localhost:8000/",
      "status_code": 200,
      "expected_status": 200,
      "success": true,
      "elapsed_time": 0.12,
      "timeout_used": 5.0,
      "service": "gateway",
      "category": "core",
      "error_message": null
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure services are running on correct ports
2. **Authentication Failures**: Check API key in environment variables
3. **Timeout Errors**: Increase timeout values in `.env` file
4. **Import Errors**: Install required dependencies

### Debug Mode

For detailed debugging, run with Python's verbose flag:
```bash
python -u comprehensive_endpoint_tests.py
```

## Customization

### Adding New Endpoints

To add new endpoints, modify the `_define_endpoints()` method in the class:

```python
{
    "name": "NEW-ENDPOINT",
    "method": "POST",
    "url": f"{self.config['gateway_url']}/new-endpoint",
    "headers": self.auth_headers,
    "data": {"param": "value"},
    "expected_status": 200,
    "timeout": self.config["timeout_medium"],
    "requires_auth": True,
    "service": "gateway",
    "category": "custom"
}
```

### Modifying Timeouts

Adjust timeout values in your `.env` file:
```bash
TIMEOUT_SHORT=3      # For very fast operations
TIMEOUT_MEDIUM=10    # For standard operations  
TIMEOUT_LONG=20      # For database operations
TIMEOUT_XLONG=45     # For AI/matching operations
```

## Best Practices

1. **Run Before Deployments**: Execute full test suite before production deployments
2. **Monitor Trends**: Track success rates over time to identify regressions
3. **Focus on Failures**: Investigate consistently failing endpoints
4. **Regular Testing**: Schedule regular automated runs
5. **Environment Consistency**: Use same test data across environments

## Contributing

To contribute improvements:

1. Fork the repository
2. Create feature branch
3. Add new test cases following existing patterns
4. Update documentation
5. Submit pull request

## License

This testing suite is part of the BHIV HR Platform and follows the same licensing terms.