# MongoDB Atlas Complete Setup Guide
**Date**: December 2025  
**Purpose**: Step-by-step guide to create ONE MongoDB Atlas database for both localhost and production

---

## 🎯 Goal

Set up **ONE MongoDB Atlas database** that will be used by:
- ✅ **Localhost (Development)** - Your local machine
- ✅ **Live Deployment (Production)** - Render.com or your production server

Both environments will connect to the **same MongoDB Atlas database**.

---

## 📋 Prerequisites

- Email address (for account creation)
- Internet connection
- About 15-20 minutes of time

---

## 🚀 Step-by-Step Setup

### STEP 1: Create MongoDB Atlas Account

1. **Go to MongoDB Atlas Registration**:
   - Open browser: https://www.mongodb.com/cloud/atlas/register
   - Or go to: https://www.mongodb.com/cloud/atlas → Click **"Try Free"**

2. **Sign Up**:
   - Enter your **email address**
   - Enter a **password** (save this securely!)
   - Click **"Get started free"**

3. **Verify Email**:
   - Check your email inbox
   - Click the verification link
   - You'll be redirected to MongoDB Atlas dashboard

**✅ Step 1 Complete!** You should now see the MongoDB Atlas dashboard.

---

### STEP 2: Create Your First Cluster

1. **Choose Deployment Option**:
   - You'll see: **"Deploy a cloud database"**
   - Click **"Build a Database"** button

2. **Choose Tier**:
   - Select **"M0 FREE"** (Free tier)
     - ✅ **FREE forever**
     - ✅ 512 MB storage
     - ✅ Shared RAM
     - ✅ Perfect for development and small production
   - Click **"Create"**

3. **Choose Cloud Provider**:
   - **Recommended**: **AWS (Amazon Web Services)**
   - Select a **region** closest to you:
     - **US East (N. Virginia)** - Good for US
     - **EU (Ireland)** - Good for Europe
     - **Asia Pacific (Mumbai)** - Good for India/Asia
   - Click **"Create Cluster"**

4. **Wait for Cluster Creation**:
   - You'll see: **"Creating your cluster..."**
   - **Wait 3-5 minutes** (this is normal!)
   - Status will change to: **"Your cluster is ready!"**

**✅ Step 2 Complete!** Your cluster is now created.

---

### STEP 3: Create Database User

1. **Go to Database Access**:
   - In the left sidebar, click **"Database Access"**
   - Or look for the **"Database Access"** section

2. **Add New Database User**:
   - Click **"Add New Database User"** button (green button)

3. **Configure User**:
   - **Authentication Method**: Select **"Password"**
   - **Username**: Enter `bhiv_user` (or any username you prefer)
   - **Password**: 
     - Click **"Autogenerate Secure Password"** (recommended)
     - **OR** enter your own strong password
     - ⚠️ **IMPORTANT**: **COPY AND SAVE THIS PASSWORD!** You'll need it!
   - **User Privileges**: Select **"Read and write to any database"**
     - This gives the user full access (safe for your own database)

4. **Create User**:
   - Click **"Add User"** button at bottom
   - User will be created in a few seconds

**✅ Step 3 Complete!** Database user created.

**📝 IMPORTANT**: Save these credentials:
- Username: `bhiv_user` (or what you entered)
- Password: `[the password you saved]`

---

### STEP 4: Configure Network Access (Allow Connections)

This step allows your **localhost** and **production server** to connect to MongoDB Atlas.

1. **Go to Network Access**:
   - In the left sidebar, click **"Network Access"**
   - Or look for the **"Network Access"** section

2. **Add IP Address**:
   - Click **"Add IP Address"** button (green button)

3. **Allow Access Options**:

   **Option A: Allow All IPs (Easiest - Recommended for Development)**:
   - Click **"Allow Access from Anywhere"** button
   - This adds: `0.0.0.0/0`
   - ⚠️ **Note**: Your database is still protected by username/password authentication
   - Click **"Confirm"**
   
   **Option B: Add Specific IPs (More Secure)**:
   - Click **"Add Current IP Address"** (adds your current IP)
   - For production: Add your production server IP (e.g., Render.com IP ranges)
   - Click **"Confirm"**

4. **Verify**:
   - You should see your IP address(es) listed
   - Status should be **"Active"**

**✅ Step 4 Complete!** Network access configured.

**💡 Recommendation**: For now, use **Option A (Allow Access from Anywhere)**. You can restrict it later.

---

### STEP 5: Get Connection String

1. **Go to Clusters**:
   - In the left sidebar, click **"Clusters"** (or "Database")
   - You should see your cluster listed

2. **Connect to Cluster**:
   - Click **"Connect"** button (on your cluster)

3. **Choose Connection Method**:
   - Select **"Drivers"** option
   - This shows connection strings for different programming languages

4. **Select Driver**:
   - **Driver**: **Python**
   - **Version**: **3.12 or later**
   - Copy the connection string shown

5. **Connection String Format**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Customize Connection String**:
   - Replace `<username>` with your database username (e.g., `bhiv_user`)
   - Replace `<password>` with your database password
   - Add database name: Add `/bhiv_hr` before the `?`
   - **Final format should look like**:
   ```
   mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
   ```

**✅ Step 5 Complete!** You have your connection string.

**📝 IMPORTANT**: Save this connection string securely! You'll need it for both localhost and production.

---

### STEP 6: Create Database and Collections (Optional - Auto-Created)

MongoDB Atlas will automatically create the database and collections when you first insert data.

However, you can verify connection:

1. **Test Connection** (Optional):
   - In Atlas dashboard, click **"Database"** → **"Browse Collections"**
   - Database will be created automatically when you first connect

**✅ Step 6 Complete!** Database ready.

---

## 🔧 Configure Your Application

### For Localhost (Development)

1. **Create/Update `.env` file** in `backend/` directory:

   Create file: `backend/.env`

   ```env
   # MongoDB Atlas Connection (Shared Database)
   DATABASE_URL=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
   MONGODB_URI=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
   MONGODB_DB_NAME=bhiv_hr
   
   # Other existing variables...
   API_KEY_SECRET=your_api_key
   JWT_SECRET_KEY=your_jwt_secret
   # ... etc
   ```

2. **Replace Values**:
   - Replace `bhiv_user` with your actual username
   - Replace `your_password` with your actual password
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
   - Keep `bhiv_hr` as database name (or change if you prefer)

### For Production (Render.com)

1. **Go to Render Dashboard**:
   - Log in to https://dashboard.render.com
   - Select your service (Gateway, Agent, LangGraph, etc.)

2. **Environment Variables**:
   - Click **"Environment"** tab
   - Click **"Add Environment Variable"**

3. **Add DATABASE_URL**:
   - **Key**: `DATABASE_URL`
   - **Value**: `mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority`
     - Use the **same connection string** as localhost!
   - Click **"Save Changes"**

4. **Add MONGODB_DB_NAME** (Optional):
   - **Key**: `MONGODB_DB_NAME`
   - **Value**: `bhiv_hr`
   - Click **"Save Changes"**

5. **Repeat for All Services**:
   - Gateway service
   - Agent service
   - LangGraph service
   - Any other services that need database access

---

## ✅ Verification Steps

### Test Connection (Optional)

Create a test script to verify connection:

**Create file**: `backend/test_mongodb_connection.py`

```python
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get connection string
uri = os.getenv("DATABASE_URL")

if not uri:
    print("❌ DATABASE_URL not found in environment variables")
    exit(1)

try:
    # Connect to MongoDB
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    
    # Test connection
    client.admin.command('ping')
    print("✅ Successfully connected to MongoDB Atlas!")
    
    # List databases
    databases = client.list_database_names()
    print(f"📊 Available databases: {databases}")
    
    # List collections (if database exists)
    db = client['bhiv_hr']
    collections = db.list_collection_names()
    print(f"📁 Collections in 'bhiv_hr': {collections}")
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
    exit(1)
```

**Run test**:
```bash
cd backend
pip install pymongo python-dotenv
python test_mongodb_connection.py
```

**Expected Output**:
```
✅ Successfully connected to MongoDB Atlas!
📊 Available databases: ['admin', 'bhiv_hr', 'local']
📁 Collections in 'bhiv_hr': []
```

---

## 📝 Summary Checklist

Complete these steps:

- [ ] ✅ Created MongoDB Atlas account
- [ ] ✅ Created cluster (M0 FREE tier)
- [ ] ✅ Created database user (username + password saved)
- [ ] ✅ Configured network access (allowed IPs)
- [ ] ✅ Got connection string
- [ ] ✅ Updated `.env` file for localhost
- [ ] ✅ Updated environment variables in Render.com (production)
- [ ] ✅ Tested connection (optional)

---

## 🔐 Security Notes

1. **Password Security**:
   - Use strong passwords
   - Never commit passwords to git
   - Store passwords securely (password manager)

2. **Network Access**:
   - Using `0.0.0.0/0` (all IPs) is OK for development
   - Your database is still protected by authentication
   - For production, consider restricting to specific IPs

3. **Connection String**:
   - Keep connection string secret
   - Don't share in public repositories
   - Use environment variables (not hardcoded)

---

## 🆘 Troubleshooting

### "Authentication failed"
- ✅ Check username and password are correct
- ✅ Verify password doesn't have special characters that need URL encoding
- ✅ Try regenerating password in Atlas

### "Server selection timeout"
- ✅ Check network access settings (IP whitelist)
- ✅ Verify your IP is allowed (or 0.0.0.0/0 is set)
- ✅ Check internet connection

### "SSL/TLS required"
- ✅ MongoDB Atlas requires SSL (automatic with `mongodb+srv://`)
- ✅ Don't disable SSL in connection string

### Connection string format errors
- ✅ Make sure password is URL-encoded if it has special characters
- ✅ Verify connection string format matches exactly
- ✅ Check database name is included (`/bhiv_hr`)

---

## 🎯 Next Steps After Setup

Once MongoDB Atlas is set up:

1. ✅ **Test Connection** - Verify both localhost and production can connect
2. ✅ **Proceed with Migration** - Continue with Phase 4 (Query Migration)
3. ✅ **Data Migration** - Migrate data from PostgreSQL to MongoDB (Phase 7)
4. ✅ **Deploy** - Deploy services with MongoDB Atlas connection

---

## 📞 Support

If you encounter issues:

1. Check MongoDB Atlas status: https://status.mongodb.com/
2. Review Atlas documentation: https://docs.atlas.mongodb.com/
3. Check connection string format in this guide
4. Verify network access settings

---

**✅ Setup Complete!** You now have ONE MongoDB Atlas database ready for both localhost and production use!

**Next**: Update environment variables and test connection.
