import express from 'express';
import { determineConfidenceLevel } from '../services/enhancedMatchingService.js';
import { findAIMatchingOpportunities } from '../services/aiMatchingService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @route POST /api/match/enhanced
 * @desc Find matching opportunities for a company profile using AI (formerly enhanced algorithm)
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
    
    // Find matching opportunities using AI instead of enhanced algorithm
    logger.info(`Enhanced matching route now using AI matching for ${formData.company.name}`);
    const matches = await findAIMatchingOpportunities(formData, limit);
    
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
  // Return AI-based algorithm configuration
  return res.status(200).json({
    success: true,
    algorithmVersion: '2.0.0',
    matchingType: 'AI-based (OpenAI)',
    model: process.env.AI_MODEL || 'gpt-4.1-nano',
    confidenceLevels: {
      high: '≥ 0.75',
      medium: '0.5 - 0.75',
      low: '< 0.5'
    }
  });
});

export { router as enhancedMatchingRoutes };
