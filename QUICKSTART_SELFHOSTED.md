# 🚀 Quick Start: Self-Hosted Nango + Stripe Integration

Get up and running with self-hosted Nango and a custom Stripe integration in under 30 minutes!

## What You'll Build

By the end of this guide, you'll have:

- ✅ Self-hosted Nango running locally with Docker
- ✅ Complete Stripe integration with OAuth
- ✅ Automatic syncing of customers, payments, and subscriptions
- ✅ Beautiful analytics dashboard showing real-time data
- ✅ Full control over your data and infrastructure

## Prerequisites

Install these first:

- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop))
- Node.js 18+ ([Download](https://nodejs.org/))
- Stripe Account ([Sign up](https://stripe.com/))

## Step 1: Start Nango (5 minutes)

```bash
# Clone the repo
git clone <repo-url>
cd nango-nextjs-demo

# Install dependencies
npm install

# Start Nango with one command!
npm run nango:start
```

Wait 30-60 seconds for services to start. You'll see:

```
✅ PostgreSQL is ready
✅ Redis is ready
✅ Nango Server is ready
✅ Nango Jobs Worker is ready

📍 Nango Dashboard:  http://localhost:3003/admin
🔑 Email:    admin@example.com
🔑 Password: admin123
```

## Step 2: Configure Nango (5 minutes)

```bash
# Open Nango dashboard
open http://localhost:3003/admin
```

1. **Login** with the credentials above
2. **Go to Settings** → **API Keys**
3. **Copy** your keys
4. **Create .env file**:

```bash
cp .env.example .env
```

5. **Edit .env** and add your keys:

```env
NANGO_HOST_URL=http://localhost:3003
NANGO_SECRET_KEY=<paste-your-secret-key>
NEXT_PUBLIC_NANGO_PUBLIC_KEY=<paste-your-public-key>
```

## Step 3: Configure Stripe (10 minutes)

### A. Create Stripe OAuth App

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** → **Connect** → **Settings**
3. Click **+ OAuth settings** (if not already enabled)
4. Add redirect URL:
   ```
   http://localhost:3003/oauth/callback
   ```
5. Copy your **Client ID** and **Client Secret**

### B. Add Stripe to Nango

1. In Nango dashboard: **Integrations** → **Add Integration**
2. Select **Custom Integration**
3. Fill in:
   - **Name**: `stripe`
   - **Provider**: Choose **Stripe** from dropdown
   - **Client ID**: (paste from Stripe)
   - **Client Secret**: (paste from Stripe)
   - **Scopes**: `read_write`
4. Click **Save**

## Step 4: Deploy Stripe Integration (5 minutes)

The Stripe sync scripts are already created! Just deploy them:

```bash
# Deploy to your local Nango
cd nango-integrations

# Make sure CLI knows to use local instance
export NANGO_HOST_URL=http://localhost:3003
export NANGO_SECRET_KEY=<your-secret-key>

# Deploy (requires Nango CLI)
npm install -g nango
nango deploy

# You should see:
# ✅ Deployed stripe-customers
# ✅ Deployed stripe-payments  
# ✅ Deployed stripe-subscriptions
```

## Step 5: Run Your App (2 minutes)

```bash
# Start Next.js
npm run dev

# Open in browser
open http://localhost:3000
```

You should see:
- GitHub integration card
- Slack integration card
- **Stripe integration card** 💳

## Step 6: Connect Stripe & See Magic! (3 minutes)

1. **Click "Connect Stripe"**
2. **Sign in to Stripe** (if not already)
3. **Authorize the app**
4. **You'll be redirected back** to your app

Now watch as:
- ✨ Connection appears in your dashboard
- ✨ Data starts syncing automatically
- ✨ Stripe analytics card shows up with real data

### View Your Data

The Stripe analytics card will show:
- **Total Customers**
- **Total Revenue**
- **Payment Count**
- **Subscription Count**

All data refreshes automatically every 30-60 minutes!

## Verify Everything Works

Run the test suite:

```bash
bash scripts/test-setup.sh
```

You should see:
```
✅ PostgreSQL Database
✅ Redis Cache  
✅ Nango Server
✅ Nango Jobs Worker
✅ Nango Health Check
✅ Next.js App
✅ All files present

🎉 All tests passed!
```

## What Just Happened?

You now have:

1. **Self-Hosted Infrastructure**
   - PostgreSQL database with all your data
   - Redis for queue management
   - Nango server handling OAuth
   - Background workers syncing data

2. **Custom Stripe Integration**
   - 3 sync scripts running automatically
   - OAuth flow completely configured
   - Real-time data syncing
   - Built from scratch!

3. **Production-Ready Setup**
   - Error handling
   - Automatic retries
   - Pagination support
   - Incremental syncing

## Next Steps

### View Sync Logs

```bash
# See what's happening
docker-compose logs -f nango-jobs

# You'll see logs like:
# Starting Stripe customers sync...
# Synced 50 customers (total: 50)
# ✅ Successfully synced 50 Stripe customers
```

### Trigger Manual Sync

In Nango dashboard:
1. Go to **Connections**
2. Click on your Stripe connection
3. Click **Trigger Sync**
4. Choose which data to sync
5. Watch it run in real-time!

### Add More Integrations

Now that you have the pattern, add more:

```bash
# Copy the Stripe integration structure
cp -r nango-integrations/stripe nango-integrations/my-integration

# Edit the sync scripts
# Update nango.yaml
# Deploy!
```

### Monitor Your Services

```bash
# Check status
npm run nango:status

# View logs
npm run nango:logs

# Restart if needed
npm run nango:restart
```

### Customize Sync Frequency

Edit `nango-integrations/nango.yaml`:

```yaml
stripe:
  syncs:
    stripe-customers:
      runs: every 15min  # Change this!
```

Then redeploy:

```bash
cd nango-integrations
nango deploy
```

## Troubleshooting

### Services Won't Start

```bash
# Check Docker is running
docker info

# Restart everything
npm run nango:stop
npm run nango:start
```

### Can't Access Dashboard

```bash
# Check if port 3003 is available
lsof -i :3003

# View server logs
docker-compose logs nango-server
```

### OAuth Fails

1. Verify redirect URL in Stripe: `http://localhost:3003/oauth/callback`
2. Check Nango logs: `docker-compose logs nango-server`
3. Ensure environment variables are set correctly

### Sync Not Running

```bash
# Check jobs worker
docker-compose logs nango-jobs

# Verify integration is deployed
cd nango-integrations
nango list

# Manually trigger sync in dashboard
```

## Useful Commands

```bash
# Nango Management
npm run nango:start      # Start all services
npm run nango:stop       # Stop all services  
npm run nango:restart    # Restart services
npm run nango:status     # Check status
npm run nango:logs       # View logs

# Development
npm run dev              # Start Next.js
npm run build            # Build for production
npm run test             # Run tests

# Docker
docker-compose ps        # Check containers
docker-compose down -v   # Remove everything
```

## Resources

- **Full Setup Guide**: [docs/SELF_HOSTED_SETUP.md](docs/SELF_HOSTED_SETUP.md)
- **Cloud vs Self-Hosted**: [docs/CLOUD_VS_SELFHOSTED.md](docs/CLOUD_VS_SELFHOSTED.md)
- **Nango Docs**: https://docs.nango.dev
- **Stripe API Docs**: https://stripe.com/docs/api

## Success! 🎉

You now have a fully functional self-hosted Nango instance with a custom Stripe integration built from scratch!

You've learned:
- How to self-host Nango with Docker
- How to build custom OAuth integrations
- How to create sync scripts with pagination
- How to handle real-time data syncing
- How to manage infrastructure

**Ready for more?** Try adding:
- GitHub integration (pre-built)
- Slack integration (custom)
- Your own custom integration!

---

**Questions?** Check out the comprehensive docs or join the [Nango Slack community](https://nango.dev/slack)!

