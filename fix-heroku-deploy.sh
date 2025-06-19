#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Heroku deployment with fixes..."

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
  echo "❌ Heroku CLI is not installed. Please install it first."
  exit 1
fi

# Use provided app name or ask for it
APP_NAME=$1
if [ -z "$APP_NAME" ]; then
  read -p "Enter your Heroku app name: " APP_NAME
fi

echo "📝 Using Heroku app: $APP_NAME"

# Clear and set up buildpacks
echo "🔧 Setting up buildpack and environment variables..."
heroku buildpacks:clear --app $APP_NAME
heroku buildpacks:set heroku/nodejs --app $APP_NAME
heroku buildpacks:add heroku-community/nginx --app $APP_NAME

# Configure environment variables for Heroku
echo "📝 Setting NODE_ENV=production for production build..."
heroku config:set NODE_ENV=production --app $APP_NAME

echo "📝 Setting NPM_CONFIG_FORCE=true to force dependency resolution..."
heroku config:set NPM_CONFIG_FORCE=true --app $APP_NAME

echo "📝 Setting NPM_CONFIG_LEGACY_PEER_DEPS=true for compatibility..."
heroku config:set NPM_CONFIG_LEGACY_PEER_DEPS=true --app $APP_NAME

# The most important fix - tell Heroku to use npm install instead of npm ci
echo "📝 Setting NPM_CONFIG_PACKAGE_LOCK=false to avoid package-lock.json validation..."
heroku config:set NPM_CONFIG_PACKAGE_LOCK=false --app $APP_NAME

# Set NODE_MODULES_CACHE=false for a clean installation
echo "📝 Disabling the Heroku node_modules cache for clean installation..."
heroku config:set NODE_MODULES_CACHE=false --app $APP_NAME

# Note: The build cache purge command appears to have changed in Heroku CLI
echo "🧹 Skipping build cache purge (command not available)..."

# Push to Heroku
echo "📤 Pushing to Heroku... (this may take a few minutes)"
git add .
git commit -m "Fixed deployment configuration" || echo "No changes to commit"
git push heroku main --force || git push heroku master --force

echo "✅ Deployment complete!"
echo "🌐 You can view your app at: https://$APP_NAME.herokuapp.com/"
