# Visual Guide to Nango Integration

A visual walkthrough of how Nango works in this application.

## 🎨 User Journey

### 1. Landing Page

```
┌─────────────────────────────────────────────────┐
│         Nango Integration Demo                  │
│                                                  │
│  Complete implementation of Nango in Next.js    │
│  with OAuth integrations                        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│              Your Connections                    │
├─────────────────────────────────────────────────┤
│                                                  │
│   No connections yet. Add an integration        │
│   below to get started!                         │
│                                                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           Available Integrations                 │
├─────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐          │
│  │   🔗 GitHub  │    │   💬 Slack   │          │
│  │              │    │              │          │
│  │ [Pre-built]  │    │  [Custom]    │          │
│  │              │    │              │          │
│  │ Connect to   │    │ Connect to   │          │
│  │ GitHub       │    │ Slack        │          │
│  │              │    │              │          │
│  │ [Connect]    │    │ [Connect]    │          │
│  └──────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────┘
```

### 2. Click "Connect GitHub"

```
Browser opens popup window:

┌─────────────────────────────────────────────────┐
│  GitHub Authorization                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  Authorize "Your App" to access:                │
│                                                  │
│  ✓ Read repository information                  │
│  ✓ Access user profile                          │
│  ✓ Read organization data                       │
│                                                  │
│  [ Authorize ]  [ Cancel ]                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

### 3. After Authorization

```
┌─────────────────────────────────────────────────┐
│              Your Connections                    │
├─────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐  │
│  │  🔗 GitHub                               │  │
│  │                                          │  │
│  │  Connected: Jan 1, 2024                  │  │
│  │  Connection ID: user-1234567890          │  │
│  │                                          │  │
│  │  [Test Connection]  [Disconnect]         │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 4. Click "Test Connection"

```
┌─────────────────────────────────────────────────┐
│  ✅ Test Successful!                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  {                                               │
│    "login": "your-username",                     │
│    "name": "Your Name",                          │
│    "email": "you@example.com",                   │
│    "avatar_url": "https://...",                  │
│    "public_repos": 42                            │
│  }                                               │
│                                                  │
│                          [OK]                    │
└─────────────────────────────────────────────────┘
```

## 🔄 OAuth Flow Diagram

### Complete OAuth Process

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │
     │ 1. Clicks "Connect GitHub"
     ▼
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────┬────────────┘
     │
     │ 2. nango.auth('github', 'user-123')
     ▼
┌─────────────────┐
│  Nango SDK      │
│  Opens popup    │
└────┬────────────┘
     │
     │ 3. Redirect to OAuth URL
     ▼
┌─────────────────┐
│  Nango Cloud    │
└────┬────────────┘
     │
     │ 4. Redirect to provider
     ▼
┌─────────────────┐
│  GitHub OAuth   │
│  Login Page     │
└────┬────────────┘
     │
     │ 5. User authorizes
     ▼
┌─────────────────┐
│  GitHub         │
│  Returns code   │
└────┬────────────┘
     │
     │ 6. Redirect with code
     ▼
┌─────────────────┐
│  Nango Cloud    │
│  Exchanges code │
│  for token      │
└────┬────────────┘
     │
     │ 7. Stores token securely
     │
     │ 8. Returns success
     ▼
┌─────────────────┐
│  Next.js App    │
│  Popup closes   │
│  Connection ✓   │
└─────────────────┘
```

## 🔧 API Request Flow

### Making Authenticated Requests

```
┌──────────────┐
│  Frontend    │
│  Component   │
└──────┬───────┘
       │
       │ 1. User clicks "Test Connection"
       │
       │ fetch('/api/nango/test?...')
       ▼
┌──────────────────────┐
│  Next.js API Route   │
│  /api/nango/test     │
└──────┬───────────────┘
       │
       │ 2. nango.proxy({
       │      providerConfigKey: 'github',
       │      connectionId: 'user-123',
       │      endpoint: '/user'
       │    })
       ▼
┌──────────────────┐
│  Nango SDK       │
│  (Server-side)   │
└──────┬───────────┘
       │
       │ 3. Retrieve stored token
       ▼
┌──────────────────┐
│  Nango Cloud     │
│  Token Storage   │
└──────┬───────────┘
       │
       │ 4. Make authenticated request
       │    Authorization: Bearer <token>
       ▼
┌──────────────────┐
│  GitHub API      │
│  /user           │
└──────┬───────────┘
       │
       │ 5. Return user data
       ▼
┌──────────────────┐
│  Nango Cloud     │
│  Proxy response  │
└──────┬───────────┘
       │
       │ 6. Return data
       ▼
┌──────────────────────┐
│  Next.js API Route   │
│  Process & return    │
└──────┬───────────────┘
       │
       │ 7. JSON response
       ▼
┌──────────────┐
│  Frontend    │
│  Display data│
└──────────────┘
```

## 📊 Data Sync Flow

### Background Data Synchronization

```
┌─────────────────┐
│  Nango Cloud    │
│  Scheduler      │
└────┬────────────┘
     │
     │ Every 30 minutes
     ▼
┌─────────────────────────┐
│  Sync Script            │
│  github-issues.ts       │
└────┬────────────────────┘
     │
     │ 1. nango.get({ endpoint: '/repos' })
     ▼
┌─────────────────┐
│  GitHub API     │
│  Fetch repos    │
└────┬────────────┘
     │
     │ 2. Return repositories
     ▼
┌─────────────────────────┐
│  Sync Script            │
│  For each repo...       │
└────┬────────────────────┘
     │
     │ 3. nango.get({ endpoint: '/issues' })
     ▼
┌─────────────────┐
│  GitHub API     │
│  Fetch issues   │
└────┬────────────┘
     │
     │ 4. Return issues
     ▼
┌─────────────────────────┐
│  Sync Script            │
│  Transform data         │
└────┬────────────────────┘
     │
     │ 5. nango.batchSave(issues, 'GithubIssue')
     ▼
┌─────────────────┐
│  Nango Cloud    │
│  Store data     │
└────┬────────────┘
     │
     │ 6. Trigger webhook (optional)
     ▼
┌─────────────────────────┐
│  Next.js Webhook        │
│  /api/nango/webhook     │
└─────────────────────────┘
```

## 🏗️ System Architecture

### Three-Layer Design

```
┌─────────────────────────────────────────────────┐
│                                                  │
│              FRONTEND LAYER                      │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │  Page    │  │Component │  │Component │     │
│  │page.tsx  │  │Card.tsx  │  │List.tsx  │     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘     │
│       │             │              │            │
│       └─────────────┴──────────────┘            │
│                     │                            │
│       ┌─────────────▼─────────────┐             │
│       │   Nango Frontend SDK      │             │
│       │   @nangohq/frontend       │             │
│       └─────────────┬─────────────┘             │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │
                      │ HTTPS
                      │
┌─────────────────────┼────────────────────────────┐
│                     │                            │
│              BACKEND LAYER                       │
│                     │                            │
│       ┌─────────────▼─────────────┐             │
│       │   Next.js API Routes      │             │
│       │   /api/nango/*            │             │
│       └─────────────┬─────────────┘             │
│                     │                            │
│       ┌─────────────▼─────────────┐             │
│       │   Nango Node SDK          │             │
│       │   @nangohq/node           │             │
│       └─────────────┬─────────────┘             │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │
                      │ HTTPS
                      │
┌─────────────────────┼────────────────────────────┐
│                     │                            │
│           INTEGRATION LAYER                      │
│                     │                            │
│       ┌─────────────▼─────────────┐             │
│       │   Nango Cloud Platform    │             │
│       │   - Token Storage          │             │
│       │   - Token Refresh          │             │
│       │   - Sync Orchestration     │             │
│       └─────────────┬─────────────┘             │
│                     │                            │
└─────────────────────┼────────────────────────────┘
                      │
                      │ HTTPS (OAuth 2.0)
                      │
┌─────────────────────┼────────────────────────────┐
│                     │                            │
│           PROVIDER LAYER                         │
│                     │                            │
│  ┌──────────┐  ┌───▼──────┐  ┌──────────┐      │
│  │ GitHub   │  │  Slack   │  │  Google  │      │
│  │   API    │  │   API    │  │   APIs   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│                                                  │
└─────────────────────────────────────────────────┘
```

## 💾 Data Models

### Connection Object

```typescript
{
  connection_id: "user-1234567890",
  provider_config_key: "github",
  created_at: "2024-01-01T00:00:00.000Z",
  metadata: {
    // Custom metadata
  }
}
```

### Sync Data Models

#### GitHub Issue
```typescript
{
  id: "123",
  title: "Bug fix needed",
  body: "Description...",
  state: "open",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-02T00:00:00.000Z",
  user: {
    login: "username",
    avatar_url: "https://..."
  }
}
```

#### Slack Message
```typescript
{
  id: "channel-timestamp",
  text: "Hello world",
  user: "U123456",
  channel: "C123456",
  timestamp: "1234567890.123456",
  thread_ts: null
}
```

## 🔐 Security Flow

### Token Management

```
┌────────────────────────────────────────────┐
│  OAuth Token Lifecycle                     │
├────────────────────────────────────────────┤
│                                             │
│  1. User authorizes                         │
│     ↓                                       │
│  2. Provider returns authorization code     │
│     ↓                                       │
│  3. Nango exchanges code for token          │
│     ↓                                       │
│  4. Token stored encrypted in Nango Cloud   │
│     ↓                                       │
│  5. App requests data                       │
│     ↓                                       │
│  6. Nango retrieves token                   │
│     ↓                                       │
│  7. Token used for API request              │
│     ↓                                       │
│  8. Token expires?                          │
│     ├─ No → Use existing token              │
│     └─ Yes → Refresh automatically          │
│         ↓                                   │
│      9. New token stored                    │
│         ↓                                   │
│     10. Request succeeds                    │
│                                             │
└────────────────────────────────────────────┘
```

### Security Boundaries

```
┌─────────────────────────────────────────────┐
│  Browser (Public)                            │
│  ✓ Can see: Public Key                      │
│  ✗ Cannot see: Tokens, Secret Key           │
└────────────────┬────────────────────────────┘
                 │
                 │ HTTPS Only
                 │
┌────────────────▼────────────────────────────┐
│  Next.js Server (Private)                   │
│  ✓ Can see: Secret Key, connection data     │
│  ✗ Cannot see: Actual OAuth tokens          │
└────────────────┬────────────────────────────┘
                 │
                 │ Secure API
                 │
┌────────────────▼────────────────────────────┐
│  Nango Cloud (Encrypted)                    │
│  ✓ Stores: OAuth tokens (encrypted)         │
│  ✓ Manages: Token refresh                   │
│  ✓ Provides: Token proxy                    │
└─────────────────────────────────────────────┘
```

## 📈 Performance Optimizations

### Caching Strategy

```
┌──────────────────┐
│  User requests   │
│  connections     │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Check cache     │
│  (React state)   │
└────┬─────────────┘
     │
     ├─ Cache hit → Return immediately
     │
     └─ Cache miss
         ↓
    ┌────────────────┐
    │  Fetch from    │
    │  API           │
    └────┬───────────┘
         │
         ▼
    ┌────────────────┐
    │  Update cache  │
    └────┬───────────┘
         │
         ▼
    ┌────────────────┐
    │  Return data   │
    └────────────────┘
```

## 🎯 Error Handling

### Error Flow

```
API Request
    ↓
Try block
    ├─ Success → Return data
    │
    └─ Error
         ↓
    Check error type
         ├─ 401 Unauthorized
         │   → Show "Please reconnect"
         │
         ├─ 429 Rate Limit
         │   → Show "Try again later"
         │
         ├─ 500 Server Error
         │   → Show "Service unavailable"
         │
         └─ Other
             → Show generic error
```

---

This visual guide helps understand the complete Nango integration flow. For code details, see the main [README.md](../README.md).

