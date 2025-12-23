# Supabase Configuration Update

## ✅ Completed

The Supabase configuration has been updated with your new credentials:

- **URL**: `https://smcgaaecckvngkhvsanb.supabase.co`
- **Anon Key**: `sb_publishable_oVHMsD6OZGCWlXvynx4uIw_Keb2YASw`

The `.env` file has been created in the `frontend` directory with these credentials.

## 📋 Next Steps

### 1. Run Database Migration on New Supabase Instance

You need to run the migration to create the `user_profiles` table on your new Supabase instance:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `smcgaaecckvngkhvsanb`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the contents of `frontend/supabase/migrations/001_create_user_profiles.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration

4. **Verify the Migration**
   - Go to "Table Editor" in the left sidebar
   - You should see the `user_profiles` table created
   - Verify it has the correct columns: `id`, `email`, `full_name`, `role`, etc.

### 2. Update Vercel Environment Variables (If Deployed)

If your frontend is deployed on Vercel, update the environment variables:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Update Environment Variables**
   - Go to Settings → Environment Variables
   - Update or add:
     - `VITE_SUPABASE_URL` = `https://smcgaaecckvngkhvsanb.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_oVHMsD6OZGCWlXvynx4uIw_Keb2YASw`
   - Apply to: Production, Preview, and Development

3. **Redeploy**
   - After updating variables, trigger a new deployment
   - Or wait for the next automatic deployment

### 3. Test Locally

1. **Restart Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Signup/Login**
   - Try creating a new account
   - Verify the user profile is created in Supabase
   - Test login functionality

### 4. Verify Row Level Security (RLS)

Make sure RLS policies are set correctly:

1. **Check RLS Policies**
   - In Supabase Dashboard → Authentication → Policies
   - Verify policies exist for `user_profiles` table:
     - Users can view own profile
     - Users can update own profile
     - Service role has full access

2. **Test Permissions**
   - Try accessing user profiles from the frontend
   - Verify users can only see their own profile

## 🔍 Verification Checklist

- [ ] Migration `001_create_user_profiles.sql` executed successfully
- [ ] `user_profiles` table exists in Supabase
- [ ] RLS policies are enabled and configured
- [ ] Environment variables updated in Vercel (if deployed)
- [ ] Local development server restarted
- [ ] Signup creates user profile successfully
- [ ] Login retrieves user role correctly
- [ ] User can access their dashboard based on role

## 📝 Important Notes

1. **Old Supabase Data**: If you had users in the old Supabase instance, they won't be migrated automatically. Users will need to sign up again on the new instance.

2. **Database Triggers**: The migration includes a trigger that automatically creates a user profile when a new user signs up. This should work automatically after the migration.

3. **Environment Variables**: The `.env` file is in `.gitignore` and won't be committed to git. Make sure to update environment variables in your deployment platform (Vercel, etc.).

## 🆘 Troubleshooting

### Migration Fails
- Check if you have the correct permissions in Supabase
- Verify the SQL syntax is correct
- Check Supabase logs for error messages

### Signup/Login Not Working
- Verify environment variables are set correctly
- Check browser console for errors
- Verify Supabase project is active and not paused
- Check network tab for API calls to Supabase

### Profile Not Created
- Check if the trigger `on_auth_user_created` exists
- Verify the trigger function `handle_new_user()` is created
- Check Supabase logs for trigger execution errors

## 📚 Related Files

- `frontend/src/lib/supabase.ts` - Supabase client configuration
- `frontend/src/pages/auth/AuthPage.tsx` - Authentication logic
- `frontend/supabase/migrations/001_create_user_profiles.sql` - Database migration
- `frontend/supabase/update_existing_users.sql` - Script to sync existing users

