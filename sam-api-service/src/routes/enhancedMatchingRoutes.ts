import express from 'express';
import { 
  findEnhancedMatchingOpportunities, 
  TECH_FOCUS_WEIGHT,
  STAGE_WEIGHT,
  TIMELINE_WEIGHT,
  BUDGET_WEIGHT,
  KEYWORD_WEIGHT,
  getWeightsConfig
} from '../services/enhancedMatchingService.js';
import { findAIMatchingOpportunities } from '../services/aiMatchingService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @route POST /api/match/enhanced
 * @desc Find matching opportunities for a company profile using enhanced algorithm
 * @access Public
 */
router.post('/enhanced', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData || !formData.company || !formData.project) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request - missing company or project data'
      });
    }
    
    // Get optional limit parameter
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    
    // Find matching opportunities
    const matches = await findEnhancedMatchingOpportunities(formData, limit);
    
    // Return matched opportunities with scores
    return res.status(200).json({
      success: true,
      matchCount: matches.length,
      matches
    });
  } catch (error) {
    logger.error('Error in enhanced matching route:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while finding matches'
    });
  }
});

/**
 * @route POST /api/match/ai
 * @desc Find matching opportunities for a company profile using AI
 * @access Public
 */
router.post('/ai', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    if (!formData || !formData.company || !formData.project) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request - missing company or project data'
      });
    }
    
    // Get optional limit parameter
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    
    // Find matching opportunities using AI
    const matches = await findAIMatchingOpportunities(formData, limit);
    
    // Return matched opportunities with scores
    return res.status(200).json({
      success: true,
      matchCount: matches.length,
      matches
    });
  } catch (error) {
    logger.error('Error in AI matching route:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while finding AI matches'
    });
  }
});

/**
 * @route GET /api/match/enhanced/stats
 * @desc Get matching statistics (weights, thresholds, etc.)
 * @access Public
 */
router.get('/enhanced/stats', (req, res) => {
  // Return the current algorithm configuration
  return res.status(200).json({
    success: true,
    algorithmVersion: '1.0.0',
    weights: getWeightsConfig(),
    confidenceLevels: {
      high: '≥ 0.75',
      medium: '0.5 - 0.75',
      low: '< 0.5'
    }
  });
});

export { router as enhancedMatchingRoutes };
