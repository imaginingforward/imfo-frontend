/**
 * Test script for Baserow connection
 * moved from original in src/test-baserow-connection.js b/c of baserow crashing heroku
 * This script tests the connection to Baserow using the environment variables
 * and displays the retrieved opportunities.
 * 
 * To run: node src/test-baserow-connection.js
 */

// Import from environment (using Vite env)
import.meta.env = import.meta.env || {};
const BASEROW_API_URL = import.meta.env.VITE_BASEROW_API_URL || "https://api.baserow.io";
const BASEROW_API_KEY = import.meta.env.VITE_BASEROW_API_KEY || "V8TT0pqPOKhwEcYzSysD0COL1oScagiG";
const BASEROW_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ID || "576422";

async function testBaserowConnection() {
  console.log("Testing Baserow Connection...");
  
  // Log configuration
  console.log("Configuration:");
  console.log("API URL:", BASEROW_API_URL);
  console.log("Table ID:", BASEROW_TABLE_ID);
  console.log("API Key:", BASEROW_API_KEY ? "Set (hidden)" : "Not set");
  
  try {
    // Construct the Baserow API URL
    const url = `${BASEROW_API_URL}/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`;
    
    console.log("Requesting data from:", url);
    
    // Make the request to the Baserow API
    const response = await fetch(url, {
      headers: {
        "Authorization": `Token ${BASEROW_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Baserow API error:", response.status, errorText);
      return;
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if we have results
    if (!data.results || !Array.isArray(data.results)) {
      console.warn("Invalid or empty response from Baserow");
      return;
    }
    
    console.log(`Success! Retrieved ${data.results.length} opportunities from Baserow`);
    
    // Display the first opportunity as an example
    if (data.results.length > 0) {
      console.log("\nSample opportunity:");
      const sample = data.results[0];
      console.log("ID:", sample.id);
      console.log("Title:", sample.OpportunityTitle);
      console.log("Agency:", sample.AgencyName);
      console.log("Funding Type:", sample.FundingInstrumentType);
      console.log("Category:", sample.OpportunityCategory);
      console.log("Post Date:", sample.PostDate);
      console.log("Close Date:", sample.CloseDate);
      
      // Calculate and display timeline
      if (sample.PostDate && sample.CloseDate) {
        const postDate = new Date(sample.PostDate);
        const closeDate = new Date(sample.CloseDate);
        const diffTime = Math.abs(closeDate.getTime() - postDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log("Duration:", diffDays, "days");
      }
    }
    
  } catch (error) {
    console.error("Error connecting to Baserow:", error);
  }
}

testBaserowConnection();
