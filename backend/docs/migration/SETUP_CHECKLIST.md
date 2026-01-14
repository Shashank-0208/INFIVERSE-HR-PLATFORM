# MongoDB Atlas Setup Checklist
**Quick Reference Checklist**

---

## ✅ Complete Setup Checklist

### Account & Cluster Setup
- [ ] Created MongoDB Atlas account (https://www.mongodb.com/cloud/atlas/register)
- [ ] Verified email address
- [ ] Created cluster (M0 FREE tier)
- [ ] Selected cloud provider (AWS recommended)
- [ ] Selected region (closest to you)
- [ ] Waited for cluster creation (3-5 minutes)
- [ ] Cluster status: "Your cluster is ready!"

### Database User Setup
- [ ] Went to "Database Access" in Atlas dashboard
- [ ] Clicked "Add New Database User"
- [ ] Set authentication method: "Password"
- [ ] Entered username: `bhiv_user` (or custom)
- [ ] Generated/set password
- [ ] **SAVED PASSWORD SECURELY** ⚠️
- [ ] Set privileges: "Read and write to any database"
- [ ] Created user
- [ ] User appears in database access list

### Network Access Setup
- [ ] Went to "Network Access" in Atlas dashboard
- [ ] Clicked "Add IP Address"
- [ ] Selected "Allow Access from Anywhere" (0.0.0.0/0)
  - OR added specific IPs (localhost + production server)
- [ ] Confirmed IP access
- [ ] IP addresses appear in list with "Active" status

### Connection String Setup
- [ ] Went to "Clusters" in Atlas dashboard
- [ ] Clicked "Connect" on cluster
- [ ] Selected "Drivers" option
- [ ] Selected "Python" driver
- [ ] Selected version "3.12 or later"
- [ ] Copied connection string
- [ ] Replaced `<username>` with actual username
- [ ] Replaced `<password>` with actual password
- [ ] Added database name: `/bhiv_hr` before `?`
- [ ] **SAVED CONNECTION STRING SECURELY** ⚠️

### Localhost Configuration
- [ ] Created/updated `backend/.env` file
- [ ] Added `DATABASE_URL` with connection string
- [ ] Added `MONGODB_URI` (same as DATABASE_URL)
- [ ] Added `MONGODB_DB_NAME=bhiv_hr`
- [ ] Verified connection string format
- [ ] Tested connection (optional)

### Production Configuration (Render.com)
- [ ] Logged into Render.com dashboard
- [ ] Selected Gateway service
  - [ ] Added `DATABASE_URL` environment variable
  - [ ] Added `MONGODB_DB_NAME` environment variable
- [ ] Selected Agent service
  - [ ] Added `DATABASE_URL` environment variable
  - [ ] Added `MONGODB_DB_NAME` environment variable
- [ ] Selected LangGraph service
  - [ ] Added `DATABASE_URL` environment variable
  - [ ] Added `MONGODB_DB_NAME` environment variable
- [ ] Saved all changes
- [ ] Redeployed services (if needed)

### Verification
- [ ] Tested connection from localhost (optional)
- [ ] Verified services can connect to Atlas
- [ ] Checked Atlas dashboard for connection activity
- [ ] Verified database is accessible

---

## 📝 Important Information to Save

Save these securely (password manager recommended):

1. **MongoDB Atlas Account**:
   - Email: `_________________`
   - Password: `_________________`

2. **Database User**:
   - Username: `_________________`
   - Password: `_________________`

3. **Connection String**:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/bhiv_hr?retryWrites=true&w=majority
   ```

4. **Cluster Details**:
   - Cluster Name: `_________________`
   - Region: `_________________`
   - Provider: `_________________`

---

## ✅ When All Checkboxes Are Complete

You're ready to:
1. ✅ Proceed with migration
2. ✅ Test connections
3. ✅ Deploy services
4. ✅ Continue with Phase 4 (Query Migration)

---

**Status**: Track your progress with this checklist!
