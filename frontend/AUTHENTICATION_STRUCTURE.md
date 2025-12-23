# 🔐 Authentication Structure Documentation

## 📁 File Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabase.ts              # Supabase client & auth functions
│   ├── context/
│   │   └── AuthContext.tsx          # React context for auth state
│   ├── components/
│   │   └── ProtectedRoute.tsx      # Route protection component
│   ├── pages/
│   │   └── auth/
│   │       └── AuthPage.tsx         # Signup/Login UI
│   └── App.tsx                      # Main app with route definitions
├── supabase/
│   ├── migrations/
│   │   └── 001_create_user_profiles.sql  # Database schema
│   └── update_existing_users.sql   # Migration script
└── .env                             # Environment variables
```

## 🏗️ Architecture Overview

### **Dual Authentication System**

The system uses a **hybrid approach** that supports both:
1. **Supabase Auth** (primary) - Full authentication with database
2. **localStorage Auth** (fallback) - Works when Supabase is unavailable

```
┌─────────────────────────────────────────────────────────┐
│                    User Action                          │
│              (Signup / Login / Logout)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              AuthPage.tsx                               │
│  - Handles form submission                             │
│  - Validates input                                     │
│  - Calls auth functions                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              supabase.ts                                │
│  - signUp() / signIn() / signOut()                     │
│  - Supabase client configuration                        │
│  - Error handling & fallback                           │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────────────┐
│  Supabase   │    │   localStorage       │
│  Database   │    │   (Fallback)          │
└──────────────┘    └──────────────────────┘
        │                     │
        └──────────┬──────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              AuthContext.tsx                            │
│  - Manages auth state                                   │
│  - Provides auth to entire app                          │
│  - Listens for auth changes                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              ProtectedRoute.tsx                         │
│  - Checks authentication                                │
│  - Validates user role                                  │
│  - Redirects if unauthorized                            │
└─────────────────────────────────────────────────────────┘
```

## 📦 Core Components

### 1. **Supabase Client** (`src/lib/supabase.ts`)

**Purpose:** Low-level Supabase integration and auth functions

**Key Functions:**
- `signUp(email, password, userData)` - Create new user
- `signIn(email, password)` - Authenticate user
- `signOut()` - Sign out user
- `getUserRole(userId)` - Get user role from database
- `testSupabaseConnection()` - Test Supabase connectivity
- `isSupabaseConfigured()` - Check if Supabase is set up

**Features:**
- Automatic fallback to localStorage if Supabase fails
- Error handling with user-friendly messages
- Connection testing before operations
- Debug logging in development

### 2. **Auth Context** (`src/context/AuthContext.tsx`)

**Purpose:** Global authentication state management

**State:**
```typescript
{
  user: User | null              // Current user object
  session: Session | null        // Supabase session
  loading: boolean               // Auth check in progress
  userRole: string | null        // User's role (candidate/recruiter/client)
  userName: string | null       // User's name
}
```

**Methods:**
- `signIn(email, password)` - Login
- `signUp(email, password, userData)` - Register
- `signOut()` - Logout

**Initialization Flow:**
1. Check localStorage for existing auth
2. If found, create mock user from localStorage
3. Try to get Supabase session (non-blocking)
4. Listen for auth state changes
5. Update state accordingly

### 3. **Auth Page** (`src/pages/auth/AuthPage.tsx`)

**Purpose:** Signup and login UI

**Features:**
- Dual mode: Signup / Login
- Role selection (candidate/recruiter/client)
- Form validation
- Error handling
- Profile creation in database
- Role recovery mechanism

**Signup Flow:**
1. Validate form inputs
2. Call `supabaseSignUp()` with role
3. Save to localStorage
4. Create/update user profile in database
5. Update Supabase metadata
6. Redirect to role-specific dashboard

**Login Flow:**
1. Validate credentials
2. Call `supabaseSignIn()`
3. Get user role from multiple sources (priority order):
   - `user_profiles` table (most reliable)
   - User metadata
   - Fresh user data
   - localStorage (fallback)
4. If role not found, create profile with default role
5. Save to localStorage
6. Redirect to role-specific dashboard

### 4. **Protected Route** (`src/components/ProtectedRoute.tsx`)

**Purpose:** Route protection and role-based access control

**Props:**
```typescript
{
  children: ReactNode
  allowedRoles?: string[]    // Roles that can access
  requireAuth?: boolean      // Require authentication (default: true)
}
```

**Protection Logic:**
1. Check if user is authenticated
2. If not authenticated → redirect to `/auth`
3. If authenticated, check role
4. If role doesn't match → redirect to correct dashboard
5. If authorized → render children

**Usage:**
```tsx
<ProtectedRoute allowedRoles={['candidate']}>
  <CandidateDashboard />
</ProtectedRoute>
```

### 5. **Public Route** (`src/components/ProtectedRoute.tsx`)

**Purpose:** Redirect authenticated users away from auth pages

**Usage:**
```tsx
<PublicRoute>
  <AuthPage />
</PublicRoute>
```

## 🗄️ Database Schema

### **Supabase Auth Tables** (Managed by Supabase)
- `auth.users` - User accounts
- `auth.sessions` - Active sessions

### **Custom Tables**

#### **user_profiles** (`supabase/migrations/001_create_user_profiles.sql`)

```sql
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('candidate', 'recruiter', 'client')) DEFAULT 'candidate',
    phone TEXT,
    company TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Triggers:**
- `on_auth_user_created` - Auto-creates profile when user signs up
- `set_updated_at` - Auto-updates timestamp on changes

**Row Level Security (RLS):**
- Users can view/update their own profile
- Service role has full access

## 🔄 Authentication Flows

### **Signup Flow**

```
User fills form
    ↓
Select role (candidate/recruiter/client)
    ↓
Submit form
    ↓
AuthPage.tsx validates
    ↓
supabase.ts → signUp()
    ↓
┌─────────────────────────┐
│  Supabase Auth          │
│  - Create user account  │
│  - Set user metadata    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Database Trigger        │
│  - Creates user_profile  │
│  - Sets role from meta   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  AuthPage.tsx           │
│  - Save to localStorage │
│  - Update metadata      │
│  - Create/update profile│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to Dashboard  │
│  Based on role          │
└─────────────────────────┘
```

### **Login Flow**

```
User enters credentials
    ↓
AuthPage.tsx validates
    ↓
supabase.ts → signIn()
    ↓
┌─────────────────────────┐
│  Supabase Auth           │
│  - Verify credentials    │
│  - Create session        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Get User Role          │
│  Priority:              │
│  1. user_profiles table │
│  2. user metadata       │
│  3. Fresh user data      │
│  4. localStorage        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  If role not found:     │
│  - Create profile       │
│  - Set default role     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Save to localStorage   │
│  - user_role            │
│  - user_email           │
│  - user_name            │
│  - isAuthenticated      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to Dashboard  │
│  Based on role          │
└─────────────────────────┘
```

### **Logout Flow**

```
User clicks logout
    ↓
AuthContext → signOut()
    ↓
┌─────────────────────────┐
│  Supabase signOut()     │
│  - End session          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Clear localStorage     │
│  - user_role            │
│  - user_email           │
│  - user_name            │
│  - isAuthenticated      │
│  - user_id              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Redirect to /auth      │
└─────────────────────────┘
```

## 🔑 Role-Based Access Control (RBAC)

### **Roles:**
- `candidate` - Job seekers
- `recruiter` - HR/Recruiters
- `client` - Companies/Employers

### **Role Storage:**
1. **Primary:** `user_profiles.role` (database)
2. **Secondary:** `auth.users.raw_user_meta_data.role` (metadata)
3. **Fallback:** `localStorage.user_role`

### **Route Protection:**

```tsx
// Candidate only
<ProtectedRoute allowedRoles={['candidate']}>
  <CandidateLayout />
</ProtectedRoute>

// Recruiter only
<ProtectedRoute allowedRoles={['recruiter']}>
  <RecruiterLayout />
</ProtectedRoute>

// Client only
<ProtectedRoute allowedRoles={['client']}>
  <ClientLayout />
</ProtectedRoute>
```

## 📝 localStorage Structure

```javascript
{
  isAuthenticated: 'true',
  user_id: 'uuid-from-supabase',
  user_email: 'user@example.com',
  user_name: 'John Doe',
  user_role: 'candidate' | 'recruiter' | 'client',
  candidate_id: '...',           // Optional
  backend_candidate_id: '...',   // Optional
  auth_token: '...'              // Optional
}
```

## ⚙️ Configuration

### **Environment Variables** (`.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.com
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### **Supabase Client Options**

```typescript
{
  auth: {
    autoRefreshToken: true,    // Auto-refresh expired tokens
    persistSession: true,      // Save session to localStorage
    detectSessionInUrl: true   // Detect session from URL
  }
}
```

## 🛡️ Security Features

1. **Password Validation:**
   - Minimum 6 characters
   - Confirmation matching

2. **Role Validation:**
   - Only valid roles accepted
   - Database constraints

3. **Route Protection:**
   - Authentication required
   - Role-based access
   - Automatic redirects

4. **Error Handling:**
   - User-friendly messages
   - No sensitive data exposure
   - Graceful fallbacks

5. **Session Management:**
   - Auto-refresh tokens
   - Secure session storage
   - Automatic cleanup on logout

## 🔍 Debugging

### **Check Auth State:**
```javascript
// In browser console
const { user, userRole, session } = useAuth()
console.log({ user, userRole, session })
```

### **Check localStorage:**
```javascript
console.log({
  isAuthenticated: localStorage.getItem('isAuthenticated'),
  user_role: localStorage.getItem('user_role'),
  user_email: localStorage.getItem('user_email')
})
```

### **Check Supabase Connection:**
```javascript
import { testSupabaseConnection } from './lib/supabase'
const result = await testSupabaseConnection()
console.log(result)
```

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Supabase client & auth functions |
| `src/context/AuthContext.tsx` | Global auth state management |
| `src/pages/auth/AuthPage.tsx` | Signup/Login UI |
| `src/components/ProtectedRoute.tsx` | Route protection |
| `src/App.tsx` | Route definitions |
| `supabase/migrations/001_create_user_profiles.sql` | Database schema |
| `.env` | Environment configuration |

## 🚀 Usage Examples

### **Sign Up:**
```typescript
const { signUp } = useAuth()
const { error } = await signUp('user@example.com', 'password123', {
  name: 'John Doe',
  role: 'candidate'
})
```

### **Sign In:**
```typescript
const { signIn } = useAuth()
const { error } = await signIn('user@example.com', 'password123')
```

### **Sign Out:**
```typescript
const { signOut } = useAuth()
await signOut()
```

### **Check Auth:**
```typescript
const { user, userRole, loading } = useAuth()

if (loading) return <Loading />
if (!user) return <Login />
if (userRole === 'candidate') return <CandidateDashboard />
```

## 🎯 Best Practices

1. **Always use `useAuth()` hook** - Don't access localStorage directly
2. **Use `ProtectedRoute`** - For all protected pages
3. **Handle loading states** - Check `loading` before rendering
4. **Validate roles** - Always check role before showing content
5. **Error handling** - Show user-friendly error messages
6. **Fallback gracefully** - System works even if Supabase is down

