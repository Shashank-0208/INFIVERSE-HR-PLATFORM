# MongoDB Atlas Setup Guide
**Date**: December 2025  
**Purpose**: Complete guide for setting up MongoDB Atlas and local MongoDB

---

## 📋 Overview

You need MongoDB in two environments:
1. **Localhost (Development)** - Local MongoDB for development
2. **MongoDB Atlas (Production)** - Cloud MongoDB for production

---

## 🚀 MongoDB Atlas Setup (Production)

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with your email
4. Verify your email address

### Step 2: Create a Cluster

1. Once logged in, click **"Build a Cluster"**
2. Select **"FREE" (M0) tier** for development/testing
   - For production, choose paid tier (M10 or higher)
3. Choose cloud provider:
   - **AWS** (recommended for most regions)
   - **Azure** or **GCP** (alternative)
4. Select region closest to your users
   - For US: `N. Virginia (us-east-1)`
   - For Asia: `Mumbai (ap-south-1)`
   - For Europe: `Frankfurt (eu-central-1)`
5. Keep default cluster name (e.g., `Cluster0`) or rename it
6. Click **"Create Cluster"**
7. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User

1. In Atlas dashboard, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Enter username (e.g., `bhiv_user`)
5. Enter strong password (save this securely!)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Configure Network Access

1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. For development/testing: Click **"Add Current IP Address"**
4. For production: Add your server IP addresses
   - Render.com: Add `0.0.0.0/0` (allows all IPs - secure with authentication)
   - Or add specific IP ranges
5. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **"Clusters"** (left sidebar)
2. Click **"Connect"** on your cluster
3. Select **"Drivers"** option
4. Driver: **"Python"**
5. Version: **"3.12 or later"**
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<dbname>` with `bhiv_hr` (or your database name)

**Connection String Format**:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

### Step 6: Test Connection (Optional)

Test the connection string:
```python
from pymongo import MongoClient

# Your Atlas connection string
uri = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority"

try:
    client = MongoClient(uri)
    # Test connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB Atlas!")
    print(f"Databases: {client.list_database_names()}")
except Exception as e:
    print(f"❌ Connection failed: {e}")
```

---

## 💻 Local MongoDB Setup (Development)

### Option 1: Docker (Recommended)

**Using docker-compose** (already configured):
```bash
cd backend
docker-compose -f docker-compose.production.yml up -d db
```

This will start MongoDB on `localhost:27017`

**Connection String**:
```
mongodb://bhiv_user:password@localhost:27017/bhiv_hr?authSource=admin
```

### Option 2: Install MongoDB Locally

**Windows**:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer
3. Install as Windows Service
4. MongoDB will run on `localhost:27017`

**macOS**:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian)**:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Connection String**:
```
mongodb://localhost:27017/bhiv_hr
```

---

## 🔧 Environment Configuration

### Development (.env file)

Create/update `.env` file in `backend/` directory:

```env
# Development - Local MongoDB
DATABASE_URL=mongodb://bhiv_user:your_password@localhost:27017/bhiv_hr?authSource=admin
MONGODB_URI=mongodb://bhiv_user:your_password@localhost:27017/bhiv_hr?authSource=admin
MONGODB_DB_NAME=bhiv_hr
```

### Production (MongoDB Atlas)

For production deployment (Render.com, etc.):

```env
# Production - MongoDB Atlas
DATABASE_URL=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
MONGODB_DB_NAME=bhiv_hr
```

---

## 📝 Configuration Strategy

### Recommended Setup

1. **Development**: Use local MongoDB (Docker)
   - Fast iteration
   - No internet required
   - Free
   - Connection: `mongodb://localhost:27017`

2. **Production**: Use MongoDB Atlas
   - Managed service
   - Auto-scaling
   - Backups included
   - Connection: `mongodb+srv://...`

### Environment Variable Priority

The connection modules check:
1. `DATABASE_URL` (primary)
2. `MONGODB_URI` (fallback)

Both work the same way!

---

## ✅ Checklist

### MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create cluster (free tier M0)
- [ ] Create database user
- [ ] Configure network access
- [ ] Get connection string
- [ ] Test connection
- [ ] Save connection string securely

### Local MongoDB Setup
- [ ] Choose setup method (Docker or local install)
- [ ] Start MongoDB
- [ ] Test local connection
- [ ] Create database user (if using auth)

### Configuration
- [ ] Update `.env` file for development
- [ ] Update production environment variables
- [ ] Test both connections

---

## 🔐 Security Best Practices

1. **Strong Passwords**: Use complex passwords for database users
2. **Network Access**: Limit IP access in production (avoid `0.0.0.0/0` if possible)
3. **Environment Variables**: Never commit passwords to git
4. **Use `.env` files**: Keep credentials in `.env` (gitignored)
5. **Production**: Use MongoDB Atlas with authentication enabled

---

## 🆘 Troubleshooting

### Connection Issues

**Error: "Authentication failed"**
- Check username and password
- Verify database user exists in Atlas
- Check if password has special characters (may need URL encoding)

**Error: "Server selection timeout"**
- Check network access settings in Atlas
- Verify your IP is whitelisted
- Check firewall settings

**Error: "SSL/TLS required"**
- MongoDB Atlas requires SSL (automatic with `mongodb+srv://`)
- Local MongoDB doesn't require SSL

### Local Connection Issues

**Error: "Connection refused"**
- Verify MongoDB is running: `docker ps` or `mongod --version`
- Check port 27017 is not blocked
- Verify connection string format

---

## 📚 Next Steps

After setting up MongoDB Atlas:

1. ✅ Update production environment variables with Atlas connection string
2. ✅ Test connection from your application
3. ✅ Proceed with data migration (Phase 7)
4. ✅ Deploy services with Atlas connection

---

## 🎯 Summary

**What You Need to Do**:
1. Create MongoDB Atlas account (you do this)
2. Create cluster and database user (you do this)
3. Get connection string (you copy this)
4. Update environment variables (I can help with this)

**What I Can Do**:
1. ✅ Update configuration files
2. ✅ Create connection modules (already done)
3. ✅ Guide you through setup
4. ✅ Help with connection string format

---

**Status**: ⏳ Waiting for MongoDB Atlas setup  
**Next**: Once Atlas is set up, update environment variables and test connection
