# 🗄️ BHIV HR Platform - Database Documentation

**PostgreSQL 17 Database Schema v4.3.0**  
**Updated**: December 9, 2025  
**Status**: ✅ Production Ready  
**Tables**: 19 total (13 core + 6 RL integration)  
**Endpoints**: 111 total across 6 services

---

## 📊 Database Overview

### **Database Architecture**
- **Engine**: PostgreSQL 17
- **Schema Version**: v4.3.0 (Latest)
- **Total Tables**: 19 (13 core + 6 RL tables)
- **Indexes**: 85+ performance indexes
- **Triggers**: 20+ automated triggers
- **Functions**: 5 PostgreSQL functions
- **RL Integration**: Complete reinforcement learning system

### **Production Statistics**
- **Live Data**: 29 candidates, 19 jobs, 6+ clients
- **Performance**: <50ms query response, <0.02s AI matching
- **Uptime**: 99.9% availability
- **Cost**: $0/month (optimized free tier)
- **Backup**: Automated daily backups with WAL archiving
- **Security**: Triple authentication, encrypted connections, audit logging

### **System Integration**
- **Services**: 6 microservices with unified database access
- **API Gateway**: 80 endpoints with database integration
- **AI Agent**: Phase 3 semantic engine with RL feedback
- **LangGraph**: 25 workflow endpoints with database tracking
- **Portals**: Triple portal system with shared authentication

---

## 🏗️ Core Database Schema

### **1. Application Tables (8 Tables)**

#### **candidates** - Candidate Profiles
```sql
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    experience_years INTEGER DEFAULT 0 CHECK (experience_years >= 0),
    technical_skills TEXT,
    seniority_level VARCHAR(100),
    education_level VARCHAR(100),
    resume_path VARCHAR(500),
    password_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_location_exp ON candidates(location, experience_years);
CREATE INDEX idx_candidates_skills_gin ON candidates USING GIN(to_tsvector('english', technical_skills));
```

**Features**:
- **29 Production Records**: Real candidate data
- **Full-text Search**: GIN index on technical_skills
- **Security**: bcrypt password hashing with JWT integration
- **Validation**: CHECK constraints on experience and status
- **Performance**: Optimized indexes for common queries

#### **jobs** - Job Postings
```sql
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255),
    experience_level VARCHAR(100),
    requirements TEXT,
    description TEXT,
    client_id INTEGER REFERENCES clients(id),
    employment_type VARCHAR(50) DEFAULT 'Full-time',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'draft')),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_jobs_status_dept ON jobs(status, department);
CREATE INDEX idx_jobs_client_status ON jobs(client_id, status);
CREATE INDEX idx_jobs_requirements_gin ON jobs USING GIN(to_tsvector('english', requirements));
```

**Features**:
- **19 Production Jobs**: Active job postings
- **Client Integration**: Foreign key to clients table
- **Full-text Search**: GIN index on requirements
- **Salary Range**: Min/max salary tracking
- **Status Management**: Comprehensive job status workflow

#### **feedback** - BHIV Values Assessment
```sql
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    integrity INTEGER CHECK (integrity >= 1 AND integrity <= 5),
    honesty INTEGER CHECK (honesty >= 1 AND honesty <= 5),
    discipline INTEGER CHECK (discipline >= 1 AND discipline <= 5),
    hard_work INTEGER CHECK (hard_work >= 1 AND hard_work <= 5),
    gratitude INTEGER CHECK (gratitude >= 1 AND gratitude <= 5),
    average_score DECIMAL(3,2) GENERATED ALWAYS AS 
        ((integrity + honesty + discipline + hard_work + gratitude) / 5.0) STORED,
    comments TEXT,
    interviewer_id INTEGER REFERENCES users(id),
    feedback_type VARCHAR(50) DEFAULT 'interview' CHECK (feedback_type IN ('interview', 'assessment', 'reference')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_feedback_candidate_job ON feedback(candidate_id, job_id);
CREATE INDEX idx_feedback_average_score ON feedback(average_score DESC);
```

**Features**:
- **BHIV Core Values**: Integrity, Honesty, Discipline, Hard Work, Gratitude
- **Generated Columns**: Automatic average score calculation
- **RL Integration**: Feeds into reinforcement learning system
- **Multiple Types**: Interview, assessment, and reference feedback
- **Audit Trail**: Complete feedback history with timestamps

#### **interviews** - Interview Management
```sql
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    interview_date TIMESTAMP NOT NULL,
    interviewer VARCHAR(255),
    interview_type VARCHAR(50) DEFAULT 'technical' CHECK (interview_type IN ('screening', 'technical', 'behavioral', 'final')),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    notes TEXT,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    duration_minutes INTEGER DEFAULT 60,
    meeting_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_interviews_date ON interviews(interview_date);
CREATE INDEX idx_interviews_candidate ON interviews(candidate_id, status);
```

**Features**:
- **Interview Types**: Screening, technical, behavioral, final rounds
- **Scheduling**: Date/time management with meeting links
- **Scoring**: 1-10 scale with validation
- **Status Tracking**: Complete interview lifecycle management

#### **offers** - Job Offers Management
```sql
CREATE TABLE offers (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    salary DECIMAL(12,2) NOT NULL CHECK (salary > 0),
    currency VARCHAR(3) DEFAULT 'USD',
    start_date DATE,
    terms TEXT,
    benefits TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn', 'expired')),
    offer_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_offers_candidate_status ON offers(candidate_id, status);
CREATE INDEX idx_offers_expiry ON offers(expiry_date) WHERE status = 'pending';
```

**Features**:
- **Comprehensive Offers**: Salary, benefits, terms management
- **Expiry Tracking**: Automatic offer expiration handling
- **Currency Support**: Multi-currency salary tracking
- **Status Workflow**: Complete offer lifecycle management

#### **users** - HR System Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'hr_user' CHECK (role IN ('admin', 'hr_manager', 'hr_user', 'recruiter')),
    totp_secret VARCHAR(32),
    is_2fa_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_active ON users(role, is_active);
```

**Features**:
- **Role-Based Access**: Admin, HR Manager, HR User, Recruiter roles
- **2FA Security**: TOTP secret storage with QR code generation
- **Account Security**: Failed login tracking and account locking
- **Session Management**: Last login tracking and active status

#### **clients** - Client Companies
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_clients_client_id ON clients(client_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
```

**Features**:
- **6+ Production Clients**: Active client companies
- **JWT Integration**: Client portal authentication
- **Company Profiles**: Industry, size, contact information
- **Security**: Account locking and status management

#### **job_applications** - Application Tracking
```sql
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn')),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(100) DEFAULT 'portal',
    notes TEXT,
    UNIQUE(candidate_id, job_id)
);

-- Indexes for performance
CREATE INDEX idx_applications_candidate ON job_applications(candidate_id, status);
CREATE INDEX idx_applications_job ON job_applications(job_id, status);
CREATE INDEX idx_applications_date ON job_applications(applied_date DESC);
```

**Features**:
- **Application Tracking**: Complete application lifecycle
- **Duplicate Prevention**: Unique constraint on candidate-job pairs
- **Source Tracking**: Application source identification
- **Status Management**: Comprehensive application workflow

### **2. Security & Performance Tables (5 Tables)**

#### **audit_logs** - Security & Compliance Tracking
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    user_type VARCHAR(50) DEFAULT 'system',
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(255),
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and compliance
CREATE INDEX idx_audit_logs_table_operation ON audit_logs(table_name, operation);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, user_type);
CREATE INDEX idx_audit_logs_ip ON audit_logs(ip_address);
```

**Features**:
- **Complete Audit Trail**: All database changes tracked
- **JSONB Storage**: Flexible before/after value storage
- **Security Monitoring**: IP, user agent, session tracking
- **Compliance**: GDPR and SOX compliance support
- **Performance**: Optimized indexes for audit queries

#### **rate_limits** - Dynamic API Rate Limiting
```sql
CREATE TABLE rate_limits (
    id SERIAL PRIMARY KEY,
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    window_duration INTEGER DEFAULT 60, -- seconds
    limit_type VARCHAR(50) DEFAULT 'standard',
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ip_address, endpoint, window_start)
);

-- Indexes for performance
CREATE INDEX idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start, window_duration);
CREATE INDEX idx_rate_limits_blocked ON rate_limits(is_blocked) WHERE is_blocked = TRUE;
```

**Features**:
- **Dynamic Limiting**: 60-500 requests/minute based on CPU usage
- **Endpoint Specific**: Granular rate limiting per API endpoint
- **IP Tracking**: Per-IP address rate limiting
- **Blocking**: Automatic blocking for abuse prevention

#### **csp_violations** - Content Security Policy Monitoring
```sql
CREATE TABLE csp_violations (
    id SERIAL PRIMARY KEY,
    violated_directive VARCHAR(255) NOT NULL,
    blocked_uri TEXT,
    document_uri TEXT,
    source_file VARCHAR(255),
    line_number INTEGER,
    column_number INTEGER,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    severity VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for security monitoring
CREATE INDEX idx_csp_violations_directive ON csp_violations(violated_directive);
CREATE INDEX idx_csp_violations_created_at ON csp_violations(created_at DESC);
CREATE INDEX idx_csp_violations_ip ON csp_violations(ip_address);
```

**Features**:
- **Security Monitoring**: CSP violation tracking
- **Threat Detection**: Potential XSS and injection attempts
- **Detailed Logging**: Source file, line, column tracking
- **Severity Classification**: Risk level assessment

#### **matching_cache** - AI Performance Optimization
```sql
CREATE TABLE matching_cache (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    algorithm_version VARCHAR(50) DEFAULT 'phase3_v1.0',
    semantic_score DECIMAL(5,2),
    experience_score DECIMAL(5,2),
    skills_score DECIMAL(5,2),
    location_score DECIMAL(5,2),
    cultural_fit_score DECIMAL(5,2),
    cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    hit_count INTEGER DEFAULT 0,
    UNIQUE(job_id, candidate_id, algorithm_version)
);

-- Indexes for performance
CREATE INDEX idx_matching_cache_job ON matching_cache(job_id, expires_at);
CREATE INDEX idx_matching_cache_candidate ON matching_cache(candidate_id, expires_at);
CREATE INDEX idx_matching_cache_score ON matching_cache(score DESC);
CREATE INDEX idx_matching_cache_expires ON matching_cache(expires_at);
```

**Features**:
- **AI Performance**: <0.02s response time with caching
- **Score Breakdown**: Individual component scores
- **Version Tracking**: Algorithm version management
- **Expiration**: 24-hour cache with automatic cleanup
- **Hit Tracking**: Cache usage statistics

#### **company_scoring_preferences** - Adaptive Learning Engine
```sql
CREATE TABLE company_scoring_preferences (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    semantic_weight DECIMAL(3,2) DEFAULT 0.40 CHECK (semantic_weight >= 0 AND semantic_weight <= 1),
    experience_weight DECIMAL(3,2) DEFAULT 0.30 CHECK (experience_weight >= 0 AND experience_weight <= 1),
    skills_weight DECIMAL(3,2) DEFAULT 0.20 CHECK (skills_weight >= 0 AND skills_weight <= 1),
    location_weight DECIMAL(3,2) DEFAULT 0.10 CHECK (location_weight >= 0 AND location_weight <= 1),
    cultural_fit_bonus DECIMAL(3,2) DEFAULT 0.10 CHECK (cultural_fit_bonus >= 0 AND cultural_fit_bonus <= 0.5),
    learning_rate DECIMAL(4,3) DEFAULT 0.001,
    total_feedback_count INTEGER DEFAULT 0,
    last_optimization TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id)
);

-- Indexes for performance
CREATE INDEX idx_company_preferences_client ON company_scoring_preferences(client_id);
CREATE INDEX idx_company_preferences_updated ON company_scoring_preferences(updated_at DESC);
```

**Features**:
- **Phase 3 Engine**: Advanced AI learning capabilities
- **Weight Optimization**: Based on hiring feedback and RL
- **Learning Rate**: Adaptive learning parameter
- **Feedback Integration**: Continuous improvement based on outcomes
- **Company-Specific**: Personalized scoring for each client

### **3. Reinforcement Learning Tables (6 Tables)**

#### **rl_states** - RL State Management
```sql
CREATE TABLE rl_states (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    state_vector JSONB NOT NULL,
    semantic_features JSONB,
    experience_features JSONB,
    skills_features JSONB,
    location_features JSONB,
    cultural_features JSONB,
    state_hash VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for RL performance
CREATE INDEX idx_rl_states_hash ON rl_states(state_hash);
CREATE INDEX idx_rl_states_candidate_job ON rl_states(candidate_id, job_id);
CREATE INDEX idx_rl_states_features ON rl_states USING GIN(state_vector);
```

#### **rl_actions** - RL Action Space
```sql
CREATE TABLE rl_actions (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL,
    action_parameters JSONB,
    weight_adjustments JSONB,
    threshold_changes JSONB,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for RL performance
CREATE INDEX idx_rl_actions_type ON rl_actions(action_type, is_active);
```

#### **rl_rewards** - RL Reward System
```sql
CREATE TABLE rl_rewards (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    outcome VARCHAR(50) NOT NULL,
    reward_value DECIMAL(5,2) NOT NULL,
    feedback_score DECIMAL(3,2),
    hire_success BOOLEAN,
    time_to_hire INTEGER, -- days
    retention_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for RL performance
CREATE INDEX idx_rl_rewards_outcome ON rl_rewards(outcome, reward_value);
CREATE INDEX idx_rl_rewards_candidate_job ON rl_rewards(candidate_id, job_id);
```

#### **rl_q_table** - Q-Learning Table
```sql
CREATE TABLE rl_q_table (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES rl_states(id) ON DELETE CASCADE,
    action_id INTEGER REFERENCES rl_actions(id) ON DELETE CASCADE,
    q_value DECIMAL(10,6) DEFAULT 0.0,
    visit_count INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, action_id)
);

-- Indexes for RL performance
CREATE INDEX idx_rl_q_table_state_action ON rl_q_table(state_id, action_id);
CREATE INDEX idx_rl_q_table_q_value ON rl_q_table(q_value DESC);
```

#### **rl_episodes** - RL Training Episodes
```sql
CREATE TABLE rl_episodes (
    id SERIAL PRIMARY KEY,
    episode_number INTEGER NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_reward DECIMAL(10,4),
    steps_count INTEGER DEFAULT 0,
    epsilon_value DECIMAL(4,3),
    learning_rate DECIMAL(4,3),
    convergence_metric DECIMAL(8,6),
    status VARCHAR(50) DEFAULT 'running'
);

-- Indexes for RL performance
CREATE INDEX idx_rl_episodes_number ON rl_episodes(episode_number DESC);
CREATE INDEX idx_rl_episodes_status ON rl_episodes(status);
```

#### **rl_model_versions** - RL Model Management
```sql
CREATE TABLE rl_model_versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    model_parameters JSONB,
    performance_metrics JSONB,
    training_episodes INTEGER,
    accuracy_score DECIMAL(5,4),
    is_active BOOLEAN DEFAULT FALSE,
    deployment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for RL performance
CREATE INDEX idx_rl_model_versions_active ON rl_model_versions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_rl_model_versions_accuracy ON rl_model_versions(accuracy_score DESC);
```

---

## 🔧 Advanced Database Features

### **1. Performance Optimization**

#### **Comprehensive Indexing Strategy (85+ Indexes)**
```sql
-- Full-text search indexes
CREATE INDEX idx_candidates_skills_gin ON candidates USING GIN(to_tsvector('english', technical_skills));
CREATE INDEX idx_jobs_requirements_gin ON jobs USING GIN(to_tsvector('english', requirements));
CREATE INDEX idx_jobs_description_gin ON jobs USING GIN(to_tsvector('english', description));

-- Composite indexes for common queries
CREATE INDEX idx_candidates_location_experience ON candidates(location, experience_years);
CREATE INDEX idx_jobs_status_department ON jobs(status, department);
CREATE INDEX idx_feedback_candidate_job ON feedback(candidate_id, job_id);
CREATE INDEX idx_applications_status_date ON job_applications(status, applied_date DESC);

-- Performance indexes for AI/RL
CREATE INDEX idx_matching_cache_expires ON matching_cache(expires_at);
CREATE INDEX idx_rl_states_features ON rl_states USING GIN(state_vector);
CREATE INDEX idx_rl_q_table_q_value ON rl_q_table(q_value DESC);

-- Security and audit indexes
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start, window_duration);
```

#### **Query Performance Metrics**
- **Response Time**: <50ms for typical queries
- **AI Matching**: <0.02s with caching
- **Full-text Search**: <100ms for complex searches
- **Batch Processing**: 50 candidates/chunk optimization
- **Connection Pooling**: Optimized for 6 microservices

### **2. Data Integrity & Constraints**

#### **Foreign Key Relationships**
```sql
-- Cascading deletes for data consistency
ALTER TABLE feedback ADD CONSTRAINT fk_feedback_candidate 
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE;
ALTER TABLE interviews ADD CONSTRAINT fk_interviews_job 
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;
ALTER TABLE rl_states ADD CONSTRAINT fk_rl_states_candidate 
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE;
```

#### **Check Constraints & Validation**
```sql
-- Data validation constraints
ALTER TABLE candidates ADD CONSTRAINT chk_experience_positive 
    CHECK (experience_years >= 0);
ALTER TABLE feedback ADD CONSTRAINT chk_values_range 
    CHECK (integrity >= 1 AND integrity <= 5 AND honesty >= 1 AND honesty <= 5);
ALTER TABLE offers ADD CONSTRAINT chk_salary_positive 
    CHECK (salary > 0);
ALTER TABLE matching_cache ADD CONSTRAINT chk_score_range 
    CHECK (score >= 0 AND score <= 100);
```

### **3. Automated Functions & Triggers**

#### **Timestamp Management Function**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_candidates_updated_at 
    BEFORE UPDATE ON candidates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### **Comprehensive Audit Logging**
```sql
CREATE OR REPLACE FUNCTION audit_table_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name, operation, record_id, old_values, new_values, 
        user_id, ip_address, created_at
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        COALESCE(current_setting('app.user_id', true)::INTEGER, 0),
        COALESCE(current_setting('app.ip_address', true)::INET, '0.0.0.0'::INET),
        CURRENT_TIMESTAMP
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_candidates_changes 
    AFTER INSERT OR UPDATE OR DELETE ON candidates 
    FOR EACH ROW EXECUTE FUNCTION audit_table_changes();
CREATE TRIGGER audit_jobs_changes 
    AFTER INSERT OR UPDATE OR DELETE ON jobs 
    FOR EACH ROW EXECUTE FUNCTION audit_table_changes();
```

#### **Cache Cleanup Function**
```sql
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM matching_cache WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
SELECT cron.schedule('cache-cleanup', '0 */6 * * *', 'SELECT cleanup_expired_cache();');
```

#### **RL Model Update Function**
```sql
CREATE OR REPLACE FUNCTION update_rl_model_performance()
RETURNS VOID AS $$
BEGIN
    -- Update model performance metrics based on recent feedback
    UPDATE rl_model_versions 
    SET performance_metrics = jsonb_build_object(
        'accuracy', (
            SELECT AVG(CASE WHEN outcome = 'hired' THEN 1.0 ELSE 0.0 END)
            FROM rl_rewards 
            WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
        ),
        'last_updated', CURRENT_TIMESTAMP
    )
    WHERE is_active = TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 Production Data Management

### **1. Current Production Statistics**
```sql
-- Production data overview (as of December 9, 2025)
SELECT 
    'candidates' as table_name, COUNT(*) as record_count,
    MIN(created_at) as oldest_record, MAX(created_at) as newest_record
FROM candidates
UNION ALL
SELECT 'jobs', COUNT(*), MIN(created_at), MAX(created_at) FROM jobs
UNION ALL
SELECT 'clients', COUNT(*), MIN(created_at), MAX(created_at) FROM clients
UNION ALL
SELECT 'feedback', COUNT(*), MIN(created_at), MAX(created_at) FROM feedback
UNION ALL
SELECT 'rl_states', COUNT(*), MIN(created_at), MAX(created_at) FROM rl_states;

-- Expected results:
-- candidates: 29 records
-- jobs: 19 records  
-- clients: 6+ records
-- feedback: 15+ records
-- rl_states: 50+ records
```

### **2. Data Quality Metrics**
```sql
-- Comprehensive data completeness analysis
SELECT 
    COUNT(*) as total_candidates,
    COUNT(technical_skills) as with_skills,
    COUNT(resume_path) as with_resume,
    COUNT(phone) as with_phone,
    COUNT(password_hash) as with_auth,
    ROUND(AVG(experience_years), 2) as avg_experience
FROM candidates;

-- Job posting quality metrics
SELECT 
    COUNT(*) as total_jobs,
    COUNT(requirements) as with_requirements,
    COUNT(description) as with_description,
    COUNT(client_id) as with_client,
    COUNT(*) FILTER (WHERE status = 'active') as active_jobs
FROM jobs;
```

### **3. Performance Analytics**
```sql
-- AI matching performance metrics
SELECT 
    algorithm_version,
    COUNT(*) as cache_entries,
    AVG(score) as avg_score,
    MIN(score) as min_score,
    MAX(score) as max_score,
    AVG(hit_count) as avg_hits
FROM matching_cache 
WHERE expires_at > CURRENT_TIMESTAMP
GROUP BY algorithm_version;

-- RL system performance
SELECT 
    COUNT(*) as total_episodes,
    AVG(total_reward) as avg_reward,
    MAX(total_reward) as best_reward,
    AVG(steps_count) as avg_steps
FROM rl_episodes 
WHERE status = 'completed';
```

---

## 🔒 Security & Compliance

### **1. Authentication & Authorization**

#### **Triple Authentication System**
```sql
-- User authentication with 2FA
SELECT 
    username, role, is_2fa_enabled, 
    failed_login_attempts, locked_until,
    last_login
FROM users 
WHERE is_active = TRUE;

-- Client authentication
SELECT 
    client_id, company_name, status,
    failed_login_attempts, locked_until
FROM clients 
WHERE status = 'active';

-- Candidate authentication
SELECT 
    COUNT(*) as total_candidates,
    COUNT(password_hash) as with_auth,
    COUNT(*) FILTER (WHERE status = 'applied') as active_candidates
FROM candidates;
```

#### **Role-Based Access Control**
```sql
-- Database roles and permissions
CREATE ROLE bhiv_read_only;
CREATE ROLE bhiv_app_user;
CREATE ROLE bhiv_admin;
CREATE ROLE bhiv_rl_system;

-- Grant appropriate permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO bhiv_read_only;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO bhiv_app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bhiv_admin;
GRANT SELECT, INSERT, UPDATE ON rl_states, rl_actions, rl_rewards, rl_q_table TO bhiv_rl_system;
```

### **2. Data Protection & Privacy**

#### **GDPR Compliance Features**
```sql
-- Data retention policy function
CREATE OR REPLACE FUNCTION anonymize_old_data()
RETURNS INTEGER AS $$
DECLARE
    anonymized_count INTEGER;
BEGIN
    -- Anonymize candidate data older than 7 years
    UPDATE candidates 
    SET 
        name = 'ANONYMIZED_' || id,
        email = 'anonymized_' || id || '@example.com',
        phone = NULL,
        technical_skills = 'ANONYMIZED'
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '7 years'
    AND name NOT LIKE 'ANONYMIZED_%';
    
    GET DIAGNOSTICS anonymized_count = ROW_COUNT;
    RETURN anonymized_count;
END;
$$ LANGUAGE plpgsql;
```

#### **Audit Trail & Monitoring**
```sql
-- Security monitoring queries
SELECT 
    ip_address,
    COUNT(*) as violation_count,
    array_agg(DISTINCT violated_directive) as directives
FROM csp_violations 
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) > 10;

-- Rate limiting analysis
SELECT 
    ip_address,
    endpoint,
    SUM(request_count) as total_requests,
    COUNT(*) as windows,
    MAX(is_blocked) as was_blocked
FROM rate_limits 
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '1 hour'
GROUP BY ip_address, endpoint
ORDER BY total_requests DESC;
```

---

## 🔧 Maintenance & Operations

### **1. Database Health Monitoring**

#### **Performance Monitoring Queries**
```sql
-- Query performance analysis
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;

-- Connection and activity monitoring
SELECT 
    state,
    COUNT(*) as connection_count,
    AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - state_change))) as avg_duration
FROM pg_stat_activity
WHERE datname = 'bhiv_hr'
GROUP BY state;

-- Table size and growth analysis
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### **System Health Checks**
```sql
-- Database health dashboard
SELECT 
    'database_size' as metric,
    pg_size_pretty(pg_database_size('bhiv_hr')) as value
UNION ALL
SELECT 
    'active_connections',
    COUNT(*)::text
FROM pg_stat_activity
WHERE state = 'active' AND datname = 'bhiv_hr'
UNION ALL
SELECT 
    'cache_hit_ratio',
    ROUND(100.0 * sum(blks_hit) / (sum(blks_hit) + sum(blks_read)), 2)::text || '%'
FROM pg_stat_database
WHERE datname = 'bhiv_hr'
UNION ALL
SELECT 
    'total_tables',
    COUNT(*)::text
FROM information_schema.tables
WHERE table_schema = 'public';
```

### **2. Backup & Recovery Strategy**

#### **Automated Backup System**
```bash
#!/bin/bash
# Daily backup script
BACKUP_DIR="/backups/bhiv_hr"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="bhiv_hr"

# Full database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
    --verbose --clean --create --if-exists \
    --format=custom \
    --file="$BACKUP_DIR/bhiv_hr_full_$DATE.dump"

# Schema-only backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
    --schema-only --verbose \
    --file="$BACKUP_DIR/bhiv_hr_schema_$DATE.sql"

# Compress and rotate backups
gzip "$BACKUP_DIR/bhiv_hr_schema_$DATE.sql"
find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +90 -delete
```

#### **Point-in-Time Recovery Setup**
```sql
-- WAL archiving configuration (postgresql.conf)
-- wal_level = replica
-- archive_mode = on
-- archive_command = 'cp %p /backup/wal_archive/%f'
-- max_wal_senders = 3
-- wal_keep_segments = 64

-- Recovery verification
SELECT 
    pg_is_in_recovery() as in_recovery,
    pg_last_wal_receive_lsn() as last_wal_received,
    pg_last_wal_replay_lsn() as last_wal_replayed,
    pg_last_xact_replay_timestamp() as last_replay_time;
```

### **3. Performance Tuning & Optimization**

#### **Configuration Recommendations**
```sql
-- PostgreSQL configuration for BHIV HR Platform
-- Based on 1GB RAM, SSD storage, moderate load

-- Memory settings
-- shared_buffers = 256MB                    # 25% of RAM
-- effective_cache_size = 768MB              # 75% of RAM  
-- work_mem = 4MB                            # For sorting/hashing
-- maintenance_work_mem = 64MB               # For VACUUM, CREATE INDEX

-- Checkpoint settings
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100

-- Connection settings
-- max_connections = 100
-- shared_preload_libraries = 'pg_stat_statements'

-- Query optimization settings
-- random_page_cost = 1.1                    # SSD optimization
-- effective_io_concurrency = 200            # SSD optimization
```

#### **Index Maintenance**
```sql
-- Index usage analysis
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Unused index detection
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND schemaname = 'public';

-- Index maintenance commands
REINDEX INDEX CONCURRENTLY idx_candidates_skills_gin;
ANALYZE candidates;
VACUUM ANALYZE matching_cache;
```

---

## 📈 Schema Evolution & Versioning

### **1. Version Management System**

#### **Schema Version Tracking**
```sql
CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(10) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    migration_script TEXT,
    rollback_script TEXT
);

-- Current version record
INSERT INTO schema_version (version, description) 
VALUES ('4.3.0', 'Complete RL integration with 6 additional tables, enhanced security, and performance optimization')
ON CONFLICT (version) DO UPDATE SET
    applied_at = CURRENT_TIMESTAMP,
    description = EXCLUDED.description;
```

#### **Migration History**
```sql
-- Schema evolution timeline
SELECT version, applied_at, description 
FROM schema_version 
ORDER BY applied_at DESC;

-- Expected history:
-- v4.3.0 (2025-12-09): RL integration + security enhancements
-- v4.2.0 (2025-11-15): Performance optimization + audit improvements  
-- v4.1.0 (2025-10-20): LangGraph workflow support
-- v4.0.0 (2025-09-15): Initial production schema
```

### **2. Future Enhancement Roadmap**

#### **Planned Features (v4.4.0)**
- **Table Partitioning**: Partition large tables by date for performance
- **Materialized Views**: Pre-computed analytics views
- **Advanced Indexing**: Partial and expression indexes
- **Sharding Preparation**: Horizontal scaling readiness

#### **Advanced Analytics (v4.5.0)**
- **Time Series Tables**: Performance metrics over time
- **Data Warehouse Integration**: OLAP cube support
- **Machine Learning Extensions**: PostgreSQL ML integration
- **Real-time Analytics**: Streaming data processing

---

## 🛠️ Development & Integration Guide

### **1. Local Development Setup**

#### **Docker-based Development**
```bash
# Clone repository
git clone https://github.com/Shashank-0208/BHIV-HR-PLATFORM.git
cd BHIV-HR-Platform

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Start database service
docker-compose -f deployment/docker/docker-compose.production.yml up -d db

# Initialize schema
docker exec -i bhiv_hr_db psql -U bhiv_user -d bhiv_hr < services/db/consolidated_schema.sql

# Verify setup
docker exec bhiv_hr_db psql -U bhiv_user -d bhiv_hr -c "\dt"
```

#### **Direct PostgreSQL Setup**
```bash
# Install PostgreSQL 17
sudo apt-get install postgresql-17 postgresql-contrib-17

# Create database and user
sudo -u postgres createuser bhiv_user --createdb --login
sudo -u postgres createdb bhiv_hr --owner=bhiv_user

# Set password
sudo -u postgres psql -c "ALTER USER bhiv_user PASSWORD 'your_secure_password';"

# Initialize schema
psql -h localhost -U bhiv_user -d bhiv_hr -f services/db/consolidated_schema.sql
```

### **2. Service Integration**

#### **Database Connection Configuration**
```python
# services/gateway/app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://bhiv_user:password@localhost:5432/bhiv_hr"
)

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

#### **Service-Specific Database Access**
```python
# Each service has dedicated database access patterns:

# Gateway Service: Full CRUD operations across all tables
# AI Agent: Read access to candidates/jobs, write to matching_cache/rl_*
# LangGraph: Read/write for workflow tracking and notifications
# HR Portal: Full access with role-based restrictions
# Client Portal: Client-scoped access to jobs and applications
# Candidate Portal: Candidate-scoped access with application management
```

### **3. Testing & Validation**

#### **Database Test Suite**
```bash
# Run comprehensive database tests
python tests/database/test_schema.py
python tests/database/test_data_integrity.py
python tests/database/test_performance.py
python tests/database/test_security.py

# RL system tests
python tests/database/test_rl_integration.py

# Load testing
python tests/database/test_load_performance.py
```

#### **Data Validation Scripts**
```sql
-- Comprehensive data validation
SELECT 'Data Integrity Check' as test_name,
CASE 
    WHEN COUNT(*) = 0 THEN 'PASS'
    ELSE 'FAIL: ' || COUNT(*) || ' orphaned records'
END as result
FROM job_applications ja
LEFT JOIN candidates c ON ja.candidate_id = c.id
LEFT JOIN jobs j ON ja.job_id = j.id
WHERE c.id IS NULL OR j.id IS NULL;

-- RL system validation
SELECT 'RL System Check' as test_name,
CASE 
    WHEN COUNT(*) > 0 THEN 'PASS: ' || COUNT(*) || ' RL states'
    ELSE 'FAIL: No RL states found'
END as result
FROM rl_states;
```

---

## 📊 Analytics & Reporting

### **1. Business Intelligence Queries**

#### **Recruitment Analytics**
```sql
-- Hiring funnel analysis
WITH funnel_stats AS (
    SELECT 
        COUNT(*) FILTER (WHERE status = 'applied') as applied,
        COUNT(*) FILTER (WHERE status = 'screening') as screening,
        COUNT(*) FILTER (WHERE status = 'interview') as interview,
        COUNT(*) FILTER (WHERE status = 'offer') as offer,
        COUNT(*) FILTER (WHERE status = 'hired') as hired
    FROM job_applications
)
SELECT 
    applied,
    screening,
    ROUND(100.0 * screening / applied, 2) as screening_rate,
    interview,
    ROUND(100.0 * interview / applied, 2) as interview_rate,
    offer,
    ROUND(100.0 * offer / applied, 2) as offer_rate,
    hired,
    ROUND(100.0 * hired / applied, 2) as hire_rate
FROM funnel_stats;
```

#### **AI Performance Analytics**
```sql
-- AI matching effectiveness
SELECT 
    j.title,
    j.department,
    COUNT(mc.id) as total_matches,
    AVG(mc.score) as avg_match_score,
    COUNT(ja.id) as applications,
    COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) as hires,
    ROUND(100.0 * COUNT(CASE WHEN ja.status = 'hired' THEN 1 END) / COUNT(ja.id), 2) as hire_rate
FROM jobs j
LEFT JOIN matching_cache mc ON j.id = mc.job_id
LEFT JOIN job_applications ja ON j.id = ja.job_id
WHERE j.status = 'active'
GROUP BY j.id, j.title, j.department
ORDER BY hire_rate DESC;
```

### **2. Performance Dashboards**

#### **System Performance Metrics**
```sql
-- Real-time system dashboard
SELECT 
    'Active Users' as metric,
    COUNT(*) as value,
    'users' as unit
FROM users WHERE is_active = TRUE
UNION ALL
SELECT 
    'Active Jobs',
    COUNT(*),
    'jobs'
FROM jobs WHERE status = 'active'
UNION ALL
SELECT 
    'Pending Applications',
    COUNT(*),
    'applications'
FROM job_applications WHERE status IN ('applied', 'screening')
UNION ALL
SELECT 
    'Cache Hit Rate',
    ROUND(AVG(hit_count), 2),
    'hits'
FROM matching_cache WHERE expires_at > CURRENT_TIMESTAMP;
```

---

**BHIV HR Platform Database Documentation v4.3.0** - Complete PostgreSQL 17 enterprise database with 19 tables, reinforcement learning integration, and production-grade security.

*Built with Integrity, Honesty, Discipline, Hard Work & Gratitude*

**Last Updated**: December 9, 2025 | **Schema**: v4.3.0 | **Tables**: 19 Total | **Status**: ✅ Production Ready | **Services**: 6/6 Live | **Uptime**: 99.9%