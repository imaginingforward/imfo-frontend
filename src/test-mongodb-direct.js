// Direct MongoDB Data API Test Script
// This script will directly query MongoDB using the Data API

// Load environment variables
import { config } from 'dotenv';
import { readFileSync } from 'fs';

// Initialize environment variables
config();

// Manually load environment variables if needed
const env = {};
try {
  const envFile = readFileSync('.env', 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^VITE_([^=]+)=(.*)$/);
    if (match) {
      env[match[1]] = match[2].trim();
    }
  });
} catch (err) {
  console.warn('Could not load .env file, using defaults');
}

// Configuration from .env file
const MONGODB_DATA_API_URL = process.env.VITE_MONGODB_DATA_API_URL || env.MONGODB_DATA_API_URL || "https://data.mongodb-api.com/app/data-apiapp-uktwh/endpoint/data/v1";
const MONGODB_API_KEY = process.env.VITE_MONGODB_DATA_API_KEY || env.MONGODB_DATA_API_KEY || "14c2ff00-5f0c-442d-a473-9944be4ca9fc";
const MONGODB_DATA_SOURCE = process.env.VITE_MONGODB_DATA_SOURCE || env.MONGODB_DATA_SOURCE || "Cluster0";
const MONGODB_DATABASE = process.env.VITE_MONGODB_DATABASE || env.MONGODB_DATABASE || "aero_match_db";
const MONGODB_COLLECTION = process.env.VITE_MONGODB_COLLECTION || env.MONGODB_COLLECTION || "opportunities";

console.log('Testing with the following configuration:');
console.log('API URL:', MONGODB_DATA_API_URL);
console.log('Database:', MONGODB_DATABASE);
console.log('Collection:', MONGODB_COLLECTION);
console.log('Data Source:', MONGODB_DATA_SOURCE);
console.log('API Key (partial):', MONGODB_API_KEY ? `${MONGODB_API_KEY.substring(0, 5)}...` : 'Not provided');

async function testMongoDBDirectly() {
  console.log("=== Testing Direct MongoDB Data API Connection ===");
  console.log(`API URL: ${MONGODB_DATA_API_URL}`);
  console.log(`Database: ${MONGODB_DATABASE}`);
  console.log(`Collection: ${MONGODB_COLLECTION}`);
  console.log("Sending request to MongoDB Data API...");
  
  try {
    // Use Data API to count documents
    const countUrl = `${MONGODB_DATA_API_URL}/action/countDocuments`;
    
    // Make the request to MongoDB Data API for count
    const countResponse = await fetch(countUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': MONGODB_API_KEY
      },
      body: JSON.stringify({
        dataSource: MONGODB_DATA_SOURCE,
        database: MONGODB_DATABASE,
        collection: MONGODB_COLLECTION,
        filter: {}
      })
    });
    
    if (!countResponse.ok) {
      const errorText = await countResponse.text();
      console.error('MongoDB Count Error:', countResponse.status, errorText);
      throw new Error(`MongoDB Count Error: ${countResponse.status}`);
    }
    
    const countResult = await countResponse.json();
    console.log(`Document count: ${countResult.count || 0}`);
    
    // If we have documents, retrieve them
    if (countResult.count > 0) {
      // Construct the URL for the find operation
      const findUrl = `${MONGODB_DATA_API_URL}/action/find`;
      
      // Make the request to MongoDB Data API for find
      console.log("Retrieving documents...");
      const findResponse = await fetch(findUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': MONGODB_API_KEY
        },
        body: JSON.stringify({
          dataSource: MONGODB_DATA_SOURCE,
          database: MONGODB_DATABASE,
          collection: MONGODB_COLLECTION,
          filter: {},
          limit: 10
        })
      });
      
      if (!findResponse.ok) {
        const errorText = await findResponse.text();
        console.error('MongoDB Find Error:', findResponse.status, errorText);
        throw new Error(`MongoDB Find Error: ${findResponse.status}`);
      }
      
      const findResult = await findResponse.json();
      
      console.log(`Retrieved ${findResult.documents?.length || 0} documents`);
      
      // Print first document to verify structure
      if (findResult.documents && findResult.documents.length > 0) {
        console.log("Sample document:");
        console.log(JSON.stringify(findResult.documents[0], null, 2));
      }
    }
  } catch (error) {
    console.error("Error testing MongoDB directly:", error);
  }
}

// Check database name and collection name by listing them
async function listDatabasesAndCollections() {
  console.log("\n=== Checking Available Databases and Collections ===");
  
  try {
    // Log that Atlas Data API doesn't support listing databases/collections
    console.log("Note: MongoDB Atlas Data API does not support listing all databases and collections.");
    console.log("Looking for collections in the specified database directly...");
    
    // Try to list collections in the specified database
    const listCollectionsUrl = `${MONGODB_DATA_API_URL}/action/listCollections`;
    
    const listCollectionsResponse = await fetch(listCollectionsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': MONGODB_API_KEY
      },
      body: JSON.stringify({
        dataSource: MONGODB_DATA_SOURCE,
        database: MONGODB_DATABASE
      })
    });
    
    // Note: This might fail as Data API might not support this operation
    if (!listCollectionsResponse.ok) {
      console.log("Could not list collections via Data API (this is expected, as Data API might not support this operation)");
      console.log("Please verify database and collection names manually in MongoDB Atlas dashboard");
    } else {
      const collections = await listCollectionsResponse.json();
      console.log("Available collections:", collections);
    }
  } catch (error) {
    console.log("Error listing databases/collections (this is expected with Data API)");
  }
}

// Run all tests
async function runDiagnostics() {
  await listDatabasesAndCollections();
  await testMongoDBDirectly();
  console.log("\nTesting complete");
}

runDiagnostics();
