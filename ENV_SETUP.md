# Environment Variables Setup Guide

This guide will help you set up the required environment variables for your Nango Next.js demo.

## 📋 Required Variables

Your project needs these environment variables to work:

| Variable | Type | Description | Where to get it |
|----------|------|-------------|-----------------|
| `NANGO_SECRET_KEY` | **Required** | Server-side secret key for Nango API | Nango Dashboard |
| `NEXT_PUBLIC_NANGO_PUBLIC_KEY` | **Required** | Client-side public key for OAuth | Nango Dashboard |
| `NANGO_HOST_URL` | Optional | Custom Nango host URL | Only if self-hosting |
| `NEXT_PUBLIC_NANGO_HOST_URL` | Optional | Custom Nango host for client | Only if self-hosting |

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Your .env File

```bash
# Copy the example file
cp .env.example .env
```

Or create it manually:
```bash
# Create .env file
touch .env
```

### Step 2: Get Your Nango Keys

1. Go to **[Nango Dashboard](https://app.nango.dev)**
2. Sign up or log in to your account
3. Create a new project (or select existing)
4. Navigate to **Settings** → **API Keys**
5. Copy:
   - **Secret Key** (starts with `nango_sk_...`)
   - **Public Key** (starts with `nango_pk_...`)

### Step 3: Update Your .env File

Open `.env` and paste your keys:

```env
NANGO_SECRET_KEY=nango_sk_your_secret_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=nango_pk_your_public_key_here
```

**⚠️ Important**: Never commit your `.env` file to Git! It contains sensitive credentials.

## 🔌 Configure Integrations

Your project has **2 integrations** set up: **GitHub** and **Slack**

### GitHub Integration Setup

1. **In Nango Dashboard**:
   - Go to **Integrations** → **Add Integration**
   - Search for "GitHub" and select it
   - Set **Integration ID** to: `github`

2. **Create GitHub OAuth App**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in:
     - **Application name**: Your app name
     - **Homepage URL**: `http://localhost:3000` (for development)
     - **Authorization callback URL**: Get from Nango Dashboard (looks like: `https://api.nango.dev/oauth/callback`)
   - Click **Register application**
   - Copy **Client ID** and **Client Secret**

3. **Configure in Nango**:
   - Paste Client ID and Client Secret in Nango Dashboard
   - Add required scopes:
     - `repo` (access repositories)
     - `user` (access user info)
     - `read:org` (read organization data)
   - Save the integration

### Slack Integration Setup

1. **In Nango Dashboard**:
   - Go to **Integrations** → **Add Custom Integration**
   - Select **Slack** as provider
   - Set **Integration ID** to: `slack`

2. **Create Slack App**:
   - Go to [Slack API](https://api.slack.com/apps)
   - Click **Create New App** → **From scratch**
   - Name your app and select workspace
   - Go to **OAuth & Permissions**
   - Add **Redirect URLs**: Get from Nango Dashboard
   - Add **Bot Token Scopes**:
     - `channels:history` (read channel messages)
     - `channels:read` (view channels)
     - `chat:write` (send messages)
     - `users:read` (view user info)
   - Save Changes

3. **Configure in Nango**:
   - Go to **Basic Information** in Slack App
   - Copy **Client ID** and **Client Secret**
   - Paste them in Nango Dashboard
   - Save the integration

## ✅ Verify Setup

After setting up, verify everything works:

```bash
# Start the development server
npm run dev
```

Then:
1. Open [http://localhost:3000](http://localhost:3000)
2. You should see both GitHub and Slack integration options
3. Try connecting to GitHub by clicking "Connect"
4. Complete the OAuth flow
5. Test the connection

## 🔍 Troubleshooting

### "NANGO_SECRET_KEY is not set"
- Make sure your `.env` file is in the root directory
- Restart your development server after creating `.env`
- Check that variable names are spelled correctly

### "OAuth redirect mismatch"
- Verify redirect URL in Nango Dashboard matches your OAuth app settings
- For GitHub/Slack, use the exact callback URL from Nango
- Use `http://localhost:3000` not `http://127.0.0.1:3000`

### Connection fails after OAuth
- Check that all required scopes are added in GitHub/Slack app
- Verify Integration IDs match exactly: `github` and `slack`
- Look at browser console and server logs for errors

## 📝 Example .env File

Here's what your complete `.env` file should look like:

```env
# Nango Keys (Required)
NANGO_SECRET_KEY=nango_sk_abc123def456...
NEXT_PUBLIC_NANGO_PUBLIC_KEY=nango_pk_xyz789uvw012...

# Optional: Only if self-hosting Nango
# NANGO_HOST_URL=https://your-nango-instance.com
# NEXT_PUBLIC_NANGO_HOST_URL=https://your-nango-instance.com
```

## 🎯 What Each Integration Does

### GitHub Integration
- **Syncs Issues**: Automatically fetches and syncs issues from your repositories
- **Syncs Pull Requests**: Keeps track of all PRs
- **Sync Frequency**: Every 30 minutes
- **Sync Type**: Incremental (only new/changed data)

### Slack Integration  
- **Syncs Messages**: Fetches messages from channels
- **Syncs Channels**: Lists all channels in workspace
- **Sync Frequency**: Messages every 15 min, Channels every 1 hour
- **Sync Type**: Messages (incremental), Channels (full)

## 📚 Next Steps

Once your environment is set up:

1. ✅ Test both integrations from the UI
2. 📊 Check the Nango Dashboard for sync logs
3. 🔧 Customize sync frequencies in `nango-integrations/nango.yaml`
4. 🚀 Deploy your integrations: `cd nango-integrations && nango deploy`
5. 📖 Read [ADVANCED_USAGE.md](docs/ADVANCED_USAGE.md) for more features

## 🆘 Need Help?

- 📖 [Nango Documentation](https://docs.nango.dev)
- 💬 [Nango Slack Community](https://nango.dev/slack)
- 📧 [Nango Support](https://nango.dev/support)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

---

**🎉 Happy Integrating!**

