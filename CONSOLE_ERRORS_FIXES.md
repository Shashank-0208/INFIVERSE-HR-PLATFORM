# Console Errors Fixes

## Issues Identified from Console Logs

### 1. **401 Unauthorized Errors**
Multiple endpoints were returning 401 Unauthorized:
- `/v1/candidate/applications/{candidate_id}` - 401
- `/v1/interviews?candidate_id=...` - 401  
- `/v1/offers?candidate_id=...` - 401

**Root Cause**: The `/v1/interviews` and `/v1/offers` endpoints were using `get_api_key` which only accepts API keys, not JWT tokens from the frontend.

**Fix Applied**:
- Changed `/v1/interviews` endpoint to use `get_auth` instead of `get_api_key`
- Changed `/v1/offers` endpoint to use `get_auth` instead of `get_api_key`
- Added support for `candidate_id` query parameter filtering
- Added JWT token validation to ensure candidates can only view their own data

### 2. **404 Not Found Error**
- `/v1/candidate/stats/{candidate_id}` - 404

**Root Cause**: This endpoint didn't exist in the backend.

**Fix Applied**:
- Created new endpoint `/v1/candidate/stats/{candidate_id}`
- Returns dashboard statistics: total_applications, shortlisted, interviews_scheduled, offers_received, profile_views
- Includes JWT authentication and authorization checks

## Changes Made

### Backend Changes (`backend/services/gateway/app/main.py`)

1. **Updated `/v1/interviews` endpoint**:
   ```python
   # Before:
   async def get_interviews(api_key: str = Depends(get_api_key)):
   
   # After:
   async def get_interviews(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
   ```
   - Now accepts JWT tokens
   - Supports filtering by `candidate_id` query parameter
   - Validates that candidates can only view their own interviews

2. **Updated `/v1/offers` endpoint**:
   ```python
   # Before:
   async def get_all_offers(api_key: str = Depends(get_api_key)):
   
   # After:
   async def get_all_offers(candidate_id: Optional[str] = None, auth = Depends(get_auth)):
   ```
   - Now accepts JWT tokens
   - Supports filtering by `candidate_id` query parameter
   - Validates that candidates can only view their own offers

3. **Created `/v1/candidate/stats/{candidate_id}` endpoint**:
   - Returns dashboard statistics for a candidate
   - Requires JWT authentication
   - Validates that candidates can only view their own stats

## Testing

After restarting the backend service, you should see:

✅ **No more 401 errors** for:
- `/v1/candidate/applications/{candidate_id}`
- `/v1/interviews?candidate_id=...`
- `/v1/offers?candidate_id=...`

✅ **No more 404 errors** for:
- `/v1/candidate/stats/{candidate_id}`

✅ **Dashboard loads successfully** with:
- Application statistics
- Interview data
- Offer data

## Next Steps

1. **Restart the backend gateway service** to apply changes
2. **Clear browser cache/localStorage** (optional):
   ```javascript
   localStorage.clear()
   ```
3. **Test the login flow again**:
   - Login as candidate
   - Check browser console - should see no 401/404 errors
   - Dashboard should load with data

## Debugging

If you still see 401 errors:

1. **Check if token is being sent**:
   - Open browser DevTools → Network tab
   - Click on a failed request
   - Check "Headers" → "Authorization" header
   - Should see: `Authorization: Bearer <token>`

2. **Check token validity**:
   ```javascript
   // In browser console:
   const token = localStorage.getItem('auth_token');
   console.log('Token exists:', !!token);
   if (token) {
     const payload = JSON.parse(atob(token.split('.')[1]));
     console.log('Token payload:', payload);
     console.log('Token expired:', new Date(payload.exp * 1000) < new Date());
   }
   ```

3. **Check backend logs**:
   - Look for authentication errors in gateway service logs
   - Verify `CANDIDATE_JWT_SECRET_KEY` environment variable is set correctly

