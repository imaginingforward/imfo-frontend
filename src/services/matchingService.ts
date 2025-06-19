import type { FormData } from "@/types/form";

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
