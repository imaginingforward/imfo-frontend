import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { findAIMatchingOpportunities } from '../services/aiMatchingService.js';
import { logger } from '../utils/logger.js';
import { FormData } from '../services/matchingService.js';

const router = express.Router();

/**
 * Validate API key middleware
 */
const validateApiKey = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

/**
 * @route POST /api/matching
 * @desc Find matching opportunities for a company profile
 * @access Private (requires API key)
 */
router.post(
  '/',
  validateApiKey,
  [
    // Validate company data
    body('company.name').notEmpty().withMessage('Company name is required'),
    body('company.description').notEmpty().withMessage('Company description is required'),
    body('company.techCategory').isArray().withMessage('Tech categories must be an array'),
    body('company.stage').notEmpty().withMessage('Company stage is required'),
    body('company.teamSize').notEmpty().withMessage('Team size is required'),
    body('company.foundedYear').notEmpty().withMessage('Founded year is required'),
    body('company.email').isEmail().withMessage('Valid email is required'),
    
    // Validate project data
    body('project.title').notEmpty().withMessage('Project title is required'),
    body('project.description').notEmpty().withMessage('Project description is required'),
    body('project.techSpecs').notEmpty().withMessage('Tech specs are required'),
    body('project.budget').notEmpty().withMessage('Budget is required'),
    body('project.timeline').notEmpty().withMessage('Timeline is required'),
    body('project.interests').isArray().withMessage('Interests must be an array')
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const formData: FormData = req.body;
      const limit = parseInt(req.query.limit as string) || 3;
      
      logger.info(`Matching request received for ${formData.company.name}`);
      
      // Find matching opportunities using AI
      const matches = await findAIMatchingOpportunities(formData, limit);
      
      // Return matches
      res.status(200).json({
        success: true,
        count: matches.length,
        data: matches
      });
    } catch (error) {
      logger.error('Error finding matching opportunities:', error);
      res.status(500).json({
        success: false,
        message: 'Error finding matching opportunities'
      });
    }
  }
);

/**
 * @route POST /api/matching/score
 * @desc Score a specific opportunity against a company profile
 * @access Private (requires API key)
 */
router.post(
  '/score',
  validateApiKey,
  [
    // Validate company data
    body('company.name').notEmpty().withMessage('Company name is required'),
    body('company.description').notEmpty().withMessage('Company description is required'),
    body('company.techCategory').isArray().withMessage('Tech categories must be an array'),
    body('company.stage').notEmpty().withMessage('Company stage is required'),
    body('company.teamSize').notEmpty().withMessage('Team size is required'),
    body('company.foundedYear').notEmpty().withMessage('Founded year is required'),
    body('company.email').isEmail().withMessage('Valid email is required'),
    
    // Validate project data
    body('project.title').notEmpty().withMessage('Project title is required'),
    body('project.description').notEmpty().withMessage('Project description is required'),
    body('project.techSpecs').notEmpty().withMessage('Tech specs are required'),
    body('project.budget').notEmpty().withMessage('Budget is required'),
    body('project.timeline').notEmpty().withMessage('Timeline is required'),
    body('project.interests').isArray().withMessage('Interests must be an array'),
    
    // Validate opportunity ID
    body('opportunityId').notEmpty().withMessage('Opportunity ID is required')
  ],
  async (req: Request, res: Response) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const { opportunityId, ...formData } = req.body;
      
      logger.info(`Score request received for ${formData.company.name} against opportunity ${opportunityId}`);
      
      // Find matching opportunities using AI (limit to 1)
      const matches = await findAIMatchingOpportunities(formData, 1);
      
      // Filter for the requested opportunity
      const match = matches.find(m => {
        // Check if the opportunity has an _id property
        const idMatch = m.opportunity._id && m.opportunity._id.toString() === opportunityId;
        // Check if the noticeId matches
        const noticeIdMatch = m.opportunity.noticeId === opportunityId;
        
        return idMatch || noticeIdMatch;
      });
      
      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Opportunity not found or no match'
        });
      }
      
      // Return match score
      res.status(200).json({
        success: true,
        data: match
      });
    } catch (error) {
      logger.error('Error scoring opportunity:', error);
      res.status(500).json({
        success: false,
        message: 'Error scoring opportunity'
      });
    }
  }
);

export { router as matchingRoutes };
