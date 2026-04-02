#!/bin/bash

# Investment Club Management App - Supabase Deployment Script
# This script deploys your backend to Supabase Edge Functions

set -e  # Exit on any error

echo "🚀 Investment Club Management App - Supabase Deployment"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_REF="heozvgsotrvfaucnkbvh"
FUNCTION_NAME="make-server-f4ff8ddc"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo ""
    echo "  macOS/Linux:"
    echo "    brew install supabase/tap/supabase"
    echo ""
    echo "  Windows:"
    echo "    scoop install supabase"
    echo ""
    echo "  Or use npm:"
    echo "    npm install -g supabase"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase CLI is installed${NC}"
echo ""

# Check if already linked to project
if [ ! -f ".supabase/config.toml" ]; then
    echo -e "${YELLOW}🔗 Linking to Supabase project...${NC}"
    echo ""
    echo "Please enter your database password when prompted."
    echo "You can find/reset it at:"
    echo "https://supabase.com/dashboard/project/$PROJECT_REF/settings/database"
    echo ""
    
    supabase link --project-ref $PROJECT_REF
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully linked to project${NC}"
        echo ""
    else
        echo -e "${RED}❌ Failed to link to project${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Already linked to Supabase project${NC}"
    echo ""
fi

# Deploy the function
echo -e "${YELLOW}📦 Deploying backend function...${NC}"
echo ""
echo "Function: $FUNCTION_NAME"
echo "Endpoint: https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME"
echo ""

supabase functions deploy $FUNCTION_NAME

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    echo "========================================================"
    echo -e "${GREEN}🎉 Your backend is now live!${NC}"
    echo "========================================================"
    echo ""
    echo "📍 API Endpoint:"
    echo "   https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME"
    echo ""
    echo "🔍 Health Check:"
    echo "   https://$PROJECT_REF.supabase.co/functions/v1/$FUNCTION_NAME/health"
    echo ""
    echo "📊 View Logs:"
    echo "   supabase functions logs $FUNCTION_NAME"
    echo ""
    echo "🌐 Dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions/$FUNCTION_NAME/logs"
    echo ""
    echo "========================================================"
    echo ""
    echo "Next Steps:"
    echo ""
    echo "1. Refresh your app in the browser"
    echo "2. Look for the green '✅ PRODUCTION MODE' message"
    echo "3. Click 'Initialize Demo Data' to create users"
    echo "4. Log in as admin:"
    echo "   Email: admin@club.com"
    echo "   Password: InvestClub2026!"
    echo ""
    echo -e "${GREEN}Happy investing! 💰${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check if you're logged in: supabase login"
    echo "2. Check logs: supabase functions logs $FUNCTION_NAME"
    echo "3. Try redeploying: supabase functions deploy $FUNCTION_NAME"
    echo ""
    exit 1
fi
