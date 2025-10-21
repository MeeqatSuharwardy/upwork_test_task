# Nango Setup Guide

This guide will walk you through setting up Nango integrations in your Next.js application.

## Prerequisites

- Node.js 18+ installed
- A Nango account (sign up at https://app.nango.dev)
- GitHub OAuth app (for GitHub integration)
- Slack OAuth app (for Slack integration)

## Step 1: Create a Nango Account

1. Go to https://app.nango.dev and sign up
2. Create a new project
3. Copy your **Public Key** and **Secret Key**

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following variables:
   ```
   NANGO_SECRET_KEY=your_secret_key_here
   NEXT_PUBLIC_NANGO_PUBLIC_KEY=your_public_key_here
   ```

## Step 3: Set Up GitHub Integration

### Create GitHub OAuth App

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: Get this from Nango dashboard
4. Copy the **Client ID** and **Client Secret**

### Configure in Nango

1. Go to Nango Dashboard > Integrations
2. Search for "GitHub" and click "Add"
3. Enter your GitHub OAuth credentials
4. Set the integration ID to `github`
5. Configure scopes: `repo`, `user`, `read:org`

## Step 4: Set Up Slack Integration

### Create Slack App

1. Go to https://api.slack.com/apps
2. Click "Create New App" > "From scratch"
3. Fill in the details:
   - **App Name**: Your app name
   - **Workspace**: Select your workspace
4. Go to "OAuth & Permissions"
5. Add Redirect URLs (get from Nango dashboard)
6. Add Bot Token Scopes:
   - `channels:history`
   - `channels:read`
   - `chat:write`
   - `users:read`
7. Copy **Client ID** and **Client Secret**

### Configure in Nango

1. Go to Nango Dashboard > Integrations
2. Click "Add Custom Integration"
3. Select "Slack" as the provider
4. Enter your Slack OAuth credentials
5. Set the integration ID to `slack`
6. Save the configuration

## Step 5: Deploy Nango Integrations

1. Install Nango CLI:
   ```bash
   npm install -g nango
   ```

2. Login to Nango:
   ```bash
   nango login
   ```

3. Deploy integrations:
   ```bash
   cd nango-integrations
   nango deploy
   ```

## Step 6: Install Dependencies and Run

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Step 7: Test the Integrations

### Test GitHub Integration

1. Click "Connect GitHub" on the homepage
2. Authorize the application
3. Click "Test Connection" to fetch your GitHub user data

### Test Slack Integration

1. Click "Connect Slack" on the homepage
2. Authorize the application
3. Click "Test Connection" to verify the connection

## Troubleshooting

### Common Issues

#### 1. "Nango is not initialized"
- Check that `NEXT_PUBLIC_NANGO_PUBLIC_KEY` is set in `.env`
- Restart the development server after updating `.env`

#### 2. "Failed to connect"
- Verify OAuth credentials in Nango dashboard
- Check that redirect URLs match
- Ensure scopes are correctly configured

#### 3. "Connection test failed"
- Check that the integration is properly configured
- Verify the connection exists in Nango dashboard
- Check browser console for detailed error messages

### Getting Help

- Nango Documentation: https://docs.nango.dev
- Nango Slack Community: https://nango.dev/slack
- GitHub Issues: Open an issue in this repository

## Next Steps

- Customize the UI to match your brand
- Add more integrations
- Implement data syncing
- Add webhook handlers for real-time updates
- Deploy to production

