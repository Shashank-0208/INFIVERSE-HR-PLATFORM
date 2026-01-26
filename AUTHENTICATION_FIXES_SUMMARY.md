# Authentication Fixes Summary

## Issues Fixed

### 1. Missing `candidate_id` in Login Response
**Problem**: The backend login response didn't include `candidate_id` at the top level, causing frontend pages to fail when trying to make API calls.

**Fix**: Added `candidate_id` to the login response in `backend/services/gateway/app/main.py`:
```python
return {
    "success": True,
    "message": "Login successful",
    "token": token,
    "candidate_id": candidate_id_str,  # ✅ Added this
    "candidate": { ... }
}
```

### 2. Frontend Not Storing `candidate_id` After Login
**Problem**: The `authService.ts` wasn't storing `candidate_id` in localStorage, so subsequent API calls couldn't find the candidate ID.

**Fix**: Updated `frontend/src/services/authService.ts` to store `candidate_id`:
```typescript
// Store candidate_id if available (for API calls)
if (response.data.candidate_id) {
  localStorage.setItem('backend_candidate_id', response.data.candidate_id.toString());
  localStorage.setItem('candidate_id', response.data.candidate_id.toString());
}
```

## What to Check After Restart

1. **Restart Backend Service**: The gateway service needs to be restarted for the changes to take effect.

2. **Test Login Flow**:
   - Login as a candidate
   - Check browser console for errors
   - Verify that `candidate_id` is stored in localStorage:
     ```javascript
     localStorage.getItem('backend_candidate_id')
     localStorage.getItem('candidate_id')
     ```

3. **Test Dashboard**:
   - After login, the dashboard should load without errors
   - Check browser console for any API errors
   - Verify API calls are being made with the JWT token

4. **Common Console Errors to Look For**:
   - `401 Unauthorized` - Token not being sent or invalid
   - `403 Forbidden` - Token valid but insufficient permissions
   - `404 Not Found` - Endpoint doesn't exist
   - `422 Unprocessable Entity` - Invalid candidate_id format

## Debugging Steps

If you still see errors:

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for red error messages
   - Check Network tab to see API request/response details

2. **Verify Token is Being Sent**:
   - In Network tab, click on any API request
   - Check "Headers" section
   - Look for `Authorization: Bearer <token>`
   - If missing, the token isn't being attached

3. **Check localStorage**:
   ```javascript
   // In browser console, run:
   console.log('Token:', localStorage.getItem('auth_token'));
   console.log('Candidate ID:', localStorage.getItem('backend_candidate_id'));
   console.log('User Data:', localStorage.getItem('user_data'));
   ```

4. **Check Backend Logs**:
   - Look for authentication errors in gateway service logs
   - Check if JWT_SECRET_KEY and CANDIDATE_JWT_SECRET_KEY are set correctly

## Expected Behavior After Fix

✅ Login succeeds and stores token + candidate_id
✅ Dashboard loads and fetches stats/applications/interviews
✅ Profile page loads candidate data
✅ Job search works
✅ All API calls include JWT token in Authorization header
✅ No 401 errors in console

## Files Modified

1. `backend/services/gateway/app/main.py` - Added `candidate_id` to login response
2. `frontend/src/services/authService.ts` - Store `candidate_id` after login

