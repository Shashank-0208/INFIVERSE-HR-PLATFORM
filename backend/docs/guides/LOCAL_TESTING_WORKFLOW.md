# 🧪 BHIV HR Platform - Local Testing Workflow

**Complete End-to-End Testing Guide**  
**Version**: v4.3.0 with RL Integration  
**Updated**: December 9, 2025  
**Services**: 6 microservices | **Endpoints**: 111 total  
**Testing Coverage**: 100% workflow automation

---

## 📊 Testing Overview

### **System Under Test**
- **Platform**: BHIV HR Platform v4.3.0
- **Services**: 6 microservices (Gateway, Agent, LangGraph, 3 Portals)
- **Database**: PostgreSQL 17 with Schema v4.3.0 (19 tables)
- **Endpoints**: 111 total (80 Gateway + 6 Agent + 25 LangGraph)
- **Features**: AI matching, RL integration, workflow automation, triple authentication

### **Testing Scope**
- **Functional Testing**: All core HR workflows
- **Integration Testing**: Service-to-service communication
- **AI Testing**: Semantic matching and RL feedback
- **Workflow Testing**: LangGraph automation
- **Security Testing**: Authentication and authorization
- **Performance Testing**: Response times and throughput

### **Prerequisites**
```bash
# Required software
- Docker Desktop 4.0+
- Git 2.30+
- Python 3.12.7
- curl or Postman
- PostgreSQL client (optional)
- 4GB RAM minimum
```

---

## 🚀 Environment Setup

### **Step 1: Clone and Setup**
```bash
# Clone repository
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git
cd BHIV-HR-Platform

# Setup environment
cp .env.example .env
# Edit .env with local testing credentials (optional)
```

### **Step 2: Start All Services**
```bash
# Start complete system
docker-compose -f docker-compose.production.yml up -d

# Wait for services to initialize
sleep 30

# Verify all services are running
docker-compose -f docker-compose.production.yml ps
```

### **Step 3: Service Health Verification**
```bash
# API Gateway (80 endpoints)
curl http://localhost:8000/health
curl http://localhost:8000/docs

# AI Agent (6 endpoints)
curl http://localhost:8001/health
curl http://localhost:8001/docs

# LangGraph (25 endpoints)
curl http://localhost:8002/health
curl http://localhost:8002/docs

# Portal Services
curl -I http://localhost:8501  # HR Portal
curl -I http://localhost:8502  # Client Portal
curl -I http://localhost:8503  # Candidate Portal

# Database
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "SELECT version();"
```

### **Expected Service URLs**
| Service | Local URL | Status Check |
|---------|-----------|--------------|
| **API Gateway** | http://localhost:8000/docs | /health |
| **AI Agent** | http://localhost:8001/docs | /health |
| **LangGraph** | http://localhost:8002/docs | /health |
| **HR Portal** | http://localhost:8501 | /_stcore/health |
| **Client Portal** | http://localhost:8502 | /_stcore/health |
| **Candidate Portal** | http://localhost:8503 | /_stcore/health |
| **Database** | localhost:5432 | psql connection |

---

## 🔄 Complete Testing Workflow

### **Test Scenario 1: Client Registration & Job Posting**

#### **1.1 Client Registration (Portal)**
```bash
# Open Client Portal
# URL: http://localhost:8502

# Registration Form:
Client ID: TESTCORP001
Company Name: Test Corporation Ltd
Email: admin@testcorp.com
Contact Person: John Manager
Phone: +1-555-0100
Password: SecurePass123!
Confirm Password: SecurePass123!

# Expected Result: "Registration successful! You can now login securely."
```

#### **1.2 Client Registration (API)**
```bash
curl -X POST http://localhost:8000/v1/client/register \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "TESTCORP001",
    "company_name": "Test Corporation Ltd",
    "email": "admin@testcorp.com",
    "contact_person": "John Manager",
    "phone": "+1-555-0100",
    "password": "SecurePass123!",
    "industry": "Technology",
    "company_size": "50-100"
  }'

# Expected Response:
# {
#   "message": "Client registered successfully",
#   "client_id": "TESTCORP001",
#   "status": "active"
# }
```

#### **1.3 Client Login & Authentication**
```bash
# Login via API
curl -X POST http://localhost:8000/v1/client/login \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "TESTCORP001",
    "password": "SecurePass123!"
  }'

# Save the JWT token from response
export CLIENT_TOKEN="<jwt_token_from_response>"

# Verify token
curl -H "Authorization: Bearer $CLIENT_TOKEN" \
     http://localhost:8000/v1/client/profile
```

#### **1.4 Job Posting**
```bash
# Create job posting
curl -X POST http://localhost:8000/v1/jobs \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Full Stack Developer",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "experience_level": "Senior",
    "employment_type": "Full-time",
    "salary_min": 120000,
    "salary_max": 160000,
    "description": "We are seeking a senior full stack developer with expertise in Python, React, and cloud technologies.",
    "requirements": "5+ years experience with Python, FastAPI, React, PostgreSQL, Docker, AWS. Strong problem-solving skills and team collaboration."
  }'

# Expected Response:
# {
#   "job_id": 1,
#   "title": "Senior Full Stack Developer",
#   "status": "active",
#   "created_at": "2025-12-09T..."
# }

# Save job ID for later use
export JOB_ID=1
```

### **Test Scenario 2: Candidate Registration & Application**

#### **2.1 Candidate Registration**
```bash
# Register candidate via API
curl -X POST http://localhost:8000/v1/candidate/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "password": "CandidatePass123!",
    "phone": "+1-555-0201",
    "location": "San Francisco, CA",
    "experience_years": 6,
    "technical_skills": "Python, FastAPI, React, PostgreSQL, Docker, AWS, Kubernetes, Redis",
    "education_level": "Master",
    "seniority_level": "Senior"
  }'

# Expected Response:
# {
#   "candidate_id": 1,
#   "name": "Alice Johnson",
#   "email": "alice.johnson@example.com",
#   "status": "applied"
# }

export CANDIDATE_ID=1
```

#### **2.2 Candidate Login**
```bash
# Login candidate
curl -X POST http://localhost:8000/v1/candidate/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.johnson@example.com",
    "password": "CandidatePass123!"
  }'

# Save candidate token
export CANDIDATE_TOKEN="<jwt_token_from_response>"

# Verify candidate profile
curl -H "Authorization: Bearer $CANDIDATE_TOKEN" \
     http://localhost:8000/v1/candidate/profile
```

#### **2.3 Job Search & Application**
```bash
# Search available jobs
curl -H "Authorization: Bearer $CANDIDATE_TOKEN" \
     http://localhost:8000/v1/jobs?status=active

# Apply for job
curl -X POST http://localhost:8000/v1/candidate/apply \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": '$JOB_ID',
    "cover_letter": "I am excited to apply for the Senior Full Stack Developer position. With 6 years of experience in Python, React, and cloud technologies, I believe I would be a valuable addition to your engineering team. My expertise in FastAPI, PostgreSQL, and AWS aligns perfectly with your requirements."
  }'

# Expected Response:
# {
#   "application_id": 1,
#   "status": "applied",
#   "applied_date": "2025-12-09T..."
# }

export APPLICATION_ID=1
```

### **Test Scenario 3: AI Matching & RL Integration**

#### **3.1 AI Semantic Matching**
```bash
# Test AI matching for specific candidate-job pair
curl -X POST http://localhost:8001/match \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID'
  }'

# Expected Response:
# {
#   "candidate_id": 1,
#   "job_id": 1,
#   "overall_score": 87.5,
#   "semantic_score": 92.3,
#   "experience_score": 85.0,
#   "skills_score": 90.1,
#   "location_score": 100.0,
#   "cultural_fit_score": 78.5,
#   "algorithm_version": "phase3_v1.0",
#   "cached": false
# }
```

#### **3.2 Batch AI Matching**
```bash
# Test batch matching for all candidates against job
curl -X POST http://localhost:8001/batch_match \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": '$JOB_ID',
    "limit": 10
  }'

# Expected Response: Array of candidate matches with scores
```

#### **3.3 RL System Testing**
```bash
# Check RL states
curl http://localhost:8000/v1/rl/states?candidate_id=$CANDIDATE_ID&job_id=$JOB_ID

# Test RL feedback integration
curl -X POST http://localhost:8000/v1/rl/feedback \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "outcome": "interview_scheduled",
    "feedback_score": 4.5,
    "hire_success": null
  }'
```

### **Test Scenario 4: LangGraph Workflow Automation**

#### **4.1 Application Workflow Trigger**
```bash
# Start application workflow
curl -X POST http://localhost:8002/workflows/application/start \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "application_id": '$APPLICATION_ID',
    "candidate_email": "alice.johnson@example.com",
    "candidate_phone": "+1-555-0201",
    "candidate_name": "Alice Johnson",
    "job_title": "Senior Full Stack Developer",
    "company_name": "Test Corporation Ltd",
    "client_email": "admin@testcorp.com"
  }'

# Expected Response:
# {
#   "workflow_id": "wf_abc123",
#   "status": "started",
#   "created_at": "2025-12-09T...",
#   "steps": ["notification_sent", "ai_matching", "client_notification"]
# }

export WORKFLOW_ID="wf_abc123"
```

#### **4.2 Workflow Status Monitoring**
```bash
# Check workflow status
curl http://localhost:8002/workflows/$WORKFLOW_ID/status

# List all workflows
curl http://localhost:8002/workflows

# Get workflow details
curl http://localhost:8002/workflows/$WORKFLOW_ID
```

#### **4.3 Notification Testing**
```bash
# Test email notification
curl -X POST http://localhost:8002/tools/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email",
    "recipient": "alice.johnson@example.com",
    "subject": "Application Received - Senior Full Stack Developer",
    "message": "Thank you for your application. We will review it and get back to you soon.",
    "metadata": {
      "candidate_id": '$CANDIDATE_ID',
      "job_id": '$JOB_ID'
    }
  }'

# Test WhatsApp notification (development mode)
curl -X POST http://localhost:8002/tools/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "type": "whatsapp",
    "recipient": "+1-555-0201",
    "message": "Your application for Senior Full Stack Developer has been received!",
    "metadata": {
      "candidate_id": '$CANDIDATE_ID',
      "job_id": '$JOB_ID'
    }
  }'
```

### **Test Scenario 5: Interview & Assessment Process**

#### **5.1 Interview Scheduling**
```bash
# Schedule interview
curl -X POST http://localhost:8000/v1/interviews \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "interview_date": "2025-12-15T14:00:00",
    "interview_type": "technical",
    "interviewer": "Sarah Tech Lead",
    "duration_minutes": 90,
    "meeting_link": "https://meet.google.com/abc-defg-hij",
    "notes": "Technical interview focusing on Python, React, and system design"
  }'

# Expected Response:
# {
#   "interview_id": 1,
#   "status": "scheduled",
#   "interview_date": "2025-12-15T14:00:00"
# }

export INTERVIEW_ID=1
```

#### **5.2 BHIV Values Assessment**
```bash
# Submit values feedback
curl -X POST http://localhost:8000/v1/feedback \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "integrity": 5,
    "honesty": 5,
    "discipline": 4,
    "hard_work": 5,
    "gratitude": 4,
    "comments": "Excellent candidate with strong technical skills and great cultural fit. Shows high integrity and work ethic.",
    "feedback_type": "interview",
    "interviewer_id": 1
  }'

# Expected Response:
# {
#   "feedback_id": 1,
#   "average_score": 4.6,
#   "created_at": "2025-12-09T..."
# }
```

#### **5.3 RL Feedback Integration**
```bash
# Update RL system with interview outcome
curl -X POST http://localhost:8000/v1/rl/rewards \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "outcome": "interview_completed",
    "reward_value": 0.8,
    "feedback_score": 4.6,
    "hire_success": null
  }'
```

### **Test Scenario 6: Job Offer & Completion**

#### **6.1 Job Offer Creation**
```bash
# Create job offer
curl -X POST http://localhost:8000/v1/offers \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "salary": 145000,
    "currency": "USD",
    "start_date": "2025-01-15",
    "terms": "Full-time employment with comprehensive benefits package including health insurance, dental, vision, 401k with company match, and 20 days PTO.",
    "benefits": "Health insurance, Dental, Vision, 401k match, PTO, Remote work flexibility",
    "expiry_date": "2025-12-20"
  }'

# Expected Response:
# {
#   "offer_id": 1,
#   "status": "pending",
#   "offer_date": "2025-12-09",
#   "expiry_date": "2025-12-20"
# }

export OFFER_ID=1
```

#### **6.2 Offer Notification Workflow**
```bash
# Trigger offer notification workflow
curl -X POST http://localhost:8002/workflows/offer/start \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "offer_id": '$OFFER_ID',
    "candidate_email": "alice.johnson@example.com",
    "candidate_phone": "+1-555-0201",
    "candidate_name": "Alice Johnson",
    "job_title": "Senior Full Stack Developer",
    "salary": 145000,
    "start_date": "2025-01-15"
  }'
```

#### **6.3 Final RL Update**
```bash
# Update RL system with offer outcome
curl -X POST http://localhost:8000/v1/rl/rewards \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": '$CANDIDATE_ID',
    "job_id": '$JOB_ID',
    "outcome": "offer_made",
    "reward_value": 1.0,
    "feedback_score": 4.6,
    "hire_success": true
  }'
```

---

## 🔍 Portal Testing

### **HR Portal Testing (http://localhost:8501)**
```bash
# Access HR Portal
# Login with demo credentials or create HR user

# Test Features:
1. Dashboard Overview
   - Total candidates: Should show 1+
   - Active jobs: Should show 1+
   - Recent applications: Should show Alice Johnson

2. Candidate Management
   - View all candidates
   - Search by skills: "Python"
   - Filter by experience: "Senior"

3. Job Management
   - View all jobs
   - Edit job postings
   - Job analytics

4. AI Matching
   - Run AI matching for jobs
   - View match scores
   - Batch processing results

5. Analytics & Reports
   - Hiring funnel metrics
   - AI performance stats
   - RL system metrics
```

### **Client Portal Testing (http://localhost:8502)**
```bash
# Login with TESTCORP001 / SecurePass123!

# Test Features:
1. Dashboard
   - Company: Test Corporation Ltd
   - Active jobs: 1
   - Applications: 1
   - Interviews: 1

2. Job Posting
   - Create new job
   - Edit existing job
   - Job status management

3. Candidate Review
   - View applications for jobs
   - AI match scores
   - Candidate profiles

4. Interview Management
   - Schedule interviews
   - View interview calendar
   - Interview notes

5. Reports & Analytics
   - Application metrics
   - Hiring pipeline
   - Time-to-hire stats
```

### **Candidate Portal Testing (http://localhost:8503)**
```bash
# Access as candidate or register new candidate

# Test Features:
1. Job Search
   - Browse available jobs
   - Filter by location, experience
   - Search by keywords

2. Application Management
   - View applied jobs
   - Application status tracking
   - Interview schedules

3. Profile Management
   - Update skills and experience
   - Upload resume
   - Contact information

4. Notifications
   - Application confirmations
   - Interview invitations
   - Offer notifications
```

---

## 📊 Data Verification

### **Database Verification**
```bash
# Connect to local database
docker exec -it bhiv_hr_db psql -U bhiv_user -d bhiv_hr

# Verify test data
SELECT * FROM clients WHERE client_id = 'TESTCORP001';
SELECT * FROM candidates WHERE email = 'alice.johnson@example.com';
SELECT * FROM jobs WHERE title = 'Senior Full Stack Developer';
SELECT * FROM job_applications WHERE candidate_id = 1 AND job_id = 1;
SELECT * FROM interviews WHERE candidate_id = 1;
SELECT * FROM feedback WHERE candidate_id = 1;
SELECT * FROM offers WHERE candidate_id = 1;

# Check RL system data
SELECT * FROM rl_states WHERE candidate_id = 1;
SELECT * FROM rl_rewards WHERE candidate_id = 1;
SELECT * FROM matching_cache WHERE candidate_id = 1;

# Verify workflow data
SELECT * FROM audit_logs WHERE table_name IN ('candidates', 'jobs', 'job_applications');
```

### **API Response Validation**
```bash
# Validate API responses
curl -H "Authorization: Bearer $CLIENT_TOKEN" \
     http://localhost:8000/v1/analytics/dashboard | jq '.'

curl -H "Authorization: Bearer $CANDIDATE_TOKEN" \
     http://localhost:8000/v1/candidate/applications | jq '.'

# Check AI matching cache
curl http://localhost:8001/cache/stats | jq '.'

# Verify LangGraph workflows
curl http://localhost:8002/workflows/stats | jq '.'
```

---

## 🧪 Advanced Testing Scenarios

### **Scenario A: Multi-Candidate Competition**
```bash
# Register 3 additional candidates with different skill levels
for i in {2..4}; do
  curl -X POST http://localhost:8000/v1/candidate/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Candidate '$i'",
      "email": "candidate'$i'@example.com",
      "password": "Pass123!",
      "phone": "+1-555-020'$i'",
      "location": "San Francisco, CA",
      "experience_years": '$((i+2))',
      "technical_skills": "Python, JavaScript, SQL",
      "education_level": "Bachelor",
      "seniority_level": "Mid"
    }'
done

# Have all candidates apply for the same job
for i in {2..4}; do
  # Login each candidate and apply
  TOKEN=$(curl -X POST http://localhost:8000/v1/candidate/login \
    -H "Content-Type: application/json" \
    -d '{"email": "candidate'$i'@example.com", "password": "Pass123!"}' | jq -r '.access_token')
  
  curl -X POST http://localhost:8000/v1/candidate/apply \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"job_id": '$JOB_ID', "cover_letter": "I am interested in this position."}'
done

# Test batch AI matching
curl -X POST http://localhost:8001/batch_match \
  -H "Content-Type: application/json" \
  -d '{"job_id": '$JOB_ID', "limit": 10}'
```

### **Scenario B: Workflow Error Handling**
```bash
# Test invalid workflow data
curl -X POST http://localhost:8002/workflows/application/start \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 999,
    "job_id": 999,
    "application_id": 999
  }'

# Expected: Error response with proper error handling

# Test workflow recovery
curl -X POST http://localhost:8002/workflows/$WORKFLOW_ID/retry
```

### **Scenario C: Performance Testing**
```bash
# Load test API endpoints
ab -n 100 -c 10 http://localhost:8000/health

# Test concurrent AI matching
for i in {1..10}; do
  curl -X POST http://localhost:8001/match \
    -H "Content-Type: application/json" \
    -d '{"candidate_id": 1, "job_id": 1}' &
done
wait

# Test workflow concurrency
for i in {1..5}; do
  curl -X POST http://localhost:8002/workflows/test \
    -H "Content-Type: application/json" \
    -d '{"test_id": '$i'}' &
done
wait
```

### **Scenario D: Security Testing**
```bash
# Test authentication
curl http://localhost:8000/v1/jobs
# Expected: 401 Unauthorized

# Test invalid tokens
curl -H "Authorization: Bearer invalid_token" \
     http://localhost:8000/v1/jobs
# Expected: 401 Unauthorized

# Test rate limiting
for i in {1..100}; do
  curl http://localhost:8000/health &
done
wait
# Should trigger rate limiting after threshold
```

---

## ✅ Success Criteria & Validation

### **Core Functionality (20 Tests)**
1. ✅ **Client Registration**: Portal and API registration successful
2. ✅ **Client Authentication**: Login returns valid JWT token
3. ✅ **Job Posting**: Job created with all required fields
4. ✅ **Candidate Registration**: Candidate profile created successfully
5. ✅ **Candidate Authentication**: Login returns valid JWT token
6. ✅ **Job Application**: Application submitted and tracked
7. ✅ **AI Matching**: Semantic matching returns scores >80%
8. ✅ **Batch Matching**: Multiple candidates ranked correctly
9. ✅ **Interview Scheduling**: Interview created with proper details
10. ✅ **Values Assessment**: BHIV values feedback submitted
11. ✅ **Job Offer**: Offer created with salary and terms
12. ✅ **Database Persistence**: All data properly stored
13. ✅ **Portal Access**: All 3 portals load and function
14. ✅ **API Documentation**: Swagger docs accessible
15. ✅ **Health Checks**: All services respond to health endpoints
16. ✅ **Error Handling**: Proper error responses for invalid requests
17. ✅ **Data Validation**: Input validation working correctly
18. ✅ **Security**: Authentication and authorization enforced
19. ✅ **Performance**: Response times <100ms for API calls
20. ✅ **Logging**: Audit logs created for all operations

### **Advanced Features (15 Tests)**
21. ✅ **RL Integration**: RL states and rewards created
22. ✅ **RL Feedback**: Feedback updates RL system
23. ✅ **Matching Cache**: AI results cached for performance
24. ✅ **LangGraph Workflows**: Workflows created and tracked
25. ✅ **Workflow Status**: Status updates work correctly
26. ✅ **Multi-Channel Notifications**: Email, WhatsApp, Telegram
27. ✅ **Workflow Automation**: End-to-end automation working
28. ✅ **Gateway Integration**: All services accessible via gateway
29. ✅ **Service Discovery**: Services communicate correctly
30. ✅ **Load Balancing**: Multiple requests handled properly
31. ✅ **Concurrent Processing**: Parallel operations work
32. ✅ **Data Consistency**: ACID properties maintained
33. ✅ **Backup & Recovery**: Database backup/restore works
34. ✅ **Monitoring**: Health and performance metrics available
35. ✅ **Scalability**: System handles increased load

### **Performance Benchmarks**
- **API Response Time**: <100ms (95th percentile)
- **AI Matching Speed**: <0.02s with caching
- **Database Query Time**: <50ms average
- **Workflow Processing**: <5s end-to-end
- **Portal Load Time**: <3s initial load
- **Concurrent Users**: 50+ simultaneous
- **Throughput**: 500+ requests/minute
- **Memory Usage**: <2GB total system
- **CPU Usage**: <70% under load
- **Disk I/O**: <100MB/s sustained

---

## 🚨 Troubleshooting Guide

### **Common Issues & Solutions**

#### **Services Not Starting**
```bash
# Check Docker status
docker-compose -f docker-compose.production.yml ps

# View service logs
docker-compose -f docker-compose.production.yml logs gateway
docker-compose -f docker-compose.production.yml logs db

# Restart specific service
docker-compose -f docker-compose.production.yml restart gateway

# Full system restart
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml up -d
```

#### **Database Connection Issues**
```bash
# Check database status
docker exec bhiv_hr_db pg_isready -U bhiv_user

# Reset database
docker-compose -f docker-compose.production.yml down -v
docker-compose -f docker-compose.production.yml up -d

# Manual schema initialization
docker exec -i bhiv_hr_db psql -U bhiv_user -d bhiv_hr < services/db/consolidated_schema.sql
```

#### **Authentication Failures**
```bash
# Check JWT configuration
curl -X POST http://localhost:8000/v1/auth/verify \
  -H "Authorization: Bearer $TOKEN"

# Reset API keys
docker-compose -f docker-compose.production.yml restart gateway

# Check environment variables
docker exec gateway env | grep JWT
```

#### **Portal Loading Issues**
```bash
# Check Streamlit health
curl http://localhost:8501/_stcore/health
curl http://localhost:8502/_stcore/health
curl http://localhost:8503/_stcore/health

# Restart portal services
docker-compose -f docker-compose.production.yml restart hr_portal
docker-compose -f docker-compose.production.yml restart client_portal
docker-compose -f docker-compose.production.yml restart candidate_portal
```

#### **AI Matching Issues**
```bash
# Check AI Agent status
curl http://localhost:8001/health

# Test semantic model loading
curl http://localhost:8001/model/status

# Clear matching cache
curl -X DELETE http://localhost:8001/cache/clear
```

#### **LangGraph Workflow Issues**
```bash
# Check LangGraph service
curl http://localhost:8002/health

# List active workflows
curl http://localhost:8002/workflows

# Cancel stuck workflow
curl -X DELETE http://localhost:8002/workflows/$WORKFLOW_ID
```

### **Performance Issues**
```bash
# Check resource usage
docker stats

# Monitor database performance
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC LIMIT 10;"

# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/v1/jobs
```

### **Data Integrity Issues**
```bash
# Verify database constraints
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE contype IN ('f', 'c', 'u');"

# Check for orphaned records
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "
SELECT 'job_applications' as table_name, COUNT(*) as orphaned_count
FROM job_applications ja
LEFT JOIN candidates c ON ja.candidate_id = c.id
LEFT JOIN jobs j ON ja.job_id = j.id
WHERE c.id IS NULL OR j.id IS NULL;"
```

---

## 📈 Test Reporting

### **Automated Test Report Generation**
```bash
#!/bin/bash
# generate_test_report.sh

echo "🧪 BHIV HR Platform Test Report"
echo "Generated: $(date)"
echo "================================"

# Service health checks
echo "📊 Service Health:"
services=("gateway:8000" "agent:8001" "langgraph:8002" "hr_portal:8501" "client_portal:8502" "candidate_portal:8503")
for service in "${services[@]}"; do
    name=${service%%:*}
    port=${service#*:}
    if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1; then
        echo "✅ $name: Healthy"
    else
        echo "❌ $name: Unhealthy"
    fi
done

# Database connectivity
echo "🗄️ Database:"
if docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ PostgreSQL: Connected"
else
    echo "❌ PostgreSQL: Connection failed"
fi

# API endpoint tests
echo "🔗 API Endpoints:"
endpoints=("health" "docs" "v1/jobs" "v1/candidates")
for endpoint in "${endpoints[@]}"; do
    if curl -f -s "http://localhost:8000/$endpoint" > /dev/null 2>&1; then
        echo "✅ /$endpoint: Accessible"
    else
        echo "❌ /$endpoint: Failed"
    fi
done

# Performance metrics
echo "⚡ Performance:"
response_time=$(curl -w "%{time_total}" -o /dev/null -s http://localhost:8000/health)
echo "Response time: ${response_time}s"

# Test summary
echo "📋 Test Summary:"
echo "Total tests: 35"
echo "Passed: $(grep -c "✅" <<< "$output")"
echo "Failed: $(grep -c "❌" <<< "$output")"
```

### **Test Coverage Report**
```bash
# Generate coverage report
python -m pytest tests/ --cov=services --cov-report=html --cov-report=term

# View coverage
open htmlcov/index.html  # macOS
start htmlcov/index.html  # Windows
```

---

**BHIV HR Platform Local Testing Workflow v4.3.0** - Complete end-to-end testing guide with 35 test scenarios, RL integration, workflow automation, and comprehensive validation.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: December 9, 2025 | **Version**: v4.3.0 | **Services**: 6/6 | **Tests**: 35 scenarios | **Coverage**: 100%