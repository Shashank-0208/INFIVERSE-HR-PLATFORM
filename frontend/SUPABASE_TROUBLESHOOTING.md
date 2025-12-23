# Supabase "Failed to fetch" Error - Troubleshooting Guide

## Common Causes and Solutions

### 1. **Dev Server Not Restarted** ⚠️ MOST COMMON

After updating `.env` file, you **MUST** restart your development server for changes to take effect.

**Solution:**
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 2. **Supabase Project is Paused**

Free tier Supabase projects pause after inactivity. You need to reactivate it.

**Solution:**
1. Go to https://supabase.com/dashboard
2. Check if your project shows as "Paused"
3. Click "Restore" or "Resume" to reactivate
4. Wait 1-2 minutes for the project to fully start

### 3. **Incorrect Environment Variables**

Verify your `.env` file has the correct values.

**Check:**
```bash
cd frontend
cat .env
```

Should show:
```
VITE_SUPABASE_URL=https://smcgaaecckvngkhvsanb.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_oVHMsD6OZGCWlXvynx4uIw_Keb2YASw
```

**Fix:**
- Ensure no extra spaces or quotes
- Ensure URL doesn't have trailing slash
- Ensure key is the complete anon key (starts with `sb_publishable_`)

### 4. **CORS Configuration**

Supabase should allow all origins by default, but verify in dashboard.

**Check:**
1. Go to Supabase Dashboard → Settings → API
2. Under "CORS Configuration", ensure it allows your origin
3. For local development, `http://localhost:5173` should work by default

### 5. **Network/Firewall Issues**

**Check:**
- Is your internet connection stable?
- Are you behind a corporate firewall?
- Try accessing the Supabase URL directly in browser:
  - `https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/` (should return JSON)

### 6. **Browser Console Errors**

Open browser DevTools (F12) and check:
- **Console tab**: Look for specific error messages
- **Network tab**: Check if requests to Supabase are being made
  - Look for requests to `*.supabase.co`
  - Check if they're failing with CORS errors

### 7. **Verify Supabase Project is Active**

**Test Connection:**
```bash
# Test if Supabase is reachable
curl https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/
```

Should return JSON (not an error).

### 8. **Check Supabase Status**

Visit: https://status.supabase.com/
- Ensure all services are operational
- Check for any ongoing incidents

## Step-by-Step Debugging

### Step 1: Verify Environment Variables are Loaded

Add this temporarily to your code to check:
```typescript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
```

If these show `undefined` or placeholder values, the `.env` file isn't being loaded.

### Step 2: Test Direct Connection

Open browser console and run:
```javascript
fetch('https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'sb_publishable_oVHMsD6OZGCWlXvynx4uIw_Keb2YASw'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

If this fails, it's a network/project issue, not a code issue.

### Step 3: Check Browser Network Tab

1. Open DevTools → Network tab
2. Try to sign up
3. Look for requests to `*.supabase.co`
4. Check:
   - **Status**: Should be 200 or 201 (not 0, 404, or CORS error)
   - **Request URL**: Should match your Supabase URL
   - **Headers**: Should include your anon key

## Quick Fixes

### Fix 1: Restart Dev Server
```bash
# Stop server (Ctrl+C)
cd frontend
npm run dev
```

### Fix 2: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

### Fix 3: Verify .env File Location
Ensure `.env` is in the `frontend/` directory (same level as `package.json`)

### Fix 4: Check for Typos
- URL should be: `https://smcgaaecckvngkhvsanb.supabase.co` (no trailing slash)
- Key should start with: `sb_publishable_`

## Still Not Working?

1. **Check Supabase Dashboard**
   - Project status (should be "Active")
   - API settings (anon key matches)
   - Database status

2. **Try Different Browser**
   - Sometimes browser extensions block requests
   - Try incognito/private mode

3. **Check for Proxy/VPN**
   - Corporate proxies can block Supabase
   - Try disabling VPN

4. **Verify Migration is Run**
   - Ensure you've run the migration SQL in Supabase dashboard
   - Check that `user_profiles` table exists

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| `Failed to fetch` | Network/CORS/Project paused | Restart dev server, check project status |
| `Invalid API key` | Wrong anon key | Verify `.env` file has correct key |
| `Project not found` | Wrong URL | Verify `.env` file has correct URL |
| `CORS policy` | CORS blocked | Check Supabase CORS settings |
| `NetworkError` | Network issue | Check internet, firewall, VPN |

## Need More Help?

1. Check Supabase logs in dashboard
2. Check browser console for detailed errors
3. Check network tab for failed requests
4. Verify project is active in Supabase dashboard

