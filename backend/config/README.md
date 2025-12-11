# 🔧 BHIV HR Platform - Configuration Guide

## 📁 Directory Structure

```
config/
├── local.env           # Local development configuration
├── production.env      # Production configuration with live credentials
└── README.md          # This configuration guide
```

## 🔧 Configuration Files

### **production.env** - Production Configuration
- **Purpose**: Production deployment on Render platform
- **Database**: Live PostgreSQL database on Render
- **Service URLs**: Production Render service URLs
- **Credentials**: Live production API keys and secrets
- **Usage**: Copy values to Render dashboard environment variables

### **local.env** - Local Development Configuration  
- **Purpose**: Local Docker development environment
- **Database**: Local PostgreSQL (localhost:5432)
- **Service URLs**: Local Docker container URLs (localhost)
- **Credentials**: Same as production for authentication consistency
- **Usage**: Copy to `.env` file in project root for Docker Compose

## 🔐 Security Configuration

### Core Authentication Secrets
```bash
API_KEY_SECRET=prod_api_key_XUqM2msdCa4CYIaRywRNXRVc477nlI3AQ-lr6cgTB2o
JWT_SECRET_KEY=prod_jwt_Ova9A8L-OU4uIcAero0v3ZLQRckNr3xBDuO0OXF6uwA
CANDIDATE_JWT_SECRET_KEY=candidate_jwt_secret_key_2025
GATEWAY_SECRET_KEY=prod_gateway_secret_key_2025
```

### Database Connection
```bash
DATABASE_URL=postgresql://bhiv_user:JwvtCqKDYsVgnTiAEtSNAKaDHkksATRA@dpg-d4kjncvpm1nc738abapg-a.oregon-postgres.render.com/bhiv_hr_i7zb
```

## 🌐 Service URLs

### Production (Render Platform)
```bash
GATEWAY_SERVICE_URL=https://bhiv-hr-gateway-ltg0.onrender.com
AGENT_SERVICE_URL=https://bhiv-hr-agent-nhgg.onrender.com
LANGGRAPH_SERVICE_URL=https://bhiv-hr-langgraph.onrender.com
PORTAL_SERVICE_URL=https://bhiv-hr-portal-u670.onrender.com
CLIENT_PORTAL_SERVICE_URL=https://bhiv-hr-client-portal-3iod.onrender.com
CANDIDATE_PORTAL_SERVICE_URL=https://bhiv-hr-candidate-portal-abe6.onrender.com
```

### Local Development (Docker)
```bash
GATEWAY_SERVICE_URL=http://localhost:8000
AGENT_SERVICE_URL=http://localhost:9000
LANGGRAPH_SERVICE_URL=http://localhost:9001
PORTAL_SERVICE_URL=http://localhost:8501
CLIENT_PORTAL_SERVICE_URL=http://localhost:8502
CANDIDATE_PORTAL_SERVICE_URL=http://localhost:8503
```

## 📡 Communication Services (LangGraph Only)

### Twilio (WhatsApp/SMS)
```bash
TWILIO_ACCOUNT_SID=<secured_twilio_sid>
TWILIO_AUTH_TOKEN=<secured_twilio_token>
TWILIO_WHATSAPP_NUMBER=+14155238886
```

### Gmail (Email Notifications)
```bash
GMAIL_EMAIL=<secured_gmail_email>
GMAIL_APP_PASSWORD=<secured_gmail_password>
```

### Telegram (Bot Notifications)
```bash
TELEGRAM_BOT_TOKEN=<secured_telegram_token>
TELEGRAM_BOT_USERNAME=@bhiv_hr_assistant_bot
```

### Gemini AI
```bash
GEMINI_API_KEY=<secured_gemini_key>
GEMINI_MODEL=gemini-pro
```

## 🚀 Usage Instructions

### For Production Deployment (Render)
1. Use `production.env` values
2. Copy each environment variable to respective Render service dashboard
3. Ensure all 6 services have required credentials based on service analysis

### For Local Development (Docker)
1. Use `local.env` values
2. Copy to `.env` file in project root
3. Run `docker-compose up -d`

### Service-Specific Requirements

#### Gateway Service
- DATABASE_URL
- API_KEY_SECRET, JWT_SECRET_KEY, CANDIDATE_JWT_SECRET_KEY
- AGENT_SERVICE_URL, LANGGRAPH_SERVICE_URL

#### Agent Service  
- DATABASE_URL
- API_KEY_SECRET, JWT_SECRET_KEY, CANDIDATE_JWT_SECRET_KEY

#### LangGraph Service
- DATABASE_URL
- API_KEY_SECRET, JWT_SECRET_KEY, CANDIDATE_JWT_SECRET_KEY
- All communication service credentials (Twilio, Gmail, Telegram, Gemini)

#### Portal Services (HR, Client, Candidate)
- GATEWAY_SERVICE_URL, LANGGRAPH_SERVICE_URL
- API_KEY_SECRET, JWT_SECRET_KEY
- CANDIDATE_JWT_SECRET_KEY (for Candidate Portal only)
- DATABASE_URL (for Candidate Portal only)

## ⚠️ Security Recommendations

1. **Credential Protection**: Never commit production credentials to Git
2. **Rotate Secrets**: Change API keys every 90 days
3. **Environment Separation**: Use different secrets for dev/staging/prod
4. **Access Control**: Limit who can access production credentials
5. **Monitoring**: Monitor for unauthorized credential usage

## 🔄 Configuration Consistency

- **Database**: Same PostgreSQL instance for local and production
- **Authentication**: Identical secrets ensure seamless data access
- **Service Communication**: Proper URL configuration for each environment
- **Feature Flags**: Consistent settings across environments

## 📊 Current Status

- ✅ **Production Config**: Ready with live credentials
- ✅ **Local Config**: Ready for Docker development  
- ✅ **Service Requirements**: Analyzed and optimized per service
- ✅ **Security**: No sensitive files in Git repository
- ✅ **Consistency**: Local and production use same core credentials