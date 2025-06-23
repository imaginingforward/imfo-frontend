/**
 * MongoDB Service for accessing opportunities data
 * 
 * This service connects to the dedicated MongoDB API endpoint 
 * that directly uses the MongoDB driver rather than the deprecated Data API
 */

import { getApiBaseUrl, getBackendApiKey } from '@/utils/envConfig';
import type { MatchOpportunity } from './matchingService';

// Log initial startup message
console.log('MongoDB Service initialized');
console.log('API Base URL:', getApiBaseUrl() || 'http://localhost:3000');

// Cache the data to avoid unnecessary API calls
let cachedOpportunities: MatchOpportunity[] | null = null;

/**
 * Get all opportunities from the MongoDB-connected backend API
 * @returns Promise that resolves to an array of opportunities
 */
export async function getAllOpportunities(): Promise<MatchOpportunity[]> {
  try {
    // If we have cached opportunities, return them
    if (cachedOpportunities) {
      console.log('Using cached opportunities data');
      return cachedOpportunities;
    }

    console.log('Fetching opportunities from MongoDB...');
    
    // Set the API URL to our MongoDB-connected backend
    const mongoApiUrl = process.env.VITE_MONGODB_API_URL || 'http://localhost:3002';
    const apiUrl = `${mongoApiUrl}/api/opportunities?limit=50`;
    
    console.log('Requesting from MongoDB API:', apiUrl);
    
    // Make the request to our MongoDB API
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': getBackendApiKey()
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('MongoDB API error:', response.status, errorText);
      throw new Error(`MongoDB API error: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // If the response is not in the expected format, throw an error
    if (!responseData.success) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid API response format');
    }
    
    // Extract the raw data from the response
    const rawData = responseData.data || [];
    
    console.log(`Successfully retrieved ${rawData.length} opportunities from MongoDB`);

    if (!Array.isArray(rawData)) {
      console.error('Invalid data received:', rawData);
      return [];
    }
    
    // Map API response to our MatchOpportunity format
    const opportunities = rawData.map(doc => {
      // Calculate award amount based on available data
      let awardAmount: number | undefined;
      if (doc.fundingAmount?.amount) {
        awardAmount = doc.fundingAmount.amount;
      } else if (doc.fundingAmount?.range?.max) {
        awardAmount = doc.fundingAmount.range.max;
      } else if (doc.awardCeiling && typeof doc.awardCeiling === 'string' && doc.awardCeiling.includes('$')) {
        // Try to extract amount from the string
        const match = doc.awardCeiling.match(/\$\s*([\d,]+)/);
        if (match && match[1]) {
          awardAmount = parseInt(match[1].replace(/,/g, ''));
        }
      }
      
      // Map data fields to our MatchOpportunity interface
      return {
        noticeId: doc.opportunityId || doc._id?.toString() || 'unknown-id',
        title: doc.title || 'Untitled Opportunity',
        agency: doc.agency || 'Unknown Agency',
        description: doc.additionalInformation || doc.description || '',
        postedDate: doc.datePosted ? 
          (typeof doc.datePosted === 'string' ? doc.datePosted : new Date(parseInt(doc.datePosted)).toISOString()) 
          : new Date().toISOString(),
        responseDeadline: doc.closeDate ? 
          (typeof doc.closeDate === 'string' ? doc.closeDate : new Date(parseInt(doc.closeDate)).toISOString())
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        // Use archiveDate from document or calculate it as 30 days after response deadline
        archiveDate: doc.archiveDate || (() => {
          const deadline = doc.closeDate ? 
            (typeof doc.closeDate === 'string' ? new Date(doc.closeDate) : new Date(parseInt(doc.closeDate))) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          const archive = new Date(deadline);
          archive.setDate(archive.getDate() + 30); // Add 30 days to deadline
          return archive.toISOString();
        })(),
        awardAmount: awardAmount,
        naicsCode: doc.naicsCode,
        setAside: doc.setAside,
        placeOfPerformance: doc.placeOfPerformance,
        // Map technologies to techFocus, or use default
        techFocus: doc.technologies || doc.techFocus || ['Technology'],
        // Default eligibleStages since this info may not be in the DB
        eligibleStages: doc.eligibleStages || ['Any'],
        // Default timeline if not available
        timeline: doc.timeline || 'Varies',
        url: doc.url || '',
        // Map point of contact info if available
        pointOfContact: doc.pointOfContact || {
          name: doc.contactName,
          email: doc.contactEmail,
          phone: doc.contactPhone
        }
      };
    });
    
    // Cache the opportunities
    cachedOpportunities = opportunities;
    
    return opportunities;
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return [];
  }
}

/**
 * Clear the opportunities cache
 */
export function clearCache(): void {
  cachedOpportunities = null;
}
