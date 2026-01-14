# Environment Variables Setup for MongoDB
**Date**: December 2025  
**Purpose**: Guide for configuring environment variables for MongoDB (localhost and Atlas)

---

## 📋 Environment Variables Required

### For All Services

```env
# MongoDB Connection (supports both localhost and Atlas)
DATABASE_URL=<connection_string>
MONGODB_URI=<connection_string>  # Alternative name (same as DATABASE_URL)
MONGODB_DB_NAME=bhiv_hr  # Optional (defaults to bhiv_hr)
```

---

## 🔧 Configuration Examples

### Development (Local MongoDB)

**Option 1: Docker Compose (Recommended)**
```env
# .env file in backend/ directory
DATABASE_URL=mongodb://bhiv_user:your_password@localhost:27017/bhiv_hr?authSource=admin
MONGODB_DB_NAME=bhiv_hr
```

**Option 2: Local MongoDB (no auth)**
```env
DATABASE_URL=mongodb://localhost:27017/bhiv_hr
MONGODB_DB_NAME=bhiv_hr
```

### Production (MongoDB Atlas)

```env
# Production environment variables (Render.com, etc.)
DATABASE_URL=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
MONGODB_DB_NAME=bhiv_hr
```

---

## 📝 Setup Instructions

### Step 1: Create MongoDB Atlas Account

**You need to do this:**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create account
3. Create free cluster (M0 tier)
4. Create database user
5. Whitelist IP addresses (or use 0.0.0.0/0 for testing)
6. Get connection string

**I cannot do this for you** - it requires your account and decisions.

### Step 2: Update Environment Variables

**Development (.env file)**:
```bash
# Create/update backend/.env file
DATABASE_URL=mongodb://bhiv_user:password@localhost:27017/bhiv_hr?authSource=admin
```

**Production (Render.com)**:
1. Go to Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add/update:
   - `DATABASE_URL` = your MongoDB Atlas connection string
   - `MONGODB_DB_NAME` = `bhiv_hr`

### Step 3: Test Connection

The connection modules will automatically:
- Use `DATABASE_URL` if available
- Fall back to `MONGODB_URI` if `DATABASE_URL` not found
- Use database name from `MONGODB_DB_NAME` or default to `bhiv_hr`

---

## 🔄 Connection String Formats

### Local MongoDB (Development)

**With Authentication**:
```
mongodb://username:password@localhost:27017/database_name?authSource=admin
```

**Without Authentication**:
```
mongodb://localhost:27017/database_name
```

### MongoDB Atlas (Production)

**Standard Format**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority
```

**With Additional Options**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database_name?retryWrites=true&w=majority&ssl=true
```

---

## ✅ What I Can Help With

1. ✅ **Update configuration files** - Once you have connection strings
2. ✅ **Create connection modules** - Already done!
3. ✅ **Test connection code** - Can verify format
4. ✅ **Documentation** - Complete guides created

## ❌ What You Need to Do

1. ❌ **Create MongoDB Atlas account** - Requires your email/payment
2. ❌ **Create cluster** - Requires your decisions (region, tier)
3. ❌ **Create database user** - Requires your password
4. ❌ **Configure network access** - Requires your IP addresses
5. ❌ **Get connection string** - Copy from Atlas dashboard

---

## 🎯 Recommended Approach

### For Development
1. **Use Docker Compose** (already configured)
   - Run: `docker-compose -f docker-compose.production.yml up -d db`
   - Uses: `mongodb://bhiv_user:password@localhost:27017/bhiv_hr`

### For Production
1. **Use MongoDB Atlas** (you create this)
   - Free tier available (M0)
   - Managed service
   - Automatic backups
   - Uses: `mongodb+srv://...` connection string

---

## 📞 Next Steps

1. **You**: Create MongoDB Atlas account and cluster
2. **You**: Get connection string from Atlas
3. **Me**: Help update environment variables
4. **Me**: Test connections
5. **Together**: Proceed with migration

---

**Status**: ⏳ Waiting for MongoDB Atlas setup from you  
**Action Required**: Create MongoDB Atlas account and get connection string
