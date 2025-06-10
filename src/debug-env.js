/**
 * Debug utility to check environment variables
 * Run this in the browser console to check if your environment variables are correctly set
 */
function debugEnvironmentVariables() {
  console.log("Debugging environment variables...");
  
  // Check for Vite environment object
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log("Vite environment object found:", import.meta.env);
    
    // Check for specific API variables
    console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("VITE_AERO_AI_BACKEND_API_KEY present:", 
                import.meta.env.VITE_AERO_AI_BACKEND_API_KEY ? "Yes" : "No");
                
    if (import.meta.env.VITE_AERO_AI_BACKEND_API_KEY) {
      const apiKey = import.meta.env.VITE_AERO_AI_BACKEND_API_KEY;
      // Show first and last 4 chars only for security
      console.log("API Key format check:", 
                  apiKey.substring(0, 4) + "..." + 
                  apiKey.substring(apiKey.length - 4));
    }
  } else {
    console.log("Vite environment object not found. Are you running in a Vite application?");
  }
  
  // Check for process.env (Node.js environment)
  if (typeof process !== 'undefined' && process.env) {
    console.log("Node.js process.env found");
    console.log("NODE_ENV:", process.env.NODE_ENV);
  } else {
    console.log("Node.js process.env not available in this context");
  }
  
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
 */
