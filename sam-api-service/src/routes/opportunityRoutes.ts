import express from 'express';
import { Opportunity } from '../models/opportunity.js';
import { logger } from '../utils/logger.js';
import { generateSampleOpportunities } from '../services/schedulerService.js';

const router = express.Router();

/**
 * @route GET /api/opportunities
 * @desc Get all opportunities
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Opportunity.countDocuments();
    
    // Get opportunities with pagination
    const opportunities = await Opportunity.find({})
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.status(200).json({
      success: true,
      count: opportunities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: opportunities
    });
  } catch (error) {
    logger.error('Error fetching opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunities'
    });
  }
});

/**
 * @route GET /api/opportunities/:id
 * @desc Get opportunity by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).lean();
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunity'
    });
  }
});

/**
 * @route GET /api/opportunities/notice/:noticeId
 * @desc Get opportunity by notice ID
 * @access Public
 */
router.get('/notice/:noticeId', async (req, res) => {
  try {
    const opportunity = await Opportunity.findOne({ 
      noticeId: req.params.noticeId 
    }).lean();
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error('Error fetching opportunity:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunity'
    });
  }
});

/**
 * @route GET /api/opportunities/search
 * @desc Search opportunities
 * @access Public
 */
router.get('/search', async (req, res) => {
  try {
    const { query, techFocus, agency, stage } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    // Build search query
    const searchQuery: any = {};
    
    // Text search
    if (query) {
      searchQuery.$text = { $search: query as string };
    }
    
    // Filter by tech focus
    if (techFocus) {
      searchQuery.techFocus = { $in: (techFocus as string).split(',') };
    }
    
    // Filter by agency
    if (agency) {
      searchQuery.agency = { $regex: agency as string, $options: 'i' };
    }
    
    // Filter by stage
    if (stage) {
      searchQuery.eligibleStages = { $in: (stage as string).split(',') };
    }
    
    // Get total count
    const total = await Opportunity.countDocuments(searchQuery);
    
    // Get opportunities with pagination
    const opportunities = await Opportunity.find(searchQuery)
      .sort({ postedDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    res.status(200).json({
      success: true,
      count: opportunities.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: opportunities
    });
  } catch (error) {
    logger.error('Error searching opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching opportunities'
    });
  }
});

/**
 * @route POST /api/opportunities/generate-samples
 * @desc Generate sample opportunities for testing
 * @access Private (should be protected in production)
 */
router.post('/generate-samples', async (req, res) => {
  try {
    const count = parseInt(req.query.count as string) || 10;
    
    await generateSampleOpportunities(count);
    
    res.status(200).json({
      success: true,
      message: `Generated ${count} sample opportunities`
    });
  } catch (error) {
    logger.error('Error generating sample opportunities:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating sample opportunities'
    });
  }
});

export { router as opportunityRoutes };
