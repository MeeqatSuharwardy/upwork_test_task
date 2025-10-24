# 🔧 Troubleshooting "unknown_user_account" Error

## ✅ Checklist - Do These In Order:

### 1. Verify Your Nango Dashboard Setup

Go to: **https://app.nango.dev**

#### Check Your Environment:
- [ ] Are you in **Production** or **Development**?
- [ ] The key in `.env` matches the environment you're in

#### Check Your Integrations:

##### GitHub Integration:
- [ ] Integration exists in Nango Dashboard
- [ ] **Integration ID (Unique Key)** is EXACTLY: `github` (lowercase)
- [ ] Client ID and Client Secret are filled in
- [ ] Status shows as "Active" or "Configured"

##### Slack Integration:
- [ ] Integration exists in Nango Dashboard  
- [ ] **Integration ID (Unique Key)** is EXACTLY: `slack` (lowercase)
- [ ] Client ID and Client Secret are filled in
- [ ] Status shows as "Active" or "Configured"

---

### 2. Verify OAuth Redirect URLs

#### In Nango Dashboard:
Look for the **OAuth Callback URL** - it should be:
```
https://api.nango.dev/oauth/callback
```

#### In GitHub OAuth App:
1. Go to: https://github.com/settings/developers
2. Click on your OAuth App
3. Verify **Authorization callback URL** is:
   ```
   https://api.nango.dev/oauth/callback
   ```
4. If it's different or missing, update it and save

#### In Slack OAuth App:
1. Go to: https://api.slack.com/apps
2. Select your app
3. Go to **OAuth & Permissions**
4. Under **Redirect URLs**, verify it includes:
   ```
   https://api.nango.dev/oauth/callback
   ```
5. If it's different or missing, add it and save

---

### 3. Verify Required Scopes

#### GitHub Scopes (in Nango Dashboard):
- [ ] `repo`
- [ ] `user`
- [ ] `read:org`

#### Slack Scopes (in Slack App → OAuth & Permissions):
- [ ] `channels:history`
- [ ] `channels:read`
- [ ] `chat:write`
- [ ] `users:read`

---

### 4. Check Your .env File

Your current `.env` file should have:
```env
NANGO_SECRET_KEY=59749c6a-0a73-4f21-bdb1-532dabd0cad3
NEXT_PUBLIC_NANGO_PUBLIC_KEY=59749c6a-0a73-4f21-bdb1-532dabd0cad3
```

- [ ] File exists in project root
- [ ] Keys match what's in Nango Dashboard
- [ ] No extra spaces or quotes

---

### 5. Test Connection

After verifying above:

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Open browser console:** Press F12 → Console tab

4. **Click "Connect GitHub"**

5. **Watch for errors** in the console

---

## 🎯 Most Common Issues:

### Issue: Integration ID Mismatch
**Symptom:** "unknown_user_account" error  
**Fix:** In Nango Dashboard, change Integration ID to exactly `github` or `slack` (lowercase)

### Issue: Wrong Callback URL
**Symptom:** OAuth redirect fails  
**Fix:** Use `https://api.nango.dev/oauth/callback` in GitHub/Slack OAuth settings

### Issue: Wrong Environment
**Symptom:** "unknown_user_account" error  
**Fix:** Use Development key for localhost testing, not Production

### Issue: Missing Scopes
**Symptom:** OAuth succeeds but connection doesn't work  
**Fix:** Add all required scopes listed above

---

## 📸 What to Screenshot:

If still not working, take screenshots of:

1. **Nango Dashboard → Integrations page** (showing your integrations)
2. **Nango Dashboard → Environment Settings** (showing your key - can blur part of it)
3. **GitHub OAuth App settings** (callback URL section)
4. **Browser console errors** (when clicking Connect)

Then share these for further help!

---

## 🆘 Still Not Working?

Try this:

1. **Delete the integration** in Nango Dashboard
2. **Re-create it** with the exact settings above
3. **Make sure Integration ID is** `github` (lowercase)
4. **Restart dev server**
5. **Try again**

