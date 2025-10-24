# 📱 Twilio Integration Guide

Complete guide to setting up the custom Twilio integration with self-hosted Nango.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Twilio Account Setup](#twilio-account-setup)
- [Nango Configuration](#nango-configuration)
- [Features](#features)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Twilio integration syncs three types of data from your Twilio account:

- **📱 Messages** - SMS and MMS messages (sent and received)
- **📞 Calls** - Voice call records with duration and status
- **☎️ Phone Numbers** - All phone numbers with their capabilities

### Sync Frequency

- **Messages**: Every 15 minutes (incremental)
- **Calls**: Every 30 minutes (incremental)
- **Phone Numbers**: Every 1 hour (full sync)

## ✅ Prerequisites

Before you begin:

- ✅ Self-hosted Nango running (`npm run nango:start`)
- ✅ Twilio account ([Sign up here](https://www.twilio.com/try-twilio))
- ✅ Your Nango API keys configured in `.env`

## 🔧 Twilio Account Setup

### Step 1: Create Twilio Account

1. Go to [https://www.twilio.com/console](https://www.twilio.com/console)
2. Sign up for a new account (free trial available)
3. Verify your email and phone number

### Step 2: Get Twilio Credentials

1. Go to **Console** → **Account** → **API keys & tokens**
2. You'll need:
   - **Account SID** - Found on Console Dashboard
   - **Auth Token** - Found on Console Dashboard (click "View" to reveal)

**Important:** Keep these credentials secure!

### Step 3: Add to Environment

Edit your `.env` file:

```env
# Twilio Credentials
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
```

## 🔗 Nango Configuration

### Step 1: Open Nango Dashboard

```bash
open http://localhost:3003/admin
```

Login with:
- Email: `admin@example.com`
- Password: `admin123`

### Step 2: Add Twilio Integration

1. Click **Integrations** → **Add Integration**
2. Select **Custom Integration**
3. Fill in the details:

```yaml
Name: twilio
Provider: Twilio (select from dropdown or enter manually)
Authentication Type: API Key
```

### Step 3: Configure Authentication

Since Twilio uses API Key authentication (not OAuth), configure it as:

**Base URL:**
```
https://api.twilio.com
```

**Authentication:**
- Type: Basic Auth
- Username: Your Account SID
- Password: Your Auth Token

Or configure as API Key:
- Header: `Authorization`
- Value: `Basic {base64(AccountSID:AuthToken)}`

### Step 4: Set Integration ID

Make sure the integration ID is set to `twilio` (this matches your configuration files).

## 🚀 Deploy Integration

### Step 1: Deploy to Nango

```bash
# Navigate to integrations folder
cd nango-integrations

# Set environment for local Nango
export NANGO_HOST_URL=http://localhost:3003
export NANGO_SECRET_KEY=ec8cbc49-6218-4874-9069-8e0ba8aae2ae

# Deploy integrations
nango deploy

# You should see:
# ✅ Deployed twilio-messages
# ✅ Deployed twilio-calls
# ✅ Deployed twilio-phone-numbers
```

### Step 2: Verify Deployment

```bash
# List deployed integrations
nango list

# You should see twilio with 3 syncs
```

## 📊 Features

### 1. Messages Sync

Syncs all SMS and MMS messages with:
- Message content and status
- Sender and receiver numbers
- Timestamps (created, sent, updated)
- Error codes and messages (if any)
- Pricing information

**Example Message:**
```json
{
  "sid": "SMxxxxxxxxxxxxxxxxx",
  "from": "+14155552671",
  "to": "+14155552672",
  "body": "Hello from Twilio!",
  "status": "delivered",
  "direction": "outbound-api",
  "date_created": "2024-10-22T10:00:00Z",
  "date_sent": "2024-10-22T10:00:01Z",
  "price": "-0.00750"
}
```

### 2. Calls Sync

Syncs all voice call records with:
- Call status and duration
- Caller and callee numbers
- Start and end times
- Answered by (human/machine)
- Pricing information

**Example Call:**
```json
{
  "sid": "CAxxxxxxxxxxxxxxxxx",
  "from": "+14155552671",
  "to": "+14155552672",
  "status": "completed",
  "duration": 125,
  "start_time": "2024-10-22T10:00:00Z",
  "end_time": "2024-10-22T10:02:05Z",
  "price": "-0.0130"
}
```

### 3. Phone Numbers Sync

Syncs all your phone numbers with:
- Phone number and friendly name
- Capabilities (voice, SMS, MMS, fax)
- Status
- Creation and update timestamps

**Example Phone Number:**
```json
{
  "sid": "PNxxxxxxxxxxxxxxxxx",
  "phone_number": "+14155552671",
  "friendly_name": "My Business Line",
  "capabilities": {
    "voice": true,
    "sms": true,
    "mms": true,
    "fax": false
  },
  "status": "active"
}
```

## 🎨 Analytics Dashboard

The Twilio dashboard shows real-time analytics:

### Messages Analytics
- Total messages sent and received
- Delivery success rate
- Failed messages count

### Calls Analytics
- Total calls made
- Completed vs failed calls
- Total call duration
- Average call duration

### Phone Numbers Stats
- Total active numbers
- Voice-enabled numbers
- SMS-enabled numbers

## 🧪 Testing

### Step 1: Connect Twilio

1. Open your app: `http://localhost:3000`
2. Find the **Twilio** integration card (📱)
3. Click **Connect Twilio**
4. You'll be asked to authenticate (enter credentials if prompted)

### Step 2: Verify Connection

```bash
# Check in Nango dashboard
open http://localhost:3003/admin

# Go to Connections tab
# You should see your Twilio connection
```

### Step 3: Trigger Manual Sync

In Nango dashboard:
1. Go to **Connections**
2. Click on your Twilio connection
3. Click **Trigger Sync**
4. Select which sync to run:
   - `twilio-messages`
   - `twilio-calls`
   - `twilio-phone-numbers`

### Step 4: View Synced Data

Check the analytics dashboard on your app's main page to see:
- Messages statistics
- Call analytics
- Phone number information

### Step 5: Check Logs

```bash
# View sync logs
docker-compose logs nango-jobs -f

# You should see:
# Starting Twilio messages sync...
# Synced 50 messages (total: 50)
# ✅ Successfully synced 50 Twilio messages
```

## 🐛 Troubleshooting

### Issue: "Authentication Failed"

**Cause:** Invalid Twilio credentials

**Solution:**
1. Verify your Account SID and Auth Token in Twilio Console
2. Make sure there are no extra spaces
3. Check if Auth Token has been regenerated
4. Update `.env` with correct credentials

### Issue: "No data syncing"

**Cause:** Integration not deployed or Twilio account has no data

**Solution:**
```bash
# 1. Verify deployment
cd nango-integrations
nango list

# 2. Check if Twilio account has data
# - Send a test SMS
# - Make a test call
# - Then trigger sync manually

# 3. Check logs
docker-compose logs nango-jobs --tail=100
```

### Issue: "Rate Limiting"

**Cause:** Too many API requests to Twilio

**Solution:**
1. Twilio has rate limits on their API
2. Adjust sync frequency in `nango.yaml`:
```yaml
twilio-messages:
  runs: every 30min  # Instead of 15min
```
3. Redeploy: `nango deploy`

### Issue: "Invalid Endpoint"

**Cause:** Account SID placeholder not replaced

**Solution:**

The sync scripts use `{AccountSid}` placeholder which Nango should automatically replace. If it doesn't:

1. Check Nango configuration has the Account SID
2. Or modify sync scripts to use your actual Account SID

### Issue: "Sync fails with 20003 error"

**Cause:** Authentication headers not set correctly

**Solution:**

Make sure in Nango dashboard:
1. Authentication type is set correctly
2. Account SID is in username field
3. Auth Token is in password field
4. Base URL is `https://api.twilio.com`

## 📚 API Endpoints

### Get Messages

```bash
GET /api/nango/twilio/messages?connectionId=your-connection-id

Response:
{
  "success": true,
  "data": [...messages...],
  "count": 50,
  "stats": {
    "total": 50,
    "sent": 30,
    "received": 20,
    "delivered": 45,
    "failed": 5
  }
}
```

### Get Calls

```bash
GET /api/nango/twilio/calls?connectionId=your-connection-id

Response:
{
  "success": true,
  "data": [...calls...],
  "count": 25,
  "stats": {
    "total": 25,
    "completed": 20,
    "failed": 5,
    "totalDuration": 3125,
    "averageDuration": 125
  }
}
```

### Get Phone Numbers

```bash
GET /api/nango/twilio/phone-numbers?connectionId=your-connection-id

Response:
{
  "success": true,
  "data": [...numbers...],
  "count": 3,
  "stats": {
    "total": 3,
    "voiceEnabled": 3,
    "smsEnabled": 3,
    "mmsEnabled": 2,
    "faxEnabled": 0
  }
}
```

## 🔒 Security Best Practices

### 1. Protect Your Credentials

- ✅ Never commit `.env` to git
- ✅ Use environment variables in production
- ✅ Rotate Auth Token regularly
- ✅ Use subaccounts for different applications

### 2. Monitor Usage

```bash
# Check Twilio usage
# Go to: https://www.twilio.com/console/usage

# Set up usage alerts in Twilio Console
```

### 3. Implement Rate Limiting

```typescript
// In your app, add rate limiting for Twilio API calls
// to prevent accidental overuse
```

## 🎯 Use Cases

### 1. Customer Support Dashboard

Track all support messages and calls in one place:
- See conversation history
- Monitor response times
- Analyze call patterns

### 2. Marketing Analytics

Measure campaign effectiveness:
- SMS delivery rates
- Response rates
- Cost per message

### 3. Call Center Analytics

Monitor call center performance:
- Average call duration
- Call completion rates
- Peak call times

### 4. Phone Number Management

Keep track of your phone number inventory:
- Active numbers
- Capabilities
- Usage patterns

## 🚀 Next Steps

### 1. Customize Sync Scripts

Edit sync scripts to add more fields:
```typescript
// nango-integrations/twilio/syncs/twilio-messages.ts

// Add more fields like:
- media_url (for MMS)
- num_segments
- num_media
```

### 2. Add Webhooks

Set up real-time webhooks in Twilio:
1. Go to Twilio Console → **Messaging** → **Settings**
2. Add webhook URL: `http://your-domain/api/nango/twilio/webhook`
3. Handle incoming webhooks in your app

### 3. Build Custom Reports

Use the synced data to build custom reports:
- Daily message volume
- Cost analysis
- Customer engagement metrics

### 4. Integrate with Other Services

Combine Twilio data with other integrations:
- Send Slack notifications for failed messages
- Log calls in Salesforce
- Track revenue in Stripe

## 📞 Support

### Twilio Resources
- **Twilio Docs**: https://www.twilio.com/docs
- **API Reference**: https://www.twilio.com/docs/api
- **Support**: https://support.twilio.com

### Nango Resources
- **Nango Docs**: https://docs.nango.dev
- **Self-Hosted Guide**: See `docs/SELF_HOSTED_SETUP.md`
- **Slack Community**: https://nango.dev/slack

## ✅ Checklist

Before going live:

- [ ] Twilio account created and verified
- [ ] Account SID and Auth Token configured
- [ ] Integration deployed to Nango
- [ ] Test messages/calls syncing correctly
- [ ] Dashboard showing correct analytics
- [ ] Error handling tested
- [ ] Rate limits configured appropriately
- [ ] Security best practices implemented

---

## 🎉 You're Ready!

Your custom Twilio integration is now complete! You can:

- ✅ Track all messages and calls
- ✅ Monitor phone number usage
- ✅ View real-time analytics
- ✅ Build custom reports

**Need help?** Check the [main README](../README.md) or [Nango docs](https://docs.nango.dev)!

