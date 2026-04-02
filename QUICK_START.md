# Quick Start Guide - Investment Club App

## 🚀 Your App is Connected to Supabase!

The app is now fully integrated with Supabase for:

- ✅ **Authentication** - Secure user login/signup
- ✅ **Database** - Real-time data sharing across all devices
- ✅ **File Storage** - Upload and store PDF payment proofs
- ✅ **Multi-user Access** - All 91 members can access simultaneously

---

## Step 1: Initialize Demo Data (First Time Setup)

### ⚡ EASY METHOD - Use the App UI (Recommended)

1. **Load the app** in your browser
2. On the login screen, you'll see a blue card that says **"First Time Setup"**
3. Click the **"Initialize Demo Data"** button
4. Wait 30-60 seconds while it creates all users
5. Once complete, you'll see a success message with login credentials
6. The admin credentials will be automatically filled in
7. Click **"Login"** to access the admin dashboard!

That's it! ✨

### 📋 ALTERNATIVE METHOD - Use API Directly

If you prefer to use the API endpoint directly:

**Using Browser Console:**

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Paste and run this code:

```javascript
fetch('https://[YOUR-PROJECT-ID].supabase.co/functions/v1/make-server-f4ff8ddc/init-demo-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer [YOUR-ANON-KEY]'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

Replace `[YOUR-PROJECT-ID]` and `[YOUR-ANON-KEY]` with your actual Supabase credentials.

### Response Example:

```json
{
  "success": true,
  "message": "Demo data initialized successfully!",
  "admin": {
    "email": "admin@club.com",
    "password": "InvestClub2026!",
    "note": "Use these credentials to log in as admin"
  },
  "members": {
    "created": 91,
    "total": 91,
    "defaultPassword": "Member2026!",
    "note": "All members can log in with their email and this password"
  }
}
```

---

## Step 2: Login Credentials

### Admin Account:

- **Email**: `admin@club.com`
- **Password**: `InvestClub2026!`

### Member Accounts (all 91 members):

- **Email**: Auto-generated from name (e.g., `mduduzicibane@club.com`)
- **Password**: `Member2026!` (same for all members)

---

## Step 3: Test the App

### As Admin:

1. Log in with admin credentials
2. View all 91 members in the dashboard
3. See payment grid with checkmarks/X marks
4. Upload payment proofs for any member
5. Delete any payment proof
6. Edit member profiles
7. Export monthly reports as PDF
8. Send payment reminders

### As Member:

1. Log in with any member's email
2. View personal payment status
3. Upload payment proofs (up to 2 per month)
4. See completion rate and stats

---

## Step 4: Build for Production

When ready to deploy to Bluehost:

```bash
npm run build
```

This creates a `dist/` folder with all production files.

---

## Step 5: Deploy to Bluehost

Follow the complete deployment instructions in:
📄 **DEPLOYMENT_GUIDE.md**

Quick summary:

1. Create subdomain in Bluehost cPanel
2. Upload contents of `dist/` folder to subdomain
3. Create `.htaccess` file for React Router
4. Install SSL certificate
5. Share the URL with your investment club!

---

## Features Overview

### ✅ Authentication System

- Secure signup and login
- Separate admin and member access
- Session management with Supabase Auth

### ✅ Admin Dashboard

- View all 91 members
- Complete payment tracking grid
- Upload proofs for any member
- Delete any payment proof
- Edit member information
- Export monthly PDF reports
- Send payment reminders
- Real-time statistics

### ✅ Member Dashboard

- Personal 12-month payment grid
- Upload payment proofs (up to 2/month)
- View uploaded documents
- Check completion rate
- See outstanding payments

### ✅ Payment Management

- Visual grid (green ✓ = paid, red ✗ = unpaid)
- Multiple proofs per month (max 2)
- PDF file uploads to Supabase Storage
- View proofs in browser
- Delete individual proofs (admin only)

### ✅ Reporting

- Export monthly reports as PDF
- Includes member list with payment status
- 12-month overview grid
- Payment statistics and rates

### ✅ Reminders

- View members with outstanding payments
- See which months are unpaid
- Email reminder feature (coming soon)

---

## File Structure

```
/src/app/
├── App.tsx                        # Main app with Supabase integration
├── services/
│   └── api.ts                     # API client for backend
├── components/
│   ├── auth-screen.tsx            # Login/signup forms
│   ├── admin-dashboard.tsx        # Admin interface
│   ├── user-dashboard.tsx         # Member interface
│   ├── payment-grid.tsx           # 12-month visual grid
│   ├── member-detail-dialog.tsx   # Edit member & upload proofs
│   ├── reminder-dialog.tsx        # Outstanding payments
│   └── ui/                        # UI components
└── types.ts                       # TypeScript types

/supabase/functions/server/
├── index.tsx                      # Backend API routes
├── kv_store.tsx                   # Database utilities
└── init-demo.tsx                  # Demo data script
```

---

## API Endpoints

All endpoints are prefixed with:
`/make-server-f4ff8ddc/`

### Auth:

- `POST /signup` - Register new user
- `GET /me` - Get current user profile

### Users:

- `GET /users` - Get all users
- `PUT /users/:userId` - Update user profile

### Payments:

- `GET /payments` - Get all payment records
- `POST /payments/upload` - Upload payment proof
- `DELETE /payments/:userId/:month/:year/:proofId` - Delete proof

### Setup:

- `POST /init-demo-data` - Initialize all demo data

---

## Database Structure (KV Store)

### Users:

Key: `user:{userId}`

```json
{
  "id": "uuid",
  "email": "member@club.com",
  "name": "Member Name",
  "phone": "+27123456789",
  "isAdmin": false,
  "joinedAt": "2026-01-01T00:00:00.000Z"
}
```

### Payments:

Key: `payment:{userId}:{month}:{year}`

```json
{
  "id": "payment-uuid-0-2026",
  "userId": "uuid",
  "month": 0,
  "year": 2026,
  "proofs": [
    {
      "id": "proof-timestamp",
      "url": "https://signed-url",
      "fileName": "payment-proof.pdf",
      "uploadedAt": "2026-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## Support & Troubleshooting

### App won't load data?

- Check browser console (F12) for errors
- Verify you're logged in
- Refresh the page
- Check Supabase dashboard for auth issues

### Can't upload files?

- File must be PDF format
- Max size: 10MB per file
- Check internet connection
- Verify Supabase Storage bucket exists

### Login not working?

- Verify email and password
- Check if user type matches (admin vs member)
- Try password reset via Supabase dashboard

### Need to reset demo data?

- Delete all KV store entries via Supabase dashboard
- Re-run the init-demo-data endpoint
- All users will be recreated with random payment data

---

## Next Steps

1. ✅ Initialize demo data
2. ✅ Test as admin and member
3. ✅ Upload real PDF payment proofs
4. ✅ Build for production (`npm run build`)
5. ✅ Deploy to Bluehost
6. ✅ Share with investment club members!

---

## Security Notes

⚠️ **Important:**

- Change default passwords before production use
- The admin password is shared in this guide - change it immediately
- Enable HTTPS on Bluehost
- Consider implementing Row Level Security (RLS) for sensitive data
- Regular backups via Supabase dashboard

---

**🎉 Ready to go!** Your investment club management app is fully functional and ready for deployment!