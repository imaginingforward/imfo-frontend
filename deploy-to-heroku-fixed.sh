#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Heroku deployment with fixed Rollup configuration..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
  echo "❌ Heroku CLI is not installed. Please install it first."
  echo "   https://devcenter.heroku.com/articles/heroku-cli"
  exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo "❌ Git is not installed. Please install it first."
  exit 1
fi

# Check if logged in to Heroku
heroku whoami &> /dev/null || (echo "❌ Not logged in to Heroku. Please run 'heroku login' first." && exit 1)

# Get Heroku app name
if [ -z "$1" ]; then
  read -p "Enter your Heroku app name: " APP_NAME
else
  APP_NAME=$1
fi

echo "📝 Using Heroku app: $APP_NAME"

# Check if the app exists
if ! heroku apps:info --app $APP_NAME &> /dev/null; then
  echo "❓ App does not exist. Do you want to create it? (y/n)"
  read CREATE_APP
  if [ "$CREATE_APP" = "y" ] || [ "$CREATE_APP" = "Y" ]; then
    heroku apps:create $APP_NAME
  else
    echo "❌ Aborting deployment."
    exit 1
  fi
fi

echo "🔧 Setting up buildpack..."
heroku buildpacks:clear --app $APP_NAME
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git --app $APP_NAME

# Ensure we're in a git repository
if [ ! -d .git ]; then
  echo "📁 Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit"
fi

# Check if we have a Heroku remote
if ! git remote | grep -q heroku; then
  echo "🔄 Adding Heroku remote..."
  heroku git:remote --app $APP_NAME
fi

# Push to Heroku
echo "📤 Pushing to Heroku... (this may take a few minutes)"
git add .
git commit -m "Deploy with fixed Rollup configuration" || echo "No changes to commit"
git push heroku main --force || git push heroku master --force

echo "✅ Deployment complete!"
echo "🌐 You can view your app at: https://$APP_NAME.herokuapp.com/"

# Open the app
echo "❓ Do you want to open the app in your browser? (y/n)"
read OPEN_APP
if [ "$OPEN_APP" = "y" ] || [ "$OPEN_APP" = "Y" ]; then
  heroku open --app $APP_NAME
fi
