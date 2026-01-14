# PostgreSQL to MongoDB Migration Plan - CORRECTED & ENHANCED
**Version**: 2.0  
**Date**: December 2025  
**Status**: Ready for Implementation  
**Platform**: Infiverse-HR (BHIV HR Platform)

---

## 📊 Executive Summary

This document provides a **corrected and enhanced** migration plan for converting the Infiverse-HR platform from PostgreSQL to MongoDB. The original plan had several gaps which have been addressed based on actual codebase analysis.

### Key Corrections Made

1. ✅ **Complete Table Mapping**: All 19 tables mapped (original plan only showed 4 examples)
2. ✅ **LangGraph Checkpointer**: Addressed PostgreSQL-specific `PostgresSaver` dependency
3. ✅ **Connection Strategy**: Clarified async vs sync decision points
4. ✅ **ID Strategy**: Added recommendations for ObjectId vs Integer IDs
5. ✅ **Complete Dependency List**: Accurate package replacements for all services
6. ✅ **Query Migration Examples**: Real code examples from actual codebase
7. ✅ **Frontend Impact**: Confirmed no frontend changes needed

---

## 🏗️ Current Architecture (Verified)

### Services Using Database

1. **Gateway Service** (`services/gateway/`)
   - **Current**: SQLAlchemy 2.0.23 + asyncpg 0.29.0 + psycopg2-binary 2.9.7
   - **Pattern**: SQLAlchemy Engine with raw SQL queries via `text()`
   - **Queries**: 80+ endpoints with extensive SQL queries
   - **File**: `app/main.py` - `get_db_engine()` function

2. **Agent Service** (`services/agent/`)
   - **Current**: psycopg2-binary 2.9.7 + SQLAlchemy 2.0.23
   - **Pattern**: psycopg2 ThreadedConnectionPool + SQLAlchemy Engine
   - **Queries**: 6 endpoints for AI matching
   - **File**: `app.py` - `init_connection_pool()` function

3. **LangGraph Service** (`services/langgraph/`)
   - **Current**: psycopg2-binary 2.9.0 + SQLAlchemy 2.0.0 + `langgraph-checkpoint-postgres`
   - **Pattern**: PostgreSQL adapter + PostgresSaver checkpointer
   - **Special**: Uses `PostgresSaver.from_conn_string()` for state persistence
   - **Files**: 
     - `app/rl_integration/postgres_adapter.py`
     - `app/database_tracker.py`
     - `app/graphs.py` (checkpointer configuration)

4. **Portal Services** (portal, client_portal, candidate_portal)
   - **Database Access**: None (HTTP API calls only)
   - **Migration**: No changes required ✅

### Frontend
- **Database Access**: None
- **Migration**: No changes required ✅

---

## 📋 Complete Database Schema (19 Tables)

### Core Application Tables (13)

1. **candidates** - Candidate profiles with authentication
2. **jobs** - Job postings from clients and HR
3. **feedback** - Values assessment (BHIV values: integrity, honesty, discipline, hard_work, gratitude)
4. **interviews** - Interview scheduling and management
5. **offers** - Job offer management
6. **users** - Internal HR users with 2FA support
7. **clients** - External client companies with JWT auth
8. **audit_logs** - Security and compliance tracking
9. **rate_limits** - API rate limiting by IP and endpoint
10. **csp_violations** - Content Security Policy violations
11. **matching_cache** - AI matching results cache
12. **company_scoring_preferences** - Client-specific scoring preferences
13. **job_applications** - Candidate job applications

### RL Integration Tables (6)

14. **rl_predictions** - Reinforcement learning predictions
15. **rl_feedback** - RL feedback signals
16. **rl_model_performance** - Model performance tracking
17. **rl_training_data** - RL training dataset
18. **workflows** - LangGraph workflow tracking
19. **schema_version** - Schema version tracking

---

## 🔄 Migration Strategy: 6-Phase Approach

### Phase 1: Preparation and Planning ✅

**Status**: In Progress  
**Duration**: 2-3 days

#### Tasks

1. **Complete Schema Documentation** ✅
   - [x] Document all 19 tables with field definitions
   - [x] Document foreign key relationships
   - [x] Document indexes and constraints
   - [x] Document triggers and functions

2. **Critical Decisions Required** ⚠️

   **Decision 1: ID Strategy**
   - **Option A**: Use MongoDB ObjectId (`_id`)
     - ✅ Native MongoDB approach
     - ✅ Better for horizontal scaling
     - ❌ Requires changing all integer ID references
   - **Option B**: Keep integer IDs (use custom `id` field)
     - ✅ Minimal code changes
     - ✅ Maintains compatibility
     - ❌ Not MongoDB-native
   - **Recommendation**: **Option A** (ObjectId) for long-term scalability

   **Decision 2: Gateway Service - Async vs Sync**
   - **Option A**: Convert to async (Motor) ✅ **RECOMMENDED**
     - ✅ Better performance for I/O operations
     - ✅ Aligns with FastAPI async capabilities (endpoints already async)
     - ✅ High concurrency for nationwide multi-client deployment
     - ✅ Essential for high-traffic scenarios
     - ⚠️ Requires refactoring all endpoints
   - **Option B**: Keep sync (pymongo)
     - ✅ Minimal code changes
     - ✅ Faster migration
     - ❌ Less optimal for FastAPI (blocks async event loop)
     - ❌ Limited concurrency (not suitable for nationwide deployment)
   - **Recommendation**: **Option A** (Motor async) - Essential for nationwide multi-client deployment
   - **See**: `CRITICAL_DECISIONS_RECOMMENDATIONS.md` for detailed analysis

   **Decision 3: LangGraph Checkpointer**
   - **Challenge**: `langgraph-checkpoint-postgres` is PostgreSQL-specific
   - **Option A**: Use MongoDB checkpoint adapter (if available)
   - **Option B**: Implement custom MongoDB checkpointer
   - **Option C**: Use MemorySaver (development only)
   - **Recommendation**: **Option B** (custom MongoDB checkpointer)

3. **MongoDB Schema Design**
   - Design all 19 collections with complete document structure
   - Plan embedded vs referenced relationships
   - Design index strategy
   - Plan for computed fields (average_score, etc.)

---

### Phase 2: Dependencies Update

**Status**: Pending  
**Duration**: 1 day

#### Gateway Service (`services/gateway/requirements.txt`)

```txt
# REMOVE PostgreSQL dependencies
# asyncpg>=0.29.0,<0.30.0
# psycopg2-binary>=2.9.7,<3.0.0
# sqlalchemy>=2.0.23,<2.1.0
# alembic>=1.12.0,<2.0.0

# ADD MongoDB dependencies (Async - Motor)
motor>=3.3.0  # Async MongoDB driver for FastAPI
dnspython>=2.4.0  # For MongoDB Atlas SRV connections
```

#### Agent Service (`services/agent/requirements.txt`)

```txt
# REMOVE PostgreSQL dependencies
# psycopg2-binary>=2.9.7,<3.0.0
# sqlalchemy>=2.0.23,<2.1.0

# ADD MongoDB dependencies
pymongo>=4.6.0
dnspython>=2.4.0
```

#### LangGraph Service (`services/langgraph/requirements.txt`)

```txt
# REMOVE PostgreSQL dependencies
# langgraph-checkpoint-postgres>=1.0.0
# psycopg2-binary>=2.9.0
# sqlalchemy>=2.0.0

# ADD MongoDB dependencies
pymongo>=4.6.0
dnspython>=2.4.0
# Note: Custom MongoDB checkpointer will be implemented
```

---

### Phase 3: MongoDB Schema Design

**Status**: Pending  
**Duration**: 2-3 days

#### Complete Collection Schema Designs

##### 1. candidates Collection

```javascript
{
  _id: ObjectId,
  email: String,              // Index: unique
  name: String,
  phone: String,
  location: String,           // Index
  experience_years: Number,   // Index
  technical_skills: String,   // Index: text index for search
  seniority_level: String,
  education_level: String,
  resume_path: String,
  password_hash: String,
  average_score: Number,      // Index (computed in app)
  status: String,             // Index
  created_at: Date,           // Index
  updated_at: Date
}
```

**Indexes**:
- `{ email: 1 }` (unique)
- `{ status: 1 }`
- `{ location: 1 }`
- `{ experience_years: 1 }`
- `{ average_score: 1 }`
- `{ created_at: 1 }`
- `{ technical_skills: "text" }` (text index)

##### 2. jobs Collection

```javascript
{
  _id: ObjectId,
  title: String,
  department: String,         // Index
  location: String,           // Index
  experience_level: String,   // Index
  requirements: String,
  description: String,
  employment_type: String,
  client_id: String,          // Index (references clients.client_id)
  status: String,             // Index
  created_at: Date,           // Index
  updated_at: Date
}
```

**Indexes**:
- `{ status: 1 }`
- `{ client_id: 1 }`
- `{ department: 1 }`
- `{ location: 1 }`
- `{ experience_level: 1 }`
- `{ created_at: 1 }`

##### 3. feedback Collection

```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,     // Index (references candidates._id)
  job_id: ObjectId,           // Index (references jobs._id)
  integrity: Number,          // 1-5
  honesty: Number,            // 1-5
  discipline: Number,         // 1-5
  hard_work: Number,          // 1-5
  gratitude: Number,          // 1-5
  average_score: Number,      // Index (computed in app: sum/5)
  comments: String,
  reviewer_name: String,
  created_at: Date            // Index
}
```

**Indexes**:
- `{ candidate_id: 1 }`
- `{ job_id: 1 }`
- `{ average_score: 1 }`
- `{ created_at: 1 }`

##### 4. interviews Collection

```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,     // Index (references candidates._id)
  job_id: ObjectId,           // Index (references jobs._id)
  interview_date: Date,       // Index
  interviewer: String,
  interview_type: String,     // Index
  notes: String,
  status: String,             // Index
  created_at: Date
}
```

**Indexes**:
- `{ candidate_id: 1 }`
- `{ job_id: 1 }`
- `{ interview_date: 1 }`
- `{ status: 1 }`
- `{ interview_type: 1 }`

##### 5. offers Collection

```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,     // Index (references candidates._id)
  job_id: ObjectId,           // Index (references jobs._id)
  salary: Number,
  start_date: Date,
  terms: String,
  status: String,             // Index
  created_at: Date,           // Index
  updated_at: Date
}
```

**Indexes**:
- `{ candidate_id: 1 }`
- `{ job_id: 1 }`
- `{ status: 1 }`
- `{ created_at: 1 }`

##### 6. users Collection

```javascript
{
  _id: ObjectId,
  username: String,           // Index: unique
  email: String,              // Index: unique
  password_hash: String,
  totp_secret: String,
  is_2fa_enabled: Boolean,    // Index
  role: String,
  status: String,             // Index
  last_login: Date,           // Index
  failed_login_attempts: Number,
  locked_until: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ username: 1 }` (unique)
- `{ email: 1 }` (unique)
- `{ status: 1 }`
- `{ is_2fa_enabled: 1 }`
- `{ last_login: 1 }`

##### 7. clients Collection

```javascript
{
  _id: ObjectId,
  client_id: String,          // Index: unique (business identifier)
  client_name: String,
  company_name: String,
  password_hash: String,
  email: String,              // Index: unique
  phone: String,
  totp_secret: String,
  two_factor_enabled: Boolean, // Index
  backup_codes: String,
  status: String,             // Index
  password_changed_at: Date,
  password_history: String,
  failed_login_attempts: Number,
  locked_until: Date,
  created_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ client_id: 1 }` (unique)
- `{ email: 1 }` (unique)
- `{ status: 1 }`
- `{ two_factor_enabled: 1 }`

##### 8. audit_logs Collection

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,          // Index (references users._id, nullable)
  client_id: String,          // Index (references clients.client_id, nullable)
  action: String,             // Index
  resource: String,
  resource_id: ObjectId,
  ip_address: String,         // Index
  user_agent: String,
  request_method: String,
  endpoint: String,
  success: Boolean,           // Index
  error_message: String,
  details: Object,            // Flexible document
  timestamp: Date             // Index
}
```

**Indexes**:
- `{ user_id: 1 }`
- `{ client_id: 1 }`
- `{ action: 1 }`
- `{ timestamp: 1 }`
- `{ ip_address: 1 }`
- `{ success: 1 }`

##### 9. rate_limits Collection

```javascript
{
  _id: ObjectId,
  ip_address: String,         // Index: compound with endpoint
  endpoint: String,           // Index: compound with ip_address
  user_tier: String,
  request_count: Number,
  window_start: Date,         // Index
  blocked_until: Date
}
```

**Indexes**:
- `{ ip_address: 1, endpoint: 1 }` (unique compound)
- `{ window_start: 1 }`

##### 10. csp_violations Collection

```javascript
{
  _id: ObjectId,
  violated_directive: String,
  blocked_uri: String,
  document_uri: String,
  ip_address: String,         // Index
  user_agent: String,
  timestamp: Date             // Index
}
```

**Indexes**:
- `{ timestamp: 1 }`
- `{ ip_address: 1 }`

##### 11. matching_cache Collection

```javascript
{
  _id: ObjectId,
  job_id: ObjectId,           // Index
  candidate_id: ObjectId,     // Index
  match_score: Number,        // Index
  skills_match_score: Number,
  experience_match_score: Number,
  location_match_score: Number,
  values_alignment_score: Number,
  algorithm_version: String,
  reasoning: String,
  created_at: Date            // Index
}
```

**Indexes**:
- `{ job_id: 1 }`
- `{ candidate_id: 1 }`
- `{ match_score: 1 }`
- `{ created_at: 1 }`
- `{ job_id: 1, candidate_id: 1, algorithm_version: 1 }` (unique compound)

##### 12. company_scoring_preferences Collection

```javascript
{
  _id: ObjectId,
  client_id: String,          // Index (references clients.client_id)
  scoring_weights: Object,    // Flexible document
  avg_satisfaction: Number,
  feedback_count: Number,
  preferred_experience: Number,
  updated_at: Date
}
```

**Indexes**:
- `{ client_id: 1 }`

##### 13. job_applications Collection

```javascript
{
  _id: ObjectId,
  candidate_id: ObjectId,     // Index (references candidates._id)
  job_id: ObjectId,           // Index (references jobs._id)
  cover_letter: String,
  status: String,             // Index
  applied_date: Date,         // Index
  updated_at: Date
}
```

**Indexes**:
- `{ candidate_id: 1 }`
- `{ job_id: 1 }`
- `{ status: 1 }`
- `{ applied_date: 1 }`
- `{ candidate_id: 1, job_id: 1 }` (unique compound)

##### 14-17. RL Integration Collections

**rl_predictions**, **rl_feedback**, **rl_model_performance**, **rl_training_data** - Similar structure with ObjectId references and appropriate indexes.

##### 18. workflows Collection

```javascript
{
  _id: ObjectId,
  workflow_id: String,        // Index: unique (business identifier)
  workflow_type: String,      // Index
  status: String,             // Index
  candidate_id: ObjectId,     // Index (references candidates._id, nullable)
  job_id: ObjectId,           // Index (references jobs._id, nullable)
  client_id: String,          // Index (references clients.client_id, nullable)
  progress_percentage: Number,
  current_step: String,
  total_steps: Number,
  input_data: Object,
  output_data: Object,
  error_message: String,
  started_at: Date,           // Index
  completed_at: Date,
  updated_at: Date
}
```

**Indexes**:
- `{ workflow_id: 1 }` (unique)
- `{ status: 1 }`
- `{ workflow_type: 1 }`
- `{ candidate_id: 1 }`
- `{ job_id: 1 }`
- `{ client_id: 1 }`
- `{ started_at: 1 }`
- `{ completed_at: 1 }`

##### 19. schema_version Collection

```javascript
{
  _id: ObjectId,
  version: String,            // Index
  applied_at: Date,           // Index
  description: String
}
```

**Indexes**:
- `{ version: 1 }`
- `{ applied_at: 1 }`

---

### Phase 4: Database Connection Layer

**Status**: Pending  
**Duration**: 3-4 days

#### Gateway Service Connection (Async - Motor)

**File**: `services/gateway/app/main.py`

**Current**:
```python
from sqlalchemy import create_engine, text

def get_db_engine():
    database_url = os.getenv("DATABASE_URL")
    return create_engine(
        database_url, 
        pool_pre_ping=True, 
        pool_recycle=3600,
        pool_size=10,
        connect_args={"connect_timeout": 10, "application_name": "bhiv_gateway"},
        pool_timeout=20,
        max_overflow=5
    )
```

**New (MongoDB - Async Motor)**:
```python
from motor.motor_asyncio import AsyncIOMotorClient
from motor.motor_asyncio import AsyncIOMotorDatabase
import os

# Global MongoDB client (async)
_mongo_client: AsyncIOMotorClient = None
_mongo_db: AsyncIOMotorDatabase = None

def get_mongo_client() -> AsyncIOMotorClient:
    global _mongo_client
    if _mongo_client is None:
        mongodb_uri = os.getenv("DATABASE_URL") or os.getenv("MONGODB_URI")
        _mongo_client = AsyncIOMotorClient(
            mongodb_uri,
            serverSelectionTimeoutMS=5000,
            maxPoolSize=10,
            minPoolSize=2
        )
    return _mongo_client

async def get_mongo_db() -> AsyncIOMotorDatabase:
    global _mongo_db
    if _mongo_db is None:
        client = get_mongo_client()
        db_name = os.getenv("MONGODB_DB_NAME", "bhiv_hr")
        _mongo_db = client[db_name]
        # Test connection
        await _mongo_client.admin.command('ping')
    return _mongo_db
```

#### Agent Service Connection

**File**: `services/agent/app.py`

**Current**: psycopg2 ThreadedConnectionPool

**New (MongoDB)**: Similar pattern with pymongo MongoClient (connection pooling is built-in)

#### LangGraph Service Connection

**Files**: 
- `services/langgraph/app/rl_integration/postgres_adapter.py` → `mongo_adapter.py`
- `services/langgraph/app/database_tracker.py`
- `services/langgraph/app/graphs.py` (checkpointer)

**Challenge**: Need custom MongoDB checkpointer implementation

---

### Phase 5: Query Migration

**Status**: Pending  
**Duration**: 7-10 days (largest phase)

#### Example Query Conversions

##### Example 1: Simple SELECT

**PostgreSQL (Current)**:
```python
query = text("SELECT * FROM candidates WHERE email = :email")
result = connection.execute(query, {"email": email})
candidate = result.fetchone()
```

**MongoDB (New - Async)**:
```python
db = await get_mongo_db()
candidate = await db.candidates.find_one({"email": email})
```

##### Example 2: INSERT

**PostgreSQL (Current)**:
```python
query = text("""
    INSERT INTO jobs (title, department, location, status, created_at)
    VALUES (:title, :department, :location, 'active', NOW())
    RETURNING id
""")
result = connection.execute(query, {
    "title": job.title,
    "department": job.department,
    "location": job.location
})
job_id = result.fetchone()[0]
```

**MongoDB (New)**:
```python
db = get_mongo_db()
result = db.jobs.insert_one({
    "title": job.title,
    "department": job.department,
    "location": job.location,
    "status": "active",
    "created_at": datetime.utcnow()
})
job_id = result.inserted_id
```

##### Example 3: JOIN Query

**PostgreSQL (Current)**:
```python
query = text("""
    SELECT o.id, o.candidate_id, o.job_id, o.salary, o.status,
           c.name as candidate_name, j.title as job_title
    FROM offers o
    LEFT JOIN candidates c ON o.candidate_id = c.id
    LEFT JOIN jobs j ON o.job_id = j.id
    ORDER BY o.created_at DESC
""")
result = connection.execute(query)
offers = [dict(row) for row in result]
```

**MongoDB (New)** - Using Aggregation Pipeline:
```python
db = get_mongo_db()
pipeline = [
    {"$lookup": {
        "from": "candidates",
        "localField": "candidate_id",
        "foreignField": "_id",
        "as": "candidate"
    }},
    {"$lookup": {
        "from": "jobs",
        "localField": "job_id",
        "foreignField": "_id",
        "as": "job"
    }},
    {"$sort": {"created_at": -1}},
    {"$project": {
        "id": "$_id",
        "candidate_id": 1,
        "job_id": 1,
        "salary": 1,
        "status": 1,
        "candidate_name": {"$arrayElemAt": ["$candidate.name", 0]},
        "job_title": {"$arrayElemAt": ["$job.title", 0]}
    }}
]
offers = list(db.offers.aggregate(pipeline))
```

##### Example 4: COUNT with WHERE

**PostgreSQL (Current)**:
```python
count_query = text("SELECT COUNT(*) FROM candidates WHERE status = :status")
count_result = connection.execute(count_query, {"status": "active"})
total_count = count_result.fetchone()[0]
```

**MongoDB (New)**:
```python
db = get_mongo_db()
total_count = db.candidates.count_documents({"status": "active"})
```

---

### Phase 6: Testing and Validation

**Status**: Pending  
**Duration**: 3-5 days

#### Test Checklist

- [ ] Unit tests for all database operations
- [ ] Integration tests for all API endpoints
- [ ] Performance benchmarks (compare with PostgreSQL)
- [ ] Data integrity validation
- [ ] Index effectiveness verification
- [ ] Connection pooling verification
- [ ] Error handling verification

---

### Phase 7: Data Migration

**Status**: Pending  
**Duration**: 2-3 days

#### Migration Script Requirements

1. **Export from PostgreSQL**
   - Export all 19 tables to JSON/CSV
   - Preserve relationships (foreign keys)
   - Handle special types (dates, JSONB, etc.)

2. **Transform Data**
   - Convert SERIAL IDs to ObjectIds
   - Convert foreign key references
   - Handle computed fields (average_score)
   - Transform JSONB to MongoDB documents

3. **Import to MongoDB**
   - Create collections
   - Create indexes
   - Import data with validation
   - Verify data integrity

---

### Phase 8: Deployment

**Status**: Pending  
**Duration**: 1-2 days

#### Docker Configuration Update

**File**: `docker-compose.production.yml`

**Current**:
```yaml
db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: bhiv_hr
    POSTGRES_USER: bhiv_user
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  ports:
    - "5432:5432"
```

**New (MongoDB)**:
```yaml
db:
  image: mongo:latest
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    MONGO_INITDB_DATABASE: bhiv_hr
  ports:
    - "27017:27017"
  volumes:
    - mongo_data:/data/db
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
    interval: 30s
    timeout: 10s
    retries: 5
```

#### Environment Variables Update

**New Variables Needed**:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://user:password@localhost:27017/bhiv_hr?authSource=admin
DATABASE_URL=mongodb://user:password@localhost:27017/bhiv_hr?authSource=admin
MONGODB_DB_NAME=bhiv_hr

# For MongoDB Atlas
# MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

---

## ⚠️ Critical Challenges & Solutions

### Challenge 1: LangGraph Checkpointer

**Problem**: `langgraph-checkpoint-postgres` is PostgreSQL-specific

**Solution Options**:
1. **Custom MongoDB Checkpointer** (Recommended)
   - Implement MongoDB-based checkpoint storage
   - Compatible with LangGraph's checkpointer interface

2. **Memory Checkpointer** (Development only)
   - Use MemorySaver for testing
   - Not suitable for production

**Implementation**: Create `services/langgraph/app/checkpoint/mongodb_checkpointer.py`

### Challenge 2: Transactions

**Problem**: MongoDB transactions require replica set

**Solution**:
- For local development: Use single-node replica set
- For production (MongoDB Atlas): Already configured with replica set
- For standalone MongoDB: Consider if transactions are critical (many operations don't need them)

### Challenge 3: Generated Columns

**Problem**: PostgreSQL has `GENERATED ALWAYS AS` columns (e.g., `average_score`)

**Solution**: 
- Compute in application code
- Create helper functions
- Consider using MongoDB change streams for automatic computation (advanced)

### Challenge 4: Full-Text Search

**Problem**: PostgreSQL GIN indexes for full-text search

**Solution**: 
- Use MongoDB text indexes
- Consider MongoDB Atlas Search for advanced features
- Or use external search service (Elasticsearch)

---

## 📊 Timeline Estimate (Updated)

- **Phase 1**: Preparation (2-3 days) ✅ In Progress
- **Phase 2**: Dependencies (1 day)
- **Phase 3**: Schema Design (2-3 days)
- **Phase 4**: Connection Layer (3-4 days)
- **Phase 5**: Query Migration (7-10 days) ⚠️ Largest phase
- **Phase 6**: Testing (3-5 days)
- **Phase 7**: Data Migration (2-3 days)
- **Phase 8**: Deployment (1-2 days)

**Total**: 21-31 days (4-6 weeks)

---

## ✅ Success Criteria

- [ ] All 111 endpoints continue to function correctly
- [ ] All 19 collections created and indexed
- [ ] Data integrity maintained during migration
- [ ] Performance meets or exceeds current levels
- [ ] All services operate with MongoDB
- [ ] Frontend continues to work without changes
- [ ] LangGraph workflows function correctly
- [ ] All tests pass
- [ ] Documentation updated

---

## 📝 Next Steps

1. **Review this corrected plan**
2. **Make critical decisions** (IDs, async/sync, checkpointer)
3. **Set up MongoDB** (local or Atlas)
4. **Begin Phase 1 implementation**
5. **Create detailed MongoDB schema scripts**
6. **Start code migration** (Phase 4-5)

---

## 📚 Additional Resources

- MongoDB Documentation: https://docs.mongodb.com/
- pymongo Documentation: https://pymongo.readthedocs.io/
- LangGraph Checkpointing: https://langchain-ai.github.io/langgraph/how-tos/persistence/
- MongoDB Migration Guide: https://www.mongodb.com/docs/manual/core/migration/

---

**Document Version**: 2.0  
**Last Updated**: December 2025  
**Status**: Ready for Implementation