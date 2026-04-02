# ⚡ Deploy from VS Code - Complete Guide

Deploy your Investment Club app entirely from VS Code in **5-10 minutes**!

---

## 🚀 Quick Deploy (VS Code Terminal)

### Step 1: Open Integrated Terminal

- **Windows/Linux**: `Ctrl + ` (backtick)
- **Mac**: `Cmd + ` (backtick)
- Or: `View → Terminal`

### Step 2: Copy & Paste This Block

```bash
# Install deployment tools
npm install -g supabase netlify-cli

# Deploy backend to Supabase
supabase login
supabase link --project-ref heozvgsotrvfaucnkbvh
supabase functions deploy make-server-f4ff8ddc

# Build and deploy frontend to Netlify
npm run build
netlify deploy --prod --dir=dist
```

### Step 3: Follow Prompts

1. **Supabase login** - Browser opens, click "Allow"
2. **Enter database password** - From Supabase dashboard
3. **Netlify login** - Browser opens, authorize
4. **Create new site** - Accept defaults

**Done! You get a live URL!** 🎉

---

## 📦 **VS Code Extensions Method**

### Part A: Install Extensions

1. Open Extensions: `Ctrl+Shift+X` (Win/Linux) or `Cmd+Shift+X` (Mac)
2. Search and install:
   - ✅ **Netlify** (by Netlify)
   - ✅ **Supabase Snippets** (optional)
   - ✅ **Azure Functions** (optional, for function dev)

### Part B: Deploy Backend

Open Terminal in VS Code and run:

```bash
npm install -g supabase
supabase login
supabase link --project-ref heozvgsotrvfaucnkbvh
supabase functions deploy make-server-f4ff8ddc
```

### Part C: Deploy Frontend with Extension

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy with Netlify Extension:**
   - Press `Ctrl+Shift+P` (Command Palette)
   - Type: `Netlify: Deploy`
   - Select folder: `dist`
   - Choose: "Deploy to production"
   - ✅ Get your live URL!

---

## 🔄 **Best Method: Auto-Deploy with GitHub**

Set up once, then every `git push` auto-deploys!

### Setup (One Time - 10 minutes)

#### Step 1: Initialize Git in VS Code

If not already initialized:

1. Click **Source Control** icon (`Ctrl+Shift+G`)
2. Click **"Initialize Repository"**
3. Stage all files (click `+` next to Changes)
4. Commit: Enter message "Initial commit", click ✓

#### Step 2: Publish to GitHub

1. Click **"Publish Branch"** button in Source Control
2. Choose **"Publish to GitHub public repository"** (or private)
3. Select files to include (keep all selected)
4. Click OK
5. VS Code uploads to GitHub ✅

#### Step 3: Connect Netlify to GitHub

1. Open https://app.netlify.com in browser
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Authorize Netlify (if first time)
5. Select your repository
6. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click **"Deploy site"**
7. Wait 2-3 minutes for first deploy
8. ✅ Get your live URL!

#### Step 4: Deploy Backend (Terminal)

```bash
supabase login
supabase link --project-ref heozvgsotrvfaucnkbvh
supabase functions deploy make-server-f4ff8ddc
```

### Future Updates (30 seconds!)

After any code changes in VS Code:

1. **Source Control** (`Ctrl+Shift+G`)
2. Stage changes (click `+`)
3. Enter commit message
4. Click ✓ to commit
5. Click **"Sync Changes"** (or push icon)
6. Netlify auto-deploys! ✨

**Backend updates:**
```bash
supabase functions deploy make-server-f4ff8ddc
```

---

## 🎨 **VS Code Tasks (Advanced)**

Create automated tasks for one-click deployment!

### Create `.vscode/tasks.json`:

1. Press `Ctrl+Shift+P`
2. Type: `Tasks: Configure Task`
3. Select: `Create tasks.json from template`
4. Choose: `Others`
5. Replace content with:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Build App",
      "type": "shell",
      "command": "npm run build",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Deploy Backend",
      "type": "shell",
      "command": "supabase functions deploy make-server-f4ff8ddc",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Deploy Frontend",
      "type": "shell",
      "command": "netlify deploy --prod --dir=dist",
      "dependsOn": ["Build App"],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Deploy Full App",
      "dependsOn": ["Deploy Backend", "Deploy Frontend"],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Check Backend Health",
      "type": "shell",
      "command": "curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

### Run Tasks:

- Press `Ctrl+Shift+P`
- Type: `Tasks: Run Task`
- Choose:
  - **"Build App"** - Build only
  - **"Deploy Backend"** - Deploy backend only
  - **"Deploy Frontend"** - Build + deploy frontend
  - **"Deploy Full App"** - Deploy everything
  - **"Check Backend Health"** - Test backend

---

## 🔧 **VS Code Scripts Setup**

Add these to your `package.json` scripts section:

```json
{
  "scripts": {
    "build": "vite build",
    "deploy:backend": "supabase functions deploy make-server-f4ff8ddc",
    "deploy:frontend": "npm run build && netlify deploy --prod --dir=dist",
    "deploy:all": "npm run deploy:backend && npm run deploy:frontend",
    "check:backend": "curl https://heozvgsotrvfaucnkbvh.supabase.co/functions/v1/make-server-f4ff8ddc/health"
  }
}
```

### Run from VS Code:

1. Open `package.json`
2. Click **"Run Script"** button next to any script
3. Or use NPM Scripts panel in Explorer

---

## 🎯 **Recommended VS Code Workflow**

### First Time Setup:

```bash
# In VS Code Terminal
npm install -g supabase netlify-cli
supabase login
supabase link --project-ref heozvgsotrvfaucnkbvh
supabase functions deploy make-server-f4ff8ddc
npm run build
netlify deploy --prod --dir=dist
```

**Time: 5-10 minutes**

### Daily Development:

1. Make changes in VS Code
2. Save files (`Ctrl+S`)
3. Test locally (if dev server running)
4. **Commit & Push** (Source Control panel)
5. Netlify auto-deploys! ✨

### Update Backend:

```bash
# In VS Code Terminal
supabase functions deploy make-server-f4ff8ddc
```

---

## 📱 **Shortcuts in VS Code**

| Action | Shortcut | Command |
|--------|----------|---------|
| Open Terminal | `Ctrl+` ` | View: Toggle Terminal |
| Command Palette | `Ctrl+Shift+P` | Show All Commands |
| Source Control | `Ctrl+Shift+G` | View: Show Source Control |
| Run Task | `Ctrl+Shift+P` → `task` | Tasks: Run Task |
| New Terminal | `Ctrl+Shift+` ` | Terminal: Create New |
| Search Files | `Ctrl+P` | Go to File |

---

## 🐛 **Troubleshooting in VS Code**

### Terminal not working?

1. `Ctrl+Shift+P`
2. Type: `Terminal: Select Default Profile`
3. Choose: `PowerShell` (Win), `bash` (Mac/Linux)
4. Restart terminal

### Build fails?

```bash
# In VS Code Terminal
rm -rf node_modules dist
npm install
npm run build
```

### Can't run global commands?

Windows PowerShell may block scripts. Run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Git not working?

Install Git: https://git-scm.com/downloads  
Restart VS Code after installation.

---

## 📚 **Recommended VS Code Extensions**

Install these for better development:

1. **Netlify** - One-click deployment
2. **Supabase Snippets** - Code snippets
3. **ES7+ React/Redux** - React snippets
4. **Tailwind CSS IntelliSense** - Tailwind autocomplete
5. **Prettier** - Code formatting
6. **GitLens** - Git integration
7. **Error Lens** - Inline error display
8. **Thunder Client** - API testing (alternative to Postman)

---

## ✅ **Complete Checklist**

- [ ] Open VS Code
- [ ] Open integrated terminal (`Ctrl+` `)
- [ ] Install tools: `npm install -g supabase netlify-cli`
- [ ] Login to Supabase: `supabase login`
- [ ] Link project: `supabase link --project-ref heozvgsotrvfaucnkbvh`
- [ ] Deploy backend: `supabase functions deploy make-server-f4ff8ddc`
- [ ] Build app: `npm run build`
- [ ] Deploy frontend: `netlify deploy --prod --dir=dist`
- [ ] Open live URL
- [ ] Click "Initialize Demo Data"
- [ ] Login as admin
- [ ] Test features
- [ ] Share URL with members

---

## 🎉 **You're Live!**

Your investment club app is now deployed from VS Code!

**Deploy Time:** 5-10 minutes  
**Monthly Cost:** $0 (free tiers)  
**Future Updates:** 30 seconds (git push)  

---

## 📖 **More Resources**

- **VS Code Docs**: https://code.visualstudio.com/docs
- **Netlify CLI**: https://docs.netlify.com/cli/get-started/
- **Supabase CLI**: https://supabase.com/docs/reference/cli
- **Full Deploy Guide**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Happy deploying from VS Code! 🚀**
