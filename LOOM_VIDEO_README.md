# 🎥 Nango Next.js Integration Demo

## Video Overview

This video demonstrates a **complete, production-ready implementation** of Nango in a Next.js application with GitHub and Slack integrations.

---

## 🎯 What You'll See

### ✨ Features Demonstrated

- **🔐 OAuth Made Simple** - Connect to GitHub & Slack with just 2 lines of code
- **🔄 Automated Data Syncing** - Background sync for issues, PRs, messages, and channels
- **💻 Clean Architecture** - Modern Next.js 14 with TypeScript and App Router
- **🎨 Beautiful UI** - Responsive design with Tailwind CSS
- **🛠️ Production Ready** - Error handling, type safety, and best practices

### 🏗️ Tech Stack

```
Frontend:  Next.js 14, TypeScript, Tailwind CSS
Backend:   Next.js API Routes, Nango Node SDK
APIs:      GitHub, Slack (via Nango)
Auth:      OAuth 2.0 (handled by Nango)
```

---

## 📊 Project Stats

| Metric | Value |
|--------|-------|
| **Setup Time** | ~5 minutes |
| **Lines of Code** | ~500 LOC |
| **OAuth Implementation** | 2 lines! |
| **Integrations** | 2 (expandable to 100+) |
| **Type Safety** | 100% TypeScript |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone [your-repo-url]
cd nango-nextjs-demo

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Add your Nango secret key to .env

# 4. Run the app
npm run dev

# 5. Open browser
open http://localhost:3000
```

---

## 🎬 Video Chapters

| Time | Topic |
|------|-------|
| 0:00 | Introduction & Overview |
| 2:00 | Project Structure |
| 4:00 | Environment Setup |
| 7:00 | Live Demo - Connecting to GitHub |
| 10:00 | Testing API Connection |
| 12:00 | Code Walkthrough |
| 15:00 | Custom Sync Scripts |
| 16:00 | Wrap Up & Resources |

---

## 📁 Key Files Shown in Video

```
nango-nextjs-demo/
├── .env                          # Environment variables
├── app/
│   ├── page.tsx                  # Main UI with connection flow
│   └── api/nango/
│       ├── connections/route.ts  # List/manage connections
│       └── test/route.ts         # Test API calls
├── components/
│   ├── ConnectionCard.tsx        # Display active connections
│   └── IntegrationsList.tsx      # Available integrations
├── lib/
│   ├── nango-client.ts          # Frontend Nango setup
│   └── nango-server.ts          # Backend Nango setup
└── nango-integrations/
    ├── nango.yaml               # Sync configuration
    ├── github/syncs/            # GitHub sync scripts
    └── slack/syncs/             # Slack sync scripts
```

---

## 💡 Key Takeaways

### Before Nango:
```typescript
// 100+ lines of OAuth implementation
// Token management and refresh logic
// API client setup for each service
// Error handling for auth flows
// Credential storage and security
```

### With Nango:
```typescript
// 2 lines to connect
const nango = new Nango({ publicKey })
await nango.auth('github', 'user-123')

// Done! ✨
```

---

## 🔑 Configuration Needed

### 1. Nango Dashboard Setup
- Sign up at https://app.nango.dev
- Get your secret key
- Configure integrations (GitHub, Slack)

### 2. Environment Variables
```env
NANGO_SECRET_KEY=your_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_key_here
```

### 3. OAuth Apps (Optional)
- Create GitHub OAuth App → Add credentials to Nango
- Create Slack App → Add credentials to Nango
- Or use Nango's Developer Apps for testing

---

## 📚 Documentation Included

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `ENV_SETUP.md` | Environment setup guide |
| `SETUP_OAUTH_APPS.md` | OAuth app creation tutorial |
| `TROUBLESHOOTING_CHECKLIST.md` | Common issues & solutions |
| `LOOM_VIDEO_GUIDE.md` | This video's full script |

---

## 🌟 Why This Matters

### Traditional OAuth Implementation:
- ❌ **2-3 weeks** of development time
- ❌ Complex token management
- ❌ Separate logic for each provider
- ❌ Security vulnerabilities
- ❌ Maintenance overhead

### With Nango:
- ✅ **30 minutes** to production
- ✅ Automatic token refresh
- ✅ Unified API for all providers
- ✅ Security built-in
- ✅ Minimal maintenance

---

## 🎨 UI Highlights

### Home Page Features:
- **Your Connections** - Shows all active OAuth connections
- **Available Integrations** - GitHub & Slack cards with connect buttons
- **Connection Cards** - Display integration details, test, and disconnect options
- **Responsive Design** - Works on mobile, tablet, and desktop

### User Flow:
1. Click "Connect GitHub" button
2. OAuth popup opens → User authorizes
3. Redirected back → Success message
4. Connection appears in "Your Connections"
5. Click "Test Connection" → Fetch real data
6. Click "Disconnect" → Remove connection

---

## 🔧 Customization Options

### Add More Integrations:
- Google Drive
- Salesforce
- HubSpot
- Notion
- 100+ more...

### Customize Syncs:
```yaml
github-issues:
  runs: every 30min    # Change frequency
  sync_type: incremental  # or 'full'
```

### Extend Features:
- Add user authentication
- Build data dashboards
- Create automation workflows
- Sync to your database

---

## 🚀 Deployment Ready

```bash
# Deploy to Vercel
vercel

# Deploy Nango integrations
cd nango-integrations
nango deploy
```

Environment variables needed:
- `NANGO_SECRET_KEY` (Production)
- `NEXT_PUBLIC_NANGO_PUBLIC_KEY` (Production)

---

## 📈 What's Next?

After watching this video, you can:

1. **Clone and run** this project locally
2. **Add your own integrations** (Notion, Google, etc.)
3. **Customize the UI** to match your brand
4. **Build features** on top of synced data
5. **Deploy to production** with Vercel

---

## 🔗 Resources

- **Nango Dashboard**: https://app.nango.dev
- **Nango Docs**: https://docs.nango.dev
- **GitHub Repository**: [Your Repo URL]
- **Live Demo**: [Your Demo URL]
- **Nango Community**: https://nango.dev/slack

---

## 📝 Video Script Summary

**Hook (0-30s):**
> "What if I told you OAuth integration could be just 2 lines of code?"

**Demo (30s-10m):**
> Shows complete working application with real OAuth flows

**Code (10m-15m):**
> Walks through clean, simple implementation

**Conclusion (15m-17m):**
> Summarizes benefits and encourages viewers to try it

---

## 💬 Engagement Questions

Great questions to answer in the video:
- ✅ How does Nango simplify OAuth?
- ✅ What's the difference between pre-built and custom integrations?
- ✅ How do automated syncs work?
- ✅ Is this production-ready?
- ✅ How do I add more integrations?

---

## 🎯 Call to Action

At the end of the video:

> "If you found this helpful:"
> 1. ⭐ **Star the repository** on GitHub
> 2. 💬 **Comment** what integrations you'd like to see next
> 3. 🔗 **Share** with developers who need OAuth
> 4. 📺 **Subscribe** for more integration tutorials

---

## 📊 Video Tags

```
#nextjs #oauth #nango #typescript #webdev #api #integration 
#github #slack #react #coding #tutorial #programming 
#javascript #fullstack #developer #softwareengineering
```

---

## ✨ Bonus Content Ideas

For future videos:
- 📹 Adding Google Drive integration
- 📹 Building a data dashboard with synced data
- 📹 Deploying to production on Vercel
- 📹 Creating custom automation workflows
- 📹 Advanced Nango features and tips

---

**Ready to record? Check out `LOOM_VIDEO_GUIDE.md` for the complete script!** 🎬



