#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== SAM.gov API Opportunity Fetcher ===${NC}"
echo -e "${BLUE}This script will fetch opportunities from SAM.gov API or generate sample data${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js to continue.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "\n${YELLOW}Installing dependencies...${NC}"
  npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating from .env.example...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env file to set your API tokens and configuration.${NC}"
        exit 1
    else
        echo -e "${RED}Error: .env.example file not found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Check if Baserow API token and table ID are set
if grep -q "BASEROW_API_TOKEN=your_baserow_api_token_here\|BASEROW_OPPORTUNITIES_TABLE_ID=your_baserow_table_id_here" .env; then
    echo -e "${RED}Error: Baserow API token or table ID not set in .env file.${NC}"
    echo -e "${YELLOW}Please edit .env file to set your Baserow API token and table ID.${NC}"
    exit 1
fi

# Check if data source is properly configured
USE_SAMPLE_DATA=$(grep "USE_SAMPLE_DATA" .env | cut -d '=' -f2)
SAM_API_KEY=$(grep "SAM_API_KEY" .env | cut -d '=' -f2)

if [ "$USE_SAMPLE_DATA" != "true" ] && [ "$SAM_API_KEY" = "your_api_key_here" ]; then
    echo -e "${RED}Error: SAM.gov API key not configured and USE_SAMPLE_DATA is not enabled.${NC}"
    echo -e "${YELLOW}Please either:${NC}"
    echo -e "${YELLOW}1. Set a valid SAM_API_KEY in your .env file to fetch real data from SAM.gov${NC}"
    echo -e "${YELLOW}2. Set USE_SAMPLE_DATA=true in your .env file to use generated sample data${NC}"
    exit 1
fi

# Show configuration summary
echo -e "\n${BLUE}=== Configuration Summary ===${NC}"
if [ "$USE_SAMPLE_DATA" = "true" ]; then
    echo -e "${GREEN}Data Source: Sample Data (USE_SAMPLE_DATA=true)${NC}"
else
    echo -e "${GREEN}Data Source: SAM.gov API${NC}"
    
    FALLBACK_SETTING=$(grep "FALLBACK_TO_SAMPLE_DATA" .env | cut -d '=' -f2)
    if [ "$FALLBACK_SETTING" = "true" ]; then
        echo -e "${GREEN}Fallback to sample data is enabled if API call fails${NC}"
    else
        echo -e "${YELLOW}No fallback configured - will fail if API call is unsuccessful${NC}"
    fi
    
    SAM_API_LIMIT=$(grep "SAM_API_FETCH_LIMIT" .env | cut -d '=' -f2)
    if [ -z "$SAM_API_LIMIT" ]; then
        echo -e "${GREEN}API Fetch Limit: Default (10)${NC}"
    else
        echo -e "${GREEN}API Fetch Limit: $SAM_API_LIMIT${NC}"
    fi
fi

# Install axios if needed
if ! npm list axios >/dev/null 2>&1; then
  echo -e "\n${YELLOW}Installing axios...${NC}"
  npm install axios
fi

# Run the fetch-opportunities.js script
echo -e "\n${YELLOW}Fetching and storing opportunities...${NC}"
node fetch-opportunities.js

echo -e "\n${GREEN}Process completed!${NC}"
echo -e "Check the output above for details on the opportunities fetched and stored."
