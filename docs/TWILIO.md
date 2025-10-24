# Twilio Authentication Fix

## The Issue

Twilio uses **API Key authentication** (not OAuth), but our current setup tries to use OAuth flow. This causes the "unknown_user_account" error.

## Solution: Configure Twilio as API Key Integration

### Option 1: Configure in Nango Dashboard (Recommended)

1. **Open Nango Dashboard**
```bash
open http://localhost:3003/admin
```

2. **Go to Integrations** → Find or Add Twilio

3. **Configure as API Key Integration**:
   - **Integration ID**: `twilio`
   - **Provider**: `twilio` or `api-key`
   - **Authentication Type**: `API_KEY` (not OAuth)
   - **Base URL**: `https://api.twilio.com`

4. **Set Authentication Headers**:
   ```
   Authorization: Basic {base64(AccountSID:AuthToken)}
   ```

### Option 2: Use Nango Proxy for API Key Auth

Since Twilio doesn't have OAuth, you can use Nango's proxy feature with API credentials:

1. **Store credentials securely** in Nango
2. **Use the proxy** to make authenticated requests

### Option 3: Direct API Key Storage (Simplest)

For API Key integrations like Twilio, you can store credentials directly per connection.

## Quick Fix: Update Integration Configuration

Since Twilio is an API Key provider, not OAuth, we need to adjust the approach.

