/**
 * API Connection Checker
 * A utility to check if the API is accessible and responding properly
 */

/**
 * Check API connection
 * @param {string} apiUrl - The API URL to check
 * @param {string} apiKey - The API key to use for authentication
 * @returns {Promise<Object>} - Response object with status and details
 */
export async function checkApiConnection(apiUrl = null, apiKey = null) {
  try {
    // Use provided values or try to get them from environment
    // Add CORS proxy to avoid CORS issues
    const corsProxy = 'https://corsproxy.io/?';
    const url = corsProxy + (apiUrl || "https://aero-ai-backend-b4a2e5c4d981.herokuapp.com");
    const key = apiKey || (import.meta.env ? import.meta.env.VITE_AERO_AI_BACKEND_API_KEY : "");
    
    console.log(`Checking API connection to: ${url}`);
    console.log(`API key provided: ${key ? 'Yes' : 'No'}`);
    
    // First, try a simple GET request to the root endpoint
    const rootResponse = await fetch(url, {
      method: "GET",
      headers: key ? { "x-api-key": key } : {}
    });
    
    console.log(`Root endpoint status: ${rootResponse.status}`);
    
    const rootText = await rootResponse.text();
    let rootData = null;
    
    try {
      rootData = JSON.parse(rootText);
      console.log("Root endpoint response:", rootData);
    } catch (e) {
      console.log("Root endpoint returned non-JSON response");
    }
    
    // Now try the actual matching endpoint with a simple request
    // Ensure we're using the CORS proxy
    const matchingUrl = url.includes('corsproxy.io') 
      ? `${url}/api/matching`
      : `${corsProxy}${url}/api/matching`;
    console.log(`Checking matching endpoint: ${matchingUrl}`);
    
    const testPayload = {
      company: {
        name: "API Check Company",
        description: "A test company for API checking",
        techCategory: ["Test"],
        stage: "Early Stage",
        teamSize: "1-10",
        foundedYear: "2023",
        email: "test@example.com"
      },
      project: {
        title: "API Check Project",
        description: "A test project for API checking",
        techSpecs: "Test specs",
        budget: "$1",
        timeline: "1 day",
        interests: ["Test"]
      }
    };
    
    const matchingResponse = await fetch(matchingUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(key ? { "x-api-key": key } : {})
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log(`Matching endpoint status: ${matchingResponse.status}`);
    
    const matchingText = await matchingResponse.text();
    let matchingData = null;
    
    try {
      matchingData = JSON.parse(matchingText);
      console.log("Matching endpoint response:", matchingData);
    } catch (e) {
      console.log("Matching endpoint returned non-JSON response:", matchingText.substring(0, 200));
    }
    
    // Compile the results
    return {
      success: 
        rootResponse.ok && 
        matchingResponse.status !== 400 && 
        matchingResponse.status !== 404,
      rootEndpoint: {
        status: rootResponse.status,
        isJson: rootData !== null,
        data: rootData
      },
      matchingEndpoint: {
        status: matchingResponse.status,
        isJson: matchingData !== null,
        data: matchingData
      },
      errorDetails: matchingResponse.status >= 400 ? matchingText : null
    };
    
  } catch (error) {
    console.error("API connection check failed:", error);
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

// Example usage:
// import { checkApiConnection } from './api-connection-checker.js';
// 
// async function testConnection() {
//   const result = await checkApiConnection();
//   console.log("API Connection Check Result:", result);
// }
// 
// testConnection();
