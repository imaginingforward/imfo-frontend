import type { FormData } from "@/types/form";

// API endpoints for matching
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";
const ENHANCED_MATCHING_ENDPOINT = `${API_URL}/matching/enhanced`;
const AI_MATCHING_ENDPOINT = `${API_URL}/matching/ai`;

// Default matching endpoint - can be switched between AI and algorithmic matching
const MATCHING_ENDPOINT = AI_MATCHING_ENDPOINT; // Use AI matching by default

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

// Get matching opportunities for form data
export const getMatchingOpportunities = async (formData: FormData): Promise<MatchResponse> => {
  try {
    console.log("Calling matching API with:", formData);
    
    const response = await fetch(MATCHING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Matching API response:", data);

    if (!response.ok) {
      throw new Error(data.error || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Error finding matches:", error);
    throw error;
  }
};

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
