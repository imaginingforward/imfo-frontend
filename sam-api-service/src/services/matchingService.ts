import { logger } from '../utils/logger.js';
import { Opportunity, IOpportunity } from '../models/opportunity.js';

// Weights for matching algorithm
const TECH_FOCUS_WEIGHT = parseFloat(process.env.TECH_FOCUS_WEIGHT || '0.6');
const STAGE_WEIGHT = parseFloat(process.env.STAGE_WEIGHT || '0.3');
const TIMELINE_WEIGHT = parseFloat(process.env.TIMELINE_WEIGHT || '0.1');

// Interface for company data
export interface CompanyData {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];
  stage: string;
  teamSize: string;
  foundedYear: string;
  email: string;
}

// Interface for project data
export interface ProjectData {
  title: string;
  description: string;
  techSpecs: string;
  budget: string;
  timeline: string;
  interests: string[];
}

// Interface for form data
export interface FormData {
  company: CompanyData;
  project: ProjectData;
}

// Interface for match result
export interface MatchResult {
  opportunity: IOpportunity;
  score: number;
  matchDetails: {
    techFocusMatch: number;
    stageMatch: number;
    timelineMatch: number;
  };
}

/**
 * Find matching opportunities for a company profile
 * @param formData Form data with company and project information
 * @param limit Maximum number of matches to return
 * @returns Array of matching opportunities with scores
 */
export const findMatchingOpportunities = async (
  formData: FormData,
  limit: number = 3
): Promise<MatchResult[]> => {
  try {
    logger.info(`Finding matching opportunities for ${formData.company.name}`);
    
    // Get all opportunities from the database
    const opportunities = await Opportunity.find({}).lean();
    
    if (!opportunities || opportunities.length === 0) {
      logger.warn('No opportunities found in the database');
      return [];
    }
    
    logger.info(`Found ${opportunities.length} opportunities to match against`);
    
    // Calculate match scores for each opportunity
    const matches: MatchResult[] = opportunities.map(opportunity => {
      // Calculate tech focus match score
      const techFocusMatch = calculateTechFocusMatch(
        formData.company.techCategory,
        opportunity.techFocus
      );
      
      // Calculate stage match score
      const stageMatch = calculateStageMatch(
        formData.company.stage,
        opportunity.eligibleStages
      );
      
      // Calculate timeline match score
      const timelineMatch = calculateTimelineMatch(
        formData.project.timeline,
        opportunity.timeline
      );
      
      // Calculate weighted score
      const score = (
        techFocusMatch * TECH_FOCUS_WEIGHT +
        stageMatch * STAGE_WEIGHT +
        timelineMatch * TIMELINE_WEIGHT
      );
      
      return {
        opportunity,
        score,
        matchDetails: {
          techFocusMatch,
          stageMatch,
          timelineMatch
        }
      };
    });
    
    // Sort matches by score (descending)
    const sortedMatches = matches.sort((a, b) => b.score - a.score);
    
    // Return top matches
    const topMatches = sortedMatches.slice(0, limit);
    
    logger.info(`Found ${topMatches.length} matching opportunities for ${formData.company.name}`);
    
    return topMatches;
  } catch (error) {
    logger.error('Error finding matching opportunities:', error);
    throw error;
  }
};

/**
 * Calculate match score for technology focus
 * @param companyTechCategories Company's technology categories
 * @param opportunityTechFocus Opportunity's technology focus
 * @returns Match score between 0 and 1
 */
const calculateTechFocusMatch = (
  companyTechCategories: string[],
  opportunityTechFocus: string[]
): number => {
  if (!companyTechCategories.length || !opportunityTechFocus.length) {
    return 0;
  }
  
  // Count matching categories
  const matchingCategories = companyTechCategories.filter(category => 
    opportunityTechFocus.some(focus => 
      focus.toLowerCase() === category.toLowerCase()
    )
  );
  
  // Calculate match score
  // We use the Jaccard similarity coefficient: intersection / union
  const intersection = matchingCategories.length;
  const union = new Set([...companyTechCategories, ...opportunityTechFocus]).size;
  
  return intersection / union;
};

/**
 * Calculate match score for company stage
 * @param companyStage Company's stage
 * @param opportunityEligibleStages Opportunity's eligible stages
 * @returns Match score between 0 and 1
 */
const calculateStageMatch = (
  companyStage: string,
  opportunityEligibleStages: string[]
): number => {
  if (!companyStage || !opportunityEligibleStages.length) {
    return 0;
  }
  
  // Check if company stage is eligible
  const isEligible = opportunityEligibleStages.some(stage => 
    stage.toLowerCase() === companyStage.toLowerCase()
  );
  
  return isEligible ? 1 : 0;
};

/**
 * Calculate match score for project timeline
 * @param projectTimeline Project's timeline
 * @param opportunityTimeline Opportunity's timeline
 * @returns Match score between 0 and 1
 */
const calculateTimelineMatch = (
  projectTimeline: string,
  opportunityTimeline: string
): number => {
  if (!projectTimeline || !opportunityTimeline) {
    return 0;
  }
  
  // Extract numeric values from timelines
  const projectMonths = extractMonthsFromTimeline(projectTimeline);
  const opportunityMonths = extractMonthsFromTimeline(opportunityTimeline);
  
  if (!projectMonths || !opportunityMonths) {
    return 0.5; // Default to medium match if we can't parse the timelines
  }
  
  // Calculate overlap between timelines
  const projectStart = projectMonths.min;
  const projectEnd = projectMonths.max;
  const opportunityStart = opportunityMonths.min;
  const opportunityEnd = opportunityMonths.max;
  
  // Calculate overlap
  const overlapStart = Math.max(projectStart, opportunityStart);
  const overlapEnd = Math.min(projectEnd, opportunityEnd);
  const overlap = Math.max(0, overlapEnd - overlapStart);
  
  // Calculate match score
  const projectRange = projectEnd - projectStart;
  const opportunityRange = opportunityEnd - opportunityStart;
  const maxRange = Math.max(projectRange, opportunityRange);
  
  return overlap / maxRange;
};

/**
 * Extract minimum and maximum months from timeline string
 * @param timeline Timeline string (e.g., "12-24 months", "1-2 years")
 * @returns Object with min and max months, or null if parsing fails
 */
const extractMonthsFromTimeline = (
  timeline: string
): { min: number; max: number } | null => {
  // Try to match patterns like "12-24 months", "1-2 years", etc.
  const monthPattern = /(\d+)(?:-(\d+))?\s*months?/i;
  const yearPattern = /(\d+)(?:-(\d+))?\s*years?/i;
  
  let min = 0;
  let max = 0;
  
  // Try to match month pattern
  const monthMatch = timeline.match(monthPattern);
  if (monthMatch) {
    min = parseInt(monthMatch[1], 10);
    max = monthMatch[2] ? parseInt(monthMatch[2], 10) : min;
    return { min, max };
  }
  
  // Try to match year pattern
  const yearMatch = timeline.match(yearPattern);
  if (yearMatch) {
    min = parseInt(yearMatch[1], 10) * 12;
    max = yearMatch[2] ? parseInt(yearMatch[2], 10) * 12 : min;
    return { min, max };
  }
  
  return null;
};
