# Quick Start: MongoDB Setup
**Date**: December 2025

---

## 🚀 Quick Setup (Choose One)

### Option A: Local Development Only (Fastest)

**Use Docker (already configured):**
```bash
cd backend
docker-compose -f docker-compose.production.yml up -d db
```

**Update .env file:**
```env
DATABASE_URL=mongodb://bhiv_user:your_password@localhost:27017/bhiv_hr?authSource=admin
```

**Done!** ✅ You can start development immediately.

---

### Option B: MongoDB Atlas (Production)

**Steps (You do these):**

1. **Create Account** (5 minutes)
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email

2. **Create Cluster** (5 minutes)
   - Click "Build a Cluster"
   - Select "FREE (M0)" tier
   - Choose region
   - Click "Create Cluster"

3. **Create User** (2 minutes)
   - Database Access → Add New Database User
   - Username: `bhiv_user`
   - Password: (create strong password)
   - Privileges: Read and write to any database

4. **Network Access** (2 minutes)
   - Network Access → Add IP Address
   - For testing: "Add Current IP Address"
   - For production: Add your server IPs

5. **Get Connection String** (1 minute)
   - Clusters → Connect → Drivers
   - Copy connection string
   - Replace `<password>` with your password

**Total Time**: ~15 minutes

**Then update environment variables:**
```env
DATABASE_URL=mongodb+srv://bhiv_user:your_password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
```

---

## 🎯 Recommended: Both!

**Development**: Use Docker (localhost)
**Production**: Use MongoDB Atlas

This way you can:
- Develop offline (localhost)
- Test locally (fast, free)
- Deploy to production (Atlas)
- Use same code for both!

---

## ✅ What's Already Done

1. ✅ Docker configuration updated
2. ✅ Connection modules created
3. ✅ Code supports both localhost and Atlas
4. ✅ Environment variable handling ready

## ⏳ What You Need to Do

1. ⏳ Create MongoDB Atlas account (if you want cloud MongoDB)
2. ⏳ Get connection string
3. ⏳ Update environment variables

---

**I can help with**: Configuration, code, testing  
**You need to do**: Create Atlas account (if using cloud MongoDB)
