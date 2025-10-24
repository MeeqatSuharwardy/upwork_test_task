# Cloud vs Self-Hosted Nango: Complete Comparison Guide

This guide helps you decide between using Nango's cloud service and self-hosting Nango, with detailed comparisons, use cases, and migration paths.

## 📊 Quick Comparison Table

| Feature | Cloud (Nango.dev) | Self-Hosted |
|---------|------------------|-------------|
| **Setup Time** | 5 minutes | 30-60 minutes |
| **Maintenance** | Managed by Nango | Your responsibility |
| **Infrastructure** | Fully managed | You manage Docker/K8s |
| **Scaling** | Automatic | Manual configuration |
| **Updates** | Automatic | Manual updates |
| **Data Location** | Nango's servers (AWS) | Your infrastructure |
| **Cost Model** | Pay per connection/sync | Infrastructure only |
| **Uptime SLA** | 99.9% guaranteed | Your responsibility |
| **Support** | Priority support available | Community + docs |
| **Security** | SOC 2 Type II | You control everything |
| **Customization** | Limited | Unlimited |
| **Debugging** | Dashboard + logs | Full access to logs |
| **Compliance** | GDPR, SOC 2, HIPAA | Your compliance |

## 🎯 When to Use Cloud

### Best For:

✅ **Getting Started Quickly**
- Need to prototype in hours, not days
- Want to focus on your application, not infrastructure
- Small team without DevOps resources

✅ **Production Applications**
- Need reliable, managed service
- Want automatic updates and security patches
- Require 99.9% uptime SLA
- Need priority support

✅ **Moderate Scale**
- Up to 10,000 connections
- Standard sync frequencies (15min+)
- Predictable usage patterns

✅ **Compliance-Light Applications**
- No strict data residency requirements
- Can use US-based infrastructure
- SOC 2 compliance sufficient

### Example Use Cases:

```typescript
// Perfect for cloud:
// - SaaS products with multi-tenant architecture
// - Internal tools with < 100 integrations
// - B2B apps with standard OAuth needs
// - MVPs and prototypes
```

### Cost Example (Cloud):

```
Pricing (example):
- Free tier: Up to 5 connections
- Starter: $49/mo for 50 connections
- Pro: $199/mo for 500 connections
- Enterprise: Custom pricing

Total Cost for 100 connections:
- Base: $49-199/mo
- No infrastructure costs
- No maintenance overhead
```

## 🏗️ When to Self-Host

### Best For:

✅ **Data Privacy & Control**
- Strict data residency requirements
- Financial, healthcare, or government data
- Need to audit all code and infrastructure
- Want OAuth tokens on your servers

✅ **High Scale or Special Requirements**
- 10,000+ connections
- Custom sync frequencies (< 1 minute)
- Need to modify Nango's code
- Special network requirements (VPNs, private networks)

✅ **Cost Optimization at Scale**
- High volume of syncs
- Large data transfers
- Want to optimize infrastructure costs

✅ **Full Customization**
- Need custom authentication flows
- Want to modify sync logic
- Require special rate limiting
- Need custom database schemas

### Example Use Cases:

```typescript
// Perfect for self-hosted:
// - Financial platforms (banking, trading)
// - Healthcare applications (HIPAA)
// - Enterprise with private cloud
// - High-frequency data syncing
// - Developer tools and platforms
```

### Cost Example (Self-Hosted):

```
Infrastructure Costs:
- Database (PostgreSQL): $50-200/mo
- Redis: $20-100/mo
- App Server: $50-200/mo
- Total: ~$120-500/mo

Additional Costs:
- DevOps time: 2-4 hours/week
- Monitoring: $20-50/mo
- Backups: $20-50/mo

Total for 1000 connections:
- Infrastructure: $200-600/mo
- Personnel: ~$1000/mo (DevOps time)
- Savings at scale: Significant
```

## 🔄 Feature Comparison

### Setup & Configuration

#### Cloud:
```bash
# 1. Sign up at nango.dev
# 2. Get API keys
# 3. Configure in .env
NANGO_SECRET_KEY=nango_sk_xxx
NEXT_PUBLIC_NANGO_PUBLIC_KEY=nango_pk_xxx

# 4. Start coding!
npm run dev
```

**Time: 5 minutes**

#### Self-Hosted:
```bash
# 1. Install Docker
# 2. Configure docker-compose.yml
# 3. Start services
docker-compose up -d

# 4. Configure Nango
open http://localhost:3003/admin

# 5. Get API keys
# 6. Configure environment
# 7. Deploy integrations
cd nango-integrations && nango deploy

# 8. Start coding!
npm run dev
```

**Time: 30-60 minutes**

### OAuth Configuration

#### Cloud:
```yaml
# Configure in Nango Dashboard UI
# OAuth credentials stored securely by Nango
# Automatic token refresh
# Built-in rate limiting
```

#### Self-Hosted:
```yaml
# Configure in local Nango instance
# OAuth credentials in your database
# You manage token refresh
# Custom rate limiting possible
```

### Data Syncing

#### Cloud:
```typescript
// Syncs run on Nango's infrastructure
// Automatic scaling
// Monitored by Nango team
// Logs in dashboard

integrations:
  stripe:
    syncs:
      customers:
        runs: every 1h  # Minimum: 15 minutes
```

#### Self-Hosted:
```typescript
// Syncs run on your infrastructure
// You scale workers
// You monitor
// Full access to logs

integrations:
  stripe:
    syncs:
      customers:
        runs: every 1m  # Any frequency you want
```

### Security & Compliance

#### Cloud:
- ✅ SOC 2 Type II certified
- ✅ GDPR compliant
- ✅ HIPAA available (Enterprise)
- ✅ Data encrypted at rest and in transit
- ✅ Regular security audits
- ✅ DDoS protection
- ⚠️ Data in US (AWS)
- ⚠️ Shared infrastructure

#### Self-Hosted:
- ✅ Full control over data location
- ✅ Private infrastructure
- ✅ Custom security policies
- ✅ Audit all code
- ✅ On-premises possible
- ⚠️ You handle security
- ⚠️ You manage compliance
- ⚠️ You do security audits

### Monitoring & Debugging

#### Cloud:
```typescript
// Built-in dashboard
// Real-time sync monitoring
// Error notifications
// Usage analytics
// Log retention: 30 days

// View in dashboard:
// - Connection status
// - Sync history
// - Error logs
// - Usage metrics
```

#### Self-Hosted:
```bash
# Full access to everything
# Custom monitoring tools
# Unlimited log retention
# Custom alerting

# Commands:
docker-compose logs -f nango-server
docker-compose logs -f nango-jobs

# Integrate with:
# - Datadog
# - New Relic
# - Prometheus + Grafana
# - ELK Stack
```

### Updates & Maintenance

#### Cloud:
- ✅ Automatic updates
- ✅ Zero downtime deployments
- ✅ Security patches applied immediately
- ✅ New features automatically available
- ✅ Database migrations handled
- ⚠️ Can't delay updates

#### Self-Hosted:
- ⚠️ Manual updates required
- ⚠️ Plan downtime windows
- ⚠️ Test updates in staging
- ⚠️ Apply security patches manually
- ✅ Control update timing
- ✅ Test before production

## 🚀 Migration Guide

### Cloud to Self-Hosted

```bash
# Step 1: Export your configuration
# From Nango dashboard, export:
# - Integration configurations
# - OAuth credentials
# - Sync scripts

# Step 2: Set up self-hosted instance
npm run nango:start

# Step 3: Import configurations
# In local Nango dashboard (localhost:3003/admin)
# Manually recreate integrations

# Step 4: Update environment
# Change .env from:
NANGO_HOST_URL=https://api.nango.dev

# To:
NANGO_HOST_URL=http://localhost:3003

# Step 5: Redeploy integrations
cd nango-integrations
nango deploy

# Step 6: Test thoroughly
npm run test

# Step 7: Migrate connections
# Users will need to reconnect their accounts
```

**Migration Time: 2-4 hours**
**Downtime Required: Yes (for reconnection)**

### Self-Hosted to Cloud

```bash
# Step 1: Sign up at nango.dev
# Get your API keys

# Step 2: Deploy integrations to cloud
cd nango-integrations
export NANGO_SECRET_KEY=your_cloud_key
nango deploy

# Step 3: Update environment
# Change .env from:
NANGO_HOST_URL=http://localhost:3003

# To:
NANGO_HOST_URL=https://api.nango.dev

# Step 4: Restart application
npm run dev

# Step 5: Stop local instance
npm run nango:stop

# Note: Users will need to reconnect
```

**Migration Time: 1-2 hours**
**Downtime Required: Yes (for reconnection)**

## 💡 Best Practices

### For Cloud Users:

1. **Use Environment-Based Configuration**
```typescript
// .env.development
NANGO_HOST_URL=https://api.nango.dev

// .env.production
NANGO_HOST_URL=https://api.nango.dev
```

2. **Monitor Usage**
- Track connection count
- Watch sync frequency
- Monitor API calls
- Set up billing alerts

3. **Implement Error Handling**
```typescript
try {
  await nango.auth(integrationId, connectionId)
} catch (error) {
  if (error.status === 429) {
    // Rate limited
  } else if (error.status === 500) {
    // Nango service issue
  }
}
```

### For Self-Hosted Users:

1. **Implement Proper Monitoring**
```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    # Monitor Nango metrics

  grafana:
    image: grafana/grafana
    # Visualize metrics
```

2. **Set Up Backups**
```bash
# Backup script (run daily)
#!/bin/bash
docker-compose exec nango-db pg_dump -U nango nango > backup-$(date +%Y%m%d).sql
aws s3 cp backup-$(date +%Y%m%d).sql s3://backups/
```

3. **Plan for Scaling**
```yaml
# docker-compose.yml
services:
  nango-jobs-1:
    # Worker 1
  nango-jobs-2:
    # Worker 2
  nango-jobs-3:
    # Worker 3
```

4. **Implement Health Checks**
```bash
# Monitoring script
#!/bin/bash
if ! curl -f http://localhost:3003/health; then
  # Send alert
  curl -X POST https://alerts.example.com/nango-down
fi
```

## 🎓 Recommendations by Company Size

### Startup (1-10 people)
**Recommendation: Cloud**
- Focus on product, not infrastructure
- Fast iteration needed
- Limited DevOps resources
- Cost-effective at small scale

### Small Business (10-50 people)
**Recommendation: Cloud (usually)**
- Unless: Data privacy requirements
- Or: High sync volume (cost optimization)

### Mid-Market (50-200 people)
**Recommendation: Evaluate both**
- **Cloud if**: Standard use case, US-based
- **Self-hosted if**: Compliance needs, high volume

### Enterprise (200+ people)
**Recommendation: Self-Hosted (often)**
- Better control
- Cost savings at scale
- Custom requirements
- Compliance needs

## 📞 Getting Help

### Cloud Support:
- Dashboard: https://app.nango.dev
- Docs: https://docs.nango.dev
- Slack: https://nango.dev/slack
- Email: support@nango.dev
- Status: https://status.nango.dev

### Self-Hosted Support:
- Docs: https://docs.nango.dev/host/self-host
- GitHub: https://github.com/NangoHQ/nango
- Slack Community: https://nango.dev/slack
- Local Docs: See docs/ folder

## 🎯 Decision Tree

```
Start: Need Nango?
│
├─ Have strict data residency? YES → Self-Host
│  └─ NO → Continue
│
├─ Need HIPAA compliance? YES → Self-Host  
│  └─ NO → Continue
│
├─ > 10,000 connections? YES → Self-Host
│  └─ NO → Continue
│
├─ Need < 1min sync frequency? YES → Self-Host
│  └─ NO → Continue
│
├─ Have DevOps team? NO → Cloud
│  └─ YES → Continue
│
├─ Need to modify Nango code? YES → Self-Host
│  └─ NO → Cloud
│
└─ Default: Start with Cloud, migrate if needed
```

## 🔄 Hybrid Approach

Some organizations use both:

```typescript
// Development: Self-hosted
// - Fast iteration
// - Free
// - Test changes

// Staging: Self-hosted
// - Test at scale
// - Pre-production validation

// Production: Cloud
// - Managed service
// - High availability
// - Support
```

## 📝 Summary

**Choose Cloud if:**
- ✅ Getting started
- ✅ Want managed service
- ✅ Need fast setup
- ✅ Standard requirements
- ✅ Limited DevOps resources

**Choose Self-Hosted if:**
- ✅ Data privacy critical
- ✅ High scale/volume
- ✅ Custom requirements
- ✅ Have DevOps team
- ✅ Cost optimization at scale

**Remember:** You can start with Cloud and migrate to Self-Hosted later if your needs change!

---

Need help deciding? Join our [Slack community](https://nango.dev/slack) and ask!

