# Docker Compose Migration Notes - PostgreSQL to MongoDB
**Date**: December 2025  
**Status**: ✅ Updated

---

## ✅ Changes Made

### Database Service Updated

**Before (PostgreSQL)**:
```yaml
db:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: bhiv_hr
    POSTGRES_USER: bhiv_user
    POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U bhiv_user -d bhiv_hr"]
```

**After (MongoDB)**:
```yaml
db:
  image: mongo:7.0
  environment:
    MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME:-bhiv_user}
    MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD:-${POSTGRES_PASSWORD}}
    MONGO_INITDB_DATABASE: bhiv_hr
  ports:
    - "27017:27017"
  volumes:
    - mongo_data:/data/db
    - mongo_config:/data/configdb
  healthcheck:
    test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
```

### Volume Names Updated

**Before**:
```yaml
volumes:
  postgres_data:
```

**After**:
```yaml
volumes:
  mongo_data:
  mongo_config:
```

---

## 🔧 Environment Variables

### Required Environment Variables

For MongoDB connection, services need:

**DATABASE_URL** (MongoDB connection string format):
```
# Local MongoDB (docker-compose)
DATABASE_URL=mongodb://bhiv_user:password@db:27017/bhiv_hr?authSource=admin

# MongoDB Atlas (production)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

### Optional Environment Variables

- `MONGO_ROOT_USERNAME`: MongoDB root username (default: bhiv_user)
- `MONGO_ROOT_PASSWORD`: MongoDB root password (defaults to POSTGRES_PASSWORD for migration)
- `MONGODB_DB_NAME`: Database name (default: bhiv_hr)

---

## ⚠️ Migration Notes

### Port Change
- **PostgreSQL**: Port 5432
- **MongoDB**: Port 27017

### Connection String Format
- **PostgreSQL**: `postgresql://user:pass@host:5432/dbname`
- **MongoDB**: `mongodb://user:pass@host:27017/dbname?authSource=admin`

### Volume Migration
If you have existing PostgreSQL data volumes, you'll need to:
1. Backup PostgreSQL data
2. Migrate data to MongoDB (separate migration process)
3. Remove old `postgres_data` volume after migration complete

---

## 🚀 Usage

### Start Services
```bash
docker-compose -f docker-compose.production.yml up -d
```

### Connect to MongoDB
```bash
docker exec -it <container_name> mongosh -u bhiv_user -p <password> --authenticationDatabase admin
```

### Check MongoDB Health
```bash
docker-compose -f docker-compose.production.yml ps db
```

---

## ✅ Next Steps

1. Update `.env` file with MongoDB connection string
2. Run data migration script (separate phase)
3. Update all service environment variables
4. Test connections from all services

---

**Status**: ✅ Docker Compose Updated for MongoDB