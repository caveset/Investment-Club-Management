# 🔧 Troubleshooting Guide

## "Failed to fetch" Error When Initializing Demo Data

### ❌ Problem
When clicking "Initialize Demo Data", you get: `TypeError: Failed to fetch`

### 🔍 Root Cause
The **Supabase Edge Function is not deployed yet**. The frontend is trying to call your backend server at:
```
https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/init-demo-data
```

But this function doesn't exist on Supabase yet because it only exists in your local code.

---

## ✅ Solution: Deploy the Edge Function

You need to deploy your backend server code to Supabase. Here's how:

### Step 1: Install Supabase CLI

**On macOS:**
```bash
brew install supabase/tap/supabase
```

**On Windows (with Scoop):**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

**On Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/supabase/cli/main/install.sh | sh
```

### Step 2: Login to Supabase
```bash
supabase login
```

This will open your browser and ask you to authorize the CLI.

### Step 3: Link Your Project
```bash
supabase link --project-ref heozvgsotrvfaucnkbvh
```

You'll be asked for your database password. Find it in your Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **Database**
4. Copy the password (or reset it if needed)

### Step 4: Deploy the Edge Function
```bash
supabase functions deploy make-server-f4ff8ddc
```

This will upload your backend code from `/supabase/functions/server/` to Supabase.

### Step 5: Verify Deployment

Visit the Edge Function URL in your browser:
```
https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
```

You should see: `{"status":"ok"}`

If you see this, your backend is deployed! ✅

### Step 6: Test Demo Data Initialization

Now reload your app and click **"Initialize Demo Data"** again. It should work!

---

## 🔑 Setting Environment Variables (If Needed)

Your Edge Function needs these environment variables (they're auto-configured by Supabase):
- `SUPABASE_URL` - Auto-set by Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Auto-set by Supabase
- `SUPABASE_ANON_KEY` - Auto-set by Supabase

You don't need to set these manually.

---

## 🚀 Alternative: Use Supabase Dashboard to Deploy

If you prefer not to use the CLI:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** in the left sidebar
4. Click **"Create a new function"**
5. Name it: `make-server-f4ff8ddc`
6. Copy the entire contents of `/supabase/functions/server/index.tsx`
7. Paste it into the editor
8. Click **"Deploy"**

Note: You'll also need to upload `kv_store.tsx` as a dependency.

---

## 📋 Quick Checklist

Before testing the app, make sure:

- [ ] Supabase CLI is installed
- [ ] You're logged in: `supabase login`
- [ ] Project is linked: `supabase link --project-ref heozvgsotrvfaucnkbvh`
- [ ] Function is deployed: `supabase functions deploy make-server-f4ff8ddc`
- [ ] Health check works: Visit `/health` endpoint
- [ ] Click "Initialize Demo Data" in the app

---

## 🔍 Other Common Errors

### Error: "User already registered"
**Cause:** You've already created a user with that email.  
**Solution:** Try logging in instead, or use a different email.

### Error: "Invalid login credentials"
**Cause:** User doesn't exist yet, or wrong password.  
**Solution:** 
1. Make sure you've initialized demo data first
2. Use correct credentials: `admin@club.com` / `InvestClub2026!`
3. Check the "Login as Admin" checkbox

### Error: "Unauthorized"
**Cause:** Not logged in, or session expired.  
**Solution:** Log out and log back in.

### Error: "Failed to upload payment proof"
**Cause:** Storage bucket doesn't exist, or file is too large (>10MB).  
**Solution:** 
1. Make sure your Edge Function has run at least once (it creates the bucket on startup)
2. Check file size is under 10MB
3. Verify file is a PDF

### Console shows "CORS error"
**Cause:** Edge Function not deployed, or CORS not configured.  
**Solution:** Deploy the Edge Function. CORS is already configured in the code.

---

## 🆘 Still Having Issues?

### Check Supabase Edge Function Logs

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Edge Functions** → **make-server-f4ff8ddc**
4. Click **"Logs"** tab
5. Look for errors or request logs

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for red errors
4. Check **Network** tab to see failed requests

### Verify Environment

Make sure you're using the correct Supabase project:
```
Project ID: heozvgsotrvfaucnkbvh
URL: https://heozvgsotrvfaucnkbvh.supabase.co
```

---

## 📚 Resources

- **Supabase CLI Docs:** https://supabase.com/docs/guides/cli
- **Edge Functions Docs:** https://supabase.com/docs/guides/functions
- **Supabase Dashboard:** https://supabase.com/dashboard

---

## ✨ Success Indicators

When everything is working correctly, you should see:

1. ✅ Health check returns `{"status":"ok"}`
2. ✅ "Initialize Demo Data" button creates users
3. ✅ Login with admin credentials works
4. ✅ Dashboard loads with 91 members
5. ✅ Payment grid displays correctly
6. ✅ File uploads work

---

**Need more help?** Check the console logs and Edge Function logs for detailed error messages!
