// Test script to make a direct API call with minimal valid payload
async function testApiCall() {
  try {
    console.log("Starting API test call");
    
    // Minimal valid data that meets all requirements
    const minimalData = {
      company: {
        name: "Test Company",
        description: "A test company description",
        techCategory: ["Satellite", "Propulsion"],
        stage: "Early Stage",
        teamSize: "1-10",
        foundedYear: "2020",
        email: "test@example.com"
      },
      project: {
        title: "Test Project",
        description: "A test project description",
        techSpecs: "Simple specs",
        budget: "$10,000",
        timeline: "3 months",
        interests: ["Space"]
      }
    };
    
    console.log("Test payload:", JSON.stringify(minimalData, null, 2));
    
    // Use CORS proxy for the API call
    const corsProxy = 'https://corsproxy.io/?';
    const apiUrl = `${corsProxy}https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/matching`;
    
    console.log(`Using CORS proxy: ${apiUrl}`);
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Get API key from environment variable (must have VITE_ prefix)
        "x-api-key": import.meta.env.VITE_AERO_AI_BACKEND_API_KEY || ""
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log("Response status:", response.status);
    
    // Get response text
    const responseText = await response.text();
    console.log("Response preview:", responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""));
    
    // Try to parse the response as JSON
    try {
      const data = JSON.parse(responseText);
      console.log("Parsed response data:", data);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError);
    }
    
  } catch (error) {
    console.error("Error making API test call:", error);
  }
}

// Run the test
testApiCall();

// To run this script in the browser console:
// 1. Open your browser developer tools (F12 or Ctrl+Shift+I)
// 2. Copy and paste this entire file into the console
// 3. Press Enter to execute
