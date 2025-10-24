# 🔧 Create Your Own OAuth Apps (Recommended)

Using Nango's Developer App is good for quick testing, but creating your own OAuth apps is more reliable and required for production.

## 📋 GitHub OAuth App Setup

### Step 1: Create GitHub OAuth App

1. Go to: **https://github.com/settings/developers**
2. Click **"New OAuth App"** (or "OAuth Apps" → "New OAuth App")
3. Fill in the form:

   ```
   Application name: Nango NextJS Demo (or any name you like)
   Homepage URL: http://localhost:3000
   Application description: (optional) Testing Nango integration
   Authorization callback URL: https://api.nango.dev/oauth/callback
   ```

4. Click **"Register application"**
5. You'll see your **Client ID** displayed
6. Click **"Generate a new client secret"**
7. **Copy both Client ID and Client Secret** immediately (you won't see the secret again!)

### Step 2: Add to Nango Dashboard

1. Go to: **https://app.nango.dev**
2. Click on **Integrations**
3. Find your **GitHub** integration
4. Click on it to edit
5. Look for **"OAuth Credentials"** or similar section
6. **Paste your Client ID**
7. **Paste your Client Secret**
8. Make sure **Integration ID** is: `github` (lowercase)
9. **Save**

### Step 3: Configure Scopes (if needed)

Make sure these scopes are enabled:
- `repo` - Access repositories
- `user` - Access user information
- `read:org` - Read organization data

---

## 💬 Slack OAuth App Setup

### Step 1: Create Slack App

1. Go to: **https://api.slack.com/apps**
2. Click **"Create New App"**
3. Select **"From scratch"**
4. Fill in:
   ```
   App Name: Nango NextJS Demo
   Pick a workspace: (select your workspace)
   ```
5. Click **"Create App"**

### Step 2: Configure OAuth Settings

1. In your Slack app dashboard, go to **"OAuth & Permissions"** (left sidebar)
2. Scroll to **"Redirect URLs"**
3. Click **"Add New Redirect URL"**
4. Enter: `https://api.nango.dev/oauth/callback`
5. Click **"Add"**
6. Click **"Save URLs"**

### Step 3: Add Bot Token Scopes

Still in **OAuth & Permissions**, scroll to **"Scopes"** section:

Under **"Bot Token Scopes"**, click **"Add an OAuth Scope"** and add:
- `channels:history` - View messages in channels
- `channels:read` - View basic channel information
- `chat:write` - Send messages
- `users:read` - View users in workspace

### Step 4: Get Credentials

1. Scroll to top of the page
2. Find **"App Credentials"** section or go to **"Basic Information"** in left sidebar
3. Copy your **Client ID**
4. Copy your **Client Secret** (click "Show" first)

### Step 5: Add to Nango Dashboard

1. Go to: **https://app.nango.dev**
2. Click on **Integrations**
3. Find your **Slack** integration
4. Click on it to edit
5. **Paste your Client ID**
6. **Paste your Client Secret**
7. Make sure **Integration ID** is: `slack` (lowercase)
8. **Save**

---

## ✅ Verify Your Setup

### Check Integration IDs

In Nango Dashboard → Integrations:
- [ ] GitHub Integration ID = `github`
- [ ] Slack Integration ID = `slack`
- [ ] Both have Client ID and Client Secret filled in
- [ ] Both show as "Active" or "Configured"

### Test Your App

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **Click "Connect GitHub"**

4. You should see GitHub's OAuth authorization page

5. Authorize the app

6. You should be redirected back and see success message

---

## 🎯 Benefits of Your Own OAuth Apps

✅ **More reliable** - No dependency on Nango's shared app  
✅ **Full control** - Customize scopes and permissions  
✅ **Production ready** - Required for real deployments  
✅ **Better debugging** - See your own app's activity in GitHub/Slack  
✅ **No rate limits** - Not shared with other Nango users  

---

## 🆘 Troubleshooting

### "Redirect URI mismatch" error
- Double-check the callback URL is exactly: `https://api.nango.dev/oauth/callback`
- No trailing slashes, no http (must be https)

### "Invalid client" error
- Verify you pasted the Client ID and Secret correctly
- Check for extra spaces or line breaks
- Regenerate the client secret and try again

### "Insufficient permissions" error
- Add the required scopes listed above
- If you already authorized, you may need to re-authorize to get new scopes

---

## 📝 Security Notes

⚠️ **Never commit OAuth credentials to Git**
- They're stored in Nango Dashboard, not in your code
- Your `.env` only contains Nango keys
- GitHub/Slack credentials stay in Nango

✅ **Your `.env.local` is already in `.gitignore`**
✅ **OAuth secrets are only in Nango Dashboard**

---

**After completing this setup, your "unknown_user_account" error should be resolved!** 🎉

