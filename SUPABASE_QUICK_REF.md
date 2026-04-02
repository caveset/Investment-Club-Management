# 🚀 Quick Supabase Connection Reference

## Your Supabase Project

- **Project ID**: `heozvgsotrvfaucnkbvh`
- **Health Check**: https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
- **Dashboard**: https://supabase.com/dashboard/project/heozvgsotrvfaucnkbvh

## One-Command Deployment

### Linux/macOS:
```bash
chmod +x deploy-to-supabase.sh
./deploy-to-supabase.sh
```

### Windows:
```bash
deploy-to-supabase.bat
```

## Manual Deployment (4 Commands)

```bash
# 1. Install CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link project
supabase link --project-ref heozvgsotrvfaucnkbvh

# 4. Deploy
supabase functions deploy make-server-f4ff8ddc
```

## Verify It's Working

1. **Check Health**:
   ```bash
   curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health
   ```
   Expected: `{"status":"ok"}`

2. **Check App**:
   - Open your app in browser
   - Look for: `✅ PRODUCTION MODE` in console
   - No yellow "DEMO MODE" banner should appear

3. **Initialize Data**:
   - Click "Initialize Demo Data" button
   - Wait for success message
   - Login with: `admin@club.com` / `InvestClub2026!`

## View Logs

```bash
# Stream live logs
supabase functions logs make-server-f4ff8ddc --follow

# View last 100 logs
supabase functions logs make-server-f4ff8ddc
```

## Common Issues

### Issue: "Project not linked"
**Solution**: 
```bash
supabase link --project-ref heozvgsotrvfaucnkbvh
```

### Issue: "Not logged in"
**Solution**: 
```bash
supabase login
```

### Issue: App still shows "DEMO MODE"
**Solutions**:
1. Verify health check returns `{"status":"ok"}`
2. Clear browser cache
3. Check browser console for errors
4. Redeploy: `supabase functions deploy make-server-f4ff8ddc`

### Issue: "Failed to fetch"
**Solution**: Backend not deployed yet. Run:
```bash
supabase functions deploy make-server-f4ff8ddc
```

## Update Backend After Changes

Anytime you modify `/supabase/functions/server/index.tsx`:

```bash
supabase functions deploy make-server-f4ff8ddc
```

Changes are live immediately!

## Useful Commands

```bash
# List all functions
supabase functions list

# Delete a function
supabase functions delete make-server-f4ff8ddc

# Check CLI version
supabase --version

# Get help
supabase functions deploy --help
```

## Environment Variables

Your function automatically has access to:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

No need to configure anything!

## Storage Bucket

Your backend automatically creates:
- **Bucket Name**: `make-f4ff8ddc-payment-proofs`
- **Type**: Private (signed URLs)
- **Max File Size**: 10MB
- **Allowed**: PDF files

## After Successful Deployment

1. ✅ Backend is live on Supabase Edge Functions
2. ✅ App automatically switches to Production Mode
3. ✅ Data is stored in Supabase PostgreSQL
4. ✅ Files are stored in Supabase Storage
5. ✅ Multiple users can access simultaneously
6. ✅ Data persists across devices

## Next Steps

1. **Test**: Open app, click "Initialize Demo Data"
2. **Login**: Use admin@club.com / InvestClub2026!
3. **Upload**: Test file upload with a real PDF
4. **Deploy Frontend**: Build and upload to Bluehost
5. **Share**: Give URL to club members

## Support

- 📖 Full Guide: [SUPABASE_CONNECTION_GUIDE.md](./SUPABASE_CONNECTION_GUIDE.md)
- 🐛 Troubleshooting: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📚 Supabase Docs: https://supabase.com/docs
- 💬 Supabase Discord: https://discord.supabase.com

---

**Remember**: Your app works in DEMO MODE right now with no deployment. Deploy to Supabase only when you're ready for multi-user production access!
