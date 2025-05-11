# Deployment Guide for CORS Fix

This guide explains how to deploy the changes made to fix the CORS (Cross-Origin Resource Sharing) issue affecting form submissions.

## Overview of Changes

1. **Backend Proxy Route**: Created a new endpoint in the backend that forwards requests to Baserow API
2. **Frontend Service Update**: Modified the frontend to call our backend proxy instead of Baserow directly
3. **CORS Configuration**: Updated the backend to allow requests from specified domains

## Deployment Steps

### 1. Backend Deployment

Deploy the updated backend (`sam-api-service`) with the following key files:

- `src/routes/baserowRoutes.ts` - New route to handle proxying requests to Baserow
- `src/index.ts` - Updated with CORS configuration and new route registration
- `.env` - Updated environment variables (includes Baserow token and CORS settings)

```bash
# From the root directory
cd sam-api-service

# Install dependencies if needed
npm install

# Build the application
npm run build

# Start the server
npm start
```

### 2. Frontend Deployment

Deploy the updated frontend with:

- `src/services/baserowService.ts` - Updated to call backend proxy instead of Baserow directly

Make sure the `VITE_API_URL` environment variable is set correctly in your frontend deployment to point to your backend API URL.

### 3. Environment Variable Configuration

Ensure these environment variables are correctly set in your backend:

- `BASEROW_API_TOKEN`: Your Baserow API token
- `BASEROW_FORM_TABLE_ID`: The table ID for form submissions
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed origins (frontend domains)

Example:
```
BASEROW_API_TOKEN=your-token-here
BASEROW_FORM_TABLE_ID=519889
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

### 4. Verify Deployment

After deployment, verify:

1. Form submissions work without CORS errors
2. Submissions are correctly stored in Baserow
3. Matching results are displayed after submission

## Troubleshooting

If you encounter issues:

- **CORS Errors**: Check that your frontend domain is included in `CORS_ALLOWED_ORIGINS`
- **Backend Connection**: Verify the `VITE_API_URL` is correct in your frontend
- **Baserow API Issues**: Make sure the `BASEROW_API_TOKEN` is valid and not expired
- **Check Logs**: Review your backend application logs for specific error messages

For any API-related issues, check the Network tab in your browser's developer tools to see the specific request/response details.
