# PostgreSQL to MongoDB Migration Analysis
**Date**: December 2025  
**Status**: Planning Phase  
**Database**: PostgreSQL 17 → MongoDB  

## 📊 Current Architecture Analysis

### Backend Services (6 Microservices)

1. **Gateway Service** (`services/gateway/`)
   - **Database Driver**: SQLAlchemy 2.0.23 + asyncpg 0.29.0 + psycopg2-binary 2.9.7
   - **Connection Pattern**: SQLAlchemy Engine with `create_engine()` + raw SQL via `text()`
   - **Location**: `app/main.py` - `get_db_engine()` function
   - **Queries**: Extensive use of raw SQL queries with `text()` function
   - **Dependencies**: `asyncpg`, `psycopg2-binary`, `sqlalchemy`, `alembic`

2. **Agent Service** (`services/agent/`)
   - **Database Driver**: psycopg2-binary 2.9.7 + SQLAlchemy 2.0.23
   - **Connection Pattern**: psycopg2 ThreadedConnectionPool + SQLAlchemy Engine
   - **Location**: `app.py` - `init_connection_pool()` function
   - **Dependencies**: `psycopg2-binary`, `sqlalchemy`

3. **LangGraph Service** (`services/langgraph/`)
   - **Database Driver**: psycopg2-binary 2.9.0 + SQLAlchemy 2.0.0
   - **Connection Pattern**: PostgreSQL adapter in `rl_integration/postgres_adapter.py`
   - **Dependencies**: `psycopg2-binary`, `sqlalchemy`, `langgraph-checkpoint-postgres`

4. **Portal Services** (portal, client_portal, candidate_portal)
   - **Database Access**: HTTP API calls to Gateway (no direct DB access)
   - **No Migration Required**: These services don't connect directly to the database

### Frontend
- **Technology**: React/TypeScript (Vite)
- **Database Access**: None (makes HTTP API calls to Gateway)
- **Migration Impact**: None required - frontend remains unchanged

## 📋 Current Database Schema (PostgreSQL)

### Core Tables (13)
1. `candidates` - Candidate profiles with authentication
2. `jobs` - Job postings
3. `feedback` - Values assessment (BHIV values: integrity, honesty, discipline, hard_work, gratitude)
4. `interviews` - Interview scheduling
5. `offers` - Job offers
6. `users` - Internal HR users with 2FA
7. `clients` - External client companies
8. `audit_logs` - Security audit trail
9. `rate_limits` - API rate limiting
10. `csp_violations` - CSP violation tracking
11. `matching_cache` - AI matching results cache
12. `company_scoring_preferences` - Client-specific scoring
13. `job_applications` - Application tracking

### RL Integration Tables (6)
14. `rl_predictions` - Reinforcement learning predictions
15. `rl_feedback` - RL feedback signals
16. `rl_model_performance` - Model performance tracking
17. `rl_training_data` - Training dataset
18. `workflows` - LangGraph workflow tracking
19. `schema_version` - Schema version tracking

### Key PostgreSQL Features Used
- **SERIAL PRIMARY KEYS** (auto-incrementing integers)
- **FOREIGN KEYS** (referential integrity)
- **CHECK CONSTRAINTS** (data validation)
- **GENERATED COLUMNS** (computed columns)
- **TRIGGERS** (auto-update timestamps)
- **INDEXES** (75+ performance indexes)
- **EXTENSIONS** (uuid-ossp, pg_stat_statements, pg_trgm)
- **JOINS** (complex relational queries)

## 🔄 Migration Plan Review

### ✅ Correct Aspects

1. **Phased Approach**: The 6-phase approach is appropriate
2. **Collection Mapping**: Table-to-collection mapping is reasonable
3. **Dependency Updates**: Correct identification of packages to replace
4. **Service Identification**: All 6 services correctly identified
5. **Frontend Impact**: Correctly identified as no impact

### ⚠️ Issues & Corrections Needed

#### 1. **Database Connection Patterns**

**Issue**: User's plan suggests Motor (async MongoDB driver), but:
- Gateway uses SQLAlchemy with synchronous `create_engine()`
- Agent uses psycopg2 connection pooling (synchronous)
- LangGraph uses psycopg2 (synchronous)

**Correction**: 
- Gateway: Use **Motor** (async) OR **pymongo** (sync) - depends on whether we convert endpoints to async
- Agent: Use **pymongo** (sync) to maintain current architecture
- LangGraph: Use **pymongo** (sync) for RL adapter

#### 2. **Schema Design Issues**

**Issue**: User's MongoDB schema design is too simplistic:
- PostgreSQL uses SERIAL (auto-incrementing integers) for IDs
- MongoDB uses ObjectId by default
- Foreign key relationships need to be converted to references
- Generated columns (average_score) need application-level computation

**Correction Needed**:
- Decision: Keep integer IDs or switch to ObjectId?
- Foreign keys: Convert to ObjectId references or keep as integers?
- Generated columns: Implement in application code
- Indexes: Plan MongoDB index strategy

#### 3. **LangGraph Checkpoint Storage**

**Issue**: `langgraph-checkpoint-postgres` package is PostgreSQL-specific
- Need alternative: MongoDB checkpoint storage
- May need custom implementation or MongoDB-compatible package

#### 4. **Query Migration Complexity**

**Issue**: User's plan doesn't address:
- Complex JOINs (e.g., offers with candidates and jobs)
- Aggregations (e.g., COUNT, SUM, AVG)
- Full-text search (PostgreSQL GIN indexes → MongoDB text indexes)
- Transactions (PostgreSQL transactions → MongoDB transactions)

#### 5. **Missing Tables**

**Issue**: User's plan lists 19 tables but migration plan only shows 4 collections
- Need complete mapping of all 19 tables to MongoDB collections

#### 6. **Frontend Database Name**

**Issue**: User's plan mentions `bhiv_hr_db` but code uses `bhiv_hr`
- Need consistency check

## 📝 Corrected Migration Strategy

### Phase 1: Preparation (Enhanced)

1. **Complete Schema Documentation**
   - Document ALL 19 tables with complete field definitions
   - Document all relationships (foreign keys)
   - Document all indexes and their purposes
   - Document triggers and functions

2. **MongoDB Schema Design Decisions**
   - **ID Strategy**: Use ObjectId (_id) OR maintain integer IDs (custom field)?
     - Recommendation: Use ObjectId for MongoDB-native approach
   - **References**: Use ObjectId references or embed documents?
     - Recommendation: Reference for related entities, embed for small sub-documents
   - **Embedded vs Referenced**: 
     - Embed: values_scores in candidates
     - Reference: candidate_id in feedback, job_id in offers

3. **Connection Strategy Decision**
   - **Gateway**: Convert to async (Motor) OR keep sync (pymongo)?
   - **Agent**: Keep sync (pymongo)
   - **LangGraph**: Keep sync (pymongo) + custom MongoDB checkpoint adapter

### Phase 2: Dependencies Update (Corrected)

**Gateway Service**:
```txt
# Remove
asyncpg>=0.29.0,<0.30.0
psycopg2-binary>=2.9.7,<3.0.0
sqlalchemy>=2.0.23,<2.1.0
alembic>=1.12.0,<2.0.0

# Add (if async)
motor>=3.3.0
pymongo>=4.6.0

# OR Add (if sync)
pymongo>=4.6.0
```

**Agent Service**:
```txt
# Remove
psycopg2-binary>=2.9.7,<3.0.0
sqlalchemy>=2.0.23,<2.1.0

# Add
pymongo>=4.6.0
```

**LangGraph Service**:
```txt
# Remove
langgraph-checkpoint-postgres>=1.0.0
psycopg2-binary>=2.9.0
sqlalchemy>=2.0.0

# Add
pymongo>=4.6.0
# Custom MongoDB checkpoint adapter needed
```

### Phase 3: MongoDB Schema Design (Complete)

**All 19 Collections with Complete Schema**:

1. **candidates** collection
2. **jobs** collection
3. **feedback** collection
4. **interviews** collection
5. **offers** collection
6. **users** collection
7. **clients** collection
8. **audit_logs** collection
9. **rate_limits** collection
10. **csp_violations** collection
11. **matching_cache** collection
12. **company_scoring_preferences** collection
13. **job_applications** collection
14. **rl_predictions** collection
15. **rl_feedback** collection
16. **rl_model_performance** collection
17. **rl_training_data** collection
18. **workflows** collection
19. **schema_version** collection

### Phase 4: Code Migration Challenges

1. **SQL to MongoDB Query Conversion**
   - Raw SQL queries → MongoDB queries
   - JOINs → Aggregation pipeline or multiple queries
   - Transactions → MongoDB transactions (requires replica set)

2. **Connection Pooling**
   - PostgreSQL connection pools → MongoDB connection pools
   - psycopg2 ThreadedConnectionPool → pymongo MongoClient connection pooling

3. **Error Handling**
   - PostgreSQL exceptions → MongoDB exceptions
   - Update error handling throughout codebase

## 🚨 Critical Decisions Required

1. **ID Strategy**: ObjectId vs Integer IDs?
2. **Async vs Sync**: Convert Gateway to async or keep sync?
3. **LangGraph Checkpoints**: How to handle MongoDB checkpoint storage?
4. **Transaction Requirements**: Do we need transactions? (MongoDB requires replica set)
5. **Migration Timeline**: How much downtime is acceptable?

## 📊 Migration Complexity Assessment

- **High Complexity Areas**:
  - Gateway service (80+ endpoints with SQL queries)
  - LangGraph checkpoint storage
  - Complex JOINs and aggregations
  - Transaction requirements

- **Medium Complexity Areas**:
  - Agent service (6 endpoints)
  - Schema migrations
  - Index strategies

- **Low Complexity Areas**:
  - Portal services (no DB access)
  - Frontend (no changes needed)
  - Docker configuration updates

## ✅ Next Steps

1. Review this analysis
2. Make critical decisions (IDs, async/sync, etc.)
3. Create detailed MongoDB schema designs
4. Create code migration examples
5. Set up MongoDB Atlas/local MongoDB
6. Begin Phase 1 implementation