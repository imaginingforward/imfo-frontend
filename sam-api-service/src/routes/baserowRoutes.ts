import express, { Request, Response } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger.js';
import { formatBaserowOpportunityData } from '../services/baserowService.js';

const router = express.Router();

// Environment variables for Baserow configuration
const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table';
const BASEROW_API_TOKEN = process.env.BASEROW_API_TOKEN || '';
const BASEROW_FORM_TABLE_ID = process.env.BASEROW_FORM_TABLE_ID || '519889';

// Field mapping between form fields and Baserow field IDs
const FIELD_MAPPING = {
  companyName: "field_4128859",
  companyDescription: "field_4128860",
  techCategory: "field_4128861",
  stage: "field_4128862",
  teamSize: "field_4128863",
  foundedYear: "field_4128868",
  website: "field_4128869",
  patents: "field_4128870",
  email: "field_4128871",
  projectTitle: "field_4128872",
  projectDescription: "field_4128873",
  techSpecs: "field_4128874",
  budget: "field_4128875",
  timeline: "field_4128876",
  interests: "field_4128877"
};

// Format the form data for Baserow submission
const formatBaserowFormData = (data: any) => {
  return {
    [FIELD_MAPPING.companyName]: data.company.name,
    [FIELD_MAPPING.companyDescription]: data.company.description,
    [FIELD_MAPPING.techCategory]: data.company.techCategory.join(", "),
    [FIELD_MAPPING.stage]: data.company.stage,
    [FIELD_MAPPING.teamSize]: data.company.teamSize,
    [FIELD_MAPPING.foundedYear]: data.company.foundedYear,
    [FIELD_MAPPING.website]: data.company.website || "",
    [FIELD_MAPPING.patents]: data.company.patents || "",
    [FIELD_MAPPING.email]: data.company.email,
    [FIELD_MAPPING.projectTitle]: data.project.title,
    [FIELD_MAPPING.projectDescription]: data.project.description,
    [FIELD_MAPPING.techSpecs]: data.project.techSpecs,
    [FIELD_MAPPING.budget]: data.project.budget,
    [FIELD_MAPPING.timeline]: data.project.timeline,
    [FIELD_MAPPING.interests]: data.project.interests.join(", ")
  };
};

/**
 * @route POST /api/baserow/submit
 * @desc Submit form data to Baserow
 * @access Public
 */
router.post('/submit', async (req: Request, res: Response) => {
  try {
    const formData = req.body;
    
    // Validate basic form structure
    if (!formData || !formData.company || !formData.project) {
      return res.status(400).json({
        success: false,
        error: 'Invalid form data structure'
      });
    }
    
    logger.info(`Submitting form data for company: ${formData.company.name}`);
    
    // Format data for Baserow
    const baserowData = formatBaserowFormData(formData);
    
    // Send data to Baserow
    const response = await axios.post(
      `${BASEROW_API_URL}/${BASEROW_FORM_TABLE_ID}/`,
      baserowData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${BASEROW_API_TOKEN}`
        }
      }
    );
    
    logger.info(`Successfully submitted form data to Baserow for: ${formData.company.name}`);
    
    // Return success response
    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    logger.error('Error submitting form data to Baserow:', error);
    
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      return res.status(error.response?.status || 500).json({
        success: false,
        error: errorMessage
      });
    }
    
    // Handle other errors
    return res.status(500).json({
      success: false,
      error: 'Error submitting form data'
    });
  }
});

export { router as baserowRoutes };
