# Nango Next.js Integration Demo

A complete, production-ready implementation of Nango in a Next.js application, featuring GitHub (pre-built) and Slack (custom) integrations with full OAuth authentication, data syncing, and connection management.

![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Nango](https://img.shields.io/badge/Nango-0.36-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🌟 Features

- ✅ **Full Nango Integration** - Complete implementation of Nango OAuth flow
- 🔗 **GitHub Integration** - Pre-built integration for GitHub API access
- 💬 **Slack Integration** - Custom integration for Slack workspace management
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- 🔄 **Connection Management** - Add, test, and remove connections easily
- 🔐 **Secure Authentication** - OAuth 2.0 flow handled by Nango
- 📊 **Data Syncing** - Automated data synchronization with configurable intervals
- 🪝 **Webhook Support** - Real-time event handling
- 🛠️ **TypeScript** - Fully typed for better developer experience

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Creating a New Integration](#creating-a-new-integration)
- [API Routes](#api-routes)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🏗️ Architecture Overview

This project demonstrates the complete Nango integration architecture:

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ├─── Nango Frontend SDK (@nangohq/frontend)
         │    - OAuth Flow Initialization
         │    - User Authentication
         │
         ├─── API Routes (Backend)
         │    ├─── /api/nango/connections (GET, DELETE)
         │    ├─── /api/nango/test (GET)
         │    └─── /api/nango/webhook (POST)
         │
         └─── Nango Node SDK (@nangohq/node)
              - Connection Management
              - API Proxy Requests
              - Data Syncing
```

### Key Components

1. **Frontend (`app/page.tsx`)**: Main UI for managing connections
2. **API Routes (`app/api/nango/`)**: Server-side endpoints for Nango operations
3. **Integrations (`nango-integrations/`)**: Custom sync scripts and configurations
4. **Utilities (`lib/`)**: Reusable Nango client and server instances

## ✅ Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Nango Account** - [Sign up here](https://app.nango.dev)
- **GitHub Account** - For GitHub integration
- **Slack Workspace** - For Slack integration (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd nango-nextjs-demo

# Install dependencies
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
NANGO_SECRET_KEY=your_nango_secret_key_here
NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_nango_public_key_here
```

### 3. Configure Nango Dashboard

#### Get Your Nango Keys

1. Go to [https://app.nango.dev](https://app.nango.dev)
2. Create a new project or select existing one
3. Copy your **Public Key** and **Secret Key**
4. Paste them into your `.env` file

#### Set Up GitHub Integration

1. In Nango Dashboard, go to **Integrations**
2. Search for **GitHub** and click **Add**
3. Create a GitHub OAuth App:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Use Nango's callback URL from dashboard
4. Enter GitHub OAuth credentials in Nango
5. Set integration ID to `github`
6. Required scopes: `repo`, `user`, `read:org`

#### Set Up Slack Integration

1. In Nango Dashboard, click **Add Custom Integration**
2. Select **Slack** as provider
3. Create a Slack App:
   - Go to [https://api.slack.com/apps](https://api.slack.com/apps)
   - Create new app "From scratch"
   - Add OAuth Redirect URLs from Nango
   - Add Bot Token Scopes:
     - `channels:history`
     - `channels:read`
     - `chat:write`
     - `users:read`
4. Enter Slack OAuth credentials in Nango
5. Set integration ID to `slack`

### 4. Deploy Nango Integrations (Optional)

```bash
# Install Nango CLI globally
npm install -g nango

# Login to Nango
nango login

# Deploy integrations
cd nango-integrations
nango deploy
```

### 5. Run the Application

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

## 📁 Project Structure

```
nango-nextjs-demo/
├── app/
│   ├── api/
│   │   └── nango/
│   │       ├── connections/
│   │       │   ├── route.ts              # List all connections
│   │       │   └── [connectionId]/
│   │       │       └── route.ts          # Delete connection
│   │       ├── test/
│   │       │   └── route.ts              # Test connection
│   │       └── webhook/
│   │           └── route.ts              # Webhook handler
│   ├── globals.css                       # Global styles
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Main page
├── components/
│   ├── ConnectionCard.tsx                # Connection display component
│   └── IntegrationsList.tsx              # Available integrations
├── lib/
│   ├── nango-client.ts                   # Frontend Nango utilities
│   └── nango-server.ts                   # Backend Nango utilities
├── nango-integrations/
│   ├── github/
│   │   └── syncs/
│   │       ├── github-issues.ts          # Sync GitHub issues
│   │       └── github-pull-requests.ts   # Sync GitHub PRs
│   ├── slack/
│   │   └── syncs/
│   │       ├── slack-messages.ts         # Sync Slack messages
│   │       └── slack-channels.ts         # Sync Slack channels
│   ├── models.ts                         # TypeScript models
│   └── nango.yaml                        # Nango configuration
├── docs/
│   └── SETUP_GUIDE.md                    # Detailed setup guide
├── scripts/
│   └── setup-nango.sh                    # Setup automation script
├── .env.example                          # Example environment variables
├── package.json
└── README.md                             # This file
```

## 🔧 Creating a New Integration

This guide shows you how to add a new integration (e.g., Google Drive) to your Nango implementation.

### Step 1: Configure Integration in Nango Dashboard

1. Log in to [Nango Dashboard](https://app.nango.dev)
2. Click **Add Integration**
3. Search for your provider (e.g., "Google Drive")
4. Enter OAuth credentials from Google Cloud Console
5. Set integration ID (e.g., `google-drive`)
6. Configure required scopes

### Step 2: Update `nango.yaml`

Add your integration configuration:

```yaml
integrations:
  google-drive:
    provider: google-drive
    syncs:
      google-drive-files:
        runs: every 1h
        endpoint: /api/nango/syncs/google-drive-files
        output: GoogleDriveFile
        sync_type: incremental
        description: Syncs files from Google Drive

models:
  GoogleDriveFile:
    id: string
    name: string
    mimeType: string
    createdTime: string
    modifiedTime: string
```

### Step 3: Create Sync Script

Create `nango-integrations/google-drive/syncs/google-drive-files.ts`:

```typescript
import type { NangoSync, GoogleDriveFile } from '../../models'

export default async function fetchData(nango: NangoSync) {
  try {
    const response = await nango.get({
      endpoint: '/drive/v3/files',
      params: {
        pageSize: '100',
        fields: 'files(id,name,mimeType,createdTime,modifiedTime)',
      },
    })

    const files: GoogleDriveFile[] = response.data.files.map((file: any) => ({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    }))

    await nango.batchSave(files, 'GoogleDriveFile')
  } catch (error: any) {
    throw new Error(`Failed to fetch Google Drive files: ${error.message}`)
  }
}
```

### Step 4: Update Models

Add to `nango-integrations/models.ts`:

```typescript
export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  createdTime: string
  modifiedTime: string
}
```

### Step 5: Add to UI

Update `components/IntegrationsList.tsx`:

```typescript
const integrations: Integration[] = [
  // ... existing integrations
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Connect to Google Drive to access and manage files',
    icon: '📁',
    type: 'custom'
  }
]
```

### Step 6: Deploy

```bash
cd nango-integrations
nango deploy
```

### Step 7: Test

1. Start your app: `npm run dev`
2. Click "Connect Google Drive"
3. Authorize the application
4. Test the connection

## 🔌 API Routes

### GET `/api/nango/connections`

Lists all active connections.

**Response:**
```json
{
  "connections": [
    {
      "connection_id": "user-123",
      "provider_config_key": "github",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "success": true
}
```

### DELETE `/api/nango/connections/[connectionId]`

Removes a specific connection.

**Query Parameters:**
- `providerConfigKey`: The integration ID (e.g., "github")

**Response:**
```json
{
  "success": true,
  "message": "Connection deleted successfully"
}
```

### GET `/api/nango/test`

Tests a connection by fetching data.

**Query Parameters:**
- `connectionId`: The connection ID
- `integrationId`: The integration ID (e.g., "github")

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Connection test successful!"
}
```

### POST `/api/nango/webhook`

Handles webhook events from Nango.

**Request Body:**
```json
{
  "type": "auth|sync|forward",
  "connectionId": "user-123",
  "providerConfigKey": "github",
  "data": { ... }
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NANGO_SECRET_KEY` | Yes | Your Nango secret key (server-side only) |
| `NEXT_PUBLIC_NANGO_PUBLIC_KEY` | Yes | Your Nango public key (client-side) |
| `NANGO_HOST_URL` | No | Custom Nango host (default: https://api.nango.dev) |
| `NEXTAUTH_URL` | No | Your application URL |

### Nango Configuration (`nango.yaml`)

The `nango.yaml` file defines:
- **Integrations**: OAuth providers and their settings
- **Syncs**: Data synchronization jobs and schedules
- **Models**: TypeScript interfaces for synced data

Example:
```yaml
integrations:
  github:
    provider: github
    syncs:
      github-issues:
        runs: every 30min           # Sync frequency
        endpoint: /api/nango/syncs  # Optional webhook endpoint
        output: GithubIssue         # Output model
        sync_type: incremental      # incremental or full
```

### Sync Types

- **Incremental**: Only syncs new/changed data
- **Full**: Re-syncs all data on each run

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy Nango Integrations

```bash
cd nango-integrations
nango deploy --env production
```

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `NANGO_SECRET_KEY`
- `NEXT_PUBLIC_NANGO_PUBLIC_KEY`
- Add OAuth credentials for each integration

## 🐛 Troubleshooting

### "Nango is not initialized"

**Cause**: Public key not set or not loaded properly

**Solution**:
1. Check `.env` file has `NEXT_PUBLIC_NANGO_PUBLIC_KEY`
2. Restart development server
3. Clear browser cache

### OAuth Redirect Mismatch

**Cause**: Redirect URL doesn't match configured URL

**Solution**:
1. Check redirect URL in Nango dashboard
2. Ensure OAuth app uses the same redirect URL
3. For localhost, use `http://localhost:3000` (not `127.0.0.1`)

### Connection Test Fails

**Cause**: Invalid credentials or insufficient permissions

**Solution**:
1. Verify OAuth scopes in Nango dashboard
2. Re-authorize the connection
3. Check API endpoint in sync script

### Sync Not Running

**Cause**: Integration not deployed or sync configuration error

**Solution**:
1. Deploy integrations: `cd nango-integrations && nango deploy`
2. Check sync logs in Nango dashboard
3. Verify `nango.yaml` syntax

### API Rate Limiting

**Cause**: Too many requests to provider API

**Solution**:
1. Adjust sync frequency in `nango.yaml`
2. Implement pagination in sync scripts
3. Use Nango's built-in rate limiting

## 📚 Additional Resources

- **Nango Documentation**: https://docs.nango.dev
- **Nango API Reference**: https://docs.nango.dev/reference
- **Next.js Documentation**: https://nextjs.org/docs
- **Nango Slack Community**: https://nango.dev/slack

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Nango** - For providing an excellent OAuth integration platform
- **Next.js** - For the amazing React framework
- **Tailwind CSS** - For the beautiful utility-first CSS framework

---

**Built with ❤️ using Nango and Next.js**

For detailed setup instructions, see [SETUP_GUIDE.md](docs/SETUP_GUIDE.md)

