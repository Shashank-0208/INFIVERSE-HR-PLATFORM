# 🚀 BHIV HR Platform

**Enterprise AI-Powered Recruiting Platform** with intelligent candidate matching, reinforcement learning, comprehensive assessment tools, and production-grade security.

---

## 📊 System Overview

| **Metric** | **Value** |
|------------|-----------|
| **Platform Version** | v4.3.0 |
| **Last Updated** | December 9, 2025 |
| **Git Status** | 📚 Complete Documentation Update - Post-Handover |
| **Services** | 6 Microservices + Database |
| **Total Endpoints** | 111 (74+6+25+6) |
| **Database Schema** | v4.3.0 (19 tables) |
| **Security Rating** | A+ (Zero Vulnerabilities) |
| **Production Status** | ✅ 6/6 Services Operational |
| **Uptime** | 99.9% |
| **Monthly Cost** | $0 (Optimized Free Tier) |

---

## 🌐 Live Production System

**Status**: ✅ **6/6 SERVICES OPERATIONAL** | **Cost**: $0/month | **Uptime**: 99.9% | **Total Endpoints**: 111

| Service | URL | Status |
|---------|-----|--------|
| **API Gateway** | [bhiv-hr-gateway-ltg0.onrender.com/docs](https://bhiv-hr-gateway-ltg0.onrender.com/docs) | ✅ 80 endpoints |
| **AI Engine** | [bhiv-hr-agent-nhgg.onrender.com/docs](https://bhiv-hr-agent-nhgg.onrender.com/docs) | ✅ 6 endpoints |
| **LangGraph Automation** | [bhiv-hr-langgraph.onrender.com](https://bhiv-hr-langgraph.onrender.com) | ✅ 25 endpoints |
| **HR Portal** | [bhiv-hr-portal-u670.onrender.com](https://bhiv-hr-portal-u670.onrender.com/) | ✅ Live |
| **Client Portal** | [bhiv-hr-client-portal-3iod.onrender.com](https://bhiv-hr-client-portal-3iod.onrender.com/) | ✅ Live |
| **Candidate Portal** | [bhiv-hr-candidate-portal-abe6.onrender.com](https://bhiv-hr-candidate-portal-abe6.onrender.com/) | ✅ Live |

**Demo Access**: Username: `TECH001` | Password: `demo123` | API Key: Available in Render dashboard

## 📚 Documentation

### **🚀 Quick Start**
- **[Get Started in 5 Minutes](docs/guides/QUICK_START_GUIDE.md)** - Setup and deployment guide
- **[Current Features](docs/guides/CURRENT_FEATURES.md)** - Complete feature list and capabilities
- **[User Guide](docs/guides/USER_GUIDE.md)** - Complete user manual
- **[Live Demo](docs/guides/LIVE_DEMO.md)** - Interactive platform demonstration

### **🏗️ Architecture**
- **[Project Structure](docs/architecture/PROJECT_STRUCTURE.md)** - Complete architecture and folder organization
- **[Services Architecture](docs/architecture/SERVICES_ARCHITECTURE_SUMMARY.md)** - Microservices documentation
- **[Deployment Status](docs/architecture/DEPLOYMENT_STATUS.md)** - Current deployment status and health metrics
- **[File Organization](docs/architecture/FILE_ORGANIZATION_SUMMARY.md)** - Project organization summary

### **🔧 Technical Guides**
- **[API Documentation](docs/api/API_DOCUMENTATION.md)** - Complete API reference (111 endpoints)
- **[Database Documentation](docs/database/DATABASE_DOCUMENTATION.md)** - Schema v4.3.0 with 19 tables
- **[DBeaver Setup Guide](docs/database/DBEAVER_SETUP_GUIDE.md)** - Professional database access
- **[Security Audit](docs/security/SECURITY_AUDIT.md)** - Enterprise security analysis
- **[Testing Guide](docs/testing/COMPREHENSIVE_TESTING_GUIDE.md)** - Complete testing strategy
- **[LangGraph Integration](docs/guides/LANGGRAPH_INTEGRATION_GUIDE.md)** - AI workflow automation
- **[WhatsApp Setup](docs/guides/WHATSAPP_COMPREHENSIVE_SETUP_GUIDE.md)** - Multi-channel communication
- **[Troubleshooting Guide](docs/guides/TROUBLESHOOTING_GUIDE.md)** - Issue resolution procedures

### **📊 Reports & Analysis**
- **[Production Readiness](docs/reports/COMPREHENSIVE_TEST_REPORT.md)** - Production verification report
- **[Endpoint Analysis](docs/reports/ENDPOINT_ANALYSIS_REPORT.md)** - Complete endpoint analysis
- **[Test Results](docs/reports/TEST_RESULTS_SUMMARY.md)** - Comprehensive test results
- **[Documentation Update](docs/reports/COMPLETE_DOCUMENTATION_UPDATE.md)** - Latest documentation changes
- **[Platform Organization](docs/reports/PLATFORM_ORGANIZATION_COMPLETE.md)** - Project restructuring summary

### **🔒 Security & Compliance**
- **[Security Audit](docs/security/SECURITY_AUDIT.md)** - A+ security rating analysis
- **[Bias Analysis](docs/security/BIAS_ANALYSIS.md)** - AI fairness assessment (97.3% score)
- **[API Keys Summary](docs/security/API_KEYS_SUMMARY.md)** - Authentication management
- **[Git Security Status](docs/guides/GIT_SECURITY_STATUS.md)** - Repository security validation

### **🎯 Handover Documentation**
- **[Read This First](handover/READ_THIS_FIRST.md)** - Quick start for new team members
- **[System Architecture](handover/architecture/ARCHITECTURE.md)** - Complete system overview
- **[API Contract](handover/api_contract/)** - Detailed API specifications (5 parts)
- **[Integration Maps](handover/integration_maps/INTEGRATION_MAPS.md)** - Service integration flows
- **[Operations FAQ](handover/FAQ_OPERATIONS.md)** - Troubleshooting procedures
- **[Runbook](handover/RUNBOOK.md)** - Operational procedures
- **[QA Checklist](handover/QA_TEST_CHECKLIST.md)** - Testing procedures

## ⚡ Quick Start

### **🌐 Use Live Platform (Recommended)**
1. Visit [HR Portal](https://bhiv-hr-portal-u670.onrender.com/) or [Client Portal](https://bhiv-hr-client-portal-3iod.onrender.com/)
2. Login with demo credentials: `TECH001` / `demo123`
3. Test API at [Gateway Docs](https://bhiv-hr-gateway-ltg0.onrender.com/docs)

### **💻 Local Development**
```bash
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git
cd BHIV-HR-Platform
cp .env.example .env
docker-compose -f docker-compose.production.yml up -d
```

**📖 Detailed Setup**: [Quick Start Guide](docs/guides/QUICK_START_GUIDE.md)

## 🏗️ System Architecture

**Microservices Architecture**: 6 services + PostgreSQL database  
**Technology Stack**: FastAPI 4.2.0, Streamlit 1.41.1, Python 3.12.7, PostgreSQL 17  
**Total Endpoints**: 111 (80 Gateway + 6 Agent + 25 LangGraph)  
**Database Schema**: v4.3.0 with 19 tables (13 core + 6 RL integration)  
**Deployment**: Docker-based microservices on Render platform  
**Organization**: Professional structure with 75+ documentation files  
**Git Status**: Complete documentation update post-handover (Dec 9, 2025)

**📖 Complete Architecture**: [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)

## 🚀 Key Features

### **🤖 AI-Powered Matching Engine**
- **Phase 3 Semantic Engine** with sentence transformers
- **Reinforcement Learning Integration** with feedback-based optimization
- **Adaptive Scoring** with company-specific optimization
- **Real-time Processing** (<0.02s response time)
- **Batch Processing** (50 candidates/chunk)
- **ML-Enhanced Predictions** with scikit-learn models
- **97.3% Fairness Score** with bias reduction framework
- **Continuous Learning** from hiring outcomes

### **🔄 LangGraph Workflow Automation**
- **AI Workflow Automation** for candidate processing
- **Multi-Channel Notifications** (Email, WhatsApp, Telegram, SMS) - ✅ Confirmed Working
- **Real-time Status Tracking** and monitoring
- **Automated Sequences** with `/tools/send-notification` endpoint
- **Direct API Integration** (Twilio, Gmail SMTP, Telegram Bot)
- **GPT-4 Powered Orchestration** for intelligent workflows
- **25 Workflow Endpoints** for complete automation

### **🔒 Enterprise Security (A+ Rating)**
- **Triple Authentication** (API Key + Client JWT + Candidate JWT)
- **Unified Auth Management** with dedicated auth_manager.py per service
- **2FA TOTP** with QR code generation
- **Dynamic Rate Limiting** (60-500 requests/minute)
- **Security Headers** (CSP, XSS protection, HSTS)
- **Zero Vulnerabilities** with comprehensive security audit
- **Complete Audit Logging** for compliance tracking

### **📊 Triple Portal System**
- **HR Portal** - Dashboard, candidate management, analytics, 2FA setup
- **Client Portal** - Enterprise job posting, application tracking, company preferences
- **Candidate Portal** - Job applications, profile management, status tracking
- **Mobile Responsive** design for all portals
- **Real-time Synchronization** across all interfaces

### **🗄️ Database & Performance**
- **PostgreSQL 17** with Schema v4.3.0 (19 tables)
- **13 Core Tables + 6 RL Integration Tables** for complete HR workflow
- **85+ Optimized Indexes** for sub-50ms query performance
- **Connection Pooling** with automatic scaling
- **Audit Logging** for comprehensive security tracking
- **Generated Columns** for real-time calculations
- **RL Feedback System** for continuous improvement

### **🏢 Enterprise Features**
- **API-First Architecture** with 111 production endpoints
- **Microservices Design** with independent scaling
- **Docker Containerization** for consistent deployment
- **Professional Documentation** with 75+ organized files
- **Comprehensive Testing** with 100% endpoint coverage
- **Zero-Cost Deployment** with $0/month optimization
- **99.9% Uptime** with production-grade reliability

**📖 Complete Features**: [Current Features](docs/guides/CURRENT_FEATURES.md)

## 🛠️ Development & Deployment

### **Project Structure**

**Microservices Architecture**: 6 services + database  
**Technology**: FastAPI, Streamlit, PostgreSQL  
**Deployment**: Docker containers with dynamic port allocation  
**Organization**: Professional structure with proper categorization

```
BHIV HR PLATFORM/
├── services/          # 6 microservices (each with Dockerfile for Render deployment)
│   ├── gateway/       # API Gateway (80 endpoints, auth_manager.py, routes/)
│   ├── agent/         # AI Engine (6 endpoints, Phase 3 + RL, semantic_engine/)
│   ├── langgraph/     # LangGraph (25 endpoints, workflows, communication.py)
│   ├── portal/        # HR Portal (Streamlit, auth_manager.py, components/)
│   ├── client_portal/ # Client Portal (Streamlit, auth_manager.py)
│   ├── candidate_portal/ # Candidate Portal (Streamlit, auth_manager.py)
│   └── db/            # Database (Schema v4.3.0, 19 tables, migrations/)
├── docs/             # Complete documentation suite (75+ files, organized)
│   ├── api/          # API documentation (111 endpoints)
│   ├── architecture/ # System architecture and project structure
│   ├── database/     # Database documentation and guides
│   ├── guides/       # User guides and setup instructions
│   ├── reports/      # Analysis reports and test results
│   ├── security/     # Security audits and compliance
│   └── testing/      # Testing strategies and guides
├── handover/         # Team handover documentation (complete system transfer)
│   ├── architecture/ # System architecture overview
│   ├── api_contract/ # Detailed API specifications (5 parts)
│   ├── integration_maps/ # Service integration flows
│   ├── issues/       # Known issues and limitations
│   └── video/        # Video documentation
├── tools/            # Data processing & utilities (organized by purpose)
├── config/           # Environment configurations (production.env, local.env)
├── deployment/       # Docker & deployment configurations
├── data/             # Production data (candidates, jobs)
└── assets/           # Static assets (resume files, documentation images)
```

**📖 Complete Structure**: [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)

### **Database Schema**

**PostgreSQL 17** with Schema v4.3.0  
**Tables**: 19 tables (13 core business + 6 RL integration)  
**Features**: 85+ indexes, audit triggers, generated columns, referential integrity, RL feedback system

**📖 Complete Schema**: [Database Documentation](docs/database/DATABASE_DOCUMENTATION.md)

### **Configuration**

**Environment Files**: `.env.example` (template), `config/` (production settings)  
**Deployment**: Docker Compose, Render platform configuration  
**Documentation**: Complete deployment guides available

**📖 Deployment Guide**: [Deployment Guide](docs/guides/DEPLOYMENT_GUIDE.md)

### **Local Development**

**Prerequisites**: Docker, Python 3.12.7, Git  
**Setup**: Copy `.env.example`, run Docker Compose  
**Services**: All 6 services available on localhost  
**Database**: PostgreSQL 17 with complete schema v4.3.0  
**Testing**: 111 endpoints with comprehensive test coverage

**📖 Setup Guide**: [Quick Start Guide](docs/guides/QUICK_START_GUIDE.md)

---

## 🧪 Testing & Quality Assurance

**Test Coverage**: 111 endpoints tested (100% pass rate)  
**Test Categories**: API, Security, Integration, LangGraph, Gateway  
**Organization**: Tests organized by service and functionality  
**Automation**: Complete test suite with reports

**📖 Testing Guide**: [Comprehensive Testing Guide](docs/testing/COMPREHENSIVE_TESTING_GUIDE.md)

---

## 📊 Performance & Monitoring

**Performance**: <100ms API response, <0.02s AI matching, 99.9% uptime  
**Monitoring**: Prometheus metrics, health checks, performance dashboards  
**Rate Limiting**: Dynamic 60-500 requests/minute based on CPU usage  
**Optimization**: Connection pooling, caching, memory optimization

**📖 Monitoring**: [Comprehensive Test Report](docs/reports/COMPREHENSIVE_TEST_REPORT.md)

---

## 🔧 Tools & Utilities

**Data Processing**: Resume extraction (29 files), job creation (19 jobs), database sync  
**Security Tools**: API key management, security audits, configuration validation  
**Deployment**: Local deployment scripts, Docker automation, health monitoring  
**Organization**: Tools categorized by purpose in dedicated directories

**📖 Tools Documentation**: [Project Structure](docs/architecture/PROJECT_STRUCTURE.md)

---

## 🎯 Production Status

**System Status**: ✅ **FULLY OPERATIONAL**  
**Services**: 6/6 live with 99.9% uptime  
**Endpoints**: 111 total (100% tested and functional)  
**Database**: PostgreSQL 17 with 19 tables (13 core + 6 RL integration)  
**Cost**: $0/month (optimized free tier deployment)

**Recent Updates (December 9, 2025)**:
- ✅ **Schema v4.3.0**: Enhanced database with 19 tables (13 core + 6 RL integration)
- ✅ **111 Endpoints**: Complete API coverage (74 Gateway + 6 Agent + 25 LangGraph + 6 Portal)
- ✅ **RL Integration**: Advanced reinforcement learning with 97.3% fairness score
- ✅ **Unified Authentication**: auth_manager.py in all 6 services
- ✅ **Multi-Channel Notifications**: Email, WhatsApp, Telegram confirmed working
- ✅ **Professional Documentation**: 75+ files organized in proper structure
- ✅ **Security Compliance**: All credentials secured, enterprise-grade protection
- ✅ **Performance Optimization**: <100ms API, <0.02s AI matching, 99.9% uptime

**📖 Detailed Status**: [Deployment Status](docs/architecture/DEPLOYMENT_STATUS.md)

---

## 🚀 Getting Started

### **🌐 For Users**
1. Visit [Live Platform](https://bhiv-hr-gateway-ltg0.onrender.com/docs)
2. Access [HR Portal](https://bhiv-hr-portal-u670.onrender.com/) or [Client Portal](https://bhiv-hr-client-portal-3iod.onrender.com/)
3. Use demo credentials: `TECH001` / `demo123` or API key for testing

### **💻 For Developers**
1. Clone repository and setup environment
2. Run Docker Compose for local development
3. Execute test suite for validation
4. Review handover documentation in `/handover/` directory

**📖 Complete Setup**: [Quick Start Guide](docs/guides/QUICK_START_GUIDE.md)

---

## 📞 Resources

**GitHub**: [BHIV-HR-Platform Repository](https://github.com/Shashank-0208/BHIV-HR-PLATFORM)  
**Platform**: Render Cloud (Oregon, US West)  
**Documentation**: Complete guides in `docs/` directory  
**Handover**: Team handover documentation in `handover/` directory

### **Quick Links**
- [Live API Documentation](https://bhiv-hr-gateway-ltg0.onrender.com/docs)
- [HR Dashboard](https://bhiv-hr-portal-u670.onrender.com/)
- [Client Portal](https://bhiv-hr-client-portal-3iod.onrender.com/)
- [Candidate Portal](https://bhiv-hr-candidate-portal-abe6.onrender.com/)
- [AI Agent Service](https://bhiv-hr-agent-nhgg.onrender.com/docs)
- [LangGraph Automation](https://bhiv-hr-langgraph.onrender.com)

### **Documentation Navigation**
- **Quick Start**: [docs/guides/QUICK_START_GUIDE.md](docs/guides/QUICK_START_GUIDE.md)
- **Architecture**: [docs/architecture/](docs/architecture/)
- **API Reference**: [docs/api/API_DOCUMENTATION.md](docs/api/API_DOCUMENTATION.md)
- **Security**: [docs/security/](docs/security/)
- **Testing**: [docs/testing/](docs/testing/)
- **Handover**: [handover/READ_THIS_FIRST.md](handover/READ_THIS_FIRST.md)

---

**BHIV HR Platform v4.3.0** - Enterprise AI-powered recruiting platform with intelligent candidate matching, reinforcement learning, comprehensive assessment tools, and production-grade security.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Status**: ✅ Production Ready | **Services**: 6/6 Live | **Endpoints**: 111 Total | **Database**: 19 Tables | **Uptime**: 99.9% | **Cost**: $0/month | **Updated**: December 9, 2025 (Post-Handover Documentation Update)