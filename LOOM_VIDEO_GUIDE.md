# 🎥 Loom Video Demo Guide - Nango Next.js Integration

This guide will help you create a comprehensive Loom video demonstrating the Nango Next.js integration project.

---

## 🎬 Video Outline (Recommended: 10-15 minutes)

### Part 1: Introduction (2 minutes)
### Part 2: Project Overview (2 minutes)
### Part 3: Setup & Configuration (3 minutes)
### Part 4: Live Demo (5 minutes)
### Part 5: Code Walkthrough (3 minutes)
### Part 6: Wrap Up (1 minute)

---

## 📝 Detailed Script

### Part 1: INTRODUCTION (2 minutes)

**[Screen: Show project directory in VS Code]**

**Script:**
> "Hey everyone! In this video, I'm going to show you a complete implementation of Nango in a Next.js application. Nango is a unified API platform that makes OAuth integrations incredibly simple."

> "By the end of this video, you'll see how to integrate multiple third-party APIs like GitHub and Slack into your Next.js app with just a few lines of code."

**Show:**
- Project folder structure
- Open `README.md` briefly

---

### Part 2: PROJECT OVERVIEW (2 minutes)

**[Screen: README.md or project structure]**

**Script:**
> "This project demonstrates two types of integrations:"

> "First, we have GitHub - using Nango's pre-built integration to sync issues and pull requests from repositories."

> "Second, we have Slack - a custom integration I built to sync messages and channels from a Slack workspace."

**Show:**
```
📁 Project Structure:
├── app/                      # Next.js 14 App Router
│   ├── api/nango/           # Backend API routes
│   └── page.tsx             # Main UI
├── components/              # React components
├── lib/                     # Nango client & server utilities
├── nango-integrations/      # Custom sync scripts
│   ├── github/
│   └── slack/
└── .env                     # Environment variables
```

**Highlight:**
- Modern Next.js 14 with App Router
- TypeScript throughout
- Clean separation of concerns
- Both pre-built and custom integrations

---

### Part 3: SETUP & CONFIGURATION (3 minutes)

**[Screen: Nango Dashboard + .env file]**

**Script:**
> "Let me show you how easy the setup is."

#### 3.1 Environment Variables

**Show `.env` file:**
```env
NANGO_SECRET_KEY=your_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_key_here
```

**Script:**
> "You only need two environment variables - your Nango secret key. That's it!"

> "You get these from your Nango Dashboard. It takes literally 30 seconds to set up."

#### 3.2 Nango Dashboard

**[Switch to Nango Dashboard]**

**Show:**
1. **Environment Settings** - where to get the secret key
2. **Integrations tab** - show GitHub and Slack integrations
3. **Integration settings:**
   - Integration ID: `github`
   - Callback URL: `https://api.nango.dev/oauth/callback`
   - OAuth credentials (blur sensitive info)

**Script:**
> "In the Nango Dashboard, you configure your integrations. Here's GitHub with its Integration ID set to 'github'."

> "Notice the callback URL - this is Nango's proxy that handles all the OAuth complexity for you."

> "You can either use Nango's Developer App for testing, or create your own OAuth apps for production. I've included a complete guide in the repository."

#### 3.3 Integration Configuration

**[Show `nango-integrations/nango.yaml`]**

```yaml
integrations:
  github:
    provider: github
    syncs:
      github-issues:
        runs: every 30min
        output: GithubIssue
        sync_type: incremental
```

**Script:**
> "The nango.yaml file defines how your data syncs work. Here I've configured GitHub issues to sync every 30 minutes, and it's incremental - meaning it only fetches new or updated data."

---

### Part 4: LIVE DEMO (5 minutes)

**[Screen: Browser - http://localhost:3000]**

#### 4.1 Show the App

**Script:**
> "Now let's see it in action. I'm going to start the development server..."

**[Run in terminal:]**
```bash
npm run dev
```

**[Open browser to localhost:3000]**

**Show:**
- Clean, modern UI
- "Your Connections" section (empty or with existing connections)
- "Available Integrations" section showing GitHub and Slack cards

**Script:**
> "Here's our app. You can see the available integrations - GitHub and Slack. Each shows a description and a connect button."

#### 4.2 Connect to GitHub

**Click "Connect GitHub"**

**Show:**
- OAuth popup window
- GitHub authorization screen
- Redirect back to app
- Success message

**Script:**
> "When I click Connect GitHub, Nango handles the entire OAuth flow. It opens GitHub's authorization page..."

> "I authorize the app... and boom! We're redirected back and the connection is established."

#### 4.3 View Active Connection

**Show:**
- Connection card appears in "Your Connections"
- Shows GitHub logo, connection ID, creation date
- "Test Connection" and "Disconnect" buttons

**Script:**
> "Now you can see the active connection displayed here with all its details."

#### 4.4 Test Connection

**Click "Test Connection"**

**Show:**
- Loading state
- Success alert with fetched data
- Browser console showing the actual GitHub data

**Script:**
> "Let me test this connection to fetch some real data from GitHub..."

**[Open browser console]**

> "And here's the actual response - we just fetched data from GitHub's API without handling any authentication ourselves!"

#### 4.5 Disconnect

**Click "Disconnect"**

**Show:**
- Confirmation
- Connection removed from the list

**Script:**
> "And when we're done, we can disconnect with a single click. Super clean!"

---

### Part 5: CODE WALKTHROUGH (3 minutes)

**[Screen: VS Code]**

#### 5.1 Frontend Code

**[Show `app/page.tsx`]**

**Highlight key parts:**

```typescript
// Initialize Nango
const publicKey = process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY
const nangoInstance = new Nango({ publicKey })

// Connect to integration
const result = await nango.auth(integrationId, connectionId)
```

**Script:**
> "The frontend code is incredibly simple. We initialize Nango with the public key..."

> "And then to connect to any integration, it's just one line - nango.auth with the integration ID."

> "That's it! Nango handles all the OAuth complexity, token management, and refresh."

#### 5.2 Backend API Route

**[Show `app/api/nango/connections/route.ts`]**

```typescript
const nango = new Nango({ secretKey: process.env.NANGO_SECRET_KEY })

// List all connections
const result = await nango.listConnections()
```

**Script:**
> "On the backend, we use the Nango Node SDK. Same simplicity - initialize with the secret key..."

> "And we can list connections, get specific connections, or make API calls to the integrated services."

#### 5.3 Custom Sync Script

**[Show `nango-integrations/slack/syncs/slack-messages.ts`]**

```typescript
export default async function fetchData(nango: NangoSync) {
  const response = await nango.get({
    endpoint: '/conversations.history',
    params: { channel: channelId }
  })
  
  await nango.batchSave(messages, 'SlackMessage')
}
```

**Script:**
> "Here's where it gets really powerful. This is a custom sync script for Slack messages."

> "We use Nango's proxy to call the Slack API - no need to manage tokens or authentication."

> "And then we save the data with batchSave. Nango handles all the storage and deduplication automatically."

#### 5.4 TypeScript Models

**[Show `nango-integrations/models.ts`]**

```typescript
export interface SlackMessage {
  id: string
  text: string
  user: string
  channel: string
  timestamp: string
}
```

**Script:**
> "Everything is fully typed. These TypeScript models ensure type safety across your entire app."

---

### Part 6: KEY FEATURES HIGHLIGHT (2 minutes)

**[Screen: Back to browser or code]**

**Script:**
> "Let me highlight the key features of this implementation:"

**Show on screen as text overlay or slides:**

```
✅ OAuth Made Simple
   - No manual OAuth implementation
   - Automatic token refresh
   - Secure credential storage

✅ Multiple Integrations
   - GitHub (pre-built)
   - Slack (custom)
   - Easy to add more

✅ Data Syncing
   - Automated background syncs
   - Incremental updates
   - Configurable schedules

✅ Production Ready
   - TypeScript throughout
   - Error handling
   - Modern Next.js 14
   - Tailwind CSS UI

✅ Developer Friendly
   - Clean code structure
   - Comprehensive docs
   - Easy to extend
```

---

### Part 7: REPOSITORY & DOCUMENTATION (1 minute)

**[Show repository structure]**

**Script:**
> "I've included comprehensive documentation in the repository:"

**Show files:**
- `README.md` - Complete overview
- `ENV_SETUP.md` - Environment setup guide
- `SETUP_OAUTH_APPS.md` - OAuth app creation
- `TROUBLESHOOTING_CHECKLIST.md` - Common issues

**Script:**
> "There's a complete setup guide, troubleshooting documentation, and step-by-step instructions for creating OAuth apps."

> "Everything you need to get this running in your own project."

---

### Part 8: WRAP UP (1 minute)

**[Screen: Back to app running]**

**Script:**
> "So that's it! We've built a complete Next.js application with multiple OAuth integrations using Nango."

> "What would normally take weeks of OAuth implementation, token management, and API handling is now just a few lines of code."

> "The code is available on GitHub - link in the description. Feel free to clone it, customize it, and use it in your own projects."

> "If you found this helpful, please give it a star on GitHub and let me know in the comments what other integrations you'd like to see!"

> "Thanks for watching, and happy coding!"

---

## 🎯 Recording Tips

### Before Recording:

- [ ] Clean up your desktop/taskbar
- [ ] Close unnecessary browser tabs
- [ ] Clear browser console
- [ ] Restart the dev server
- [ ] Have Nango Dashboard open in another tab
- [ ] Prepare a test GitHub/Slack account
- [ ] Check audio levels
- [ ] Use 1080p recording quality

### During Recording:

- [ ] Speak clearly and at a moderate pace
- [ ] Zoom in on code when showing details (Cmd/Ctrl + +)
- [ ] Pause between sections for easier editing
- [ ] Show actual API responses in console
- [ ] Keep cursor movements smooth
- [ ] Highlight important code with cursor

### What to Show:

✅ **DO Show:**
- Clean, working demo
- Real API responses
- Code structure and key files
- Nango Dashboard configuration
- Successful OAuth flow
- Documentation files

❌ **DON'T Show:**
- Your actual API keys (blur if needed)
- Personal GitHub/Slack data
- Error states (unless demonstrating troubleshooting)
- Long loading times (cut/fast-forward)

---

## 📊 Key Points to Emphasize

### 1. **Simplicity**
> "Just two lines of code to implement OAuth"

### 2. **No Backend OAuth Logic**
> "Nango handles all token management and refresh"

### 3. **Unified API**
> "One SDK for hundreds of integrations"

### 4. **Production Ready**
> "TypeScript, error handling, modern stack"

### 5. **Extensible**
> "Easy to add custom integrations"

---

## 🎨 Visual Enhancements (Optional)

If you want to add graphics/overlays:

### Title Screen:
```
🔗 Nango + Next.js
Complete OAuth Integration Demo

Built with:
• Next.js 14
• TypeScript
• Tailwind CSS
• Nango SDK
```

### Section Transitions:
- "Setup" → "Demo" → "Code" → "Wrap Up"
- Use simple fade transitions

### Code Highlights:
- Circle or box important code sections
- Add arrows pointing to key lines
- Use text callouts for explanations

---

## 📋 Video Description Template

```markdown
# Nango Next.js Integration - Complete OAuth Implementation

In this video, I demonstrate a production-ready implementation of Nango 
in a Next.js application with GitHub and Slack integrations.

## 🔗 Links
- GitHub Repository: [Your Repo URL]
- Nango Documentation: https://docs.nango.dev
- Live Demo: [Your Demo URL]

## ⏱️ Timestamps
0:00 - Introduction
2:00 - Project Overview
4:00 - Setup & Configuration
7:00 - Live Demo
12:00 - Code Walkthrough
15:00 - Wrap Up

## 🛠️ Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Nango SDK (@nangohq/frontend & @nangohq/node)
- Tailwind CSS
- GitHub & Slack APIs

## ✨ Features
✅ Complete OAuth 2.0 implementation
✅ Multiple API integrations
✅ Automated data syncing
✅ Modern, responsive UI
✅ TypeScript throughout
✅ Production ready

## 📚 Documentation Included
- Environment setup guide
- OAuth app creation guide
- Troubleshooting checklist
- Code comments and examples

## 🚀 Get Started
1. Clone the repository
2. Copy .env.example to .env
3. Add your Nango secret key
4. Run `npm install && npm run dev`

## 📖 Read More
- Full setup guide in README.md
- ENV_SETUP.md for environment configuration
- SETUP_OAUTH_APPS.md for OAuth app creation

Questions? Drop them in the comments! 👇

#nextjs #oauth #nango #typescript #webdev #api #integration
```

---

## 🎥 Alternative Video Formats

### Quick Demo (5 minutes)
- Skip code walkthrough
- Focus on demo and features
- Show setup briefly
- Great for social media

### Deep Dive (20-30 minutes)
- Detailed code explanation
- Show how to add new integrations
- Live coding session
- Troubleshooting examples
- Deploy to Vercel

### Tutorial Series
1. **Part 1:** Introduction & Setup (10 min)
2. **Part 2:** Building the UI (15 min)
3. **Part 3:** API Routes & Backend (15 min)
4. **Part 4:** Custom Integrations (20 min)
5. **Part 5:** Deployment & Production (10 min)

---

## ✅ Pre-Recording Checklist

- [ ] Project runs without errors
- [ ] All dependencies installed
- [ ] .env file configured (with test keys)
- [ ] Nango Dashboard set up
- [ ] GitHub OAuth app created
- [ ] Slack app created (optional)
- [ ] Test connection works
- [ ] Documentation files complete
- [ ] Code is commented
- [ ] README is up to date
- [ ] Audio/video recording tested
- [ ] Screen resolution set (1920x1080)
- [ ] Browser zoom at 100%
- [ ] Dark/light theme preference set
- [ ] Terminal prompt cleaned up

---

## 🎬 Post-Recording

- [ ] Review entire video
- [ ] Cut awkward pauses
- [ ] Add chapter markers
- [ ] Add intro/outro (optional)
- [ ] Check audio levels
- [ ] Export in 1080p
- [ ] Upload to Loom
- [ ] Add description and links
- [ ] Share link

---

**Good luck with your recording! 🎥✨**

Feel free to customize this script to match your style and audience!


