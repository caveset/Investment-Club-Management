# Bluehost Deployment Guide

## Investment Club Management App - Production Deployment

This guide explains how to deploy your Investment Club Management app to Bluehost with Supabase as the backend database.

---

## Overview

**Architecture:**
- **Frontend**: React SPA (Single Page Application) - hosted on Bluehost
- **Backend**: Supabase Edge Functions + PostgreSQL Database
- **Storage**: Supabase Storage for PDF payment proofs
- **Auth**: Supabase Authentication

---

## Part 1: Supabase Setup

### 1.1 Your Supabase Project is Ready!
✅ The backend server is already deployed and running
✅ Database (KV store) is configured
✅ File storage bucket will be created automatically
✅ Authentication is enabled

### 1.2 Create Your First Admin User
Once deployed, you'll need to create an admin account:

1. Open your app in a browser
2. Click "Sign Up" on the auth screen
3. Register with your admin email and password
4. After creating the account, you need to manually mark it as admin:

**Option A - Via Supabase Dashboard:**
- Go to your Supabase project dashboard
- Navigate to Database → Tables → kv_store_f4ff8ddc
- Find the record with key starting with `user:` for your account
- Edit the JSON value and set `isAdmin: true`

**Option B - Via API (recommended for first admin):**
You can create an admin user programmatically by modifying the signup endpoint temporarily or using the Supabase dashboard.

---

## Part 2: Build the React App

### 2.1 Build for Production

From your project root, run:

```bash
npm run build
```

This creates a `dist/` folder with your production-ready files:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
```

---

## Part 3: Bluehost Setup

### 3.1 Create a Subdomain

1. **Log in to Bluehost cPanel**
2. Go to **Domains** → **Subdomains**
3. Create your subdomain (e.g., `investmentclub.yourdomain.com`)
4. Set the document root (e.g., `/home/username/public_html/investmentclub`)

### 3.2 Upload Files to Bluehost

**Method 1: File Manager (Easy)**
1. In cPanel, go to **File Manager**
2. Navigate to your subdomain's document root
3. Upload ALL contents from your `dist/` folder
4. Make sure `index.html` is in the root of the subdomain folder

**Method 2: FTP (Recommended for large files)**
1. Get FTP credentials from Bluehost (cPanel → FTP Accounts)
2. Use an FTP client like FileZilla
3. Connect to your server
4. Upload the entire contents of `dist/` to the subdomain folder

**Method 3: cPanel File Manager (Upload & Extract)**
1. Zip your `dist/` folder contents
2. Upload the ZIP file via File Manager
3. Extract it in the correct directory

### 3.3 Configure .htaccess for React Router

Create a `.htaccess` file in your subdomain root:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Part 4: Test Your Deployment

### 4.1 Access Your App
Visit: `https://investmentclub.yourdomain.com`

### 4.2 Test Key Features

✅ **Authentication:**
- Sign up a new user
- Log in with existing credentials
- Log out

✅ **Admin Functions:**
- View all members
- Edit member profiles
- Upload payment proofs for any member
- Delete payment proofs
- Export monthly reports as PDF
- Send reminders for outstanding payments

✅ **Member Functions:**
- View personal payment grid (12 months)
- Upload payment proofs (up to 2 per month)
- View uploaded proofs
- Check completion rate

### 4.3 Test File Uploads
1. Log in as a member or admin
2. Upload a PDF payment proof
3. Verify the file uploads to Supabase Storage
4. Click "View" to open the PDF in a new tab

---

## Part 5: Configure SSL (HTTPS)

Bluehost usually provides free SSL certificates:

1. In cPanel, go to **Security** → **SSL/TLS**
2. Install a free **Let's Encrypt** SSL certificate
3. Enable **Force HTTPS Redirect**

---

## Part 6: Ongoing Maintenance

### 6.1 Monitor Your App
- Check Supabase dashboard for usage stats
- Monitor storage usage (10MB limit per file)
- Review authentication logs

### 6.2 Backup Your Data
**Via Supabase Dashboard:**
1. Go to Database → Backups
2. Download regular backups
3. Export user data via SQL queries if needed

### 6.3 Update the App
When you make changes:
1. Update your code
2. Run `npm run build`
3. Upload new `dist/` contents to Bluehost
4. Clear browser cache to see changes

---

## Part 7: Important Security Notes

### 7.1 Environment Variables
Your Supabase credentials are embedded in the build. For production apps with sensitive data:
- Consider using environment variables
- Implement Row Level Security (RLS) in Supabase
- Use Supabase's built-in security features

### 7.2 Data Protection
⚠️ **Important:** This app handles financial data. Ensure:
- Regular backups
- Strong password policies
- HTTPS is always enabled
- Compliance with local data protection laws

### 7.3 Supabase Row Level Security (RLS)
Currently, the app uses the KV store which doesn't have RLS. For production:
- Consider migrating to Supabase tables with RLS
- Implement proper authorization checks
- Limit what non-admin users can access

---

## Part 8: Troubleshooting

### Issue: White screen after deployment
**Solution:**
- Check browser console for errors
- Verify `.htaccess` file exists
- Ensure all files from `dist/` are uploaded
- Check file permissions (644 for files, 755 for folders)

### Issue: API calls failing
**Solution:**
- Check Network tab in browser DevTools
- Verify Supabase URL and Anon Key are correct
- Check CORS settings in Supabase Edge Function

### Issue: File uploads not working
**Solution:**
- Check Supabase Storage bucket exists
- Verify file size is under 10MB
- Check browser console for specific error messages

### Issue: Login not working
**Solution:**
- Verify user exists in Supabase Auth
- Check that `email_confirm` was set to true during signup
- Try password reset via Supabase dashboard

---

## Part 9: Adding More Members

### Option 1: Bulk Import (Recommended)
Create a CSV file with member data and use Supabase dashboard to bulk insert users.

### Option 2: Admin Panel
Have your admin user sign up all 91 members via the registration form.

### Option 3: Self-Registration
Send the app URL to all members and have them sign up themselves.

---

## Quick Deployment Checklist

- [ ] Run `npm run build` to create production files
- [ ] Create subdomain in Bluehost cPanel
- [ ] Upload `dist/` contents to subdomain folder
- [ ] Create `.htaccess` file for React Router
- [ ] Install SSL certificate
- [ ] Test authentication (signup/login)
- [ ] Create first admin user
- [ ] Test file upload functionality
- [ ] Test all admin features
- [ ] Test all member features
- [ ] Share URL with investment club members

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Bluehost Support**: https://www.bluehost.com/help
- **React Deployment**: https://create-react-app.dev/docs/deployment/

---

## Need Help?

If you encounter issues:
1. Check browser console (F12 → Console)
2. Check Network tab for API errors
3. Review Supabase Edge Function logs
4. Verify all files are uploaded correctly
5. Test on a different browser/device

---

**🎉 Congratulations!** Your Investment Club Management app is now live and accessible to all members!
