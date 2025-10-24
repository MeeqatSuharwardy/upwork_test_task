# Self-Hosted Nango Setup Guide

This guide will walk you through setting up a self-hosted Nango instance locally using Docker and building a custom integration from scratch.

## 📋 Table of Contents

- [Why Self-Host?](#why-self-host)
- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Step-by-Step Setup](#step-by-step-setup)
- [Building a Custom Integration](#building-a-custom-integration)
- [Testing End-to-End](#testing-end-to-end)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

## 🤔 Why Self-Host?

**Benefits of Self-Hosting Nango:**

- ✅ **Full Control** - Complete control over your infrastructure and data
- ✅ **Data Privacy** - All OAuth tokens and user data stay on your servers
- ✅ **Customization** - Modify and extend Nango to fit your needs
- ✅ **Cost Efficiency** - No per-connection or per-sync costs
- ✅ **Compliance** - Meet strict data residency requirements
- ✅ **Development** - Perfect for local development and testing

**When to Use Cloud vs Self-Hosted:**

| Feature | Cloud (Nango.dev) | Self-Hosted |
|---------|------------------|-------------|
| Setup Time | 5 minutes | 30-60 minutes |
| Maintenance | Managed by Nango | You manage it |
| Scaling | Automatic | Manual |
| Cost | Pay per usage | Infrastructure only |
| Data Location | Nango's servers | Your servers |
| Best For | Quick start, production | Control, privacy, development |

## ✅ Prerequisites

Before you begin, ensure you have:

- **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (included with Docker Desktop)
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **4GB+ RAM** available for Docker
- **5GB+ disk space** for Docker images and volumes

Verify your installations:

```bash
docker --version          # Should be 20.x or higher
docker-compose --version  # Should be 2.x or higher
node --version           # Should be 18.x or higher
```

## 🏗️ Architecture Overview

The self-hosted setup includes:

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │              │  │              │  │              │  │
│  │  PostgreSQL  │  │    Redis     │  │    Nango     │  │
│  │  Database    │  │    Cache     │  │    Server    │  │
│  │              │  │              │  │              │  │
│  │  Port: 5432  │  │  Port: 6379  │  │  Port: 3003  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                       │                  │
│                           ┌──────────────┐              │
│                           │              │              │
│                           │    Nango     │              │
│                           │     Jobs     │              │
│                           │   (Worker)   │              │
│                           └──────────────┘              │
└─────────────────────────────────────────────────────────┘
                              ↑
                              │
                    ┌─────────────────┐
                    │                 │
                    │  Next.js App    │
                    │  Port: 3000     │
                    │                 │
                    └─────────────────┘
```

## 🚀 Quick Start

If you want to get up and running quickly:

```bash
# 1. Start Docker services
docker-compose up -d

# 2. Wait for services to be ready (30-60 seconds)
docker-compose logs -f nango-server

# 3. Access Nango Dashboard
open http://localhost:3003/admin

# 4. Login with default credentials
# Email: admin@example.com
# Password: admin123

# 5. Copy your API keys and update .env
cp .env.local.example .env.local
# Edit .env.local with your keys

# 6. Start your Next.js app
npm run dev

# 7. Open your app
open http://localhost:3000
```

## 📖 Step-by-Step Setup

### Step 1: Start Docker Services

```bash
# Navigate to project directory
cd nango-nextjs-demo

# Start all services
docker-compose up -d

# Verify all services are running
docker-compose ps

# Expected output:
# NAME            STATE    PORTS
# nango-db        Up       0.0.0.0:5432->5432/tcp
# nango-redis     Up       0.0.0.0:6379->6379/tcp
# nango-server    Up       0.0.0.0:3003->3003/tcp
# nango-jobs      Up       
```

### Step 2: Check Service Health

```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs nango-server

# Follow logs in real-time
docker-compose logs -f nango-server

# Check if database is ready
docker-compose exec nango-db pg_isready -U nango

# Check if Redis is ready
docker-compose exec nango-redis redis-cli ping
```

### Step 3: Access Nango Dashboard

1. Open browser to: `http://localhost:3003/admin`
2. Login with credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

3. You should see the Nango dashboard!

### Step 4: Get API Keys

1. In the Nango dashboard, click on **"Settings"** → **"API Keys"**
2. Copy your **Public Key** and **Secret Key**
3. Create your environment file:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your keys:

```env
NANGO_HOST_URL=http://localhost:3003
NANGO_SECRET_KEY=your_local_secret_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_local_public_key_here
```

### Step 5: Update Application Configuration

Update `lib/nango-server.ts` to use the local instance:

```typescript
nangoServerInstance = new Nango({ 
  secretKey,
  host: process.env.NANGO_HOST_URL || 'http://localhost:3003'
})
```

Update `lib/nango-client.ts`:

```typescript
export function getNangoClient() {
  if (typeof window === 'undefined') {
    throw new Error('getNangoClient can only be called on the client side')
  }

  if (!nangoClientInstance) {
    const publicKey = process.env.NEXT_PUBLIC_NANGO_PUBLIC_KEY

    if (!publicKey) {
      throw new Error('NEXT_PUBLIC_NANGO_PUBLIC_KEY is not set')
    }

    nangoClientInstance = new Nango({
      publicKey,
      host: process.env.NEXT_PUBLIC_NANGO_HOST_URL || 'http://localhost:3003'
    })
  }

  return nangoClientInstance
}
```

### Step 6: Start Your Application

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🔧 Building a Custom Integration

Let's build a complete custom integration for **Stripe** from scratch!

### Why Stripe?

- Popular payment platform
- Clear OAuth flow
- Rich API for syncing data
- Real-world use case

### Step 1: Create Stripe OAuth App

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Settings** → **Connect** → **Settings**
3. Add OAuth redirect URL: `http://localhost:3003/oauth/callback`
4. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Integration in Nango

1. Open Nango Dashboard: `http://localhost:3003/admin`
2. Click **"Integrations"** → **"Add Integration"**
3. Select **"Custom Integration"**
4. Fill in:
   - **Name**: `stripe`
   - **Provider**: `stripe`
   - **Client ID**: (from Stripe)
   - **Client Secret**: (from Stripe)
   - **Scopes**: `read_write`
   - **Authorization URL**: `https://connect.stripe.com/oauth/authorize`
   - **Token URL**: `https://connect.stripe.com/oauth/token`
   - **Auth Mode**: `OAUTH2`

### Step 3: Create Integration Configuration

Create `nango-integrations/stripe/nango.yaml`:

```yaml
integrations:
  stripe:
    provider: stripe
    oauth_client_id: ${STRIPE_CLIENT_ID}
    oauth_client_secret: ${STRIPE_CLIENT_SECRET}
    oauth_scopes:
      - read_write
    syncs:
      stripe-customers:
        runs: every 1h
        endpoint: /api/nango/syncs/stripe-customers
        output: StripeCustomer
        sync_type: incremental
        description: Syncs Stripe customers
        
      stripe-payments:
        runs: every 30min
        endpoint: /api/nango/syncs/stripe-payments
        output: StripePayment
        sync_type: incremental
        description: Syncs Stripe payment intents
        
      stripe-subscriptions:
        runs: every 1h
        endpoint: /api/nango/syncs/stripe-subscriptions
        output: StripeSubscription
        sync_type: incremental
        description: Syncs Stripe subscriptions

models:
  StripeCustomer:
    id: string
    email: string
    name: string
    created: number
    currency: string
    balance: number
    
  StripePayment:
    id: string
    amount: number
    currency: string
    status: string
    customer: string
    created: number
    description: string
    
  StripeSubscription:
    id: string
    customer: string
    status: string
    current_period_start: number
    current_period_end: number
    created: number
```

### Step 4: Create TypeScript Models

Update `nango-integrations/models.ts`:

```typescript
// ... existing models ...

// Stripe Models
export interface StripeCustomer {
  id: string
  email: string
  name: string
  created: number
  currency: string
  balance: number
}

export interface StripePayment {
  id: string
  amount: number
  currency: string
  status: string
  customer: string
  created: number
  description: string
}

export interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  created: number
}
```

### Step 5: Create Sync Scripts

Create `nango-integrations/stripe/syncs/stripe-customers.ts`:

```typescript
import type { NangoSync, StripeCustomer } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let startingAfter: string | undefined

    while (hasMore) {
      const params: any = { limit: '100' }
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      const response = await nango.get({
        endpoint: '/v1/customers',
        params,
      })

      const customers: StripeCustomer[] = response.data.data.map((customer: any) => ({
        id: customer.id,
        email: customer.email || '',
        name: customer.name || '',
        created: customer.created,
        currency: customer.currency || 'usd',
        balance: customer.balance || 0,
      }))

      await nango.batchSave(customers, 'StripeCustomer')

      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    await nango.log('Successfully synced Stripe customers')
  } catch (error: any) {
    throw new Error(`Failed to sync Stripe customers: ${error.message}`)
  }
}
```

Create `nango-integrations/stripe/syncs/stripe-payments.ts`:

```typescript
import type { NangoSync, StripePayment } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let startingAfter: string | undefined

    while (hasMore) {
      const params: any = { limit: '100' }
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      const response = await nango.get({
        endpoint: '/v1/payment_intents',
        params,
      })

      const payments: StripePayment[] = response.data.data.map((payment: any) => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        customer: payment.customer || '',
        created: payment.created,
        description: payment.description || '',
      }))

      await nango.batchSave(payments, 'StripePayment')

      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    await nango.log('Successfully synced Stripe payments')
  } catch (error: any) {
    throw new Error(`Failed to sync Stripe payments: ${error.message}`)
  }
}
```

Create `nango-integrations/stripe/syncs/stripe-subscriptions.ts`:

```typescript
import type { NangoSync, StripeSubscription } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    let hasMore = true
    let startingAfter: string | undefined

    while (hasMore) {
      const params: any = { limit: '100' }
      if (startingAfter) {
        params.starting_after = startingAfter
      }

      const response = await nango.get({
        endpoint: '/v1/subscriptions',
        params,
      })

      const subscriptions: StripeSubscription[] = response.data.data.map((sub: any) => ({
        id: sub.id,
        customer: sub.customer,
        status: sub.status,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        created: sub.created,
      }))

      await nango.batchSave(subscriptions, 'StripeSubscription')

      hasMore = response.data.has_more
      if (hasMore && response.data.data.length > 0) {
        startingAfter = response.data.data[response.data.data.length - 1].id
      }
    }

    await nango.log('Successfully synced Stripe subscriptions')
  } catch (error: any) {
    throw new Error(`Failed to sync Stripe subscriptions: ${error.message}`)
  }
}
```

### Step 6: Add to UI

Update `components/IntegrationsList.tsx` to include Stripe:

```typescript
const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect to GitHub to sync issues and pull requests',
    icon: '🔗',
    type: 'prebuilt'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect to Slack to sync messages and channels',
    icon: '💬',
    type: 'custom'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Connect to Stripe to sync customers, payments, and subscriptions',
    icon: '💳',
    type: 'custom'
  }
]
```

### Step 7: Deploy Integration to Local Nango

```bash
# Install Nango CLI
npm install -g nango

# Configure Nango CLI for local instance
export NANGO_HOST=http://localhost:3003
export NANGO_SECRET_KEY=your_secret_key_here

# Deploy integrations
cd nango-integrations
nango deploy --env local

# Verify deployment
nango list
```

## 🧪 Testing End-to-End

### 1. Test Docker Services

```bash
# Check all services are running
docker-compose ps

# Test Nango server health
curl http://localhost:3003/health

# Expected output: {"status":"ok"}
```

### 2. Test Nango Dashboard

1. Open `http://localhost:3003/admin`
2. Verify you can see:
   - Dashboard
   - Integrations list
   - API Keys
   - Activity logs

### 3. Test OAuth Flow

1. Start your Next.js app: `npm run dev`
2. Open `http://localhost:3000`
3. Click **"Connect Stripe"**
4. You should see Stripe OAuth page
5. Authorize the app
6. Verify connection appears in your dashboard

### 4. Test Sync Functionality

```bash
# Trigger a manual sync
curl -X POST http://localhost:3003/api/sync/start \
  -H "Authorization: Bearer YOUR_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "provider_config_key": "stripe",
    "connection_id": "user-123",
    "sync_name": "stripe-customers"
  }'

# Check sync logs
docker-compose logs nango-jobs
```

### 5. Test Data Retrieval

Create a test endpoint in `app/api/nango/stripe/customers/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getNangoServer } from '@/lib/nango-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const connectionId = searchParams.get('connectionId')

  if (!connectionId) {
    return NextResponse.json(
      { error: 'connectionId is required' },
      { status: 400 }
    )
  }

  try {
    const nango = getNangoServer()
    
    // Get synced records
    const records = await nango.getRecords({
      providerConfigKey: 'stripe',
      connectionId,
      model: 'StripeCustomer',
    })

    return NextResponse.json({
      success: true,
      data: records,
      count: records.length,
    })
  } catch (error: any) {
    console.error('Failed to fetch Stripe customers:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

Test it:

```bash
curl "http://localhost:3000/api/nango/stripe/customers?connectionId=user-123"
```

## 🐛 Troubleshooting

### Docker Services Won't Start

**Problem**: Services fail to start or are unhealthy

**Solutions**:
```bash
# Check Docker is running
docker info

# Check port availability
lsof -i :3003
lsof -i :5432
lsof -i :6379

# Restart services
docker-compose down
docker-compose up -d

# View detailed logs
docker-compose logs -f
```

### Cannot Access Nango Dashboard

**Problem**: `http://localhost:3003/admin` doesn't load

**Solutions**:
```bash
# Check if Nango server is running
docker-compose ps nango-server

# Check server logs
docker-compose logs nango-server

# Restart Nango server
docker-compose restart nango-server

# Check firewall settings
# Make sure port 3003 is not blocked
```

### OAuth Redirect Fails

**Problem**: OAuth callback returns error

**Solutions**:
1. Verify redirect URL in Stripe matches: `http://localhost:3003/oauth/callback`
2. Check Nango logs: `docker-compose logs nango-server`
3. Ensure `NANGO_CALLBACK_URL` in docker-compose.yml is correct
4. Try using `127.0.0.1` instead of `localhost` or vice versa

### Sync Jobs Not Running

**Problem**: Data is not syncing automatically

**Solutions**:
```bash
# Check jobs worker is running
docker-compose ps nango-jobs

# View jobs logs
docker-compose logs nango-jobs

# Restart jobs worker
docker-compose restart nango-jobs

# Manually trigger sync in Nango dashboard
```

### Database Connection Issues

**Problem**: "Cannot connect to database" errors

**Solutions**:
```bash
# Check database is running
docker-compose ps nango-db

# Test database connection
docker-compose exec nango-db psql -U nango -d nango -c "SELECT 1"

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
```

## 🚀 Production Deployment

### Security Considerations

1. **Change Default Credentials**
   ```yaml
   # In docker-compose.yml
   NANGO_ADMIN_EMAIL: your-secure-email@company.com
   NANGO_ADMIN_PASSWORD: your-strong-password-here
   ```

2. **Use Strong Encryption Key**
   ```bash
   # Generate a secure key
   openssl rand -hex 32
   
   # Update in docker-compose.yml
   NANGO_ENCRYPTION_KEY: 'your-generated-key-here'
   ```

3. **Enable SSL/TLS**
   - Use reverse proxy (Nginx/Caddy)
   - Configure SSL certificates
   - Update URLs to use HTTPS

4. **Database Security**
   ```yaml
   # Use strong password
   POSTGRES_PASSWORD: your-strong-db-password
   
   # Enable SSL
   NANGO_DB_SSL: 'true'
   ```

5. **Network Security**
   - Don't expose database ports publicly
   - Use Docker networks for internal communication
   - Configure firewall rules

### Scaling Considerations

1. **Horizontal Scaling**
   ```yaml
   # Add more job workers
   nango-jobs-1:
     # ... same config as nango-jobs
   nango-jobs-2:
     # ... same config as nango-jobs
   ```

2. **Database Performance**
   - Increase PostgreSQL resources
   - Add read replicas
   - Configure connection pooling

3. **Redis Caching**
   - Use Redis cluster for high availability
   - Configure persistence
   - Monitor memory usage

### Monitoring

1. **Health Checks**
   ```bash
   # Add to monitoring system
   curl http://your-domain:3003/health
   ```

2. **Logs**
   ```bash
   # Centralize logs with Loki, Elasticsearch, etc.
   docker-compose logs -f > nango.log
   ```

3. **Metrics**
   - Monitor sync success rates
   - Track API response times
   - Alert on failures

### Backup Strategy

```bash
# Backup database
docker-compose exec nango-db pg_dump -U nango nango > backup.sql

# Restore database
docker-compose exec -T nango-db psql -U nango nango < backup.sql

# Backup volumes
docker run --rm -v nango_nango-db-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/db-backup.tar.gz /data
```

## 📚 Additional Resources

- [Nango Self-Hosting Docs](https://docs.nango.dev/host/self-host/overview)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Stripe OAuth Guide](https://stripe.com/docs/connect/oauth-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🎉 Next Steps

Now that you have a self-hosted Nango instance running:

1. ✅ Create more custom integrations
2. ✅ Configure webhooks for real-time events
3. ✅ Set up monitoring and alerts
4. ✅ Deploy to production environment
5. ✅ Scale your infrastructure

---

**Need Help?**
- Check the [main README](../README.md)
- See [Troubleshooting Guide](../TROUBLESHOOTING_CHECKLIST.md)
- Join [Nango Slack Community](https://nango.dev/slack)

