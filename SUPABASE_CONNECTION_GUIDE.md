# 🚀 Supabase Connection Guide

Your Investment Club app is ready to connect to Supabase! Follow these simple steps to deploy the backend and switch from Demo Mode to Production Mode.

## ✅ What's Already Done

- ✅ Supabase project created: `heozvgsotrvfaucnkbvh`
- ✅ Backend server code ready at `/supabase/functions/server/index.tsx`
- ✅ Frontend configured to auto-detect backend
- ✅ Authentication, file storage, and database all configured
- ✅ Demo mode working perfectly (using localStorage)

## 📋 Prerequisites

1. **Install Supabase CLI** (if not already installed):
   ```bash
   # macOS/Linux
   brew install supabase/tap/supabase
   
   # Windows
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   
   # Or use npm
   npm install -g supabase
   ```

2. **Verify Installation**:
   ```bash
   supabase --version
   ```

## 🔐 Step 1: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate with Supabase. If you don't have an account, create one at https://supabase.com

## 🔗 Step 2: Link to Your Project

```bash
supabase link --project-ref heozvgsotrvfaucnkbvh
```

When prompted for the database password, enter your Supabase project database password. If you don't know it, you can reset it in the Supabase dashboard at:
https://supabase.com/dashboard/project/heozvgsotrvfaucnkbvh/settings/database

## 🚀 Step 3: Deploy the Backend

```bash
supabase functions deploy make-server-f4ff8ddc
```

This command will:
- Package your backend code
- Upload it to Supabase Edge Functions
- Make it available at: `https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc`

## ✨ Step 4: That's It!

Once deployed, refresh your app in the browser. It will:
1. Auto-detect the backend is available
2. Switch from Demo Mode to Production Mode
3. Show a green "✅ PRODUCTION MODE" indicator in the console
4. Store all data in your Supabase database

## 🎯 Using the App After Deployment

### Initialize Production Data

1. Open your app in the browser
2. You should see the app WITHOUT the yellow "DEMO MODE" banner
3. Click "Initialize Demo Data" to create:
   - 1 admin account: `admin@club.com` / `InvestClub2026!`
   - 91 member accounts (all with password: `Member2026!`)

### Admin Login
- **Email**: `admin@club.com`
- **Password**: `InvestClub2026!`

### Member Login
Any member can log in using their email (e.g., `mduduzicibane@club.com`) with password: `Member2026!`

## 🔍 Verify Deployment

Check if your backend is live:

```bash
curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
```

You should see: `{"status":"ok"}`

Or open this URL in your browser:
https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health

## 📊 Monitor Your Backend

View logs and monitor your function:
```bash
supabase functions logs make-server-f4ff8ddc
```

Or visit the Supabase dashboard:
https://supabase.com/dashboard/project/heozvgsotrvfaucnkbvh/functions/make-server-f4ff8ddc/logs

## 🛠️ Troubleshooting

### Backend Not Responding

1. **Check Deployment Status**:
   ```bash
   supabase functions list
   ```
   Ensure `make-server-f4ff8ddc` is listed and deployed.

2. **Check Logs**:
   ```bash
   supabase functions logs make-server-f4ff8ddc --follow
   ```

3. **Redeploy**:
   ```bash
   supabase functions deploy make-server-f4ff8ddc --no-verify-jwt
   ```

### Environment Variables

Your backend automatically has access to:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_SERVICE_ROLE_KEY`: For admin operations
- `SUPABASE_ANON_KEY`: For client operations

No additional configuration needed!

### Still in Demo Mode?

If the app still shows "DEMO MODE" after deployment:

1. Open browser console (F12)
2. Look for connection errors
3. Verify health check works: https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
4. Clear browser cache and refresh

## 🔄 Updating Backend Code

After making changes to `/supabase/functions/server/index.tsx`, redeploy:

```bash
supabase functions deploy make-server-f4ff8ddc
```

Changes are live immediately!

## 📦 What Gets Deployed

The deployment includes:
- `/supabase/functions/server/index.tsx` - Main server with all routes
- `/supabase/functions/server/kv_store.tsx` - Database helpers

These files are bundled and deployed as a single Edge Function.

## 🎉 Features Available in Production

Once connected to Supabase:

✅ **User Management**
- Admin and member accounts
- Secure authentication with Supabase Auth
- Profile management

✅ **Payment Tracking**
- 12-month payment grid
- Visual status indicators (green ✓ for paid, red ✗ for unpaid)
- Payment history for all members

✅ **File Uploads**
- PDF proof of payment uploads
- Up to 2 proofs per month per member
- Secure storage in Supabase Storage
- Auto-generated signed URLs

✅ **Admin Features**
- View all members and their payments
- Add proofs for any member
- Edit member information
- Delete any proof of payment
- Export monthly reports as PDFs

✅ **Member Features**
- View personal payment history
- Upload payment proofs
- View all club members
- See contribution statistics

## 🌐 Deploying Frontend to Bluehost

After backend is deployed:

1. Build your frontend:
   ```bash
   npm run build
   ```

2. Upload the contents of the `dist/` folder to your Bluehost subdomain via FTP or cPanel File Manager

3. The app will automatically connect to your Supabase backend!

## 💡 Tips

- **Demo Mode is still available**: If backend deployment fails, the app automatically falls back to demo mode
- **No data migration needed**: Demo data is separate from production data
- **Test locally**: Demo mode is perfect for testing new features before deploying
- **Logs are your friend**: Always check logs when debugging issues

## 🆘 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Edge Functions Guide: https://supabase.com/docs/guides/functions

---

**Ready to go live?** Just run:
```bash
supabase functions deploy make-server-f4ff8ddc
```
