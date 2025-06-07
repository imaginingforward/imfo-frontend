#!/usr/bin/env node

/**
 * One-time script to fetch opportunities from SAM.gov API and store them in Baserow
 * 
 * This script:
 * 1. Fetches opportunities from SAM.gov API
 * 2. Transforms them to our format
 * 3. Stores them in Baserow
 * 4. Exits when complete
 * 
 * Usage:
 * node fetch-opportunities.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import axios from 'axios';
import { submitOpportunityToBaserow, opportunityExistsInBaserow } from './baserowService.js';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure logging
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

/**
 * Fetch opportunities from SAM.gov API
 * @param limit Number of opportunities to fetch
 * @returns Array of opportunities
 */
async function fetchSamOpportunities(limit = 10) {
  try {
    log(`Fetching opportunities from SAM.gov API (limit: ${limit})`);
    
    // SAM.gov API configuration
    const SAM_API_KEY = process.env.SAM_API_KEY || '';
    const SAM_API_BASE_URL = process.env.SAM_API_BASE_URL || 'https://api.sam.gov/opportunities/v1';
    
    // Space-related NAICS codes
    const SPACE_NAICS_CODES = [
      '336414', // Guided Missile and Space Vehicle Manufacturing
      '336415', // Guided Missile and Space Vehicle Propulsion Unit and Parts Manufacturing
      '334511', // Search, Detection, Navigation, Guidance, Aeronautical, and Nautical System and Instrument Manufacturing
      '517410', // Satellite Telecommunications
      '541715', // Research and Development in the Physical, Engineering, and Life Sciences
    ];
    
    // Space-related keywords for searching
    const SPACE_KEYWORDS = [
      'space',
      'satellite',
      'aerospace',
      'orbital',
      'spacecraft',
      'launch vehicle',
      'propulsion',
      'rocket',
    ];
    
    // Create a keyword query string for space-related terms
    const keywordQuery = SPACE_KEYWORDS.map(keyword => `"${keyword}"`).join(' OR ');
    
    // Get current date and date 3 months ago in MM/DD/YYYY format
    const getCurrentDate = () => {
      const date = new Date();
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    
    const getDateXMonthsAgo = (months) => {
      const date = new Date();
      date.setMonth(date.getMonth() - months);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    
    // Parameters for the SAM.gov API request
    const params = {
      api_key: SAM_API_KEY,
      limit: limit,
      postedFrom: getDateXMonthsAgo(3), // Get opportunities from the last 3 months
      postedTo: getCurrentDate(),
      sortBy: 'relevance',
      includeSections: 'synopsis,award,attachments',
      naicsCodes: SPACE_NAICS_CODES.join(','),
      keyword: keywordQuery,
    };

    // Make the API request with a timeout
    const response = await axios.get(`${SAM_API_BASE_URL}/search`, {
      params,
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.data || !response.data.opportunitiesData) {
      log('No data returned from SAM.gov API');
      return [];
    }
    
    log(`Successfully fetched ${response.data.opportunitiesData.length} opportunities from SAM.gov API`);
    return response.data.opportunitiesData;
  } catch (error) {
    // Check for specific error types
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        log('SAM.gov API access denied (403 Forbidden) - check your API key');
      } else if (error.code === 'ECONNABORTED') {
        log('SAM.gov API request timed out');
      } else {
        log(`SAM.gov API error (${error.response?.status || 'Unknown'}): ${error.message}`);
        
        // Log detailed error information
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          log(`SAM.gov API response data: ${JSON.stringify(error.response.data)}`);
          log(`SAM.gov API response status: ${error.response.status}`);
          log(`SAM.gov API response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
          // The request was made but no response was received
          log(`SAM.gov API no response received: ${error.request}`);
        } else {
          // Something happened in setting up the request that triggered an Error
          log(`SAM.gov API request setup error: ${error.message}`);
        }
        
        // Log the request configuration for debugging
        if (error.config) {
          log(`SAM.gov API request URL: ${error.config.url}`);
          log(`SAM.gov API request method: ${error.config.method}`);
          log(`SAM.gov API request headers: ${JSON.stringify(error.config.headers)}`);
          log(`SAM.gov API request params: ${JSON.stringify(error.config.params)}`);
        }
      }
    } else {
      log(`Error fetching opportunities from SAM.gov API: ${error.message}`);
      log(`Error stack: ${error.stack}`);
    }
    
    throw error;
  }
}

/**
 * Transform SAM.gov API response to our application format
 * @param samOpportunities Opportunities from SAM.gov API
 * @returns Transformed opportunities
 */
function transformSamOpportunities(samOpportunities) {
  return samOpportunities.map((opp) => {
    // Extract technology focus from description or title
    const techFocus = extractTechFocus(opp.title, opp.description);
    
    // Extract eligible stages based on contract value
    const eligibleStages = extractEligibleStages(opp.awardAmount || 0);
    
    // Extract timeline from description or use default
    const timeline = extractTimeline(opp.description) || '12-24 months';
    
    // Format dates
    const postedDate = new Date(opp.postedDate || Date.now());
    
    // Get date X months from now in MM/DD/YYYY format
    const getDateXMonthsFromNow = (months) => {
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    
    const responseDeadline = new Date(opp.responseDeadLine || getDateXMonthsFromNow(3));
    
    return {
      noticeId: opp.noticeId || `SAM-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
      title: opp.title || 'Untitled Opportunity',
      agency: opp.department || opp.agency || 'U.S. Government',
      description: opp.description || 'No description available',
      postedDate,
      responseDeadline,
      awardAmount: parseFloat(opp.awardAmount) || undefined,
      naicsCode: opp.naicsCode || undefined,
      techFocus,
      eligibleStages,
      timeline,
      url: `https://sam.gov/opp/${opp.noticeId}/view` || undefined,
    };
  });
}

/**
 * Extract technology focus from title and description
 */
function extractTechFocus(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();
  const techCategories = [
    { keywords: ['satellite', 'earth observation', 'remote sensing'], category: 'Satellites' },
    { keywords: ['drone', 'uav', 'unmanned aerial', 'unmanned aircraft'], category: 'Drones' },
    { keywords: ['signal', 'communication', 'transmission', 'radio frequency'], category: 'Signals' },
    { keywords: ['component', 'hardware', 'equipment', 'parts'], category: 'Components' },
    { keywords: ['software', 'application', 'program', 'code', 'algorithm'], category: 'Software' },
    { keywords: ['material', 'composite', 'alloy', 'substance'], category: 'Materials' },
    { keywords: ['propulsion', 'engine', 'thruster', 'propellant'], category: 'Propulsion' },
    { keywords: ['robot', 'autonomous', 'automation'], category: 'Robotics' },
    { keywords: ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural network'], category: 'AI/ML' },
    { keywords: ['cyber', 'security', 'encryption', 'protection'], category: 'Cybersecurity' },
    { keywords: ['maritime', 'naval', 'ocean', 'sea'], category: 'Maritime' },
    { keywords: ['sensor', 'detector', 'monitoring'], category: 'Sensors' },
  ];
  
  // Find matching tech categories
  const matches = techCategories
    .filter(tech => tech.keywords.some(keyword => text.includes(keyword)))
    .map(tech => tech.category);
  
  // Ensure we have at least one category
  if (matches.length === 0) {
    // Default to a generic category if no specific matches
    if (text.includes('space') || text.includes('aerospace') || text.includes('satellite')) {
      return ['Satellites', 'Software'];
    }
    return ['Components', 'Software'];
  }
  
  return matches;
}

/**
 * Extract eligible stages based on contract value
 */
function extractEligibleStages(awardAmount) {
  if (awardAmount <= 500000) {
    return ['Pre-seed', 'Seed'];
  } else if (awardAmount <= 2000000) {
    return ['Seed', 'Series A'];
  } else if (awardAmount <= 10000000) {
    return ['Series A', 'Series B+'];
  } else {
    return ['Series B+', 'Growth'];
  }
}

/**
 * Extract timeline from description
 */
function extractTimeline(description = '') {
  // Look for patterns like "12 months", "1-2 years", etc.
  const monthPattern = /(\d+)(?:-(\d+))?\s*months?/i;
  const yearPattern = /(\d+)(?:-(\d+))?\s*years?/i;
  
  const monthMatch = description.match(monthPattern);
  if (monthMatch) {
    if (monthMatch[2]) {
      return `${monthMatch[1]}-${monthMatch[2]} months`;
    }
    return `${monthMatch[1]} months`;
  }
  
  const yearMatch = description.match(yearPattern);
  if (yearMatch) {
    if (yearMatch[2]) {
      return `${yearMatch[1]}-${yearMatch[2]} years`;
    }
    return `${yearMatch[1]} years`;
  }
  
  return null;
}

// Function to generate sample opportunities
function generateSampleOpportunities(count = 10) {
  log(`Generating ${count} sample opportunities`);
  
  // Define sample data
  const agencies = [
    'NASA', 'Space Force', 'DARPA', 'Air Force Research Laboratory', 
    'Department of Defense', 'Department of Energy', 'NOAA', 'AFWERX',
    'Naval Research Laboratory', 'Missile Defense Agency'
  ];
  
  const titles = [
    'Advanced Satellite Communication Systems',
    'Space Debris Monitoring and Mitigation',
    'Autonomous Drone Swarm Technology',
    'Next-Generation Space Propulsion',
    'Secure Space-to-Ground Communications',
    'Space-Based Sensor Networks',
    'Hypersonic Vehicle Materials Research',
    'Satellite Cybersecurity Solutions',
    'Lunar Surface Exploration Robotics',
    'Small Satellite Launch Technologies'
  ];
  
  const descriptions = [
    'Research and development of advanced technologies for next-generation satellite communication systems with improved bandwidth, security, and resilience.',
    'Development of technologies for tracking, monitoring, and mitigating space debris to protect critical space assets.',
    'Creation of AI-driven drone swarm capabilities for reconnaissance and surveillance in contested environments.',
    'Research into novel propulsion technologies for more efficient and powerful space propulsion systems.',
    'Development of secure, high-bandwidth communication systems between space assets and ground stations.',
    'Creation of interconnected sensor networks for space domain awareness and threat detection.',
    'Research into advanced materials capable of withstanding extreme conditions of hypersonic flight.',
    'Development of cybersecurity solutions specifically designed for satellite systems and space infrastructure.',
    'Creation of robotic systems capable of operating on the lunar surface for exploration and resource utilization.',
    'Development of cost-effective launch technologies for small satellite deployment.'
  ];
  
  const techFocusOptions = [
    ['Satellites', 'Signals', 'Software'],
    ['Satellites', 'Software', 'AI/ML'],
    ['Drones', 'AI/ML', 'Software', 'Robotics'],
    ['Propulsion', 'Materials', 'Components'],
    ['Signals', 'Cybersecurity', 'Software'],
    ['Satellites', 'Sensors', 'Software', 'AI/ML'],
    ['Materials', 'Components'],
    ['Cybersecurity', 'Software', 'Satellites'],
    ['Robotics', 'AI/ML', 'Materials'],
    ['Propulsion', 'Components', 'Materials']
  ];
  
  const eligibleStagesOptions = [
    ['Seed', 'Series A', 'Series B+'],
    ['Seed', 'Series A', 'Series B+', 'Growth'],
    ['Pre-seed', 'Seed', 'Series A'],
    ['Series A', 'Series B+', 'Growth'],
    ['Pre-seed', 'Seed', 'Series A']
  ];
  
  const timelineOptions = [
    '12-24 months',
    '24-48 months',
    '18-36 months',
    '36-60 months',
    '12-24 months'
  ];
  
  const budgetOptions = [
    500000,
    2000000,
    5000000,
    10000000,
    20000000
  ];
  
  // Generate sample opportunities
  const sampleOpportunities = [];
  
  for (let i = 0; i < count; i++) {
    const index = i % titles.length;
    const agencyIndex = i % agencies.length;
    const techIndex = i % techFocusOptions.length;
    const stageIndex = i % eligibleStagesOptions.length;
    const timelineIndex = i % timelineOptions.length;
    const budgetIndex = i % budgetOptions.length;
    
    // Generate dates
    const postedDate = new Date();
    postedDate.setMonth(postedDate.getMonth() - Math.floor(Math.random() * 3)); // 0-3 months ago
    
    const responseDeadline = new Date();
    responseDeadline.setMonth(responseDeadline.getMonth() + 3 + Math.floor(Math.random() * 9)); // 3-12 months from now
    
    // Create opportunity
    sampleOpportunities.push({
      noticeId: `SAMPLE-${new Date().getFullYear()}-${i + 1}`,
      title: titles[index],
      agency: agencies[agencyIndex],
      description: descriptions[index],
      postedDate,
      responseDeadline,
      awardAmount: budgetOptions[budgetIndex],
      naicsCode: '336414', // Guided Missile and Space Vehicle Manufacturing
      techFocus: techFocusOptions[techIndex],
      eligibleStages: eligibleStagesOptions[stageIndex],
      timeline: timelineOptions[timelineIndex],
      url: `https://sam.gov/sample/${i + 1}`,
      source: 'Sample Data'
    });
  }
  
  return sampleOpportunities;
}

// Main function
async function main() {
  try {
    log('Starting opportunity fetch process');
    
    // Check if Baserow API token is configured
    if (!process.env.BASEROW_API_TOKEN || !process.env.BASEROW_OPPORTUNITIES_TABLE_ID) {
      log('ERROR: Baserow API token or table ID not configured. Please set BASEROW_API_TOKEN and BASEROW_OPPORTUNITIES_TABLE_ID in .env file');
      process.exit(1);
    }
    
    // Check if SAM API key is configured
    if (!process.env.SAM_API_KEY || process.env.SAM_API_KEY === 'your_api_key_here') {
      log('WARNING: SAM.gov API key is not configured or is set to default value');
      
      // If USE_SAMPLE_DATA is not explicitly 'true', warn and exit
      if (process.env.USE_SAMPLE_DATA !== 'true') {
        log('ERROR: SAM_API_KEY not configured and USE_SAMPLE_DATA is not enabled. Please set SAM_API_KEY in your .env file or set USE_SAMPLE_DATA=true');
        process.exit(1);
      }
    }
    
    // Determine data source
    const useSampleData = process.env.USE_SAMPLE_DATA === 'true';
    let samOpportunities = [];
    
    if (useSampleData) {
      log('Using sample data instead of SAM.gov API as specified in environment variables');
      samOpportunities = generateSampleOpportunities(10);
    } else {
      // Fetch opportunities from SAM.gov API
      log('Fetching opportunities from SAM.gov API...');
      
      // Get limit from environment variable or default to 10
      const fetchLimit = parseInt(process.env.SAM_API_FETCH_LIMIT || '10');
      
      try {
        log(`Attempting to fetch up to ${fetchLimit} opportunities from SAM.gov API`);
        samOpportunities = await fetchSamOpportunities(fetchLimit);
        
        if (!samOpportunities || samOpportunities.length === 0) {
          log('No opportunities fetched from SAM.gov API');
          
          // Check if we should fallback to sample data
          if (process.env.FALLBACK_TO_SAMPLE_DATA === 'true') {
            log('Falling back to generated sample data as specified in environment variables');
            samOpportunities = generateSampleOpportunities(10);
          } else {
            log('No opportunities found and FALLBACK_TO_SAMPLE_DATA is not enabled. Exiting.');
            process.exit(0);
          }
        } else {
          log(`Successfully fetched ${samOpportunities.length} opportunities from SAM.gov API`);
        }
      } catch (error) {
        log(`Error fetching from SAM.gov API: ${error.message}`);
        
        // Check if we should fallback to sample data
        if (process.env.FALLBACK_TO_SAMPLE_DATA === 'true') {
          log('Falling back to generated sample data as specified in environment variables');
          samOpportunities = generateSampleOpportunities(10);
        } else {
          log('Error fetching opportunities and FALLBACK_TO_SAMPLE_DATA is not enabled. Exiting.');
          process.exit(1);
        }
      }
    }
    
    if (!samOpportunities || samOpportunities.length === 0) {
      log('No opportunities to process. Exiting.');
      process.exit(0);
    }
    
    // Transform opportunities to our format
    log(`Transforming ${samOpportunities.length} opportunities`);
    const transformedOpportunities = samOpportunities.map(opp => {
      const transformed = transformSamOpportunities ? 
        transformSamOpportunities([opp])[0] : 
        opp;
      
      // Add source field if not present
      if (!transformed.source) {
        transformed.source = useSampleData ? 'Sample Data' : 'SAM.gov API';
      }
      
      return transformed;
    });
    
    // Store opportunities in Baserow
    log(`Storing ${transformedOpportunities.length} opportunities in Baserow`);
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const opportunity of transformedOpportunities) {
      try {
        // Check if opportunity already exists
        const exists = await opportunityExistsInBaserow(opportunity.noticeId);
        
        if (exists) {
          log(`Skipping opportunity ${opportunity.noticeId} - already exists in Baserow`);
          skipCount++;
          continue;
        }
        
        // Submit to Baserow
        await submitOpportunityToBaserow(opportunity);
        successCount++;
        log(`Successfully stored opportunity ${opportunity.noticeId} in Baserow`);
      } catch (error) {
        errorCount++;
        log(`Error storing opportunity ${opportunity.noticeId} in Baserow: ${error.message}`);
      }
    }
    
    // Log results
    log(`Process completed: ${successCount} opportunities stored, ${skipCount} skipped, ${errorCount} errors`);
    
  } catch (error) {
    log(`Error in main process: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main()
  .then(() => {
    log('Process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    log(`Process failed: ${error.message}`);
    process.exit(1);
  });
