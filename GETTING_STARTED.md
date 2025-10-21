# Getting Started with Nango Integration

Welcome! This guide will get you up and running in **5 simple steps**.

## 📁 Project Structure

```
nango-nextjs-demo/
├── 📱 app/                          # Next.js application
│   ├── api/nango/                   # API routes for Nango
│   │   ├── connections/             # Connection management
│   │   ├── test/                    # Test connections
│   │   ├── webhook/                 # Webhook handler
│   │   └── proxy/                   # API proxy
│   ├── page.tsx                     # Main dashboard
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
│
├── 🎨 components/                   # React components
│   ├── ConnectionCard.tsx           # Connection display
│   └── IntegrationsList.tsx         # Available integrations
│
├── 🔧 lib/                          # Utility libraries
│   ├── nango-client.ts              # Frontend utilities
│   └── nango-server.ts              # Backend utilities
│
├── 🔌 nango-integrations/           # Integration configs
│   ├── github/                      # GitHub integration
│   │   └── syncs/                   # Sync scripts
│   │       ├── github-issues.ts
│   │       └── github-pull-requests.ts
│   ├── slack/                       # Slack integration
│   │   └── syncs/                   # Sync scripts
│   │       ├── slack-messages.ts
│   │       └── slack-channels.ts
│   ├── nango.yaml                   # Main configuration
│   └── models.ts                    # TypeScript models
│
├── 📚 docs/                         # Documentation
│   ├── QUICKSTART.md                # 5-minute guide
│   ├── SETUP_GUIDE.md               # Detailed setup
│   ├── ADVANCED_USAGE.md            # Advanced patterns
│   └── ARCHITECTURE.md              # System design
│
├── 🛠️ scripts/                     # Utility scripts
│   └── setup-nango.sh               # Setup automation
│
├── 📋 Configuration Files
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── next.config.js               # Next.js config
│   ├── tailwind.config.js           # Tailwind config
│   └── .env.example                 # Environment template
│
└── 📖 Documentation
    ├── README.md                    # Main documentation
    ├── PROJECT_SUMMARY.md           # Project overview
    ├── CONTRIBUTING.md              # Contribution guide
    └── LICENSE                      # MIT License
```

## 🚀 5-Step Setup

### Step 1: Install Dependencies

```bash
cd nango-nextjs-demo
npm install
```

**What this does**: Installs all required packages including Nango SDK, Next.js, and Tailwind CSS.

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your Nango keys:

```env
NANGO_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_public_key_here
```

**Where to get keys**:
1. Go to [https://app.nango.dev](https://app.nango.dev)
2. Sign up (free)
3. Create a project
4. Copy keys from dashboard

### Step 3: Set Up GitHub Integration

**Option A: Quick Test (1 minute)**
1. In Nango Dashboard → Integrations
2. Find GitHub → Click "Add"
3. Select "Use Test Credentials"
4. Set integration ID to `github`

**Option B: Your Own OAuth App (5 minutes)**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Name: "My Nango Demo"
   - Homepage: `http://localhost:3000`
   - Callback: Copy from Nango dashboard
3. Copy Client ID & Secret
4. In Nango Dashboard:
   - Add GitHub integration
   - Paste credentials
   - Set ID to `github`

### Step 4: Run the Application

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

### Step 5: Test It!

1. Click **"Connect GitHub"** button
2. Authorize the application
3. See your connection appear
4. Click **"Test Connection"**
5. View your GitHub data! 🎉

## 🎯 What You Should See

### Home Page
- Header with title and description
- "Your Connections" section (empty at first)
- "Available Integrations" with GitHub and Slack cards

### After Connecting GitHub
- GitHub connection card appears in "Your Connections"
- Shows connection date and ID
- "Test Connection" and "Disconnect" buttons

### After Testing Connection
- Alert popup showing your GitHub user data
- Includes username, avatar URL, etc.

## 🔍 How It Works

### 1. OAuth Flow

```
User clicks "Connect"
    ↓
Nango opens OAuth popup
    ↓
User authorizes on GitHub
    ↓
GitHub redirects to Nango
    ↓
Nango securely stores token
    ↓
Popup closes
    ↓
Connection appears in app!
```

### 2. Behind the Scenes

**Frontend** (`app/page.tsx`):
- Displays UI
- Calls `nango.auth()` to start OAuth

**API Routes** (`app/api/nango/`):
- Handle connection management
- Make authenticated API requests
- Process webhooks

**Nango Cloud**:
- Stores OAuth tokens securely
- Refreshes tokens automatically
- Proxies API requests

## 📱 Key Files to Understand

### 1. Main Page (`app/page.tsx`)
The dashboard where users manage connections.

```typescript
// Initialize Nango
const nango = new Nango({ publicKey })

// Connect to integration
await nango.auth('github', 'user-123')

// List connections
fetch('/api/nango/connections')
```

### 2. Connection Card (`components/ConnectionCard.tsx`)
Displays each connection with test/disconnect buttons.

### 3. API Route (`app/api/nango/connections/route.ts`)
Server-side connection management.

```typescript
import { Nango } from '@nangohq/node'

const nango = new Nango({ secretKey })
const connections = await nango.listConnections()
```

### 4. Nango Config (`nango-integrations/nango.yaml`)
Defines integrations and sync schedules.

```yaml
integrations:
  github:
    provider: github
    syncs:
      github-issues:
        runs: every 30min
```

### 5. Sync Script (`nango-integrations/github/syncs/github-issues.ts`)
Fetches and syncs data in background.

```typescript
export default async function fetchData(nango: NangoSync) {
  const data = await nango.get({ endpoint: '/repos' })
  await nango.batchSave(data, 'GithubIssue')
}
```

## 🎓 Next Steps

### Learn More
1. **Read README.md** - Comprehensive documentation
2. **Check SETUP_GUIDE.md** - Detailed setup instructions
3. **Review ADVANCED_USAGE.md** - Advanced patterns
4. **Study ARCHITECTURE.md** - System design

### Add More Integrations
1. Set up Slack integration (similar to GitHub)
2. Add Google Drive, Notion, etc.
3. Create custom integrations

### Customize
1. Update UI styling in `app/globals.css`
2. Modify components in `components/`
3. Add new features in `app/`

### Deploy
1. Deploy to Vercel: `vercel deploy`
2. Set production environment variables
3. Configure production OAuth apps
4. Deploy Nango integrations: `nango deploy`

## 🐛 Common Issues

### "Nango is not initialized"
**Solution**: Restart dev server after updating `.env`
```bash
# Stop server (Ctrl+C), then:
npm run dev
```

### OAuth redirect error
**Solution**: Check callback URL matches in both places:
- GitHub OAuth App settings
- Nango Dashboard integration settings

### Connection test fails
**Solution**: 
1. Re-authorize the connection
2. Check OAuth scopes in Nango dashboard
3. View browser console for errors

### Can't see connections
**Solution**:
1. Check that `NANGO_SECRET_KEY` is set correctly
2. Verify connection exists in Nango dashboard
3. Check browser network tab for API errors

## 💡 Pro Tips

1. **Use Browser DevTools** - Network tab shows all API calls
2. **Check Nango Dashboard** - See all connections and syncs
3. **Read Error Messages** - They're detailed and helpful
4. **Start Simple** - Get GitHub working first
5. **Test Thoroughly** - Test OAuth flow multiple times
6. **Read the Docs** - Comprehensive guides available

## 📞 Need Help?

### Resources
- 📖 **README.md** - Main documentation
- 🚀 **QUICKSTART.md** - 5-minute setup
- 🔧 **SETUP_GUIDE.md** - Detailed setup
- 💬 **Nango Slack** - https://nango.dev/slack
- 📚 **Nango Docs** - https://docs.nango.dev

### Common Questions

**Q: Do I need a credit card?**
A: No! Nango has a free tier perfect for development.

**Q: Can I use this in production?**
A: Yes! This is production-ready code.

**Q: How do I add more integrations?**
A: See "Creating a New Integration" in README.md

**Q: Is my data secure?**
A: Yes! OAuth tokens are stored securely by Nango, never in your app.

**Q: Can I self-host Nango?**
A: Yes! Nango offers a self-hosted option.

## 🎉 Success Checklist

- [ ] Installed dependencies
- [ ] Created `.env` file with Nango keys
- [ ] Configured GitHub integration in Nango Dashboard
- [ ] Started development server
- [ ] Clicked "Connect GitHub" and authorized
- [ ] Saw connection appear in dashboard
- [ ] Tested connection successfully
- [ ] Viewed GitHub data in alert

## 🌟 You're Ready!

Congratulations! You now have a working Nango integration.

**What you've learned**:
- ✅ How OAuth 2.0 works
- ✅ How to use Nango SDK
- ✅ How to manage API connections
- ✅ How to build integration features

**Next challenge**: Add Slack integration following the same pattern!

---

**Happy coding! 🚀**

For more details, see [README.md](README.md)

