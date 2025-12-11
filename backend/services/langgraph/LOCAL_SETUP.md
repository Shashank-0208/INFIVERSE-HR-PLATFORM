# BHIV LangGraph Service - Local Setup Guide

## Quick Start (5 Minutes)

### 1. Navigate to Service Directory
```bash
cd "c:\BHIV HR PLATFORM\services\langgraph"
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Setup Environment
```bash
# Copy environment template
copy .env.example .env

# Edit .env with your configuration (optional for basic testing)
notepad .env
```

### 4. Start Service
```bash
# Option A: Using startup script (recommended)
python start_local.py

# Option B: Direct uvicorn
python -m uvicorn app.main:app --host 0.0.0.0 --port 9001 --reload
```

### 5. Test Service
```bash
# In another terminal
python test_local.py
```

## Service Endpoints

- **Health Check**: http://localhost:9001/health
- **API Documentation**: http://localhost:9001/docs
- **Start Workflow**: POST http://localhost:9001/workflows/application/start
- **Workflow Status**: GET http://localhost:9001/workflows/{id}/status

## Environment Variables (.env)

### Required for Basic Testing
```
GATEWAY_URL=http://localhost:8000
API_KEY_SECRET=<YOUR_API_KEY>
DATABASE_URL=postgresql://bhiv_user:bhiv_local_password_2025@localhost:5432/bhiv_hr
ENVIRONMENT=production
```

### Optional (for full functionality)
```
GEMINI_API_KEY=your-gemini-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
TELEGRAM_BOT_TOKEN=your-telegram-token
```

## Testing Workflow

### 1. Health Check
```bash
curl http://localhost:9001/health
```

### 2. Start Application Workflow
```bash
curl -X POST http://localhost:9001/workflows/application/start \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 1,
    "job_id": 1,
    "application_id": 1,
    "candidate_email": "test@example.com",
    "candidate_phone": "+1234567890",
    "candidate_name": "Test Candidate",
    "job_title": "Software Engineer"
  }'
```

### 3. Check Workflow Status
```bash
curl http://localhost:9001/workflows/{workflow_id}/status
```

## Integration with Gateway

The LangGraph service integrates with the BHIV Gateway through:
- Gateway calls LangGraph workflows via `/api/v1/workflows/*` endpoints
- LangGraph calls back to Gateway for data and updates
- Environment variable `GATEWAY_URL` configures the connection

## Troubleshooting

### Service Won't Start
- Check Python version (3.12.7+ required)
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check port 9001 is available

### Import Errors
- Ensure you're in the correct directory: `services/langgraph`
- Check Python path includes current directory

### Database Connection Issues
- Verify DATABASE_URL in .env
- Ensure PostgreSQL is running
- Check database credentials

### Gateway Integration Issues
- Verify GATEWAY_URL in .env points to running gateway
- Check API_KEY_SECRET matches gateway configuration
- Ensure gateway service is running on port 8000

## Development Mode

The service runs in production mode by default with:
- Auto-reload on file changes
- Mock AI responses for testing
- Detailed logging
- Error handling for missing external services

## Production Deployment

For production deployment, see the main deployment guide and update:
- `ENVIRONMENT=production`
- Configure all external service credentials
- Use proper database URL
- Set appropriate log levels