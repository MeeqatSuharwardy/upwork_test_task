# Architecture Documentation

This document provides a detailed overview of the Nango Next.js integration architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                     │
│  │   React UI   │────────▶│ Nango SDK    │                     │
│  │  Components  │         │ (@nangohq/   │                     │
│  │              │         │  frontend)   │                     │
│  └──────────────┘         └──────┬───────┘                     │
│                                   │                              │
└───────────────────────────────────┼──────────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │     OAuth Authorization       │
                    │      (via Nango Cloud)        │
                    └───────────────┬───────────────┘
                                    │
┌───────────────────────────────────┼──────────────────────────────┐
│                                   │                              │
│                     Next.js Server (API Routes)                  │
│                                   │                              │
│  ┌────────────────────────────────▼──────────────────────────┐  │
│  │                     API Route Handlers                     │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  /api/nango/connections     - List connections            │  │
│  │  /api/nango/connections/:id - Delete connection           │  │
│  │  /api/nango/test            - Test connection             │  │
│  │  /api/nango/webhook         - Handle webhooks             │  │
│  │  /api/nango/proxy           - Proxy API requests          │  │
│  └────────────────┬───────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼───────────────┐                             │
│  │      Nango Node SDK            │                             │
│  │    (@nangohq/node)             │                             │
│  │                                │                             │
│  │  - Connection Management       │                             │
│  │  - Token Refresh              │                             │
│  │  - API Proxy                  │                             │
│  └────────────────┬───────────────┘                             │
│                   │                                              │
└───────────────────┼──────────────────────────────────────────────┘
                    │
    ┌───────────────▼────────────────┐
    │      Nango Cloud Platform      │
    ├────────────────────────────────┤
    │  - OAuth Token Storage         │
    │  - Token Refresh Management    │
    │  - Integration Configurations  │
    │  - Sync Orchestration          │
    │  - Webhook Distribution        │
    └───────────────┬────────────────┘
                    │
    ┌───────────────▼────────────────┐
    │   External APIs (Providers)    │
    ├────────────────────────────────┤
    │  - GitHub API                  │
    │  - Slack API                   │
    │  - Google APIs                 │
    │  - etc...                      │
    └────────────────────────────────┘
```

## Component Details

### Frontend Layer

#### React Components
- **ConnectionCard**: Displays individual connection status
- **IntegrationsList**: Shows available integrations
- **Page Component**: Main UI orchestrator

#### Nango Frontend SDK
- Initializes OAuth flow
- Manages authorization popup
- Returns connection results

### Backend Layer

#### API Routes
- **Connection Routes**: CRUD operations for connections
- **Test Route**: Validates connections and fetches sample data
- **Proxy Route**: Forwards authenticated API requests
- **Webhook Route**: Handles events from Nango

#### Nango Node SDK
- Server-side connection management
- Token handling and refresh
- API request proxying
- Sync management

### Integration Layer

#### Nango Configuration (`nango.yaml`)
```yaml
integrations:
  github:
    provider: github
    syncs:
      github-issues:
        runs: every 30min
        endpoint: /sync
        output: GithubIssue
```

#### Sync Scripts
- TypeScript files in `nango-integrations/`
- Run on schedule defined in `nango.yaml`
- Fetch, transform, and store data

## Data Flow

### 1. OAuth Connection Flow

```
User clicks "Connect"
    ↓
Frontend calls Nango.auth()
    ↓
Nango opens OAuth popup
    ↓
User authorizes on provider
    ↓
Provider redirects to Nango
    ↓
Nango stores token securely
    ↓
Popup closes with success
    ↓
Frontend receives connection ID
    ↓
Connection appears in UI
```

### 2. API Request Flow

```
Frontend requests data
    ↓
API route receives request
    ↓
Server calls Nango.proxy()
    ↓
Nango retrieves stored token
    ↓
Nango makes authenticated request
    ↓
Provider returns data
    ↓
Nango returns data to server
    ↓
Server processes and returns to frontend
    ↓
UI displays data
```

### 3. Sync Flow

```
Scheduled time reached
    ↓
Nango triggers sync script
    ↓
Script fetches data from provider
    ↓
Script transforms data
    ↓
Script calls batchSave()
    ↓
Nango stores data
    ↓
Webhook sent to app (optional)
    ↓
App processes sync results
```

## Security Considerations

### Token Storage
- OAuth tokens stored securely in Nango Cloud
- Never exposed to frontend
- Encrypted at rest and in transit

### API Keys
- Secret key only used server-side
- Public key safe for frontend use
- Environment variables for all credentials

### Request Validation
- All API routes validate inputs
- Connection ownership verified
- Rate limiting applied

## Performance Optimization

### Caching
- Connection list cached client-side
- API responses cached where appropriate
- Stale-while-revalidate pattern

### Lazy Loading
- Components loaded on demand
- Integrations loaded dynamically
- Sync results paginated

### Error Handling
- Graceful degradation
- Automatic retry with exponential backoff
- User-friendly error messages

## Scalability

### Horizontal Scaling
- Stateless API routes
- No server-side sessions
- Database for persistence (if needed)

### Rate Limiting
- Provider API limits respected
- Sync schedules optimized
- Request queuing implemented

### Monitoring
- Error tracking via logs
- Performance metrics
- Connection health checks

## Extension Points

### Adding New Providers
1. Configure in Nango Dashboard
2. Add to `nango.yaml`
3. Create sync scripts
4. Update UI components

### Custom Data Models
1. Define in `models.ts`
2. Update `nango.yaml`
3. Implement transformations
4. Add to database schema

### Webhook Events
1. Add handler in webhook route
2. Process event data
3. Trigger application logic
4. Update UI via WebSocket/SSE

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Integration**: Nango SDK
- **Authentication**: OAuth 2.0 via Nango
- **Deployment**: Vercel (recommended)

## File Organization

```
nango-nextjs-demo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── nango/        # Nango-specific routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── nango-client.ts   # Frontend utilities
│   └── nango-server.ts   # Backend utilities
├── nango-integrations/    # Nango configuration
│   ├── github/           # GitHub sync scripts
│   ├── slack/            # Slack sync scripts
│   ├── models.ts         # Data models
│   └── nango.yaml        # Main configuration
└── docs/                  # Documentation
```

## Development Workflow

1. **Local Development**
   - Run `npm run dev`
   - Test with ngrok for webhooks
   - Use test OAuth apps

2. **Integration Development**
   - Edit `nango.yaml`
   - Create sync scripts
   - Deploy with `nango deploy`
   - Test syncs in dashboard

3. **Testing**
   - Unit tests for sync scripts
   - Integration tests for API routes
   - E2E tests for OAuth flow

4. **Deployment**
   - Deploy Next.js to Vercel
   - Deploy syncs to Nango Cloud
   - Configure production OAuth apps
   - Set production environment variables

## Best Practices

1. **Keep secrets secure** - Never commit credentials
2. **Handle errors gracefully** - Provide clear error messages
3. **Log extensively** - Use Nango's logging in sync scripts
4. **Test thoroughly** - Test OAuth flow and API calls
5. **Monitor actively** - Track sync failures and API errors
6. **Document changes** - Update docs when adding integrations
7. **Version control** - Tag releases of sync scripts
8. **Optimize syncs** - Minimize API calls and data transfer

## Additional Resources

- [Nango Documentation](https://docs.nango.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [OAuth 2.0 Specification](https://oauth.net/2/)

