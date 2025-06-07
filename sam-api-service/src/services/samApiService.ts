import axios from 'axios';
import { logger } from '../utils/logger.js';
import { IOpportunity, Opportunity } from '../models/opportunity.js';

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
  '541330', // Engineering Services
  '541380', // Testing Laboratories
  '541713', // Research and Development in Nanotechnology
  '541714', // Research and Development in Biotechnology
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
  'lunar',
  'mars',
  'planetary',
  'astronaut',
  'microgravity',
  'constellation',
  'earth observation',
  'remote sensing',
];

/**
 * Fetch opportunities from SAM.gov API
 * @param limit Number of opportunities to fetch
 * @returns Array of opportunities
 */
export const fetchSamOpportunities = async (limit: number = 100): Promise<any[]> => {
  try {
    logger.info(`Fetching opportunities from SAM.gov API (limit: ${limit})`);
    
    // Validate API key is configured
    if (!SAM_API_KEY || SAM_API_KEY === 'your_api_key_here') {
      logger.error('SAM.gov API key is not configured. Please set SAM_API_KEY in your .env file');
      throw new Error('SAM_API_KEY not configured');
    }
    
    // Create a keyword query string for space-related terms
    const keywordQuery = SPACE_KEYWORDS.map(keyword => `"${keyword}"`).join(' OR ');
    
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

    logger.info('Making request to SAM.gov API...');
    
    // Make the API request with a timeout
    const response = await axios.get(`${SAM_API_BASE_URL}/search`, {
      params,
      timeout: 30000 // 30 second timeout
    });
    
    if (!response.data) {
      logger.warn('No data returned from SAM.gov API');
      return [];
    }
    
    if (!response.data.opportunitiesData || !Array.isArray(response.data.opportunitiesData)) {
      logger.warn('Invalid data structure returned from SAM.gov API');
      logger.debug('API response:', response.data);
      return [];
    }
    
    logger.info(`Successfully fetched ${response.data.opportunitiesData.length} opportunities from SAM.gov API`);
    return response.data.opportunitiesData;
  } catch (error: any) {
    // Check for specific error types
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        logger.error('SAM.gov API access denied (403 Forbidden) - check your API key');
      } else if (error.code === 'ECONNABORTED') {
        logger.error('SAM.gov API request timed out');
      } else {
        logger.error(`SAM.gov API error (${error.response?.status || 'Unknown'}): ${error.message}`);
        
        // Log detailed error information
        if (error.response) {
          logger.debug(`SAM.gov API response data:`, error.response.data);
          logger.debug(`SAM.gov API response status: ${error.response.status}`);
        } else if (error.request) {
          logger.debug(`SAM.gov API no response received:`, error.request);
        }
      }
    } else {
      logger.error('Error fetching opportunities from SAM.gov API:', error);
    }
    
    throw error;
  }
};

/**
 * Transform SAM.gov API response to our application format
 * @param samOpportunities Opportunities from SAM.gov API
 * @returns Transformed opportunities
 */
export const transformSamOpportunities = (samOpportunities: any[]): Partial<IOpportunity>[] => {
  return samOpportunities.map((opp) => {
    // Extract technology focus from description or title
    const techFocus = extractTechFocus(opp.title, opp.description);
    
    // Extract eligible stages based on contract value
    const eligibleStages = extractEligibleStages(opp.awardAmount || 0);
    
    // Extract timeline from description or use default
    const timeline = extractTimeline(opp.description) || '12-24 months';
    
    // Format dates
    const postedDate = new Date(opp.postedDate || Date.now());
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
      setAside: opp.setAside || undefined,
      placeOfPerformance: opp.placeOfPerformance || undefined,
      pointOfContact: {
        name: opp.pointOfContact?.[0]?.name || undefined,
        email: opp.pointOfContact?.[0]?.email || undefined,
        phone: opp.pointOfContact?.[0]?.phone || undefined,
      },
      techFocus,
      eligibleStages,
      timeline,
      rawData: opp,
      url: `https://sam.gov/opp/${opp.noticeId}/view` || undefined,
    };
  });
};

/**
 * Extract technology focus from title and description
 */
const extractTechFocus = (title: string = '', description: string = ''): string[] => {
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
};

/**
 * Extract eligible stages based on contract value
 */
const extractEligibleStages = (awardAmount: number): string[] => {
  if (awardAmount <= 500000) {
    return ['Pre-seed', 'Seed'];
  } else if (awardAmount <= 2000000) {
    return ['Seed', 'Series A'];
  } else if (awardAmount <= 10000000) {
    return ['Series A', 'Series B+'];
  } else {
    return ['Series B+', 'Growth'];
  }
};

/**
 * Extract timeline from description
 */
const extractTimeline = (description: string = ''): string | null => {
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
};

/**
 * Get current date in MM/DD/YYYY format
 */
const getCurrentDate = (): string => {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

/**
 * Get date X months ago in MM/DD/YYYY format
 */
const getDateXMonthsAgo = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

/**
 * Get date X months from now in MM/DD/YYYY format
 */
const getDateXMonthsFromNow = (months: number): string => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};
