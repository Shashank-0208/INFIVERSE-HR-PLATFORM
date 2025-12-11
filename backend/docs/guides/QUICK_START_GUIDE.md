# ⚡ BHIV HR Platform - Quick Start Guide

**Get Started in 5 Minutes**  
**Updated**: December 9, 2025  
**Platform**: Production Ready + Local Development  
**Version**: v3.0.0 Enterprise Ready  
**Status**: ✅ All 6 Services Operational | 111 Endpoints Live | 99.95% Uptime

---

## 🚀 Choose Your Path

### **🌐 Option 1: Use Live Production Platform (Recommended)**
**No setup required - Start immediately!**

### **💻 Option 2: Local Development Setup**
**Full control - Run on your machine**

---

## 🌐 Live Production Platform (0 Minutes Setup)

### **🎯 Instant Access**
All services are live and operational - no installation needed!

#### **Production Service URLs (111 Total Endpoints)**
```bash
# API Gateway (80 endpoints - FastAPI 4.2.0)
https://bhiv-hr-gateway-ltg0.onrender.com/docs

# AI Agent Service (6 endpoints - Phase 3 AI Engine + RL Integration)  
https://bhiv-hr-agent-nhgg.onrender.com/docs

# LangGraph Workflow Service (9 endpoints - AI Automation + Multi-Channel)
https://bhiv-hr-langgraph.onrender.com

# HR Portal (8 endpoints - Complete HR workflow)
https://bhiv-hr-portal-u670.onrender.com/

# Client Portal (7 endpoints - Enterprise interface)
https://bhiv-hr-client-portal-3iod.onrender.com/

# Candidate Portal (7 endpoints - Job seeker interface)
https://bhiv-hr-candidate-portal-abe6.onrender.com/
```

#### **Service Status Overview**
| Service | Endpoints | Type | Status | Response Time |
|---------|-----------|------|--------|---------------|
| **Gateway** | 74 | FastAPI | ✅ Live | <85ms |
| **AI Agent** | 6 | FastAPI | ✅ Live | <15ms |
| **LangGraph** | 9 | FastAPI | ✅ Live | <120ms |
| **HR Portal** | 8 | Streamlit | ✅ Live | <1.8s |
| **Client Portal** | 7 | Streamlit | ✅ Live | <1.9s |
| **Candidate Portal** | 7 | Streamlit | ✅ Live | <2.1s |
| **TOTAL** | **111** | **Mixed** | **✅ 100%** | **Excellent** |

#### **🔑 Demo Credentials**
```bash
# Client Portal Login
Username: TECH001
Password: demo123

# API Testing Key
API Key: <YOUR_API_KEY>
```

#### **⚡ 30-Second Test**
```bash
# 1. Test API Health
curl https://bhiv-hr-gateway-ltg0.onrender.com/health

# 2. Get Real Data (10+ candidates)
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidates

# 3. AI Matching Test
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/match/1/top

# 4. Access HR Portal
# Visit: https://bhiv-hr-portal-u670.onrender.com/

# 5. Login to Client Portal
# Visit: https://bhiv-hr-client-portal-3iod.onrender.com/
# Use: TECH001 / demo123
```

---

## 💻 Local Development Setup (5 Minutes)

### **📋 Prerequisites**
```bash
# Required Software
✅ Docker & Docker Compose
✅ Python 3.12.7 (recommended)
✅ Git
✅ 8GB RAM minimum
✅ 10GB free disk space
```

### **🚀 Quick Setup**
```bash
# Step 1: Clone Repository (30 seconds)
git clone https://github.com/shashankmishraa/BHIV-HR-Platform.git
cd BHIV-HR-Platform

# Step 2: Environment Setup (30 seconds)
cp .env.example .env
# Edit .env if needed (optional for quick start)

# Step 3: Start All Services (3-4 minutes)
docker-compose -f deployment/docker/docker-compose.production.yml up -d

# Step 4: Verify Services (30 seconds)
curl http://localhost:8000/health    # Gateway
curl http://localhost:9000/health    # AI Agent
open http://localhost:8501           # HR Portal
open http://localhost:8502           # Client Portal
open http://localhost:8503           # Candidate Portal
```

### **🔧 Local Service Configuration**
```bash
# API Services
Gateway API:      http://localhost:8000    # 80 endpoints
AI Agent API:     http://localhost:9000    # 6 endpoints
LangGraph API:    http://localhost:9001    # 9 endpoints

# Portal Services  
HR Portal:        http://localhost:8501    # 8 endpoints
Client Portal:    http://localhost:8502    # 7 endpoints
Candidate Portal: http://localhost:8503    # 7 endpoints

# Database
PostgreSQL:       localhost:5432          # Schema v4.3.0

# Total Endpoints: 111 (80+6+25)
```

---

## 🎯 First Steps Guide

### **1. Explore the HR Portal (2 minutes)**
```bash
# Visit HR Portal
http://localhost:8501  # Local
https://bhiv-hr-portal-u670.onrender.com/  # Production

# Try These Features:
✅ Dashboard Overview - See real-time metrics
✅ View 10+ Real Candidates - Browse candidate database
✅ Check 6+ Active Jobs - Review job postings
✅ AI Shortlisting - Test Phase 3 AI matching
✅ LangGraph Workflows - Test automated processing
✅ Export Reports - Download assessment data
```

### **2. Test Client Portal (1 minute)**
```bash
# Visit Client Portal
http://localhost:8502  # Local
https://bhiv-hr-client-portal-3iod.onrender.com/  # Production

# Login Credentials:
Username: TECH001
Password: demo123

# Explore:
✅ Client Dashboard - Job posting analytics
✅ Create New Job - Post a job opening
✅ View Candidates - See AI-matched candidates
✅ Schedule Interviews - Manage interview process
```

### **3. Try Candidate Portal (1 minute)**
```bash
# Visit Candidate Portal
http://localhost:8503  # Local
https://bhiv-hr-candidate-portal-abe6.onrender.com/  # Production

# Features:
✅ Register Account - Create candidate profile
✅ Browse Jobs - View available positions
✅ Apply for Jobs - Submit applications
✅ Track Applications - Monitor application status
```

### **4. API Testing (1 minute)**
```bash
# Test Gateway API (80 endpoints)
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/jobs  # Local
     # OR
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/jobs  # Production

# Test AI Agent (6 endpoints with RL integration)
curl -X POST -H "Content-Type: application/json" \
     -d '{"job_id": 1}' \
     http://localhost:9000/match  # Local
     # OR
     https://bhiv-hr-agent-nhgg.onrender.com/match  # Production

# Test LangGraph Workflows (9 endpoints)
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1}' \
     http://localhost:9001/workflows/application/start  # Local
     # OR
     https://bhiv-hr-langgraph.onrender.com/workflows/application/start  # Production

# Test Portal Endpoints (22 total)
curl http://localhost:8501/health  # HR Portal
curl http://localhost:8502/health  # Client Portal
curl http://localhost:8503/health  # Candidate Portal
```

---

## 🔥 Key Features to Try

### **🤖 AI-Powered Matching & Automation**
```bash
# 1. Get AI Matches for Job (Phase 3 Engine)
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/match/1/top

# 2. Batch Processing (Multiple Jobs)
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"job_ids": [1, 2, 3]}' \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/match/batch

# 3. Candidate Analysis (Semantic + RL)
curl https://bhiv-hr-agent-nhgg.onrender.com/analyze/1

# 4. RL-Enhanced Prediction
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1}' \
     https://bhiv-hr-agent-nhgg.onrender.com/rl/predict

# 5. LangGraph Workflow Automation
curl -X POST -H "Content-Type: application/json" \
     -d '{"candidate_id": 1, "job_id": 1}' \
     https://bhiv-hr-langgraph.onrender.com/workflows/application/start

# 6. Multi-Channel Notification
curl -X POST -H "Content-Type: application/json" \
     -d '{"recipient": "test@example.com", "message": "Test notification", "channels": ["email", "whatsapp"]}' \
     https://bhiv-hr-langgraph.onrender.com/tools/send-notification
```

### **📊 Values Assessment**
```bash
# Submit 5-Point BHIV Values Assessment
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "candidate_id": 1,
       "job_id": 1,
       "integrity": 5,
       "honesty": 4,
       "discipline": 4,
       "hard_work": 5,
       "gratitude": 4,
       "comments": "Excellent candidate"
     }' \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/feedback
```

### **🔒 Security Features**
```bash
# Test 2FA Setup
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"user_id": "test_user"}' \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/2fa/setup

# Test Input Validation
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"input_data": "<script>alert(\"test\")</script>"}' \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/security/test-input-validation
```

---

## 📊 Real Data Available

### **Production Database**
```bash
# Current Real Data (Production Database):
✅ 10+ Candidates - Complete profiles with skills and experience
✅ 6+ Jobs - Active job postings from 3+ client companies  
✅ 29 Resume Files - Processed PDF/DOCX files in assets/resumes/
✅ 3+ Client Companies - TECH001, STARTUP01, ENTERPRISE01
✅ 3+ HR Users - Admin, HR Manager, Recruiter roles
✅ Assessment Data - 5-point BHIV values framework (Integrity, Honesty, Discipline, Hard Work, Gratitude)
✅ Interview Data - Complete scheduling and management system
✅ LangGraph Workflows - Automated candidate processing and notifications
✅ Database Schema v4.3.0 - 13 core tables + 6 RL tables with Phase 3 AI engine + RL integration + LangGraph workflow management
✅ Portal Endpoints - 22 additional endpoints across HR, Client, and Candidate portals
✅ Multi-Channel Notifications - Email, WhatsApp, SMS, Telegram integration
✅ Real-time Monitoring - Advanced performance metrics and health checks
```

### **Data Verification**
```bash
# Check Database Status (Schema v4.3.0)
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/database/schema

# Get Candidate Statistics
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     https://bhiv-hr-gateway-ltg0.onrender.com/v1/candidates/stats

# Check All Service Health (111 Endpoints)
curl https://bhiv-hr-gateway-ltg0.onrender.com/health
curl https://bhiv-hr-agent-nhgg.onrender.com/health
curl https://bhiv-hr-langgraph.onrender.com/health

# Get System Performance Metrics
curl https://bhiv-hr-gateway-ltg0.onrender.com/metrics
curl https://bhiv-hr-gateway-ltg0.onrender.com/health/detailed
```

---

## 🛠️ Development Workflow

### **Local Development Commands**
```bash
# Start Services
docker-compose -f deployment/docker/docker-compose.production.yml up -d

# View Logs
docker-compose -f deployment/docker/docker-compose.production.yml logs -f

# Stop Services
docker-compose -f deployment/docker/docker-compose.production.yml down

# Restart Single Service
docker-compose -f deployment/docker/docker-compose.production.yml restart gateway

# Database Access
psql postgresql://bhiv_user:password@localhost:5432/bhiv_hr
```

### **Testing Commands**
```bash
# Run API Tests
python tests/api/test_endpoints.py

# Run Security Tests
python tests/security/test_security.py

# Run All Tests
python tests/run_all_tests.py

# Test Specific Portal
python tests/integration/test_client_portal.py
```

---

## 🔧 Configuration

### **Environment Variables**
```bash
# Database Configuration
DATABASE_URL=postgresql://bhiv_user:password@localhost:5432/bhiv_hr

# API Configuration
API_KEY_SECRET=<YOUR_API_KEY>
JWT_SECRET_KEY=fallback_jwt_secret_key_for_client_auth_2025
CANDIDATE_JWT_SECRET_KEY=candidate_jwt_secret_key_2025

# Service URLs
GATEWAY_SERVICE_URL=http://gateway:8000
AGENT_SERVICE_URL=http://agent:9000
LANGGRAPH_SERVICE_URL=http://langgraph:9001
```

### **Service Configuration**
```bash
# Gateway Service (Port 8000) - 80 Endpoints
- FastAPI 4.2.0 (High-performance async)
- Triple authentication system
- RL integration with feedback loops
- LangGraph workflow integration
- Dynamic rate limiting (60-500 req/min)
- Real-time monitoring and metrics

# AI Agent Service (Port 9000) - 6 Endpoints
- FastAPI 4.2.0 (AI-optimized)
- Phase 3 semantic matching engine
- Reinforcement learning integration
- Sentence transformers (advanced NLP)
- <15ms response time

# LangGraph Service (Port 9001) - 9 Endpoints
- FastAPI 4.2.0 (Workflow-optimized)
- AI-powered workflow automation
- Multi-channel notifications (Email, WhatsApp, SMS, Telegram)
- Real-time status tracking
- RL-enhanced decision making

# Portal Services (Ports 8501-8503) - 22 Endpoints Total
- Streamlit 1.41.1 (Interactive web apps)
- HR Portal: 8 endpoints (Complete HR workflow)
- Client Portal: 7 endpoints (Enterprise interface)
- Candidate Portal: 7 endpoints (Job seeker interface)
- Real-time data synchronization
- Responsive design and accessibility
```

---

## 🚨 Troubleshooting

### **Common Issues & Solutions**

#### **Services Not Starting**
```bash
# Check Docker
docker --version
docker-compose --version

# Check Ports
netstat -tulpn | grep :8000
netstat -tulpn | grep :8501

# Restart Docker
sudo systemctl restart docker  # Linux
# Restart Docker Desktop      # Windows/Mac
```

#### **Database Connection Issues**
```bash
# Check Database Container
docker-compose -f deployment/docker/docker-compose.production.yml ps

# Check Database Logs
docker-compose -f deployment/docker/docker-compose.production.yml logs db

# Reset Database
docker-compose -f deployment/docker/docker-compose.production.yml down -v
docker-compose -f deployment/docker/docker-compose.production.yml up -d
```

#### **API Authentication Issues**
```bash
# Verify API Key
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/health

# Check Environment Variables
echo $API_KEY_SECRET

# Test Without Authentication (health endpoints)
curl http://localhost:8000/health
```

#### **Common API Endpoint Issues**

**Problem**: `422 Unprocessable Entity` on `/v1/candidates/stats`
**Solution**: Use Bearer token authentication
```bash
# Correct
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates/stats

# Incorrect
curl -H "X-API-Key: <YOUR_API_KEY>" \
     http://localhost:8000/v1/candidates/stats
```

**Problem**: `422 Unprocessable Entity` on `POST /v1/jobs`
**Solution**: Include all required fields
```bash
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Software Engineer",
       "department": "Engineering",
       "location": "Remote",
       "experience_level": "mid",
       "requirements": "Python, FastAPI",
       "description": "Join our team"
     }' \
     http://localhost:8000/v1/jobs
```

**Problem**: `404 Not Found` on LangGraph `/statistics`
**Solution**: Use correct endpoint path
```bash
# Correct
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/workflows/stats

# Incorrect
curl -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/statistics
```

**Problem**: `405 Method Not Allowed` on `POST /workflows`
**Solution**: Use correct workflow creation endpoint
```bash
# Correct
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"candidate_id":1,"job_id":1,"application_id":1,"candidate_email":"test@example.com","candidate_phone":"123-456-7890","candidate_name":"Test User","job_title":"Software Engineer"}' \
     http://localhost:9001/workflows/application/start

# Incorrect
curl -X POST -H "Authorization: Bearer <YOUR_API_KEY>" \
     http://localhost:9001/workflows
```

#### **Portal Access Issues**
```bash
# Check Service Status
curl http://localhost:8501/  # Should return HTML
curl http://localhost:8502/  # Should return HTML
curl http://localhost:8503/  # Should return HTML

# Check Streamlit Logs
docker-compose -f deployment/docker/docker-compose.production.yml logs portal
docker-compose -f deployment/docker/docker-compose.production.yml logs client_portal
docker-compose -f deployment/docker/docker-compose.production.yml logs candidate_portal
```

### **Performance Issues**
```bash
# Check System Resources
docker stats

# Check All Service Health (111 Endpoints)
curl http://localhost:8000/health/detailed  # Gateway (80 endpoints)
curl http://localhost:9000/health           # AI Agent (6 endpoints)
curl http://localhost:9001/health           # LangGraph (25 endpoints)
curl http://localhost:8501/health           # HR Portal (8 endpoints)
curl http://localhost:8502/health           # Client Portal (7 endpoints)
curl http://localhost:8503/health           # Candidate Portal (7 endpoints)

# Monitor Performance & Analytics
curl http://localhost:8000/metrics          # Prometheus metrics
curl http://localhost:8000/v1/monitoring/performance
curl http://localhost:9001/workflows/stats  # Workflow analytics
```

---

## 📚 Next Steps

### **After Quick Start**
1. **Explore Documentation**: Read [CURRENT_FEATURES.md](CURRENT_FEATURES.md) for complete feature list
2. **API Integration**: Check [API_DOCUMENTATION.md](../api/API_DOCUMENTATION.md) for all 111 endpoints
3. **Security Setup**: Review [SECURITY_AUDIT.md](security/SECURITY_AUDIT.md) for security features
4. **Production Deploy**: Follow [RENDER_DEPLOYMENT_GUIDE.md](deployment/RENDER_DEPLOYMENT_GUIDE.md)

### **Advanced Usage**
```bash
# Data Processing Tools
python tools/dynamic_job_creator.py --count 10
python tools/comprehensive_resume_extractor.py
python tools/database_sync_manager.py

# Custom Configuration
# Edit config/production.env
# Modify deployment/docker/docker-compose.production.yml

# Monitoring Setup
# Access Prometheus metrics at /metrics
# Set up custom dashboards
```

### **Integration Examples**
```python
# Python Integration
import requests

BASE_URL = "https://bhiv-hr-gateway-ltg0.onrender.com"
API_KEY = "<YOUR_API_KEY>"
headers = {"Authorization": f"Bearer {API_KEY}"}

# Get candidates
candidates = requests.get(f"{BASE_URL}/v1/candidates", headers=headers).json()

# AI matching
matches = requests.get(f"{BASE_URL}/v1/match/1/top", headers=headers).json()
```

---

## 🎯 Success Checklist

### **✅ Quick Start Complete When:**
- [ ] Can access all 5 portal URLs
- [ ] API health checks return "healthy"
- [ ] Can login to client portal (TECH001/demo123)
- [ ] Can view 10+ candidates in HR portal
- [ ] AI matching returns candidate scores
- [ ] Can create new job posting
- [ ] Can register new candidate
- [ ] Database shows 13 core tables
- [ ] All 111 endpoints respond correctly (80 Gateway + 6 Agent + 25 LangGraph)
- [ ] Export functionality works

### **🚀 Ready for Production When:**
- [ ] All services running smoothly
- [ ] Performance metrics acceptable (<100ms API)
- [ ] Security features tested (2FA, validation)
- [ ] Data integrity verified
- [ ] Monitoring setup complete
- [ ] Backup strategy in place

---

## 📞 Support & Resources

### **Documentation Links**
- **Complete Features**: [CURRENT_FEATURES.md](CURRENT_FEATURES.md)
- **API Reference**: [API_DOCUMENTATION.md](api/API_DOCUMENTATION.md)
- **Architecture**: [SERVICES_ARCHITECTURE_SUMMARY.md](architecture/SERVICES_ARCHITECTURE_SUMMARY.md)
- **Deployment**: [DEPLOYMENT_STATUS.md](architecture/DEPLOYMENT_STATUS.md)

### **Live Platform URLs**
- **Gateway API**: https://bhiv-hr-gateway-ltg0.onrender.com/docs
- **Agent API**: https://bhiv-hr-agent-nhgg.onrender.com/docs
- **HR Portal**: https://bhiv-hr-portal-u670.onrender.com/
- **Client Portal**: https://bhiv-hr-client-portal-3iod.onrender.com/
- **Candidate Portal**: https://bhiv-hr-candidate-portal-abe6.onrender.com/

### **Demo Credentials**
```bash
# Client Portal
Username: TECH001
Password: demo123

# API Testing
API Key: <YOUR_API_KEY>
```

---

**BHIV HR Platform Quick Start Guide** - Get started in 5 minutes with live production platform or local development setup.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: December 9, 2025 | **Setup Time**: 0-5 minutes | **Services**: 6/6 Live | **Endpoints**: 111 Total | **Status**: ✅ Production Ready
