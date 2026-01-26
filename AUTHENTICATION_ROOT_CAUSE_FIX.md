# Authentication Root Cause Fix

## Problem Identified

The user was experiencing **unauthorized errors on all API calls** after login. The root cause was a **conflict between two security schemes**:

1. **`main.py`** had: `security = HTTPBearer()` (line 76) - **auto_error=True by default**
2. **`jwt_auth.py`** had: `security = HTTPBearer(auto_error=False)` (line 17)

When `get_auth` from `jwt_auth.py` was imported and used, FastAPI's dependency injection system was potentially using the wrong security scheme, causing 401 errors before authentication logic could run.

## Fixes Applied

### 1. **Unified Security Scheme Import**
- Now importing `security` from `jwt_auth.py` (with `auto_error=False`)
- Removed duplicate `security = HTTPBearer()` in `main.py`
- If import fails, creates fallback with `auto_error=False`

**Before:**
```python
security = HTTPBearer()  # auto_error=True by default
```

**After:**
```python
# Use security scheme from jwt_auth.py (with auto_error=False) if available
if jwt_security is not None:
    security = jwt_security
else:
    security = HTTPBearer(auto_error=False)
```

### 2. **Enhanced Logging in Authentication**
Added comprehensive logging to `jwt_auth.py` to help debug authentication issues:

- Logs when no credentials are provided
- Logs when token is empty
- Logs authentication attempts (API key, candidate JWT, client JWT)
- Logs successful authentications
- Logs specific JWT validation errors (expired, invalid signature, decode errors)

### 3. **Improved Error Handling**
Enhanced `verify_jwt_token` function to catch and log specific JWT errors:
- `ExpiredSignatureError` - Token expired
- `InvalidSignatureError` - Secret mismatch
- `DecodeError` - Token format invalid
- `InvalidTokenError` - General invalid token

## Files Modified

1. **`backend/services/gateway/app/main.py`**
   - Import `security` from `jwt_auth.py`
   - Use imported security scheme instead of creating new one
   - Updated fallback to use `auto_error=False`

2. **`backend/services/gateway/jwt_auth.py`**
   - Added comprehensive logging to `get_auth()` function
   - Enhanced error handling in `verify_jwt_token()` function
   - Better error messages for debugging

## How to Verify the Fix

### 1. Check Backend Logs
After restarting the backend, check logs for authentication attempts:
```
Attempting authentication with token (first 20 chars): ...
Authentication successful: Candidate JWT token for user ...
```

### 2. Check Browser Console
Verify token is being sent:
```javascript
// In browser console:
const token = localStorage.getItem('auth_token');
console.log('Token present:', !!token);
console.log('Token (first 50 chars):', token?.substring(0, 50));
```

### 3. Check Network Tab
In browser DevTools → Network tab:
- Look for API requests
- Check Request Headers → `Authorization: Bearer <token>`
- Verify token is present in all requests

### 4. Test Authentication Flow
1. Login as candidate
2. Check browser console - should see no 401 errors
3. Navigate to different pages - all should work
4. Check backend logs - should see successful authentication messages

## Expected Behavior After Fix

✅ **All API calls should work** - No more unauthorized errors
✅ **Token is properly validated** - JWT tokens are correctly verified
✅ **Better error messages** - Logs help identify any remaining issues
✅ **Proper security** - Uses correct security scheme with auto_error=False

## Debugging Steps if Still Having Issues

### 1. Check Environment Variables
```bash
# Verify these are set in backend .env:
CANDIDATE_JWT_SECRET_KEY=...
JWT_SECRET_KEY=...
API_KEY_SECRET=...
```

### 2. Check Token Format
The token should be a valid JWT:
- Format: `header.payload.signature`
- Should decode to JSON
- Should contain `sub`, `user_id`, `role`, `exp` claims

### 3. Check Backend Logs
Look for:
- "No credentials provided" - Token not being sent
- "Empty token" - Token is empty string
- "JWT token validation failed" - Token invalid or wrong secret
- "Authentication successful" - Token validated correctly

### 4. Verify Token Secret Match
The token must be signed with the same secret as configured:
- Candidate tokens: `CANDIDATE_JWT_SECRET_KEY`
- Client tokens: `JWT_SECRET_KEY`

## Summary

The fix ensures:
1. ✅ Single security scheme (from `jwt_auth.py` with `auto_error=False`)
2. ✅ Proper token validation with detailed logging
3. ✅ Better error messages for debugging
4. ✅ No conflicts between security schemes

**Next Step:** Restart the backend service and test all API calls. The unauthorized errors should be resolved.

