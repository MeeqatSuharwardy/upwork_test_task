# Quick Start Guide

Get up and running with Nango in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Nango account (free): https://app.nango.dev

## Step 1: Get Your Nango Keys (2 minutes)

1. Go to https://app.nango.dev and sign up
2. Create a new project
3. Copy your **Public Key** and **Secret Key**

## Step 2: Set Up the Project (1 minute)

```bash
# Navigate to project directory
cd nango-nextjs-demo

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` and add your keys:
```env
NANGO_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_public_key_here
```

## Step 3: Configure GitHub Integration (2 minutes)

### Option A: Use Nango's Test Integration (Fastest)

1. In Nango Dashboard, go to **Integrations**
2. Click **GitHub** → **Use Test Credentials**
3. Set integration ID to `github`
4. Done! Skip to Step 4.

### Option B: Use Your Own GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - Name: "My Nango Test"
   - Homepage: `http://localhost:3000`
   - Callback: Get from Nango dashboard
3. Copy Client ID and Secret
4. In Nango Dashboard:
   - Add GitHub integration
   - Paste credentials
   - Set ID to `github`

## Step 4: Run the App (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## Step 5: Test It!

1. Click **"Connect GitHub"**
2. Authorize the app
3. Click **"Test Connection"**
4. See your GitHub user data! 🎉

## Next Steps

- Add more integrations (Slack, Google, etc.)
- Deploy to Vercel
- Read the full [README.md](../README.md) for advanced features

## Troubleshooting

**"Nango is not initialized"**
- Restart the dev server: `npm run dev`
- Check `.env` file has the correct keys

**OAuth redirect error**
- Make sure callback URL in GitHub matches Nango dashboard
- Use `http://localhost:3000` not `127.0.0.1`

**Connection test fails**
- Re-authorize the connection
- Check browser console for detailed errors

## Need Help?

- 📖 Full Documentation: [README.md](../README.md)
- 🔧 Advanced Usage: [ADVANCED_USAGE.md](ADVANCED_USAGE.md)
- 💬 Nango Slack: https://nango.dev/slack

