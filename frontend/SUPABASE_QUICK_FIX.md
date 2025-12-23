# Quick Fix for "Failed to fetch" Error

## ⚡ Immediate Steps

### Step 1: Restart Dev Server (REQUIRED)
```bash
# Stop current server (Ctrl+C)
cd frontend
npm run dev
```

**Why?** Vite only loads `.env` files when the server starts. Changes to `.env` require a restart.

### Step 2: Check Supabase Project Status

1. Go to: https://supabase.com/dashboard
2. Find your project: `smcgaaecckvngkhvsanb`
3. **If it shows "Paused"**: Click "Restore" or "Resume"
4. Wait 1-2 minutes for project to fully start

### Step 3: Test Connection in Browser Console

Open browser DevTools (F12) → Console tab, then paste and run:

```javascript
// Test Supabase connection
fetch('https://smcgaaecckvngkhvsanb.supabase.co/rest/v1/', {
  method: 'GET',
  headers: {
    'apikey': 'sb_publishable_oVHMsD6OZGCWlXvynx4uIw_Keb2YASw',
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('✅ Connection OK! Status:', r.status);
  return r.json();
})
.then(data => console.log('Response:', data))
.catch(err => {
  console.error('❌ Connection Failed:', err);
  console.error('Possible causes:');
  console.error('1. Project is paused - check Supabase dashboard');
  console.error('2. Network/firewall blocking request');
  console.error('3. Wrong URL or API key');
});
```

**Expected Result:**
- ✅ If you see "Connection OK!" → Supabase is working, issue is in code
- ❌ If you see "Connection Failed" → Supabase project issue (paused, wrong URL, etc.)

### Step 4: Verify Environment Variables

In browser console, check what the app sees:

```javascript
// Check if env vars are loaded
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

**Expected:**
- URL should be: `https://smcgaaecckvngkhvsanb.supabase.co`
- Key should start with: `sb_publishable_`

**If undefined:**
- `.env` file not being loaded
- Dev server not restarted
- `.env` file in wrong location (should be in `frontend/` directory)

## 🔍 Common Issues & Solutions

### Issue 1: "Failed to fetch" - Network Error
**Cause:** Supabase project is paused or unreachable

**Fix:**
1. Check Supabase dashboard - is project active?
2. If paused, click "Restore"
3. Wait 2 minutes, then try again

### Issue 2: Environment Variables Not Loading
**Cause:** Dev server wasn't restarted after creating `.env`

**Fix:**
```bash
# Stop server (Ctrl+C)
cd frontend
npm run dev
```

### Issue 3: CORS Error
**Cause:** Browser blocking cross-origin request

**Fix:**
- Supabase allows all origins by default
- Check browser console for specific CORS error
- Try different browser or incognito mode
- Check if corporate firewall/proxy is blocking

### Issue 4: Wrong API Key Format
**Cause:** Anon key might be incorrect

**Verify:**
1. Go to Supabase Dashboard → Settings → API
2. Copy "anon public" key
3. Should start with `sb_publishable_` or `eyJ...`
4. Update `.env` file if different

## 📋 Checklist

Before reporting the issue, verify:

- [ ] Dev server restarted after creating `.env`
- [ ] `.env` file exists in `frontend/` directory
- [ ] `.env` file has correct URL (no trailing slash)
- [ ] `.env` file has correct anon key
- [ ] Supabase project is active (not paused)
- [ ] Browser console test shows "Connection OK!"
- [ ] No browser extensions blocking requests
- [ ] Not behind corporate firewall/VPN

## 🆘 Still Not Working?

1. **Check Browser Network Tab:**
   - Open DevTools → Network
   - Try to sign up
   - Look for requests to `*.supabase.co`
   - Check status code and error message

2. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors
   - Check for rate limiting or other issues

3. **Try Different Browser:**
   - Sometimes extensions block requests
   - Try Chrome/Firefox/Edge
   - Try incognito/private mode

4. **Verify Project Settings:**
   - Dashboard → Settings → API
   - Verify URL matches: `https://smcgaaecckvngkhvsanb.supabase.co`
   - Verify anon key matches your `.env`

## 💡 Debug Mode

The code now includes debug logging. Check browser console for:
- `🔧 Supabase Configuration:` - Shows if env vars are loaded
- Connection test results
- Detailed error messages

