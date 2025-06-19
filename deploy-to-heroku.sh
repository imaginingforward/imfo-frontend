#!/bin/bash

# Deploy to Heroku script
echo "=== Aero-AI Match Portal - Heroku Deployment Script ==="

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "Error: git is required but not installed. Please install git first."
    exit 1
fi

# Check if branch is clean
if [[ -n $(git status -s) ]]; then
    echo "Committing changes to git..."
    git add package.json Procfile
    git commit -m "Fix Heroku deployment issues with package versions"
    echo "Changes committed."
else
    echo "No changes to commit."
fi

# Push to Heroku
echo "Deploying to Heroku..."
git push heroku main

echo ""
echo "Deployment process complete."
echo "If the deployment was successful, your app should be available at:"
echo "https://your-heroku-app-name.herokuapp.com/"
echo ""
echo "To check the logs, run: heroku logs --tail"
