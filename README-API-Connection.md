# Aero AI Match Portal - Backend API Connection

This README documents how the frontend connects to the backend API for the Aero AI Match Portal.

## Backend API

The backend API is hosted at:

```
https://aero-matching-backend-a8e57a2ef366.herokuapp.com
```

> **Important Update**: The application uses the `/api/match` endpoint which requires API key authentication.

## Configuration

### 1. Environment Variables

The application uses the `/api/match` endpoint which requires API key authentication. You need to set up environment variables:

Create a `.env` file in the project root using the `.env.example` template:

```bash
cp .env.example .env
```

Then edit the `.env` file with your specific values:

```
VITE_AERO_AI_BACKEND_API_KEY=your_api_key_here
```

### 2. API Endpoints

The frontend uses the following endpoints:

- Health check: `GET /health` - Verifies the backend is online
- Matching: `POST /api/match` - Submits company and project data for matching, requires API key authentication

### 3. Authentication

The matching endpoint (`/api/match`) requires authentication. 

API requests include an `x-api-key` header for authentication, which is stored in the environment variable `VITE_AERO_AI_BACKEND_API_KEY`.

## Implementation Details

### Form Data Structure

The form data sent to the backend follows this structure:

```typescript
interface FormData {
  company: {
    name: string;
    description: string;
    techCategory: string[];
    fundingInstrumentTypes: string[];
    eligibleAgencyCodes?: string[];
    stage: string;
    teamSize: string;
    foundedYear: string;
    website?: string;
    patents?: string;
    email: string;
  };
  project: {
    title: string;
    description: string;
    techSpecs: string;
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    timeline: {
      startDate?: string;
      duration: string;
    };
    categoryOfFundingActivity: string[];
  };
}
```

### API Service

The API connection is implemented in:

- `src/services/matchingService.ts` - Handles sending form data and receiving matches
- `src/services/apiService.ts` - General API utilities
- `src/utils/envConfig.ts` - Environment configuration utilities

## Testing the Connection

1. **Browser Test Tool**: Visit `/backend-connection-test.html` in your browser to test the API connection
2. **Debug Utilities**: Use the `debugEnvironmentVariables()` function from `/src/debug-env.js`

Example debug in browser console:

```javascript
import('/src/debug-env.js').then(module => module.default());
```

## Troubleshooting

### CORS Issues

If you encounter CORS errors:

1. Ensure the backend has your origin (e.g., `http://localhost:8080`) in its allowed origins list
2. Check the browser console for specific CORS error messages
3. Try running the frontend on the same domain or port if possible

### Authentication Errors

If you get 401 Unauthorized errors:

1. Verify your API key is correctly set in the `.env` file
2. Check that the key is being loaded properly via `getBackendApiKey()`

### 404 Not Found

If endpoints return 404:

1. Double-check the API URL in `matchingService.ts`
2. Ensure you're using `/api/match` (not `/api/match/ai` or `/api/matching`)
3. Verify the backend is running and accessible

## Additional Resources

- See `docs/api-setup-guide.md` for detailed setup instructions
- Check the backend README for information about the backend API implementation
