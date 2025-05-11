#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== SAM.gov API Microservice Development Setup ===${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo -e "\n${YELLOW}Installing dependencies...${NC}"
  npm install
fi

# Create logs directory if it doesn't exist
if [ ! -d "logs" ]; then
  echo -e "\n${YELLOW}Creating logs directory...${NC}"
  mkdir -p logs
fi

# Check if MongoDB is running
echo -e "\n${YELLOW}Checking MongoDB connection...${NC}"
if command -v mongosh &> /dev/null; then
  # Try to connect to MongoDB
  if ! mongosh --eval "db.version()" --quiet &> /dev/null; then
    echo -e "\n${YELLOW}MongoDB is not running. Starting MongoDB...${NC}"
    if command -v brew &> /dev/null && brew services list | grep -q mongodb-community; then
      brew services start mongodb-community
    else
      echo -e "\n${YELLOW}Please start MongoDB manually.${NC}"
    fi
  else
    echo -e "\n${GREEN}MongoDB is running.${NC}"
  fi
else
  echo -e "\n${YELLOW}MongoDB shell (mongosh) not found. Please ensure MongoDB is running.${NC}"
fi

# Build TypeScript
echo -e "\n${YELLOW}Building TypeScript...${NC}"
npm run build

# Start the server
echo -e "\n${YELLOW}Starting server...${NC}"
npm run dev

echo -e "\n${GREEN}Development environment is running!${NC}"
echo -e "API: http://localhost:3002"
