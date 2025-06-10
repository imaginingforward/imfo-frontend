# API Connection Guide

## Overview

This document provides guidance on how the Space Tech RFP Matchmaker connects to its backend API and how to troubleshoot common connection issues.

## Recent Changes

We have implemented a CORS proxy solution to address Cross-Origin Resource Sharing (CORS) issues when connecting to the backend API. This change affects the following files:

1. `src/services/matchingService.ts` - Core API connection service
2. `src/test-api-call.js` - API testing utility
3. `public/connection-test.html` - Connection diagnosis tool
4. `public/api-test.html` - Simple API tester
5. `src/api-connection-checker.js` - API connection checking utility

## CORS Proxy Implementation

The application now uses a CORS proxy (`https://corsproxy.io/?`) to route API requests. This proxy adds the necessary CORS headers to allow cross-origin requests from development and production environments.

Example:

```javascript
const corsProxy = 'https://corsproxy.io/?';
const apiUrl = `${corsProxy}https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/matching`;
```

## Demo Data Mode

The automatic fallback to demo data has been commented out to ensure real API requests are made. If you need to restore demo data mode, uncomment the fallback code in `src/services/matchingService.ts`.

## Debugging Tools

### 1. Connection Test Page

Access `public/connection-test.html` to run a comprehensive API connection test that checks both root and matching endpoints.

### 2. API Test Page

Open `public/api-test.html` to make simple API requests with a minimal valid payload.

### 3. API-Connection-Checker Module

Import the `checkApiConnection` function from `src/api-connection-checker.js` to programmatically test API connectivity.

## Common Issues and Solutions

### 1. CORS Errors

If you encounter CORS errors despite the proxy:

- Check if the CORS proxy is still operational
- Try an alternative proxy like `https://cors-anywhere.herokuapp.com/`
- Update the API server to accept requests from your origin

### 2. Authentication Errors

If you receive 401 or 403 responses:

- Verify your API key in `.env` file
- Check that the API key is correctly included in the request headers
- Ensure the API key hasn't expired

### 3. Invalid Responses

If you receive HTML responses instead of JSON:

- Verify the API URL is correct
- Check that the server is operational
- Ensure the endpoint path is correct

## Environment Variables

The application uses the following environment variables for API connectivity:

- `VITE_AERO_AI_BACKEND_API_KEY`: API key for authentication
- `VITE_API_BASE_URL`: Base URL for the API (optional, defaults to Heroku URL)

## Testing in Development

To test API connectivity in development:

1. Run `npm run dev` to start the development server
2. Open the application in your browser
3. Use the browser developer tools to monitor network requests
4. Check console logs for detailed API request and response information
