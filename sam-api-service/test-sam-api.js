#!/usr/bin/env node

/**
 * Test script for SAM.gov API connectivity
 * 
 * This script:
 * 1. Loads configuration from .env
 * 2. Tests connectivity to the SAM.gov API
 * 3. Reports the results
 * 
 * Usage:
 * node test-sam-api.js
 */

import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Colors for terminal output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

// Configure logging
const log = (message, color = RESET) => {
  const timestamp = new Date().toISOString();
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
};

// Test SAM.gov API connectivity
async function testSamApi() {
  log('SAM.gov API Connectivity Test', BLUE);
  log('==============================', BLUE);

  // Check if API key is configured
  const SAM_API_KEY = process.env.SAM_API_KEY || '';
  const SAM_API_BASE_URL = process.env.SAM_API_BASE_URL || 'https://api.sam.gov/opportunities/v1';

  if (!SAM_API_KEY || SAM_API_KEY === 'your_api_key_here') {
    log('ERROR: SAM_API_KEY not configured in .env file', RED);
    log('Please set a valid SAM_API_KEY in your .env file', YELLOW);
    return false;
  }

  log(`Using SAM API Base URL: ${SAM_API_BASE_URL}`, BLUE);
  log(`API Key: ${SAM_API_KEY.substring(0, 4)}...${SAM_API_KEY.substring(SAM_API_KEY.length - 4)}`, BLUE);

  try {
    log('Making test request to SAM.gov API...', BLUE);
    
    // Simple request just to test connectivity - only fetch 1 result
    const params = {
      api_key: SAM_API_KEY,
      limit: 1,
    };

    const startTime = Date.now();
    
    // Make the API request with a timeout
    const response = await axios.get(`${SAM_API_BASE_URL}/search`, {
      params,
      timeout: 30000 // 30 second timeout
    });

    const endTime = Date.now();
    const requestTime = (endTime - startTime) / 1000;
    
    if (response.status === 200) {
      log(`SUCCESS: SAM.gov API responded with status ${response.status} in ${requestTime} seconds`, GREEN);
      
      if (response.data && response.data.opportunitiesData) {
        const count = response.data.opportunitiesData.length;
        log(`Retrieved ${count} opportunities from the API`, GREEN);
        
        if (count > 0) {
          log('Sample data from first opportunity:', BLUE);
          const opp = response.data.opportunitiesData[0];
          console.log({
            noticeId: opp.noticeId,
            title: opp.title,
            agency: opp.department || opp.agency || 'Unknown',
            postedDate: opp.postedDate,
          });
        }
      } else {
        log('WARNING: API returned success but no opportunities data was found', YELLOW);
        log('Response structure:', YELLOW);
        console.log(response.data);
      }
      
      return true;
    } else {
      log(`ERROR: SAM.gov API returned status ${response.status}`, RED);
      log('Response:', RED);
      console.log(response.data);
      return false;
    }
  } catch (error) {
    log('ERROR: Failed to connect to SAM.gov API', RED);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        log(`API returned status code: ${error.response.status}`, RED);
        
        if (error.response.status === 403) {
          log('403 Forbidden - Your API key may be invalid or expired', RED);
          log('Please check your SAM_API_KEY in the .env file', YELLOW);
        }
        
        if (error.response.data) {
          log('API error response:', RED);
          console.log(error.response.data);
        }
      } else if (error.request) {
        log('No response received from the API - it may be down or unreachable', RED);
        if (error.code === 'ECONNABORTED') {
          log('Request timed out. The API may be slow or unresponsive.', RED);
        }
      } else {
        log(`Error setting up the request: ${error.message}`, RED);
      }
      
      if (error.config) {
        log('Request configuration:', YELLOW);
        log(`URL: ${error.config.url}`, YELLOW);
        log(`Method: ${error.config.method}`, YELLOW);
      }
    } else {
      log(`Unexpected error: ${error.message}`, RED);
    }
    
    return false;
  }
}

// Run test
testSamApi()
  .then(success => {
    if (success) {
      log('✅ SAM.gov API connection test successful', GREEN);
      process.exit(0);
    } else {
      log('❌ SAM.gov API connection test failed', RED);
      process.exit(1);
    }
  })
  .catch(error => {
    log(`Unhandled error: ${error.message}`, RED);
    process.exit(1);
  });
