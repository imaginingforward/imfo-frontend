import OpenAI from 'openai';
import { logger } from '../utils/logger.js';
import { Opportunity, IOpportunity } from '../models/opportunity.js';
import { 
  FormData, 
  EnhancedMatchResult,
  determineConfidenceLevel
} from './enhancedMatchingService.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const MAX_OPPORTUNITIES = parseInt(process.env.MAX_OPPORTUNITIES_TO_PROCESS || '20');
const AI_MODEL = process.env.AI_MODEL || 'gpt-4.1-nano';

/**
 * Create demo opportunities for testing when database is not available
 * @returns Array of demo opportunities
 */
function createDemoOpportunities(): IOpportunity[] {
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);
  
  return [
    {
      noticeId: 'DEMO-001',
      title: 'Advanced Satellite Communication Systems',
      agency: 'NASA',
      description: 'Development of advanced satellite communication systems for deep space missions. Looking for innovative approaches to improve data transmission rates and reduce latency in communications with spacecraft beyond Mars orbit.',
      postedDate: now,
      responseDeadline: oneMonthLater,
      awardAmount: 750000,
      techFocus: ['Communications', 'Satellites', 'Signal Processing'],
      eligibleStages: ['Growth Stage', 'Established'],
      timeline: '12-18 months',
      setAside: 'Small Business',
      placeOfPerformance: 'Contractor Site',
      rawData: {},
      lastUpdated: now
    },
    {
      noticeId: 'DEMO-002',
      title: 'Next-Generation Propulsion Technology',
      agency: 'Space Force',
      description: 'Research and development of efficient propulsion systems for small satellites and CubeSats. Looking for green propellant alternatives and innovative miniaturized propulsion solutions.',
      postedDate: now,
      responseDeadline: oneMonthLater,
      awardAmount: 500000,
      techFocus: ['Propulsion', 'CubeSats', 'Green Technology'],
      eligibleStages: ['Early Stage', 'Seed', 'Growth Stage'],
      timeline: '6-12 months',
      setAside: 'SBIR Eligible',
      placeOfPerformance: 'Multiple Locations',
      rawData: {},
      lastUpdated: now
    },
    {
      noticeId: 'DEMO-003',
      title: 'AI/ML Applications for Space Situational Awareness',
      agency: 'DARPA',
      description: 'Developing artificial intelligence and machine learning solutions for improved space situational awareness. Seeking algorithms capable of predicting orbital debris trajectories and potential collision scenarios with higher accuracy.',
      postedDate: now,
      responseDeadline: oneMonthLater,
      awardAmount: 1200000,
      techFocus: ['AI/ML', 'Space Situational Awareness', 'Orbital Mechanics'],
      eligibleStages: ['Any'],
      timeline: '24-36 months',
      setAside: 'None',
      placeOfPerformance: 'Contractor Site',
      rawData: {},
      lastUpdated: now
    }
  ] as IOpportunity[];
}

/**
 * Find matching opportunities for a company profile using AI
 * @param formData Form data with company and project information
 * @param limit Maximum number of matches to return
 * @returns Array of matching opportunities with scores
 */
export const findAIMatchingOpportunities = async (
  formData: FormData,
  limit: number = 5
): Promise<EnhancedMatchResult[]> => {
  // Define variable at the very top level of the function
  // so it's accessible throughout all blocks
  let apiCallStartTime = 0;
  
  try {
    logger.info(`Finding AI matching opportunities for ${formData.company.name}`);
    
    // Try to get opportunities from the database
    let opportunities = [];
    try {
      const allOpportunities = await Opportunity.find({}).lean();
      if (allOpportunities && allOpportunities.length > 0) {
        logger.info(`Found ${allOpportunities.length} opportunities in database`);
        opportunities = allOpportunities.slice(0, MAX_OPPORTUNITIES);
      } else {
        logger.warn('No opportunities found in the database, using demo data');
        opportunities = createDemoOpportunities();
      }
    } catch (error) {
      // Database might not be available, use demo data
      logger.warn('Error accessing database, using demo data instead:', error);
      opportunities = createDemoOpportunities();
    }
    
    logger.info(`Processing ${opportunities.length} opportunities`);
    
    // Construct the prompt for the OpenAI API
    const prompt = constructMatchingPrompt(formData, opportunities);
    
    // Log pre-API call information
    logger.info(`Preparing to call OpenAI API with model: ${AI_MODEL}`);
    logger.debug(`Using prompt with length: ${prompt.length} characters`);
    
    // Truncated prompt for logging (first 200 characters)
    const truncatedPrompt = prompt.length > 200 
      ? `${prompt.substring(0, 200)}... (truncated, full length: ${prompt.length})`
      : prompt;
    logger.debug(`Prompt preview: ${truncatedPrompt}`);
    
    // Set the API call start time
    apiCallStartTime = Date.now();
    
    // Call the OpenAI API
    logger.info('Calling OpenAI API...');
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that specializes in matching space tech startups with government contract opportunities. You'll be given a company profile and a list of government opportunities. Your task is to analyze and rank how well each opportunity matches the company's capabilities and project needs. Provide your response in the specified JSON format and limit your analysis to factual relationships between the data provided."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Calculate API call duration
    const apiCallDuration = Date.now() - apiCallStartTime;
    logger.info(`OpenAI API call completed in ${apiCallDuration}ms`);
    
    // Log API response metadata
    logger.info(`Response received. Model used: ${response.model}`);
    logger.debug(`Tokens used: ${response.usage?.total_tokens || 'N/A'} (Prompt: ${response.usage?.prompt_tokens || 'N/A'}, Completion: ${response.usage?.completion_tokens || 'N/A'})`);
  
    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      logger.error('Empty response from OpenAI API');
      return [];
    }
    
    // Log a truncated version of the response
    const truncatedContent = content.length > 500 
      ? `${content.substring(0, 500)}... (truncated, full length: ${content.length})`
      : content;
    logger.debug(`AI response content preview: ${truncatedContent}`);
    
    let matchesData: any;
    try {
      matchesData = JSON.parse(content);
      logger.info('Successfully parsed JSON response from OpenAI API');
    } catch (error) {
      logger.error('Error parsing JSON response from OpenAI API:', error);
      logger.debug('Raw response:', content);
      return [];
    }
    
    // Ensure we have the expected structure
    if (!matchesData.matches || !Array.isArray(matchesData.matches)) {
      logger.error('Invalid response format from OpenAI API');
      return [];
    }
    
    // Map AI responses to EnhancedMatchResult format
    const matches: EnhancedMatchResult[] = matchesData.matches.map((match: any) => {
      // Find the corresponding opportunity
      const opportunity = opportunities.find(opp => opp.noticeId === match.noticeId);
      
      // Skip if opportunity not found
      if (!opportunity) {
        logger.warn(`Opportunity with noticeId ${match.noticeId} not found`);
        return null;
      }
      
      // Create match result
      return {
        opportunity,
        score: match.score,
        confidenceLevel: determineConfidenceLevel(match.score),
        matchDetails: {
          techFocusMatch: match.matchDetails.techFocusMatch,
          stageMatch: match.matchDetails.stageMatch,
          timelineMatch: match.matchDetails.timelineMatch,
          budgetMatch: match.matchDetails.budgetMatch,
          keywordMatch: match.matchDetails.keywordMatch,
          matchedKeywords: match.matchDetails.matchedKeywords || [],
          aiRecommendation: match.explanation
        }
      };
    }).filter(Boolean) as EnhancedMatchResult[];
    
    // Sort matches by score (descending) and limit
    const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, limit);
    
    logger.info(`Found ${sortedMatches.length} AI matching opportunities for ${formData.company.name}`);
    
    return sortedMatches;
  } catch (error) {
    // Calculate API call duration even on error
    const apiCallDuration = Date.now() - apiCallStartTime;
    
    // Enhanced error logging
    if (error instanceof Error) {
      logger.error(`OpenAI API error after ${apiCallDuration}ms:`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      
      // Additional logging for OpenAI API errors
      if ('status' in error) {
        logger.error(`OpenAI API HTTP status: ${(error as any).status}`);
      }
      
      if ('response' in error && (error as any).response?.data) {
        logger.error('OpenAI API error details:', (error as any).response.data);
      }
    } else {
      logger.error(`Unknown error after ${apiCallDuration}ms:`, error);
    }
    
    throw error;
  }
};

/**
 * Construct the prompt for the OpenAI API
 * @param formData Form data with company and project information
 * @param opportunities List of opportunities to match against
 * @returns Prompt string for OpenAI API
 */
function constructMatchingPrompt(
  formData: FormData,
  opportunities: IOpportunity[]
): string {
  // Format company data
  const companyData = `
COMPANY INFORMATION:
Name: ${formData.company.name}
Description: ${formData.company.description}
Technology Categories: ${formData.company.techCategory.join(', ')}
Company Stage: ${formData.company.stage}
Team Size: ${formData.company.teamSize}
Founded Year: ${formData.company.foundedYear}
${formData.company.website ? `Website: ${formData.company.website}` : ''}
${formData.company.patents ? `Patents: ${formData.company.patents}` : ''}

PROJECT INFORMATION:
Title: ${formData.project.title}
Description: ${formData.project.description}
Technical Specifications: ${formData.project.techSpecs}
Budget: ${formData.project.budget}
Timeline: ${formData.project.timeline}
Areas of Interest: ${formData.project.interests.join(', ')}
  `;

  // Format opportunities data
  const opportunitiesData = opportunities.map((opp, index) => `
OPPORTUNITY ${index + 1}:
Notice ID: ${opp.noticeId}
Title: ${opp.title}
Agency: ${opp.agency}
Description: ${opp.description}
Posted Date: ${opp.postedDate.toISOString().split('T')[0]}
Response Deadline: ${opp.responseDeadline.toISOString().split('T')[0]}
${opp.awardAmount ? `Award Amount: $${opp.awardAmount}` : 'Award Amount: Not specified'}
${opp.setAside ? `Set Aside: ${opp.setAside}` : ''}
${opp.placeOfPerformance ? `Place of Performance: ${opp.placeOfPerformance}` : ''}
Technology Focus: ${opp.techFocus.join(', ')}
Eligible Stages: ${opp.eligibleStages.join(', ')}
Timeline: ${opp.timeline}
${opp.url ? `URL: ${opp.url}` : ''}
  `).join('\n');

  // Construct the complete prompt
  return `
You are a matching algorithm for a space tech RFP matchmaking service. Your task is to analyze the company information and project requirements below, and determine how well they match with each of the government contract opportunities provided.

${companyData}

Here are the government contract opportunities to evaluate:

${opportunitiesData}

For each opportunity, assess the following match criteria:
1. Tech Focus Match: How well the company's technology categories and project interests align with the opportunity's technology focus (0-1 score)
2. Stage Match: How suitable the opportunity is for the company's current stage (0-1 score)
3. Timeline Match: Compatibility between the project timeline and opportunity timeline (0-1 score)
4. Budget Match: Alignment between the project budget and opportunity award amount (0-1 score)
5. Keyword Match: Relevant keywords that appear in both the project description and opportunity description (0-1 score)

Calculate a total score (0-1) for each opportunity based on these criteria. Weight them as follows:
- Tech Focus: 35%
- Stage: 25%
- Timeline: 15%
- Budget: 15%
- Keywords: 10%

Provide an explanation for each match, highlighting why it's a good fit or what challenges might exist.

Return your analysis in the following JSON format:
{
  "matches": [
    {
      "noticeId": "string",
      "score": number,
      "matchDetails": {
        "techFocusMatch": number,
        "stageMatch": number,
        "timelineMatch": number,
        "budgetMatch": number,
        "keywordMatch": number,
        "matchedKeywords": ["string"]
      },
      "explanation": "string"
    }
  ]
}
`;
}
