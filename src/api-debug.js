// API debugging script
// Run with: node src/api-debug.js

// Configuration
const API_URL = "https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/opportunities?limit=50";
const API_KEY = "3b8811fb-36a5-4481-9a71-a9edac615d9d";

async function testAPI() {
  console.log('Testing API connection to:', API_URL);
  
  try {
    // Make the API request with full headers
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-API-Key': API_KEY
      }
    });
    
    // Log response status and headers
    console.log('Response Status:', response.status);
    console.log('Response Status Text:', response.statusText);
    console.log('Response Headers:');
    
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Try to parse the response as JSON
    try {
      const data = await response.json();
      console.log('Response Data:', JSON.stringify(data, null, 2));
      
      // Check if the response has the expected format
      if (data.success === true && Array.isArray(data.data)) {
        console.log(`Success! Found ${data.data.length} opportunities`);
      } else if (data.success === true && data.data && data.data.length === 0) {
        console.log('API returned success but no opportunities found (empty array)');
      } else if (data.success === true) {
        console.log('API returned success but data is not in expected format:', typeof data.data);
      } else {
        console.log('API call was not successful');
      }
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      const textResponse = await response.text();
      console.log('Raw response text:', textResponse);
    }
  } catch (fetchError) {
    console.error('Fetch error:', fetchError.message);
  }
}

// Try fetching with different methods if the first one fails
async function runTests() {
  console.log('=== Testing with Authorization and X-API-Key headers ===');
  await testAPI();
}

runTests().then(() => console.log('Testing complete'));
