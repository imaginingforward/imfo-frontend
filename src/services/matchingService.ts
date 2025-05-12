import type { FormData } from "@/types/form";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for browser environment
});

// Default OpenAI model - can be changed as needed
const AI_MODEL = "gpt-4.1-nano";

// Maximum number of opportunities to display
const MAX_RESULTS = 5;

// Type for match result
export interface MatchOpportunity {
  noticeId: string;
  title: string;
  agency: string;
  description: string;
  postedDate: string;
  responseDeadline: string;
  awardAmount?: number;
  naicsCode?: string;
  setAside?: string;
  placeOfPerformance?: string;
  techFocus: string[];
  eligibleStages: string[];
  timeline: string;
  url?: string;
  pointOfContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MatchResult {
  opportunity: MatchOpportunity;
  score: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  matchDetails: {
    techFocusMatch: number;
    stageMatch: number;
    timelineMatch: number;
    budgetMatch: number;
    keywordMatch: number;
    matchedKeywords?: string[];
    aiRecommendation?: string; // AI-generated explanation for the match
  };
}

export interface MatchResponse {
  success: boolean;
  matchCount: number;
  matches: MatchResult[];
}

/**
 * Create demo opportunities for testing
 * @returns Array of demo opportunities
 */
function createDemoOpportunities(): MatchOpportunity[] {
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(now.getMonth() + 1);
  
  return [
    {
      noticeId: 'DEMO-001',
      title: 'Advanced Satellite Communication Systems',
      agency: 'NASA',
      description: 'Development of advanced satellite communication systems for deep space missions. Looking for innovative approaches to improve data transmission rates and reduce latency in communications with spacecraft beyond Mars orbit.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 750000,
      techFocus: ['Communications', 'Satellites', 'Signal Processing'],
      eligibleStages: ['Growth Stage', 'Established'],
      timeline: '12-18 months',
      setAside: 'Small Business',
      placeOfPerformance: 'Contractor Site'
    },
    {
      noticeId: 'DEMO-002',
      title: 'Next-Generation Propulsion Technology',
      agency: 'Space Force',
      description: 'Research and development of efficient propulsion systems for small satellites and CubeSats. Looking for green propellant alternatives and innovative miniaturized propulsion solutions.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 500000,
      techFocus: ['Propulsion', 'CubeSats', 'Green Technology'],
      eligibleStages: ['Early Stage', 'Seed', 'Growth Stage'],
      timeline: '6-12 months',
      setAside: 'SBIR Eligible',
      placeOfPerformance: 'Multiple Locations'
    },
    {
      noticeId: 'DEMO-003',
      title: 'AI/ML Applications for Space Situational Awareness',
      agency: 'DARPA',
      description: 'Developing artificial intelligence and machine learning solutions for improved space situational awareness. Seeking algorithms capable of predicting orbital debris trajectories and potential collision scenarios with higher accuracy.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 1200000,
      techFocus: ['AI/ML', 'Space Situational Awareness', 'Orbital Mechanics'],
      eligibleStages: ['Any'],
      timeline: '24-36 months',
      setAside: 'None',
      placeOfPerformance: 'Contractor Site'
    },
    {
      noticeId: 'DEMO-004',
      title: 'Advanced Materials for Space Environment',
      agency: 'NASA',
      description: 'Development of novel materials capable of withstanding extreme space environments. Seeking innovations in radiation-resistant, thermal-adaptive, and lightweight materials for spacecraft construction and habitat development.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 850000,
      techFocus: ['Materials Science', 'Spacecraft Design', 'Radiation Protection'],
      eligibleStages: ['Growth Stage', 'Established'],
      timeline: '18-24 months',
      setAside: 'Small Business',
      placeOfPerformance: 'Multiple Locations'
    },
    {
      noticeId: 'DEMO-005',
      title: 'Small Satellite Constellation Management',
      agency: 'Space Force',
      description: 'Software solutions for managing and coordinating small satellite constellations. Looking for advanced algorithms for constellation maintenance, collision avoidance, and distributed data processing capabilities.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 650000,
      techFocus: ['Small Satellites', 'Software Systems', 'Orbital Dynamics'],
      eligibleStages: ['Seed', 'Early Stage', 'Growth Stage'],
      timeline: '12-18 months',
      setAside: 'SBIR Eligible',
      placeOfPerformance: 'Contractor Site'
    },
    {
      noticeId: 'DEMO-006',
      title: 'In-Space Manufacturing Solutions',
      agency: 'NASA',
      description: 'Technologies enabling manufacturing capabilities in space environments. Seeking innovations in 3D printing, assembly robotics, and recycling systems adapted for microgravity and lunar surface operations.',
      postedDate: now.toISOString(),
      responseDeadline: oneMonthLater.toISOString(),
      awardAmount: 950000,
      techFocus: ['Manufacturing', 'Robotics', '3D Printing', 'Lunar Operations'],
      eligibleStages: ['Early Stage', 'Growth Stage'],
      timeline: '24-36 months',
      setAside: 'None',
      placeOfPerformance: 'Multiple Locations'
    }
  ];
}

/**
 * Determine confidence level based on score
 * @param score Match score between 0 and 1
 * @returns Confidence level category
 */
function determineConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.75) {
    return 'high';
  } else if (score >= 0.5) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Get matching opportunities using direct OpenAI integration
 * @param formData Form data with company and project information
 * @returns Promise with match results
 */
export const getMatchingOpportunities = async (formData: FormData): Promise<MatchResponse> => {
  try {
    console.log("Starting direct AI matching process with:", formData);
    
    // Get opportunities (in a real app, these could come from a database)
    const opportunities = createDemoOpportunities();
    console.log(`Processing ${opportunities.length} opportunities`);
    
    // Construct OpenAI prompt
    const prompt = constructMatchingPrompt(formData, opportunities);
    
    console.log(`Calling OpenAI API with model: ${AI_MODEL}`);
    
    // Call OpenAI directly
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
    
    console.log("OpenAI API response received");
    
    // Parse response content
    const content = response.choices[0].message.content;
    if (!content) {
      console.error('Empty response from OpenAI API');
      throw new Error('Empty response from OpenAI API');
    }
    
    // Parse JSON response
    const matchesData = JSON.parse(content);
    
    // Ensure we have the expected structure
    if (!matchesData.matches || !Array.isArray(matchesData.matches)) {
      console.error('Invalid response format from OpenAI API');
      throw new Error('Invalid response format from OpenAI API');
    }
    
    // Map AI responses to MatchResult format
    const matches: MatchResult[] = matchesData.matches.map((match: any) => {
      // Find the corresponding opportunity
      const opportunity = opportunities.find(opp => opp.noticeId === match.noticeId);
      
      // Skip if opportunity not found
      if (!opportunity) {
        console.warn(`Opportunity with noticeId ${match.noticeId} not found`);
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
    }).filter(Boolean) as MatchResult[];
    
    // Sort matches by score (descending) and limit
    const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
    
    // Return in expected format
    return {
      success: true,
      matchCount: sortedMatches.length,
      matches: sortedMatches
    };
  } catch (error) {
    console.error("Error in AI matching:", error);
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
  opportunities: MatchOpportunity[]
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
Posted Date: ${new Date(opp.postedDate).toISOString().split('T')[0]}
Response Deadline: ${new Date(opp.responseDeadline).toISOString().split('T')[0]}
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

// Format date strings
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format currency amounts
export const formatCurrency = (amount?: number): string => {
  if (!amount) return "Not specified";
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get confidence level color
export const getConfidenceLevelColor = (level: string): string => {
  switch (level) {
    case "high":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "low":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};
