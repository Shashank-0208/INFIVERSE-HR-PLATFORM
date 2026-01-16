# Shared Service Modules

**Purpose:** Common authentication and utility modules for all backend services in the BHIV HR Platform.

## Overview
- Provides JWT authentication, API key validation, and role-based access utilities
- Used by agent, portal, client, candidate, langgraph, and gateway services

## Key Files
- `jwt_auth.py`: JWT validation, API key checks, role-based access decorators
- `__init__.py`: Exports all shared authentication functions

## Features
- **JWT Authentication:** Validates tokens for all user types (candidate, recruiter, client, admin)
- **API Key Validation:** Service-to-service authentication
- **Role-Based Access:** Decorators for endpoint protection
- **Token Utilities:** Extract user info, verify roles, handle optional auth

## Usage Example
Import shared authentication in your FastAPI or Streamlit service:

```python
from shared import get_auth, require_role
```

## Architecture
```
shared/
├── jwt_auth.py     # JWT and API key logic
└── __init__.py     # Exports shared functions
```

## Notes
- All secrets and keys are loaded from environment variables
- No direct endpoints; used as a dependency by other services
