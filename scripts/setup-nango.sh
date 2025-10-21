#!/bin/bash

# Setup script for Nango integrations

echo "🚀 Setting up Nango integrations..."

# Check if nango-integrations directory exists
if [ ! -d "nango-integrations" ]; then
  echo "❌ nango-integrations directory not found!"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "⚠️  Please update .env with your actual credentials!"
else
  echo "✅ .env file exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Nango CLI is installed
if ! command -v nango &> /dev/null; then
  echo "📥 Installing Nango CLI..."
  npm install -g nango
fi

# Login to Nango (optional - can be skipped for local development)
echo ""
echo "🔐 To deploy integrations to Nango Cloud, run:"
echo "   nango login"
echo ""
echo "📤 To deploy your integrations, run:"
echo "   cd nango-integrations && nango deploy"
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Nango credentials"
echo "2. Configure OAuth apps for GitHub and Slack in Nango dashboard"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:3000 to test integrations"

