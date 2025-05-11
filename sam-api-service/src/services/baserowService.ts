import axios from 'axios';
import { logger } from '../utils/logger.js';

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
export const formatBaserowOpportunityData = (opportunity: any) => {
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
export const submitOpportunityToBaserow = async (opportunity: any) => {
  try {
    const baserowData = formatBaserowOpportunityData(opportunity);
    logger.info(`Submitting opportunity to Baserow: ${opportunity.title}`);

    const response = await axios.post(
      `${BASEROW_API_URL}/${BASEROW_TABLE_ID}/`,
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
  } catch (error: any) {
    logger.error(`Error submitting opportunity to Baserow: ${error.message}`);
    if (axios.isAxiosError(error) && error.response) {
      logger.error(`Baserow API error: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

/**
 * Check if an opportunity already exists in Baserow
 * @param noticeId Notice ID to check
 * @returns Boolean indicating if the opportunity exists
 */
export const opportunityExistsInBaserow = async (noticeId: string): Promise<boolean> => {
  try {
    // Use Baserow's filter to search for the notice ID
    const response = await axios.get(
      `${BASEROW_API_URL}/${BASEROW_TABLE_ID}/`,
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
    logger.error(`Error checking if opportunity exists in Baserow: ${error}`);
    return false;
  }
};
