// Final form.ts - Combines your existing structure with comprehensive matching service requirements

export type CompanyData = {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];               // Will align with OpportunityCategory
  fundingInstrumentTypes: string[];     // Matches FundingInstrumentType
  eligibleAgencyCodes?: string[];       // Matches AgencyCode - for agency preferences
  preferredDepartments?: string[];      // NEW: For department-level matching
  keywords?: string[];                  // Keywords for matching (kept for backward compatibility)
  city?: string;                        // City location (kept flat for backward compatibility)
  state?: string;                       // State location (kept flat for backward compatibility)
  location?: {                          // NEW: Nested location structure for comprehensive matching
    city: string;
    state: string;
  };
  stage: string;
  teamSize: string;
  foundedYear: string;
  email: string;
};

export type ProjectData = {
  title: string;
  description: string;
  techSpecs: string;
  keywords?: string[];                  // Keywords for matching (kept for backward compatibility)
  budget: {                             // ENHANCED: More structured for matching
    min: number;                        // Matches AwardFloor
    max: number;                        // Matches AwardCeiling
    currency: string;                   // For display purposes
  };
  timeline: {                           // ENHANCED: More structured for matching
    deadline?: string;                  // Changed from startDate to deadline
    duration: string;                   // For matching with duration between PostDate and CloseDate
  };
  categoryOfFundingActivity?: string[]; // Made optional as we're removing from UI
  interests?: string[];                 // NEW: Areas of interest for government contracts
};

export type FormData = {
  company: CompanyData;
  project: ProjectData;
  keywords?: string[];                  // NEW: Root-level keywords for comprehensive matching
};

// Additional types for backend compatibility and matching results
export interface MatchResult {
  opportunity: {
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
    type?: string;
    state?: string;
  };
  score: number;
  matchPercentage: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  matchDetails: {
    techFocusMatch: number;
    stageMatch: number;
    timelineMatch: number;
    budgetMatch: number;
    locationMatch?: number;
    departmentMatch?: number;
    matchedKeywords: string[];
    aiRecommendation?: string;
  };
}

// Utility type for transforming form data to backend format
export type BackendFormData = {
  company: {
    name: string;
    description: string;
    website?: string;
    patents?: string;
    techCategory: string[];
    eligibleAgencyCodes?: string[];
    preferredDepartments?: string[];
    stage: string;
    teamSize: string;
    foundedYear: string;
    email: string;
    location: {
      city: string;
      state: string;
    };
  };
  project: {
    title: string;
    description: string;
    techSpecs: string;
    budget: string; // Transformed to string format for backend
    timeline: string; // Flattened timeline for backend
    interests?: string[];
    deadline?: string;
  };
  keywords: string[]; // Root-level keywords array
};
