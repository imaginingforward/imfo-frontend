/**
 * Debug utility to check environment variables and API connection settings
 * Run this in the browser console to check if your environment variables are correctly set
 */
function debugEnvironmentVariables() {
  console.log("🔍 Debugging environment variables and API settings...");
  
  // Check for Vite environment object
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log("✓ Vite environment object found");
    
    // Check for specific API variables
    console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL || "Not set (will use default)");
    
  // Check API key - required for /api/match endpoint
  if (import.meta.env.VITE_AERO_AI_BACKEND_API_KEY) {
    const apiKey = import.meta.env.VITE_AERO_AI_BACKEND_API_KEY;
    // Show first and last 4 chars only for security
    console.log("✓ API Key present:", 
                apiKey.substring(0, 4) + "..." + 
                apiKey.substring(apiKey.length - 4));
  } else {
    console.warn("⚠️ API Key not set - authentication will fail for /api/match endpoint");
  }
    
    // Check for other relevant environment variables
    console.log("Environment:", import.meta.env.MODE || "development");
    console.log("CORS Origins:", import.meta.env.VITE_CORS_ALLOWED_ORIGINS || "Not set");
  } else {
    console.warn("⚠️ Vite environment object not found. Are you running in a Vite application?");
  }
  
  // Display API connection information
  console.log("\n📡 API Connection Information:");
  console.log("API Endpoint: https://aero-matching-backend-a8e57a2ef366.herokuapp.com/api/match");
  console.log("Current Origin:", window.location.origin);
  
  // Check for potential CORS issues
  const isPotentialCorsIssue = window.location.protocol === 'http:' && 
    !['localhost', '127.0.0.1'].includes(window.location.hostname);
  
  if (isPotentialCorsIssue) {
    console.warn("⚠️ Potential CORS issue detected: You're connecting from an HTTP origin to an HTTPS API");
    console.log("Solutions:");
    console.log("1. Use HTTPS for local development");
    console.log("2. Ensure the backend has your origin in its CORS allowlist");
  }
  
  // Perform a simple health check if possible
  console.log("\n🩺 Attempting API Health Check...");
  
  fetch('https://aero-matching-backend-a8e57a2ef366.herokuapp.com/health')
    .then(response => {
      if (response.ok) {
        console.log("✓ API Health Check: Success");
        return response.json();
      } else {
        console.warn(`⚠️ API Health Check: Failed with status ${response.status}`);
        return response.text().then(text => {
          throw new Error(`API responded with ${response.status}: ${text}`);
        });
      }
    })
    .then(data => {
      console.log("API Health Response:", data);
    })
    .catch(error => {
      console.error("❌ API Health Check Error:", error.message);
      if (error.message.includes("blocked by CORS policy")) {
        console.warn("This is a CORS issue. The API server needs to allow requests from:", window.location.origin);
      }
    });
  
  return "Environment variables check complete. See console for details.";
}

// Export the function
export default debugEnvironmentVariables;

/**
 * To use this debug utility:
 * 
 * 1. In your React component or page:
 *    import debugEnvironmentVariables from './debug-env';
 *    
 *    // Call the function where needed
 *    debugEnvironmentVariables();
 * 
 * 2. Or directly in browser console:
 *    import('/src/debug-env.js').then(module => module.default());
 * 
 * 3. To test API connection manually:
 *    fetch('https://aero-matching-backend-a8e57a2ef366.herokuapp.com/health', {
 *      headers: { 'x-api-key': 'your-api-key-here' }
 *    }).then(r => r.json()).then(console.log).catch(console.error)
 */
