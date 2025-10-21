# Advanced Usage Guide

This guide covers advanced features and use cases for the Nango Next.js integration.

## Table of Contents

- [Custom API Proxy Requests](#custom-api-proxy-requests)
- [Implementing Custom Syncs](#implementing-custom-syncs)
- [Webhook Event Handling](#webhook-event-handling)
- [Error Handling](#error-handling)
- [Data Transformation](#data-transformation)
- [Rate Limiting](#rate-limiting)
- [Multi-User Support](#multi-user-support)
- [Testing](#testing)

## Custom API Proxy Requests

Use Nango's proxy feature to make authenticated API requests without managing tokens.

### Client-Side Example

```typescript
import { getNangoInstance } from '@/lib/nango-client'

async function fetchGitHubRepos(connectionId: string) {
  const response = await fetch('/api/nango/proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      connectionId,
      integrationId: 'github',
      endpoint: '/user/repos',
      method: 'GET',
      params: {
        per_page: '50',
        sort: 'updated'
      }
    })
  })
  
  return response.json()
}
```

### Server-Side Example

```typescript
import { proxyRequest } from '@/lib/nango-server'

export async function GET(request: NextRequest) {
  const data = await proxyRequest({
    providerConfigKey: 'github',
    connectionId: 'user-123',
    method: 'GET',
    endpoint: '/user/repos',
    params: {
      per_page: '50'
    }
  })
  
  return NextResponse.json(data)
}
```

## Implementing Custom Syncs

### Paginated Data Sync

Handle large datasets with pagination:

```typescript
import type { NangoSync, GithubIssue } from '../../models'

export default async function fetchData(nango: NangoSync) {
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await nango.get({
      endpoint: '/repos/owner/repo/issues',
      params: {
        page: page.toString(),
        per_page: '100',
        state: 'all'
      }
    })
    
    if (response.data.length === 0) {
      hasMore = false
      break
    }
    
    const issues: GithubIssue[] = response.data.map((issue: any) => ({
      id: issue.id.toString(),
      title: issue.title,
      body: issue.body || '',
      state: issue.state,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      user: {
        login: issue.user.login,
        avatar_url: issue.user.avatar_url
      }
    }))
    
    await nango.batchSave(issues, 'GithubIssue')
    page++
  }
}
```

### Incremental Sync with Timestamps

Only fetch new/updated data:

```typescript
import type { NangoSync, SlackMessage } from '../../models'

export default async function fetchData(nango: NangoSync) {
  const connection = await nango.getConnection()
  const lastSyncTime = connection.metadata?.lastSyncTime || 0
  
  const response = await nango.get({
    endpoint: '/conversations.history',
    params: {
      channel: 'CHANNEL_ID',
      oldest: lastSyncTime.toString()
    }
  })
  
  const messages: SlackMessage[] = response.data.messages.map((msg: any) => ({
    id: msg.ts,
    text: msg.text,
    user: msg.user,
    channel: 'CHANNEL_ID',
    timestamp: msg.ts,
    thread_ts: msg.thread_ts || null
  }))
  
  await nango.batchSave(messages, 'SlackMessage')
  
  // Update last sync time
  await nango.updateConnectionMetadata({
    lastSyncTime: Date.now()
  })
}
```

## Webhook Event Handling

### Real-Time Event Processing

```typescript
// app/api/nango/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  switch (body.type) {
    case 'auth':
      // New connection created
      await handleNewConnection(body)
      break
      
    case 'sync':
      // Sync completed
      await handleSyncComplete(body)
      break
      
    case 'forward':
      // Event forwarded from provider
      await handleForwardedEvent(body)
      break
  }
  
  return NextResponse.json({ success: true })
}

async function handleNewConnection(event: any) {
  console.log('New connection:', event.connectionId)
  // Send welcome email, create database records, etc.
}

async function handleSyncComplete(event: any) {
  console.log('Sync complete:', event)
  // Update UI, send notifications, etc.
}

async function handleForwardedEvent(event: any) {
  console.log('Forwarded event:', event)
  // Handle provider-specific webhooks
}
```

## Error Handling

### Graceful Error Handling in Syncs

```typescript
import type { NangoSync } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    const response = await nango.get({
      endpoint: '/api/endpoint'
    })
    
    // Process data
    await nango.batchSave(response.data, 'Model')
    
  } catch (error: any) {
    // Log error to Nango
    nango.log(`Error in sync: ${error.message}`)
    
    // Check error type
    if (error.status === 401) {
      // Token expired - Nango will refresh automatically
      throw new Error('Authentication failed - please reconnect')
    } else if (error.status === 429) {
      // Rate limit - sync will retry
      throw new Error('Rate limit reached - will retry later')
    } else {
      // Other errors
      throw error
    }
  }
}
```

### Client-Side Error Handling

```typescript
async function connectIntegration(integrationId: string) {
  try {
    const connectionId = `user-${Date.now()}`
    const nango = getNangoInstance()
    
    const result = await nango.auth(integrationId, connectionId)
    
    if (result) {
      // Success
      showSuccessMessage('Connected successfully!')
    }
  } catch (error: any) {
    // Handle specific errors
    if (error.type === 'authorization_cancelled') {
      showErrorMessage('Authorization was cancelled')
    } else if (error.type === 'unknown_provider_config') {
      showErrorMessage('Integration not configured properly')
    } else {
      showErrorMessage('Connection failed: ' + error.message)
    }
  }
}
```

## Data Transformation

### Mapping Provider Data to Your Schema

```typescript
interface RawGitHubIssue {
  id: number
  title: string
  body: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  user: {
    login: string
    avatar_url: string
  }
  labels: Array<{ name: string }>
}

interface MyIssue {
  id: string
  title: string
  description: string
  status: 'active' | 'resolved'
  createdDate: Date
  author: string
  tags: string[]
}

function transformIssue(raw: RawGitHubIssue): MyIssue {
  return {
    id: `gh-${raw.id}`,
    title: raw.title,
    description: raw.body || 'No description',
    status: raw.state === 'open' ? 'active' : 'resolved',
    createdDate: new Date(raw.created_at),
    author: raw.user.login,
    tags: raw.labels.map(l => l.name)
  }
}
```

## Rate Limiting

### Respecting API Rate Limits

```typescript
import type { NangoSync } from '../../models'

export default async function fetchData(nango: NangoSync) {
  const BATCH_SIZE = 10
  const DELAY_MS = 1000
  
  const items = await getItemsToProcess()
  
  // Process in batches to avoid rate limits
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    
    const promises = batch.map(item => 
      nango.get({ endpoint: `/api/${item.id}` })
    )
    
    const results = await Promise.all(promises)
    await nango.batchSave(results, 'Model')
    
    // Wait before next batch
    if (i + BATCH_SIZE < items.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }
}

async function getItemsToProcess() {
  // Return items to process
  return []
}
```

## Multi-User Support

### User-Specific Connections

```typescript
// lib/nango-user.ts
import { getNangoInstance } from './nango-client'
import { getSession } from 'next-auth/react'

export async function connectUserIntegration(
  integrationId: string,
  userId: string
) {
  const nango = getNangoInstance()
  
  // Use user ID as connection ID for uniqueness
  const connectionId = `user-${userId}`
  
  return await nango.auth(integrationId, connectionId)
}

export async function getUserConnections(userId: string) {
  const response = await fetch(
    `/api/nango/connections?userId=${userId}`
  )
  return response.json()
}
```

### API Route with User Authentication

```typescript
// app/api/nango/connections/route.ts
import { getServerSession } from 'next-auth'
import { getNangoServer } from '@/lib/nango-server'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const userId = session.user.id
  const nango = getNangoServer()
  
  // Get connections for this user only
  const connections = await nango.listConnections()
  const userConnections = connections.filter(
    c => c.connection_id === `user-${userId}`
  )
  
  return NextResponse.json({ connections: userConnections })
}
```

## Testing

### Unit Testing Sync Scripts

```typescript
// __tests__/syncs/github-issues.test.ts
import { describe, it, expect, vi } from 'vitest'
import fetchData from '@/nango-integrations/github/syncs/github-issues'

describe('GitHub Issues Sync', () => {
  it('should fetch and save issues', async () => {
    const mockNango = {
      get: vi.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Test Issue',
            body: 'Description',
            state: 'open',
            created_at: '2024-01-01',
            updated_at: '2024-01-02',
            user: {
              login: 'testuser',
              avatar_url: 'https://example.com/avatar.jpg'
            }
          }
        ]
      }),
      batchSave: vi.fn(),
      log: vi.fn()
    }
    
    await fetchData(mockNango as any)
    
    expect(mockNango.get).toHaveBeenCalled()
    expect(mockNango.batchSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          title: 'Test Issue'
        })
      ]),
      'GithubIssue'
    )
  })
})
```

### Integration Testing

```typescript
// __tests__/integration/nango-auth.test.ts
import { test, expect } from '@playwright/test'

test('should complete GitHub OAuth flow', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Click connect button
  await page.click('text=Connect GitHub')
  
  // Should redirect to GitHub
  await expect(page).toHaveURL(/github.com/)
  
  // Authorize (assuming test account)
  await page.fill('[name="login"]', process.env.TEST_GITHUB_USER)
  await page.fill('[name="password"]', process.env.TEST_GITHUB_PASSWORD)
  await page.click('[type="submit"]')
  
  // Should redirect back
  await expect(page).toHaveURL('http://localhost:3000')
  
  // Connection should appear
  await expect(page.locator('text=GitHub')).toBeVisible()
})
```

## Best Practices

1. **Always handle errors gracefully** - Network issues and API errors are common
2. **Implement retry logic** - Use exponential backoff for failed requests
3. **Log extensively** - Use `nango.log()` in sync scripts for debugging
4. **Test with real data** - Use sandbox/test accounts from providers
5. **Monitor rate limits** - Track API usage to avoid hitting limits
6. **Secure credentials** - Never commit API keys or secrets
7. **Version your syncs** - Use git tags when deploying to production
8. **Document everything** - Keep integration docs up to date

## Additional Resources

- [Nango SDK Reference](https://docs.nango.dev/reference)
- [Provider API Documentation](https://docs.nango.dev/providers)
- [Nango Sync Scripts](https://docs.nango.dev/sync-scripts)
- [Nango Webhooks](https://docs.nango.dev/webhooks)

