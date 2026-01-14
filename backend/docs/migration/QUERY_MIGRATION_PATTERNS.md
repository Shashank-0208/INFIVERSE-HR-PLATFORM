# Query Migration Patterns - PostgreSQL to MongoDB
**Date**: December 2025  
**Purpose**: Guide for migrating SQL queries to MongoDB queries

---

## 📋 Common Query Patterns

### 1. SELECT (Find)

**PostgreSQL**:
```python
query = text("SELECT * FROM candidates WHERE email = :email")
result = connection.execute(query, {"email": email})
candidate = result.fetchone()
```

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db

db = await get_mongo_db()
candidate = await db.candidates.find_one({"email": email})
if candidate:
    candidate['id'] = str(candidate['_id'])
    del candidate['_id']
```

**Using Helper**:
```python
from app.db_helpers import find_one_by_field

candidate = await find_one_by_field("candidates", "email", email)
```

---

### 2. INSERT

**PostgreSQL**:
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

**MongoDB (Async - Motor)**:
```python
from datetime import datetime, timezone
from app.database import get_mongo_db

db = await get_mongo_db()
document = {
    "title": job.title,
    "department": job.department,
    "location": job.location,
    "status": "active",
    "created_at": datetime.now(timezone.utc)
}
result = await db.jobs.insert_one(document)
job_id = str(result.inserted_id)
```

**Using Helper**:
```python
from app.db_helpers import insert_one

job_id = await insert_one("jobs", {
    "title": job.title,
    "department": job.department,
    "location": job.location,
    "status": "active"
})
```

---

### 3. SELECT with Pagination

**PostgreSQL**:
```python
query = text("""
    SELECT * FROM candidates 
    ORDER BY created_at DESC 
    LIMIT :limit OFFSET :offset
""")
result = connection.execute(query, {"limit": limit, "offset": offset})
candidates = [dict(row) for row in result]
```

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db

db = await get_mongo_db()
cursor = db.candidates.find({}).sort("created_at", -1).skip(offset).limit(limit)
candidates = await cursor.to_list(length=limit)
candidates = [{**doc, 'id': str(doc['_id']), '_id': None} for doc in candidates]
```

**Using Helper**:
```python
from app.db_helpers import find_many

candidates = await find_many(
    "candidates",
    query={},
    limit=limit,
    offset=offset,
    sort=[("created_at", -1)]
)
```

---

### 4. COUNT

**PostgreSQL**:
```python
count_query = text("SELECT COUNT(*) FROM candidates WHERE status = :status")
count_result = connection.execute(count_query, {"status": "active"})
total_count = count_result.fetchone()[0]
```

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db

db = await get_mongo_db()
total_count = await db.candidates.count_documents({"status": "active"})
```

**Using Helper**:
```python
from app.db_helpers import count_documents

total_count = await count_documents("candidates", {"status": "active"})
```

---

### 5. JOIN (Aggregation Pipeline)

**PostgreSQL**:
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

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db
from bson import ObjectId

db = await get_mongo_db()
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
        "id": {"$toString": "$_id"},
        "candidate_id": 1,
        "job_id": 1,
        "salary": 1,
        "status": 1,
        "candidate_name": {"$arrayElemAt": ["$candidate.name", 0]},
        "job_title": {"$arrayElemAt": ["$job.title", 0]}
    }}
]
cursor = db.offers.aggregate(pipeline)
offers = await cursor.to_list(length=None)
```

---

### 6. UPDATE

**PostgreSQL**:
```python
query = text("""
    UPDATE candidates 
    SET status = :status, updated_at = NOW() 
    WHERE id = :id
""")
connection.execute(query, {"id": candidate_id, "status": "active"})
```

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db
from bson import ObjectId
from datetime import datetime, timezone

db = await get_mongo_db()
await db.candidates.update_one(
    {"_id": ObjectId(candidate_id)},
    {"$set": {
        "status": "active",
        "updated_at": datetime.now(timezone.utc)
    }}
)
```

**Using Helper**:
```python
from app.db_helpers import update_one
from bson import ObjectId

await update_one(
    "candidates",
    {"_id": ObjectId(candidate_id)},
    {"$set": {"status": "active"}}
)
```

---

### 7. DELETE

**PostgreSQL**:
```python
query = text("DELETE FROM candidates WHERE id = :id")
connection.execute(query, {"id": candidate_id})
```

**MongoDB (Async - Motor)**:
```python
from app.database import get_mongo_db
from bson import ObjectId

db = await get_mongo_db()
await db.candidates.delete_one({"_id": ObjectId(candidate_id)})
```

**Using Helper**:
```python
from app.db_helpers import delete_one
from bson import ObjectId

await delete_one("candidates", {"_id": ObjectId(candidate_id)})
```

---

## 🔄 ID Conversion Patterns

### Integer ID to ObjectId

**Important**: During migration, integer IDs from PostgreSQL need to be converted to ObjectIds.

**Before Migration** (PostgreSQL uses integer IDs):
- API returns: `{"id": 123}`
- Foreign keys: `candidate_id: 123`

**After Migration** (MongoDB uses ObjectIds):
- API returns: `{"id": "507f1f77bcf86cd799439011"}`
- Foreign keys: `candidate_id: ObjectId("507f1f77bcf86cd799439011")`

**Conversion**:
```python
from bson import ObjectId

# Convert string ObjectId to ObjectId
obj_id = ObjectId("507f1f77bcf86cd799439011")

# Convert ObjectId to string for API
id_str = str(obj_id)
```

---

## ⚠️ Important Notes

1. **ObjectId Conversion**: All integer IDs need to be converted to ObjectIds during data migration
2. **Timestamps**: MongoDB uses datetime objects (not NOW() function)
3. **Transactions**: MongoDB transactions require replica set (Atlas has this by default)
4. **JOINs**: Use aggregation pipeline `$lookup` instead of SQL JOINs
5. **Null Checks**: MongoDB uses `None` instead of SQL `NULL`
6. **Text Search**: Use MongoDB text indexes instead of PostgreSQL GIN indexes

---

## 📚 Resources

- MongoDB Query Documentation: https://docs.mongodb.com/manual/tutorial/query-documents/
- Motor (Async MongoDB) Documentation: https://motor.readthedocs.io/
- Aggregation Pipeline: https://docs.mongodb.com/manual/core/aggregation-pipeline/
