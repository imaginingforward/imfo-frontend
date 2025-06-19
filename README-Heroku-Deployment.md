# Heroku Deployment for Aero AI Match Portal Frontend

This README provides instructions for deploying the Aero AI Match Portal frontend to Heroku, now configured to work with the Baserow backend API.

## What's Included

We've made the following changes to fix Heroku deployment issues:

1. **Fixed Rollup Dependency Issues**:
   - Added `.npmrc` file for proper dependency hoisting
   - Added Rollup override in package.json
   - Updated package.json scripts for Heroku compatibility

2. **Migrated from Static Buildpack to NGINX**:
   - Created NGINX configuration in `config/nginx.conf.erb`
   - Configured SPA routing for React Router support
   - Added security headers and caching rules

3. **Connected to the Heroku-hosted Baserow Backend**:
   - Updated services to use `https://aero-matching-backend-a8e57a2ef366.herokuapp.com/`
   - Created a unified API service for communication with the backend

4. **Created Deployment Scripts**:
   - `deploy-to-heroku-nginx.sh`: Modern deployment script with NGINX buildpack

## Deployment Instructions

### Quick Start

To deploy this application to Heroku:

1. Make sure you have the Heroku CLI installed and are logged in:
   ```
   heroku login
   ```

2. Run the deployment script:
   ```
   ./deploy-to-heroku-nginx.sh your-app-name
   ```

### Detailed Documentation

For more detailed information, see:
- `heroku-deployment-guide.md`: Technical explanation of all deployment fixes
- `config/nginx.conf.erb`: NGINX configuration for Heroku

## Architecture

The application is now configured as a frontend-only deployment that connects to a dedicated backend service:

```
Frontend (This Repo)                 Backend (aero-matching-backend)
┌─────────────────────┐              ┌──────────────────────────┐
│                     │              │                          │
│  React/Vite App     │───API────────▶  Express Backend Server  │
│  (Deployed on       │  Requests    │  (Deployed on Heroku)    │
│   Heroku+NGINX)     │◀─────────────│                          │
│                     │  Responses   │                          │
└─────────────────────┘              └──────────────┬───────────┘
                                                   │
                                                   │ API Calls
                                                   ▼
                                     ┌──────────────────────────┐
                                     │                          │
                                     │     Baserow API          │
                                     │                          │
                                     └──────────────────────────┘
```

## Testing Your Deployment

After deployment, you can test that everything is working properly:

1. Visit your deployed app: `https://your-app-name.herokuapp.com/`
2. Navigate to the form and submit a test company/project
3. Verify that it connects to the backend and returns matches

## Troubleshooting

If you encounter issues:

1. Check the Heroku logs:
   ```
   heroku logs --tail --app your-app-name
   ```

2. Try clearing the build cache and redeploying:
   ```
   heroku builds:cache:purge --app your-app-name
   ```

3. Verify that the NGINX configuration is correct
