#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Heroku deployment with NGINX buildpack..."

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

echo "🔧 Setting up buildpack and environment variables..."
heroku buildpacks:clear --app $APP_NAME
heroku buildpacks:set heroku/nodejs --app $APP_NAME
heroku buildpacks:add heroku-community/nginx --app $APP_NAME

# Set environment variables for clean installation
echo "📝 Setting NPM_CONFIG_PRODUCTION=false to ensure dependencies are properly installed..."
heroku config:set NPM_CONFIG_PRODUCTION=false --app $APP_NAME
echo "📝 Setting NODE_ENV=production for production build..."
heroku config:set NODE_ENV=production --app $APP_NAME
echo "📝 Setting NPM_CONFIG_FORCE=true to force dependency resolution..."
heroku config:set NPM_CONFIG_FORCE=true --app $APP_NAME
echo "📝 Setting NPM_CONFIG_LEGACY_PEER_DEPS=true for compatibility..."
heroku config:set NPM_CONFIG_LEGACY_PEER_DEPS=true --app $APP_NAME
echo "📝 Disabling the Heroku node_modules cache for clean installation..."
heroku config:set NODE_MODULES_CACHE=false --app $APP_NAME

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
git commit -m "Deploy with NGINX configuration" || echo "No changes to commit"
git push heroku main --force || git push heroku master --force

echo "✅ Deployment complete!"
echo "🌐 You can view your app at: https://$APP_NAME.herokuapp.com/"

# Open the app
echo "❓ Do you want to open the app in your browser? (y/n)"
read OPEN_APP
if [ "$OPEN_APP" = "y" ] || [ "$OPEN_APP" = "Y" ]; then
  heroku open --app $APP_NAME
fi
