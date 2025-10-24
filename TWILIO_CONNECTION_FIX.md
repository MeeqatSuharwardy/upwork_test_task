# 🔧 Twilio Connection Fix

## The Problem

You're getting this error:
```json
{
  "error": {
    "message": "An unhandled error of type 'unknown_user_account' with payload '{}' has occurred",
    "code": "unhandled_unknown_user_account",
    "payload": {}
  }
}
```

**Root Cause**: Twilio uses **API Key authentication** (Account SID + Auth Token), NOT OAuth like Stripe. The current setup tries to use OAuth flow which doesn't work for Twilio.

## ✅ Solution: Two Options

### Option 1: Manual API Key Connection (Quickest)

Use the connection form I just created:

#### Step 1: Configure Twilio in Nango Dashboard

```bash
open http://localhost:3003/admin
```

**Login:**
- Email: `admin@example.com`
- Password: `admin123`

**Configure Integration:**
1. Go to **Integrations** → **Add Integration** or edit existing Twilio
2. Set these values:
   - **Integration ID**: `twilio`
   - **Provider**: Select "Custom" or "API Key"
   - **Authentication Type**: `API_KEY` (NOT OAuth2)
   - **Base URL**: `https://api.twilio.com`

3. **Authentication Configuration**:
   - Type: `Basic Auth` or `API Key`
   - The credentials will be stored per connection

#### Step 2: Use the Connection Form

I've created a custom connection form for Twilio. To use it, you have two options:

**Option A: Direct API Call**

```bash
# Create connection directly via API
curl -X POST http://localhost:3000/api/nango/twilio/connect \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": "my-twilio",
    "accountSid": "ACxxxxxxxxxxxxxxxxxxxxx",
    "authToken": "your_auth_token_here"
  }'
```

**Option B: Use the UI Form** (Need to integrate it)

The form component is ready at `components/TwilioConnectForm.tsx`

#### Step 3: Test the Connection

```bash
# List connections
curl http://localhost:3000/api/nango/connections

# Should see your Twilio connection
```

---

### Option 2: Configure as HTTP Basic Auth (Alternative)

If Option 1 doesn't work, configure Twilio to use HTTP Basic Auth:

#### In Nango Dashboard:

1. **Integration Settings**:
   ```yaml
   ID: twilio
   Provider: custom
   Auth Type: Basic Auth
   Base URL: https://api.twilio.com
   ```

2. **Per-Connection Credentials**:
   - Username: Your Account SID
   - Password: Your Auth Token

3. **Headers** (if needed):
   ```
   Authorization: Basic {base64(AccountSID:AuthToken)}
   ```

---

## 🚀 Quick Fix Script

Run this to create a Twilio connection:

```bash
# Save your credentials
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token"

# Create connection
curl -X POST http://localhost:3000/api/nango/twilio/connect \
  -H "Content-Type: application/json" \
  -d "{
    \"connectionId\": \"twilio-$(date +%s)\",
    \"accountSid\": \"$TWILIO_ACCOUNT_SID\",
    \"authToken\": \"$TWILIO_AUTH_TOKEN\"
  }"
```

---

## 📝 What I've Created

### New Files:

1. **`app/api/nango/twilio/connect/route.ts`**
   - Custom API endpoint to create Twilio connections
   - Handles API Key authentication properly
   - Stores credentials securely in Nango

2. **`components/TwilioConnectForm.tsx`**
   - User-friendly form to enter Twilio credentials
   - Validates input
   - Shows helpful instructions

3. **`docs/TWILIO_AUTH_FIX.md`**
   - Technical explanation of the issue
   - Configuration details

---

## 🧪 Testing Steps

### 1. Get Your Twilio Credentials

```bash
# Go to Twilio Console
open https://www.twilio.com/console

# Copy:
# - Account SID (starts with AC...)
# - Auth Token (click "View" to reveal)
```

### 2. Create Connection via API

```bash
curl -X POST http://localhost:3000/api/nango/twilio/connect \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": "my-twilio-connection",
    "accountSid": "AC1234567890abcdef1234567890abcd",
    "authToken": "your_actual_auth_token_here"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "connection": {
    "id": "my-twilio-connection",
    "provider_config_key": "twilio"
  },
  "message": "Twilio connection created successfully"
}
```

### 3. Verify Connection

```bash
# List all connections
curl http://localhost:3000/api/nango/connections

# Should show your Twilio connection
```

### 4. Trigger Sync

```bash
# In Nango dashboard
open http://localhost:3003/admin

# Go to Connections → Select your Twilio connection
# Click "Trigger Sync" → Choose "twilio-messages"
```

### 5. Check Synced Data

```bash
# Get messages
curl "http://localhost:3000/api/nango/twilio/messages?connectionId=my-twilio-connection"

# Should return your Twilio messages
```

---

## 🔍 Troubleshooting

### Issue: "Connection not found"

**Solution:**
```bash
# Check if connection exists
curl http://localhost:3000/api/nango/connections

# If not, create it again with the connect endpoint
```

### Issue: "Authentication failed"

**Cause:** Invalid Account SID or Auth Token

**Solution:**
1. Verify credentials in Twilio Console
2. Make sure Auth Token hasn't been regenerated
3. Check for extra spaces or characters
4. Try creating a new Auth Token in Twilio

### Issue: "Provider config not found"

**Cause:** Twilio integration not configured in Nango

**Solution:**
```bash
# In Nango dashboard, make sure Twilio integration exists
# Integration ID must be exactly "twilio"
```

### Issue: Sync scripts not deploying

**Solution:**
```bash
cd nango-integrations

# Redeploy
export NANGO_HOST_URL=http://localhost:3003
export NANGO_SECRET_KEY=ec8cbc49-6218-4874-9069-8e0ba8aae2ae

nango deploy

# Verify
nango list | grep twilio
```

---

## 📚 Understanding the Fix

### Why OAuth Doesn't Work for Twilio

**OAuth Flow** (what Stripe uses):
1. User clicks "Connect"
2. Redirected to provider's OAuth page
3. User authorizes
4. Provider sends back access token
5. Nango stores token

**API Key Flow** (what Twilio uses):
1. User provides credentials directly
2. App stores credentials securely
3. Credentials used for API requests
4. No OAuth redirect needed

### How the Fix Works

```typescript
// Old way (OAuth - doesn't work for Twilio)
await nango.auth('twilio', connectionId)  // ❌ Fails

// New way (API Key - works for Twilio)
await nango.setConnection({
  providerConfigKey: 'twilio',
  connectionId: connectionId,
  credentials: {
    type: 'API_KEY',
    apiKey: accountSid,      // Account SID
    apiSecret: authToken,     // Auth Token
  }
})  // ✅ Works!
```

---

## 🎯 Next Steps After Fixing

Once connection is working:

1. **Trigger Manual Sync**:
   - Nango Dashboard → Connections → Trigger Sync

2. **View Synced Data**:
   - Check `http://localhost:3000` for analytics

3. **Monitor Logs**:
   ```bash
   docker-compose logs nango-jobs -f
   ```

4. **Automate Connections**:
   - Use the `/api/nango/twilio/connect` endpoint in your app
   - Build UI with `TwilioConnectForm.tsx`

---

## ✅ Summary

**Problem**: Twilio doesn't use OAuth  
**Solution**: Use API Key authentication with custom connection endpoint  
**Endpoint**: `POST /api/nango/twilio/connect`  
**Form**: `components/TwilioConnectForm.tsx`  

**Test it:**
```bash
curl -X POST http://localhost:3000/api/nango/twilio/connect \
  -H "Content-Type: application/json" \
  -d '{
    "connectionId": "test-connection",
    "accountSid": "YOUR_ACCOUNT_SID",
    "authToken": "YOUR_AUTH_TOKEN"
  }'
```

---

## 🆘 Still Having Issues?

1. **Check Nango logs**:
   ```bash
   docker-compose logs nango-server -f
   ```

2. **Verify integration exists**:
   ```bash
   # In Nango dashboard
   open http://localhost:3003/admin
   # Check Integrations tab
   ```

3. **Test credentials directly**:
   ```bash
   curl -u "ACxxx:your_token" \
     "https://api.twilio.com/2010-04-01/Accounts/ACxxx.json"
   ```

4. **Check the detailed guide**:
   - See `docs/TWILIO_INTEGRATION_GUIDE.md`
   - See `docs/TWILIO_AUTH_FIX.md`

---

**Need more help?** Share the exact error message and I'll assist further!

