import { logger } from '../utils/logger.js';
import { Opportunity, IOpportunity } from '../models/opportunity.js';

// Enhanced weights for matching algorithm
export const TECH_FOCUS_WEIGHT = parseFloat(process.env.TECH_FOCUS_WEIGHT || '0.35');
export const STAGE_WEIGHT = parseFloat(process.env.STAGE_WEIGHT || '0.25');
export const TIMELINE_WEIGHT = parseFloat(process.env.TIMELINE_WEIGHT || '0.15');
export const BUDGET_WEIGHT = parseFloat(process.env.BUDGET_WEIGHT || '0.15');
export const KEYWORD_WEIGHT = parseFloat(process.env.KEYWORD_WEIGHT || '0.10');

// Export weights configuration
export const getWeightsConfig = () => ({
  techFocus: TECH_FOCUS_WEIGHT,
  stage: STAGE_WEIGHT,
  timeline: TIMELINE_WEIGHT,
  budget: BUDGET_WEIGHT,
  keyword: KEYWORD_WEIGHT
});

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

// Interface for enhanced match result
export interface EnhancedMatchResult {
  opportunity: IOpportunity;
  score: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  matchDetails: {
    techFocusMatch: number;
    stageMatch: number;
    timelineMatch: number;
    budgetMatch: number;
    keywordMatch: number;
    matchedKeywords?: string[];
  };
}

/**
 * Find matching opportunities for a company profile with enhanced algorithm
 * @param formData Form data with company and project information
 * @param limit Maximum number of matches to return
 * @returns Array of matching opportunities with scores
 */
export const findEnhancedMatchingOpportunities = async (
  formData: FormData,
  limit: number = 5
): Promise<EnhancedMatchResult[]> => {
  try {
    logger.info(`Finding enhanced matching opportunities for ${formData.company.name}`);
    
    // Get all opportunities from the database
    const opportunities = await Opportunity.find({}).lean();
    
    if (!opportunities || opportunities.length === 0) {
      logger.warn('No opportunities found in the database');
      return [];
    }
    
    logger.info(`Found ${opportunities.length} opportunities to match against`);
    
    // Calculate match scores for each opportunity
    const matches: EnhancedMatchResult[] = opportunities.map(opportunity => {
      // Calculate tech focus match score
      const techFocusMatch = calculateTechFocusMatch(
        formData.company.techCategory,
        formData.project.interests,
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
      
      // Calculate budget match score
      const budgetMatch = calculateBudgetMatch(
        formData.project.budget,
        opportunity.awardAmount
      );
      
      // Calculate keyword match score
      const keywordMatchResult = calculateKeywordMatch(
        formData.project.description,
        formData.project.techSpecs,
        opportunity.description
      );
      
      // Calculate weighted score
      const score = (
        techFocusMatch * TECH_FOCUS_WEIGHT +
        stageMatch * STAGE_WEIGHT +
        timelineMatch * TIMELINE_WEIGHT +
        budgetMatch * BUDGET_WEIGHT +
        keywordMatchResult.score * KEYWORD_WEIGHT
      );
      
      // Determine confidence level based on score
      const confidenceLevel = determineConfidenceLevel(score);
      
      return {
        opportunity,
        score,
        confidenceLevel,
        matchDetails: {
          techFocusMatch,
          stageMatch,
          timelineMatch,
          budgetMatch,
          keywordMatch: keywordMatchResult.score,
          matchedKeywords: keywordMatchResult.matchedKeywords
        }
      };
    });
    
    // Sort matches by score (descending)
    const sortedMatches = matches.sort((a, b) => b.score - a.score);
    
    // Apply diversity mechanism to avoid overrepresentation of one factor
    const diversifiedMatches = applyDiversityMechanism(sortedMatches, limit);
    
    logger.info(`Found ${diversifiedMatches.length} matching opportunities for ${formData.company.name}`);
    
    return diversifiedMatches;
  } catch (error) {
    logger.error('Error finding enhanced matching opportunities:', error);
    throw error;
  }
};

/**
 * Calculate match score for technology focus
 * @param companyTechCategories Company's technology categories
 * @param projectInterests Project's interests
 * @param opportunityTechFocus Opportunity's technology focus
 * @returns Match score between 0 and 1
 */
const calculateTechFocusMatch = (
  companyTechCategories: string[],
  projectInterests: string[],
  opportunityTechFocus: string[]
): number => {
  if ((!companyTechCategories.length && !projectInterests.length) || !opportunityTechFocus.length) {
    return 0;
  }
  
  // Combine company tech categories and project interests
  const combinedTechInterests = [
    ...new Set([...companyTechCategories, ...projectInterests])
  ];
  
  // Count matching categories
  const matchingCategories = combinedTechInterests.filter(category => 
    opportunityTechFocus.some(focus => 
      focus.toLowerCase().includes(category.toLowerCase()) || 
      category.toLowerCase().includes(focus.toLowerCase())
    )
  );
  
  // Calculate match score using the Jaccard similarity coefficient
  const intersection = matchingCategories.length;
  const union = new Set([...combinedTechInterests, ...opportunityTechFocus]).size;
  
  return union > 0 ? intersection / union : 0;
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
  
  // Check if "Any" stage is eligible
  if (opportunityEligibleStages.some(stage => 
    stage.toLowerCase() === 'any'
  )) {
    return 1;
  }
  
  // Check if company stage is directly eligible
  const isDirectMatch = opportunityEligibleStages.some(stage => 
    stage.toLowerCase() === companyStage.toLowerCase()
  );
  
  if (isDirectMatch) {
    return 1;
  }
  
  // Check for partial matches or related stages
  const stageMap: Record<string, string[]> = {
    'seed': ['early stage', 'startup'],
    'early stage': ['seed', 'startup', 'growth stage'],
    'growth stage': ['early stage', 'established'],
    'established': ['growth stage', 'mature']
  };
  
  const relatedStages = stageMap[companyStage.toLowerCase()] || [];
  const isRelatedMatch = opportunityEligibleStages.some(stage => 
    relatedStages.includes(stage.toLowerCase())
  );
  
  return isRelatedMatch ? 0.5 : 0;
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
  
  return maxRange > 0 ? overlap / maxRange : 0;
};

/**
 * Calculate match score for project budget vs opportunity award amount
 * @param projectBudget Project's budget as string (e.g., "$100,000", "100k-500k")
 * @param opportunityAwardAmount Opportunity's award amount as number
 * @returns Match score between 0 and 1
 */
const calculateBudgetMatch = (
  projectBudget: string,
  opportunityAwardAmount?: number
): number => {
  // If award amount is not specified, return medium match
  if (!opportunityAwardAmount) {
    return 0.5;
  }
  
  // If project budget is not specified, return medium match
  if (!projectBudget) {
    return 0.5;
  }
  
  // Extract numeric values from project budget
  const budgetRange = extractBudgetRange(projectBudget);
  
  // If we couldn't parse the budget, return medium match
  if (!budgetRange) {
    return 0.5;
  }
  
  // Check if award amount is within budget range
  if (opportunityAwardAmount >= budgetRange.min && opportunityAwardAmount <= budgetRange.max) {
    // Perfect match - award is within budget range
    return 1;
  } else if (opportunityAwardAmount < budgetRange.min) {
    // Award is less than minimum budget
    const ratio = opportunityAwardAmount / budgetRange.min;
    // If award is at least 70% of minimum budget, it might still be acceptable
    return ratio >= 0.7 ? 0.7 : 0.3;
  } else {
    // Award is more than maximum budget
    // This is generally good (more money than expected)
    return 0.8;
  }
};

/**
 * Calculate keyword match score between project and opportunity descriptions
 * @param projectDescription Project's description
 * @param projectTechSpecs Project's technical specifications
 * @param opportunityDescription Opportunity's description
 * @returns Object with match score and matched keywords
 */
const calculateKeywordMatch = (
  projectDescription: string,
  projectTechSpecs: string,
  opportunityDescription: string
): { score: number; matchedKeywords: string[] } => {
  if (!projectDescription || !opportunityDescription) {
    return { score: 0, matchedKeywords: [] };
  }
  
  // Combine project description and tech specs
  const projectText = `${projectDescription} ${projectTechSpecs}`;
  
  // Extract keywords from project text
  const projectKeywords = extractKeywords(projectText);
  
  // Extract keywords from opportunity description
  const opportunityKeywords = extractKeywords(opportunityDescription);
  
  // Find matching keywords
  const matchedKeywords = projectKeywords.filter(keyword => 
    opportunityKeywords.includes(keyword)
  );
  
  // Calculate match score based on keyword overlap
  const matchRatio = matchedKeywords.length / Math.max(1, opportunityKeywords.length);
  
  return {
    score: matchRatio,
    matchedKeywords
  };
};

/**
 * Extract months from timeline string
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

/**
 * Extract budget range from budget string
 * @param budget Budget string (e.g., "$100,000", "$100k-500k", "Under $1M")
 * @returns Object with min and max budget, or null if parsing fails
 */
const extractBudgetRange = (
  budget: string
): { min: number; max: number } | null => {
  // Clean the budget string
  const cleanBudget = budget.toLowerCase()
    .replace(/\$/g, '')
    .replace(/,/g, '')
    .replace(/\s+/g, '');
  
  // Parse budget with K/M/B suffixes
  const parseBudgetValue = (value: string): number => {
    const multipliers = {
      'k': 1000,
      'm': 1000000,
      'b': 1000000000
    };
    
    // Check for suffixes
    for (const [suffix, multiplier] of Object.entries(multipliers)) {
      if (value.endsWith(suffix)) {
        return parseFloat(value.replace(suffix, '')) * multiplier;
      }
    }
    
    return parseFloat(value);
  };
  
  // Case 1: Range with hyphen (e.g. "100k-500k")
  const rangeMatch = cleanBudget.match(/^(\d+[kmb]?)-(\d+[kmb]?)$/);
  if (rangeMatch) {
    const min = parseBudgetValue(rangeMatch[1]);
    const max = parseBudgetValue(rangeMatch[2]);
    return { min, max };
  }
  
  // Case 2: Single value (e.g. "100k", "1m")
  const singleMatch = cleanBudget.match(/^(\d+[kmb]?)$/);
  if (singleMatch) {
    const value = parseBudgetValue(singleMatch[1]);
    // For a single value, use a range around it
    return { min: value * 0.8, max: value * 1.2 };
  }
  
  // Case 3: "Under X" or "Less than X"
  const underMatch = cleanBudget.match(/^(under|lessthan)(\d+[kmb]?)$/);
  if (underMatch) {
    const max = parseBudgetValue(underMatch[2]);
    return { min: 0, max };
  }
  
  // Case 4: "Over X" or "More than X"
  const overMatch = cleanBudget.match(/^(over|morethan)(\d+[kmb]?)$/);
  if (overMatch) {
    const min = parseBudgetValue(overMatch[2]);
    return { min, max: min * 10 }; // Set a reasonable upper bound
  }
  
  return null;
};

/**
 * Extract important keywords from text
 * @param text Text to extract keywords from
 * @returns Array of keywords
 */
const extractKeywords = (text: string): string[] => {
  if (!text) return [];
  
  // Normalize text
  const normalizedText = text.toLowerCase();
  
  // Split by non-alphabetic characters
  const words = normalizedText.split(/[^a-z]+/);
  
  // Filter out common words and short words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
    'which', 'this', 'that', 'these', 'those', 'then', 'just', 'so', 'than', 'such',
    'when', 'with', 'for', 'of', 'to', 'in', 'on', 'by', 'at', 'from', 'be', 'is',
    'are', 'was', 'were', 'will', 'would', 'should', 'can', 'could', 'you', 'your',
    'we', 'us', 'our', 'i', 'me', 'my', 'they', 'them', 'their', 'he', 'she', 'it',
    'has', 'have', 'had', 'do', 'does', 'did', 'about', 'very'
  ]);
  
  // Get keywords (non-stop words of length > 2)
  const keywords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );
  
  // Create a set for unique keywords
  return [...new Set(keywords)];
};

/**
 * Determine confidence level based on match score
 * @param score Match score (0-1)
 * @returns Confidence level (high, medium, low)
 */
const determineConfidenceLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 0.75) {
    return 'high';
  } else if (score >= 0.5) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Apply diversity mechanism to ensure results aren't dominated by one factor
 * @param matches Sorted matches
 * @param limit Maximum number of matches to return
 * @returns Diversified match results
 */
const applyDiversityMechanism = (
  matches: EnhancedMatchResult[],
  limit: number
): EnhancedMatchResult[] => {
  // If we have fewer matches than the limit, return all matches
  if (matches.length <= limit) {
    return matches;
  }
  
  // Create diversified results array
  const diversifiedResults: EnhancedMatchResult[] = [];
  
  // Always include the top match
  diversifiedResults.push(matches[0]);
  
  // Group the remaining matches by agency
  const matchesByAgency = new Map<string, EnhancedMatchResult[]>();
  for (let i = 1; i < matches.length; i++) {
    const agency = matches[i].opportunity.agency;
    if (!matchesByAgency.has(agency)) {
      matchesByAgency.set(agency, []);
    }
    matchesByAgency.get(agency)!.push(matches[i]);
  }
  
  // Include one match from each agency, prioritizing higher scores
  const agencies = Array.from(matchesByAgency.keys());
  let agencyIndex = 0;
  
  while (diversifiedResults.length < limit && agencies.length > 0) {
    const agency = agencies[agencyIndex % agencies.length];
    const agencyMatches = matchesByAgency.get(agency) || [];
    
    if (agencyMatches.length > 0) {
      diversifiedResults.push(agencyMatches.shift()!);
      if (agencyMatches.length === 0) {
        agencies.splice(agencyIndex % agencies.length, 1);
      } else {
        agencyIndex++;
      }
    } else {
      agencies.splice(agencyIndex % agencies.length, 1);
    }
    
    // If we've gone through all agencies, break
    if (agencies.length === 0) {
      break;
    }
  }
  
  // If we still need more matches, take the highest scoring remaining matches
  if (diversifiedResults.length < limit) {
    const remainingMatches = matches.filter(match => 
      !diversifiedResults.includes(match)
    );
    
    diversifiedResults.push(...remainingMatches.slice(0, limit - diversifiedResults.length));
  }
  
  return diversifiedResults;
};
