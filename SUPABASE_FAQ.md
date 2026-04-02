# ❓ Supabase Connection - Frequently Asked Questions

## General Questions

### Q: Do I need to deploy the backend to use the app?

**A: No!** The app works immediately in Demo Mode using your browser's localStorage. You only need to deploy the backend when you want:
- Multiple devices to access the same data
- Data to persist across different browsers/computers
- File uploads to be stored permanently in the cloud
- Real production usage with your club members

Demo Mode is perfect for testing and development.

---

### Q: What happens to my demo data when I deploy to production?

**A: They are completely separate.**
- Demo data stays in your browser's localStorage
- Production data is stored in Supabase cloud
- Deploying the backend doesn't affect demo data
- You can switch between modes at any time

---

### Q: Can I go back to demo mode after deploying?

**A: Yes!** The app automatically detects the backend availability:
- Backend deployed and working → Production Mode
- Backend not responding → Demo Mode

You can "unpublish" the edge function to return to demo mode, or just test offline.

---

### Q: How much does Supabase cost?

**A: It's FREE for your use case!** 

Supabase Free Tier includes:
- 500MB database storage (you need ~50MB)
- 1GB file storage (plenty for PDFs)
- 500K Edge Function requests/month (you need ~30K/month)
- Unlimited auth users

You won't need to pay anything for a 91-member investment club.

---

## Deployment Questions

### Q: How long does deployment take?

**A: 2-5 minutes total:**
- Install CLI: 30 seconds
- Login: 30 seconds
- Link project: 30 seconds
- Deploy function: 1-3 minutes

Most time is spent on the initial function deployment.

---

### Q: Do I need to install anything on the server?

**A: No!** Supabase Edge Functions are serverless. You just:
1. Deploy from your local computer
2. Supabase hosts everything
3. Your app connects automatically

No server management, no hosting setup, no configuration files.

---

### Q: What if deployment fails?

**A: The app stays in Demo Mode.** You can:
1. Check the error message
2. Try the deployment again
3. Check logs: `supabase functions logs make-server-f4ff8ddc`
4. See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

The app will continue working in demo mode until deployment succeeds.

---

### Q: Can I deploy from Windows?

**A: Yes!** Use the `deploy-to-supabase.bat` script or follow manual steps. The Supabase CLI works on:
- Windows (via Scoop or npm)
- macOS (via Homebrew or npm)
- Linux (via apt/brew or npm)

---

### Q: Do I need a credit card for Supabase?

**A: No!** The free tier doesn't require a credit card. You only need:
1. Email address
2. Password
3. GitHub account (optional, for OAuth login)

---

## Technical Questions

### Q: Where is my data stored in production mode?

**A: In Supabase PostgreSQL database:**
- Users table (via KV store)
- Payments table (via KV store)
- Files in Supabase Storage buckets

All in your Supabase project: `heozvgsotrvfaucnkbvh`

---

### Q: Is my data secure?

**A: Yes!**
- HTTPS encryption for all API calls
- Private storage buckets (signed URLs only)
- Token-based authentication (Supabase Auth)
- CORS protection
- Authorization checks on all endpoints

See [README.md](./README.md#security-features) for full security details.

---

### Q: Can I use my own Supabase project?

**A: Yes!** You'll need to:
1. Create a new Supabase project
2. Update `/utils/supabase/info.tsx` with your project details
3. Deploy the edge function to your project
4. Update the health check URL in App.tsx

But the current project is already set up and ready to use!

---

### Q: What happens if Supabase goes down?

**A: The app automatically falls back to Demo Mode:**
1. App tries to reach backend
2. Health check fails
3. App switches to demo mode
4. Users can still access their local data

Once Supabase is back online, refresh the app to return to production mode.

---

### Q: How do I backup my data?

**A: Supabase provides automatic backups:**
- Database snapshots daily (free tier)
- Point-in-time recovery (paid tiers)
- Manual export via Supabase dashboard
- SQL dumps available

You can also export data via the API endpoints.

---

## Feature Questions

### Q: Can members access the app from their phones?

**A: Yes!** The app is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet browsers
- Mobile browsers (iOS Safari, Chrome Mobile)

No native mobile app needed - just open the URL in any browser.

---

### Q: How many files can each member upload?

**A: Up to 2 PDFs per month** (24 files per year per member).

This is a business rule enforced by the backend. You can change it by editing `/supabase/functions/server/index.tsx` line 249.

---

### Q: What's the maximum file size?

**A: 10MB per file** (configurable in backend).

Most bank statement PDFs are 100KB - 2MB, so 10MB is plenty. You can change this in `/supabase/functions/server/index.tsx` line 26.

---

### Q: Can I add more than 91 members?

**A: Yes!** The app supports unlimited members. The demo initialization creates exactly 91 members based on your initial requirements, but you can:
- Register more members via signup
- Create them programmatically via the API
- Initialize with different member lists

---

### Q: Can I customize the member list in demo initialization?

**A: Yes!** Edit the `memberNames` array in:
- Demo Mode: `/src/app/services/demo-api.ts` line ~150
- Production Mode: `/supabase/functions/server/index.tsx` line 365

Just add/remove names from the array.

---

## Troubleshooting Questions

### Q: Why does my app still show "DEMO MODE" after deployment?

**Possible causes:**
1. **Backend not deployed yet** - Run: `supabase functions deploy make-server-f4ff8ddc`
2. **Health check failing** - Test: `curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health`
3. **Browser cache** - Clear cache and refresh
4. **Network issue** - Check internet connection

**Solution:**
```bash
# Redeploy backend
supabase functions deploy make-server-f4ff8ddc

# Check health
curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health

# Should return: {"status":"ok"}
```

---

### Q: "Invalid login credentials" error?

**A: Initialize demo data first!**

1. Click "Initialize Demo Data" button on login screen
2. Wait for success message
3. Then login with:
   - Admin: `admin@club.com` / `InvestClub2026!`
   - Member: `mduduzicibane@club.com` / `Member2026!`
4. Check the "Login as Admin" box if logging in as admin

---

### Q: "Failed to fetch" errors?

**A: Backend not deployed.**

Run:
```bash
supabase functions deploy make-server-f4ff8ddc
```

Then refresh your app.

---

### Q: File upload not working?

**Check these:**
1. ✅ Backend is deployed
2. ✅ Storage bucket exists (auto-created on first deployment)
3. ✅ File is a PDF
4. ✅ File is under 10MB
5. ✅ You haven't already uploaded 2 files for that month

View logs:
```bash
supabase functions logs make-server-f4ff8ddc --follow
```

---

### Q: How do I view error logs?

**A: Use the Supabase CLI:**

```bash
# Stream live logs
supabase functions logs make-server-f4ff8ddc --follow

# View last 100 logs
supabase functions logs make-server-f4ff8ddc

# Or view in dashboard
# https://supabase.com/dashboard/project/heozvgsotrvfaucnkbvh/functions/make-server-f4ff8ddc/logs
```

---

### Q: Can I test production mode locally?

**A: Yes!** 

Deploy the backend, then:
1. Open http://localhost:5173 (or your dev server URL)
2. App will detect the deployed backend
3. Switches to production mode automatically
4. All API calls go to Supabase cloud

No need for local backend server!

---

## Bluehost Deployment Questions

### Q: Do I need to deploy the backend before deploying to Bluehost?

**A: No, but it's recommended:**

- Deploy backend → App uses production mode on Bluehost
- Don't deploy backend → App uses demo mode on Bluehost (single-browser only)

For a multi-user investment club, you should deploy the backend first.

---

### Q: What do I upload to Bluehost?

**A: Only the frontend (dist/ folder):**

1. Run: `npm run build`
2. Upload entire contents of `dist/` folder
3. Add `.htaccess` file for routing
4. Enable SSL certificate

The backend stays on Supabase, not Bluehost.

---

### Q: Do I need a database on Bluehost?

**A: No!** Your database is on Supabase. Bluehost only hosts the static HTML/JS/CSS files (the frontend).

---

### Q: Can I use a different host instead of Bluehost?

**A: Yes!** You can use:
- Netlify (free)
- Vercel (free)
- AWS S3 + CloudFront
- Any static hosting service

Just upload the `dist/` folder contents. The backend always stays on Supabase.

---

## Advanced Questions

### Q: Can I add more API endpoints?

**A: Yes!** Edit `/supabase/functions/server/index.tsx`:

```typescript
// Add new route
app.get("/make-server-f4ff8ddc/my-new-route", async (c) => {
  // Your code here
  return c.json({ message: "Hello!" });
});
```

Then redeploy:
```bash
supabase functions deploy make-server-f4ff8ddc
```

---

### Q: Can I use a real PostgreSQL database instead of KV store?

**A: Yes!** The KV store is just a simple wrapper around Supabase PostgreSQL. You can:
1. Create proper tables with SQL
2. Use Supabase's PostgreSQL directly
3. Implement Row Level Security (RLS)
4. Use migrations

But for your use case, the KV store is simpler and sufficient.

---

### Q: Can I add email notifications?

**A: Yes!** You can:
1. Use Supabase built-in email (limited)
2. Integrate SendGrid, Mailgun, etc.
3. Add email API to your Edge Function

Example:
```typescript
// In your edge function
import { SMTPClient } from "https://deno.land/x/denomailer/mod.ts";

// Send email
const client = new SMTPClient({ /* config */ });
await client.send({ /* email details */ });
```

---

### Q: Can I add SMS notifications?

**A: Yes!** Integrate Twilio or similar:

```typescript
// In your edge function
const response = await fetch("https://api.twilio.com/...", {
  method: "POST",
  headers: { Authorization: `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}` },
  body: JSON.stringify({ to: "+27123456789", message: "Payment due!" }),
});
```

Store Twilio credentials in Supabase secrets.

---

### Q: Can I export data to Excel?

**A: Yes!** You can:
1. Use a library like `xlsx` or `exceljs`
2. Generate Excel files in the backend
3. Return download links to frontend

Or export CSV from the admin dashboard (add this feature to `/src/app/utils/pdf-export.ts`).

---

## Migration Questions

### Q: How do I migrate from demo to production?

**A: They're separate, no migration needed:**

1. Deploy backend to Supabase
2. Initialize production data with "Initialize Demo Data"
3. Production data is created fresh in Supabase
4. Demo data remains in localStorage (untouched)

If you want to migrate demo data to production, you'd need to manually export/import.

---

### Q: Can I import existing member data?

**A: Yes!** Create a bulk import endpoint:

```typescript
// Add to /supabase/functions/server/index.tsx
app.post("/make-server-f4ff8ddc/import-members", async (c) => {
  const { members } = await c.req.json();
  
  for (const member of members) {
    // Create user
    await supabase.auth.admin.createUser({ /* ... */ });
    // Store profile
    await kv.set(`user:${userId}`, profile);
  }
  
  return c.json({ success: true });
});
```

Then call this endpoint with your CSV/Excel data.

---

## Performance Questions

### Q: How fast is the app?

**A:**
- **Demo Mode**: Instant (localStorage is synchronous)
- **Production Mode**: 100-300ms per API call (depends on location)
- **File Uploads**: 1-3 seconds for a 2MB PDF
- **Page Loads**: 1-2 seconds initial load

Supabase Edge Functions run on Deno Deploy, which is globally distributed.

---

### Q: Can it handle 91 concurrent users?

**A: Yes!** Supabase can handle:
- Thousands of concurrent connections
- Edge Functions scale automatically
- No need to manage servers

Your 91 members won't cause any performance issues.

---

### Q: What if we grow to 500 members?

**A: Still free tier!**
- Database usage: ~250MB (still under 500MB limit)
- API requests: ~5K/day (still under free tier)
- Storage: Depends on file uploads

You'd only need to upgrade if you upload hundreds of PDFs daily.

---

## Maintenance Questions

### Q: Do I need to update the backend regularly?

**A: No!** Once deployed, the backend runs indefinitely. Update only when:
- Adding new features
- Fixing bugs
- Changing business logic

Supabase handles all infrastructure updates automatically.

---

### Q: How do I update the backend after making code changes?

**A: Redeploy:**

```bash
supabase functions deploy make-server-f4ff8ddc
```

Changes are live immediately. No downtime.

---

### Q: Can I roll back to a previous version?

**A: Yes!** You can:
1. Keep previous code in git
2. Checkout old version
3. Redeploy

Or use Supabase's built-in versioning (dashboard → Functions → Versions).

---

## Support Questions

### Q: Where can I get help?

**A: Multiple resources:**

1. **This project**:
   - [SUPABASE_CONNECTION_GUIDE.md](./SUPABASE_CONNECTION_GUIDE.md)
   - [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
   - [README.md](./README.md)

2. **Supabase**:
   - Docs: https://supabase.com/docs
   - Discord: https://discord.supabase.com
   - GitHub: https://github.com/supabase/supabase

3. **General**:
   - React: https://react.dev
   - TypeScript: https://www.typescriptlang.org/docs

---

### Q: Can I hire someone to help with deployment?

**A: It's very simple!** But if needed:
1. Follow [SUPABASE_CONNECTION_GUIDE.md](./SUPABASE_CONNECTION_GUIDE.md)
2. Run `./deploy-to-supabase.sh`
3. It takes 5 minutes

No need to hire anyone - the guides are complete and the process is automated.

---

### Q: What if I break something?

**A: Easy to fix!**

1. **Demo mode still works** - Your browser data is safe
2. **Redeploy backend** - `supabase functions deploy make-server-f4ff8ddc`
3. **Check logs** - `supabase functions logs make-server-f4ff8ddc`
4. **Restore from backup** - Supabase has automatic backups

You can't really "break" anything permanently.

---

## Still Have Questions?

### Option 1: Check the Documentation
- [SUPABASE_CONNECTION_GUIDE.md](./SUPABASE_CONNECTION_GUIDE.md) - Full deployment guide
- [SUPABASE_VISUAL_GUIDE.md](./SUPABASE_VISUAL_GUIDE.md) - Visual architecture
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
- [README.md](./README.md) - Complete overview

### Option 2: Check Logs
```bash
supabase functions logs make-server-f4ff8ddc --follow
```

### Option 3: Test Health Check
```bash
curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
```

### Option 4: Join Supabase Discord
https://discord.supabase.com - Very active community!

---

## Quick Summary

✅ **App works now** in Demo Mode (no deployment)  
✅ **Deploy takes 5 minutes** (one command)  
✅ **Free tier is enough** for your club  
✅ **Auto-switches modes** (demo ↔ production)  
✅ **Comprehensive docs** (you're reading them!)  
✅ **Easy to maintain** (redeploy when needed)  
✅ **Secure & scalable** (Supabase handles it)  

**Ready to connect?** Run: `./deploy-to-supabase.sh` 🚀
