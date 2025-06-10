import type { FormData } from "@/types/form";
import { getApiBaseUrl, getAIModel } from "@/utils/envConfig";

// Maximum number of opportunities to display
const MAX_RESULTS = 3;

// Base URL for API requests
const API_BASE_URL = getApiBaseUrl();

// Get AI model from environment variables for display purposes only
const AI_MODEL = getAIModel();

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
 * Get demo matching opportunities for development and fallback
 * @param formData Form data with company and project information
 * @returns Promise with match results
 */
const getDemoMatchingOpportunities = async (formData: FormData): Promise<MatchResponse> => {
  console.log("Using demo data for matching opportunities");
  
  // Get opportunities from our demo data
  const opportunities = createDemoOpportunities();
  console.log(`Processing ${opportunities.length} opportunities`);
  
  // Generate tailored matches based on the form data
  const matches = opportunities.map(opportunity => {
    // Calculate match scores based on form data and opportunity details
    let techFocusScore = 0.5;
    let stageScore = 0.5;
    let timelineScore = 0.5;
    let budgetScore = 0.5;
    let keywordScore = 0.5;
    
    // Simple keyword matching (this would be more sophisticated with real AI)
    const keywords = ["space", "satellite", "propulsion", "technology", "innovation"];
    if (formData.company.techCategory.some(cat => 
        opportunity.techFocus.includes(cat))) {
      techFocusScore = 0.8 + Math.random() * 0.2;
    }
    
    // Stage matching
    if (opportunity.eligibleStages.includes(formData.company.stage) || 
        opportunity.eligibleStages.includes("Any")) {
      stageScore = 0.7 + Math.random() * 0.3;
    }
    
    // Make the score with appropriate weights
    const totalScore = (
      techFocusScore * 0.35 + 
      stageScore * 0.25 + 
      timelineScore * 0.15 + 
      budgetScore * 0.15 + 
      keywordScore * 0.10
    );
    
    // Create a match result
    return {
      opportunity,
      score: Math.min(0.99, Math.max(0.4, totalScore)), // Ensure score is between 0.4 and 0.99
      confidenceLevel: determineConfidenceLevel(totalScore),
      matchDetails: {
        techFocusMatch: techFocusScore,
        stageMatch: stageScore,
        timelineMatch: timelineScore,
        budgetMatch: budgetScore,
        keywordMatch: keywordScore,
        matchedKeywords: keywords.slice(0, 2 + Math.floor(Math.random() * 3)), // 2-4 keywords
        aiRecommendation: `This opportunity from ${opportunity.agency} aligns with ${formData.company.name}'s focus areas${formData.company.techCategory.length ? ' in ' + formData.company.techCategory.slice(0, 2).join(', ') : ''}. The ${opportunity.title} project seeks innovations that could leverage your company's expertise${formData.company.stage ? ' at its current ' + formData.company.stage + ' stage' : ''}.`
      }
    };
  });
  
  // Sort matches by score (descending) and limit
  const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
  
  // Add a small delay to simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return in expected format
  return {
    success: true,
    matchCount: sortedMatches.length,
    matches: sortedMatches
  };
};

/**
 * Get matching opportunities by calling the backend API
 * @param formData Form data with company and project information
 * @returns Promise with match results
 */
export const getMatchingOpportunities = async (formData: FormData): Promise<MatchResponse> => {
  try {
    console.log("Starting AI matching process with:", formData);
    
    // In a development environment, use the demo data
    /*if (process.env.NODE_ENV === 'development' && !process.env.USE_REAL_API) {
      return getDemoMatchingOpportunities(formData);
    }*/
    
    // Debug API request details
    console.log("API URL:", `https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/matching`);
    console.log("API Key present:", import.meta.env.VITE_AERO_AI_BACKEND_API_KEY ? "Yes" : "No");
    
    // Prepare the data format - ensure all required fields are present
    const requestData = {
      ...formData,
      // Ensure required arrays are arrays even if empty
      company: {
        ...formData.company,
        techCategory: Array.isArray(formData.company.techCategory) ? formData.company.techCategory : [],
      },
      project: {
        ...formData.project,
        interests: Array.isArray(formData.project.interests) ? formData.project.interests : [],
      }
    };
    
    console.log("Formatted request payload:", JSON.stringify(requestData, null, 2));
    
    // Check if we're in development mode and should use fallback data
    /*if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_USE_REAL_API) {
      console.log("Development mode and VITE_USE_REAL_API not set, using demo data");
      return getDemoMatchingOpportunities(formData);
    }*/
    
    // Fall back to demo data if API key is missing
    const apiKey = import.meta.env.VITE_AERO_AI_BACKEND_API_KEY;
    /*if (!apiKey) {
      console.warn("API key missing, falling back to demo data");
      return getDemoMatchingOpportunities(formData);
    }*/
    
    // Call the backend API to get matching opportunities using a CORS proxy
    const corsProxy = 'https://corsproxy.io/?';
    const apiUrl = `${corsProxy}https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/matching`;
    console.log(`Making API request to ${apiUrl}`);
    
    // First try with our standard structure
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify(requestData)
    });
  
    // Log response status
    console.log(`API response status: ${response.status}`);
    
    // Get the response text first to check if it's JSON or HTML
    const responseText = await response.text();
    console.log("Response preview:", responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""));
  
    // Check if the response is HTML (which would indicate an error)
    if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
      console.error("Received HTML response instead of JSON:", responseText.substring(0, 200) + "...");
      throw new Error(`Server returned HTML instead of JSON. Check API URL and server status.`);
    }
    
    // Parse the response as JSON if it's not HTML
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("Parsed response data:", data);
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", responseText);
      throw new Error(`Invalid JSON response from server: ${parseError.message}`);
    }
    
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }
    
    // Transform the backend response to match our frontend format
    const matches = data.data.map((match: any) => ({
      opportunity: match.opportunity,
      score: match.score,
      confidenceLevel: determineConfidenceLevel(match.score),
      matchDetails: {
        techFocusMatch: match.matchDetails?.techFocusMatch || 0,
        stageMatch: match.matchDetails?.stageMatch || 0,
        timelineMatch: match.matchDetails?.timelineMatch || 0,
        budgetMatch: match.matchDetails?.budgetMatch || 0,
        keywordMatch: match.matchDetails?.keywordMatch || 0,
        matchedKeywords: match.matchDetails?.matchedKeywords || [],
        aiRecommendation: match.explanation || match.matchDetails?.aiRecommendation
      }
    }));
    
    // Return in expected format
    return {
      success: true,
      matchCount: matches.length,
      matches: matches.slice(0, MAX_RESULTS) // Limit to max results
    };
  } catch (error: any) {
    console.error("Error in AI matching:", error);
    
    // Extract more details from the error if available
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    }
    
    // If it's a 400 Bad Request, log more specific information
    if (error.message && error.message.includes('400')) {
      console.error("400 Bad Request detected. This typically means the request format is incorrect.");
      console.error("Check that all required fields are present and properly formatted.");
    }
    
    // If API call fails, try again with a simpler payload format
    console.log("First API attempt failed, trying alternate payload format");
    
    // Create a simplified payload with only the required fields
    const simplifiedPayload = {
      company: {
        name: formData.company.name || "Test Company",
        description: formData.company.description || "A company description",
        techCategory: Array.isArray(formData.company.techCategory) ? 
          formData.company.techCategory : ["Space Technology"],
        stage: formData.company.stage || "Early Stage",
        email: formData.company.email || "test@example.com"
      },
      project: {
        title: formData.project.title || "Test Project",
        description: formData.project.description || "A project description",
        interests: Array.isArray(formData.project.interests) ? 
          formData.project.interests : ["Space"]
      }
    };
    
    console.log("Trying with simplified payload:", simplifiedPayload);
    
    try {
      // Use CORS proxy for second attempt as well
      const corsProxy = 'https://corsproxy.io/?';
      const apiUrl = `${corsProxy}https://aero-ai-backend-b4a2e5c4d981.herokuapp.com/api/matching`;
      const simpleResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_AERO_AI_BACKEND_API_KEY || ''
        },
        body: JSON.stringify(simplifiedPayload)
      });
      
      console.log(`Simplified API response status: ${simpleResponse.status}`);
      
      if (simpleResponse.ok) {
        const data = await simpleResponse.json();
        
        // Transform the backend response to match our frontend format
        const matches = data.data.map((match: any) => ({
          opportunity: match.opportunity,
          score: match.score,
          confidenceLevel: determineConfidenceLevel(match.score),
          matchDetails: {
            techFocusMatch: match.matchDetails?.techFocusMatch || 0,
            stageMatch: match.matchDetails?.stageMatch || 0,
            timelineMatch: match.matchDetails?.timelineMatch || 0,
            budgetMatch: match.matchDetails?.budgetMatch || 0,
            keywordMatch: match.matchDetails?.keywordMatch || 0,
            matchedKeywords: match.matchDetails?.matchedKeywords || [],
            aiRecommendation: match.explanation || match.matchDetails?.aiRecommendation
          }
        }));
        
        return {
          success: true,
          matchCount: matches.length,
          matches: matches.slice(0, MAX_RESULTS)
        };
      }
    } catch (fallbackError) {
      console.error("Simplified payload attempt also failed:", fallbackError);
    }
    
    // If all API calls fail, throw the error - no more fallback to demo data
    console.error("All API attempts failed");
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
