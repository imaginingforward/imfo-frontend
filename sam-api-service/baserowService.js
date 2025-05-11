import axios from 'axios';
import { logger } from './logger.js';

// Baserow API configuration
const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || '';
const BASEROW_TABLE_ID = process.env.BASEROW_OPPORTUNITIES_TABLE_ID || '';

// Field mapping between our opportunity fields and Baserow field IDs
// Replace these with your actual Baserow field IDs
export const OPPORTUNITIES_FIELD_MAPPING = {
  noticeId: "field_notice_id",
  title: "field_title",
  agency: "field_agency",
  description: "field_description",
  postedDate: "field_posted_date",
  responseDeadline: "field_response_deadline",
  awardAmount: "field_award_amount",
  naicsCode: "field_naics_code",
  techFocus: "field_tech_focus",
  eligibleStages: "field_eligible_stages",
  timeline: "field_timeline",
  url: "field_url"
};

/**
 * Format opportunity data for Baserow submission
 * @param opportunity Opportunity data
 * @returns Formatted data for Baserow
 */
export const formatBaserowOpportunityData = (opportunity) => {
  return {
    [OPPORTUNITIES_FIELD_MAPPING.noticeId]: opportunity.noticeId,
    [OPPORTUNITIES_FIELD_MAPPING.title]: opportunity.title,
    [OPPORTUNITIES_FIELD_MAPPING.agency]: opportunity.agency,
    [OPPORTUNITIES_FIELD_MAPPING.description]: opportunity.description,
    [OPPORTUNITIES_FIELD_MAPPING.postedDate]: opportunity.postedDate,
    [OPPORTUNITIES_FIELD_MAPPING.responseDeadline]: opportunity.responseDeadline,
    [OPPORTUNITIES_FIELD_MAPPING.awardAmount]: opportunity.awardAmount?.toString() || '',
    [OPPORTUNITIES_FIELD_MAPPING.naicsCode]: opportunity.naicsCode || '',
    [OPPORTUNITIES_FIELD_MAPPING.techFocus]: opportunity.techFocus.join(', '),
    [OPPORTUNITIES_FIELD_MAPPING.eligibleStages]: opportunity.eligibleStages.join(', '),
    [OPPORTUNITIES_FIELD_MAPPING.timeline]: opportunity.timeline,
    [OPPORTUNITIES_FIELD_MAPPING.url]: opportunity.url || ''
  };
};

/**
 * Submit opportunity data to Baserow
 * @param opportunity Opportunity data
 * @returns Baserow response
 */
export const submitOpportunityToBaserow = async (opportunity) => {
  try {
    const baserowData = formatBaserowOpportunityData(opportunity);
    logger.info(`Submitting opportunity to Baserow: ${opportunity.title}`);

    // Log the URL for debugging
    const url = `${BASEROW_API_URL}/${BASEROW_TABLE_ID}`;
    logger.info(`Baserow API URL: ${url}`);
    
    const response = await axios.post(
      url,
      baserowData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${BASEROW_API_TOKEN}`
        }
      }
    );

    logger.info(`Successfully submitted opportunity to Baserow: ${opportunity.title}`);
    return response.data;
  } catch (error) {
    logger.error(`Error submitting opportunity to Baserow: ${error.message}`);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.error(`Baserow API error: ${JSON.stringify(error.response.data)}`);
        logger.error(`Baserow API response status: ${error.response.status}`);
        logger.error(`Baserow API response headers: ${JSON.stringify(error.response.headers)}`);
      } else if (error.request) {
        // The request was made but no response was received
        logger.error(`Baserow API no response received: ${error.request}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error(`Baserow API request setup error: ${error.message}`);
      }
      
      // Log the request configuration for debugging
      if (error.config) {
        logger.error(`Baserow API request URL: ${error.config.url}`);
        logger.error(`Baserow API request method: ${error.config.method}`);
        logger.error(`Baserow API request headers: ${JSON.stringify(error.config.headers)}`);
        logger.error(`Baserow API request data: ${JSON.stringify(error.config.data)}`);
      }
    } else {
      // Not an Axios error
      logger.error(`Non-Axios error: ${error.stack}`);
    }
    
    throw error;
  }
};

/**
 * Check if an opportunity already exists in Baserow
 * @param noticeId Notice ID to check
 * @returns Boolean indicating if the opportunity exists
 */
export const opportunityExistsInBaserow = async (noticeId) => {
  try {
    // Log the URL for debugging
    const url = `${BASEROW_API_URL}/${BASEROW_TABLE_ID}`;
    logger.info(`Baserow API URL for checking existence: ${url}`);
    
    // Use Baserow's filter to search for the notice ID
    const response = await axios.get(
      url,
      {
        params: {
          filter__field_notice_id__equal: noticeId
        },
        headers: {
          'Authorization': `Token ${BASEROW_API_TOKEN}`
        }
      }
    );

    // If any results are returned, the opportunity exists
    return response.data.count > 0;
  } catch (error) {
    logger.error(`Error checking if opportunity exists in Baserow: ${error.message}`);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.error(`Baserow API error (exists check): ${JSON.stringify(error.response.data)}`);
        logger.error(`Baserow API response status (exists check): ${error.response.status}`);
        logger.error(`Baserow API response headers (exists check): ${JSON.stringify(error.response.headers)}`);
      } else if (error.request) {
        // The request was made but no response was received
        logger.error(`Baserow API no response received (exists check): ${error.request}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error(`Baserow API request setup error (exists check): ${error.message}`);
      }
      
      // Log the request configuration for debugging
      if (error.config) {
        logger.error(`Baserow API request URL (exists check): ${error.config.url}`);
        logger.error(`Baserow API request method (exists check): ${error.config.method}`);
        logger.error(`Baserow API request headers (exists check): ${JSON.stringify(error.config.headers)}`);
        logger.error(`Baserow API request params (exists check): ${JSON.stringify(error.config.params)}`);
      }
    } else {
      // Not an Axios error
      logger.error(`Non-Axios error (exists check): ${error.stack}`);
    }
    
    return false;
  }
};
