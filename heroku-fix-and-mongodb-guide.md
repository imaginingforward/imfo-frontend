# Heroku Deployment Fix & MongoDB Connection Guide

## Heroku Deployment Issues Fixed

We've resolved several issues that were preventing successful deployment to Heroku:

1. **Node.js Engine Specification**
   - Changed from `>=16.0.0` (dangerous semver range) to a specific version `16.x`
   - This ensures compatibility with Heroku's Node.js buildpack

2. **Package Version Conflicts**
   - Fixed versions in package.json to match exactly what the lock file expects:
     - Changed MongoDB from `^6.17.0` to `5.9.2` (exact version)
     - Added missing dependencies like `morgan`, `bson`, etc.
     - Fixed versions for `debug`, `semver`, and other dependencies

3. **Package Lock Synchronization**
   - Regenerated package-lock.json to ensure it's in sync with package.json
   - This addresses the error: `npm ci can only install packages when your package.json and package-lock.json are in sync`

4. **Procfile Added**
   - Created a Procfile with `web: npm start` command
   - Ensures Heroku knows how to start the application

## MongoDB Connection Setup

The application now connects to MongoDB Atlas using the official MongoDB driver:

### Connection Configuration

Your MongoDB connection details are in the `.env` file:

```
# MongoDB Connection (for backend API)
VITE_MONGODB_DATABASE=aero_match_db
VITE_MONGODB_COLLECTION=opportunities

# MongoDB API URL (for frontend to connect to backend API)
VITE_MONGODB_API_URL=http://localhost:3002
```

### Connection Architecture

The system uses a two-tier approach for MongoDB access:

1. **Backend MongoDB API** (`../aero-ai-match-api/`)
   - Direct connection to MongoDB using the official MongoDB Node.js driver
   - Handles all database operations securely
   - Exposes REST endpoints for the frontend

2. **Frontend Service** (`src/services/mongoDBService.ts`)
   - Connects to the backend MongoDB API
   - Never connects directly to the database for security

## Deploying the Application

The deployment process has been streamlined:

1. **Run the deployment script**:
   ```
   ./deploy-to-heroku.sh
   ```
   This script will:
   - Commit any changes to package.json and Procfile
   - Push to Heroku

2. **Manual Deployment**:
   If you prefer manual deployment:
   ```
   git add package.json Procfile
   git commit -m "Fix Heroku deployment issues with package versions"
   git push heroku main
   ```

3. **Verifying Deployment**:
   - Check the logs: `heroku logs --tail`
   - Visit your app URL: `https://your-app-name.herokuapp.com`

## Troubleshooting

If you encounter further deployment issues:

1. **Check package versions**:
   - Ensure all versions in package.json match what's expected in the lock file
   - Run `npm ls <package-name>` to check specific package versions

2. **Check Heroku buildpacks**:
   - Make sure you have the proper buildpacks: `heroku buildpacks`
   - Should show at least `heroku/nodejs`

3. **Verify Node.js version**:
   - If Heroku complains about Node version, check available versions: 
   - Update package.json with a compatible version: `"node": "~16.x"` or a specific version

## Local Development

For local development:

1. **Start the MongoDB API server**:
   ```
   cd ../aero-ai-match-api
   npm install
   npm run dev
   ```

2. **Start the frontend**:
   ```
   npm run dev
   ```

3. **Test MongoDB Connection**:
   - The application should now connect to your MongoDB database
   - Check browser console or API server logs for connection status
