#!/bin/bash

# Verification script for Nango setup

echo "🔍 Verifying Nango Next.js Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check Node.js version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "   ${GREEN}✓${NC} Node.js version is $NODE_VERSION (>= 18)"
else
    echo -e "   ${RED}✗${NC} Node.js version is $NODE_VERSION (< 18 required)"
    ((ERRORS++))
fi

# Check if package.json exists
echo "2️⃣  Checking package.json..."
if [ -f "package.json" ]; then
    echo -e "   ${GREEN}✓${NC} package.json found"
else
    echo -e "   ${RED}✗${NC} package.json not found"
    ((ERRORS++))
fi

# Check if node_modules exists
echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "   ${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "   ${YELLOW}⚠${NC}  node_modules not found. Run: npm install"
fi

# Check .env file
echo "4️⃣  Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "   ${GREEN}✓${NC} .env file exists"
    
    # Check for required environment variables
    if grep -q "NANGO_SECRET_KEY" .env && [ "$(grep NANGO_SECRET_KEY .env | cut -d'=' -f2)" != "your_nango_secret_key_here" ]; then
        echo -e "   ${GREEN}✓${NC} NANGO_SECRET_KEY is configured"
    else
        echo -e "   ${YELLOW}⚠${NC}  NANGO_SECRET_KEY not configured in .env"
    fi
    
    if grep -q "NEXT_PUBLIC_NANGO_PUBLIC_KEY" .env && [ "$(grep NEXT_PUBLIC_NANGO_PUBLIC_KEY .env | cut -d'=' -f2)" != "your_nango_public_key_here" ]; then
        echo -e "   ${GREEN}✓${NC} NEXT_PUBLIC_NANGO_PUBLIC_KEY is configured"
    else
        echo -e "   ${YELLOW}⚠${NC}  NEXT_PUBLIC_NANGO_PUBLIC_KEY not configured in .env"
    fi
else
    echo -e "   ${RED}✗${NC} .env file not found. Run: cp .env.example .env"
    ((ERRORS++))
fi

# Check directory structure
echo "5️⃣  Checking project structure..."
REQUIRED_DIRS=("app" "components" "lib" "nango-integrations" "docs")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "   ${GREEN}✓${NC} $dir/ directory exists"
    else
        echo -e "   ${RED}✗${NC} $dir/ directory missing"
        ((ERRORS++))
    fi
done

# Check key files
echo "6️⃣  Checking key files..."
REQUIRED_FILES=(
    "app/page.tsx"
    "app/api/nango/connections/route.ts"
    "components/ConnectionCard.tsx"
    "lib/nango-client.ts"
    "lib/nango-server.ts"
    "nango-integrations/nango.yaml"
)
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} $file exists"
    else
        echo -e "   ${RED}✗${NC} $file missing"
        ((ERRORS++))
    fi
done

# Check Nango configuration
echo "7️⃣  Checking Nango configuration..."
if [ -f "nango-integrations/nango.yaml" ]; then
    if grep -q "github:" nango-integrations/nango.yaml; then
        echo -e "   ${GREEN}✓${NC} GitHub integration configured"
    else
        echo -e "   ${YELLOW}⚠${NC}  GitHub integration not found in nango.yaml"
    fi
    
    if grep -q "slack:" nango-integrations/nango.yaml; then
        echo -e "   ${GREEN}✓${NC} Slack integration configured"
    else
        echo -e "   ${YELLOW}⚠${NC}  Slack integration not found in nango.yaml"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Summary
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Setup verification passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make sure you've configured your Nango keys in .env"
    echo "2. Set up integrations in Nango Dashboard"
    echo "3. Run: npm run dev"
    echo "4. Open: http://localhost:3000"
else
    echo -e "${RED}❌ Setup verification found $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above and run this script again."
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

