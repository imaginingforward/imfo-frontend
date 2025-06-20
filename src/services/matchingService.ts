import type { FormData } from "@/types/form";
import { getBackendApiKey } from "@/utils/envConfig";

// API URL for the matching API endpoint
const API_URL = "https://aero-matching-backend-5d1bd860f515.herokuapp.com/api/match";


// Maximum number of opportunities to display
const MAX_RESULTS = 5; // Updated to show top 5 matches

// Type for match result with new fields
export interface MatchOpportunity {
  noticeId: string;
  title: string;
  agency: string;
  description: string;
  postedDate: string;
  responseDeadline: string;
  archiveDate: string;
  awardAmount?: number;
  naicsCode?: string;
  setAside?: string;
  placeOfPerformance?: string;
  techFocus: string[];
  eligibleStages: string[];
  timeline: string;
  url?: string;
  // New fields
  type?: string;     // Contract Type
  city?: string;     // City information
  state?: string;    // State information
  pointOfContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface MatchResult {
  opportunity: MatchOpportunity;
  score: number;
  matchPercentage: number; // Added for frontend display
  confidenceLevel: 'high' | 'medium' | 'low';
  matchDetails: {
    techFocusMatch: number;
    stageMatch: number;
    timelineMatch: number;
    budgetMatch: number;
    keywordMatch: number;
    matchedKeywords?: string[];
    aiRecommendation?: string;
  };
}

export interface MatchResponse {
  success: boolean;
  matchCount: number;
  matches: MatchResult[];
}

// Format date strings
export const formatDate = (dateString: string): string => {
  if (!dateString) return "Not specified";
  
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

/**
 * Send company and project data to the matching API to get matching opportunities
 * @param formData The form data containing company and project information
 * @param limit Optional limit for the number of results to return
 * @returns Promise with matching results
 */
export const getMatchingOpportunities = async (formData: FormData, limit: number = MAX_RESULTS): Promise<MatchResponse> => {
  try {
    console.log('Submitting to matching API:', API_URL);
    console.log('Form data being sent to matching API:', formData);
    
    // Transform form data to match the API's expected format
    const transformedData = {
      company: {
        name: formData.company.name,
        description: formData.company.description,
        // Convert single stage to array of stages
        stages: [formData.company.stage],
        // Use tech category as focus
        focus: Array.isArray(formData.company.techCategory) ? formData.company.techCategory : [],
        // Include budget from the project
        budget: formData.project.budget?.max || 0,
        // Add other data the API might use
        email: formData.company.email,
        foundedYear: formData.company.foundedYear,
        teamSize: formData.company.teamSize
      },
      project: {
        description: formData.project.description,
        // Convert timeline object to string
        timeline: formData.project.timeline?.duration || '',
        // Add title and tech specs
        title: formData.project.title,
        techSpecs: formData.project.techSpecs,
        // Add location data
        location: {
          city: formData.company.city || '',
          state: formData.company.state || ''
        },
        // Add keywords
        keywords: formData.project.keywords || []
      }
    };
    
    console.log('Transformed data for API:', transformedData);
    
    // Get API key from environment variable
    const apiKey = getBackendApiKey();
    
    // Make the request to the API with authentication
    const response = await fetch(`${API_URL}?limit=${limit}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin,
        'x-api-key': apiKey, // Include API key for authentication
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(transformedData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      throw new Error(`API match error: ${response.status} - ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.success || !data.matches || !Array.isArray(data.matches)) {
      console.warn("Invalid or empty response from match API");
      throw new Error('Invalid response from match API');
    }
    
    // Transform the API response to match our expected format
    const matches: MatchResult[] = data.matches.map((match: any) => ({
      opportunity: match.opportunity,
      score: match.score || 0,
      matchPercentage: Math.round((match.score || 0) * 100),
      confidenceLevel: match.confidenceLevel || 'medium',
      matchDetails: match.matchDetails || {
        techFocusMatch: 0,
        stageMatch: 0,
        timelineMatch: 0,
        budgetMatch: 0,
        keywordMatch: 0,
      }
    }));
    
    console.log(`Received ${matches.length} matches from API`);
    
    // Return the match response
    return {
      success: true,
      matchCount: matches.length,
      matches: matches
    };
    
  } catch (error: any) {
    console.error("Error in matching API:", error);
    throw error;
  }
};
