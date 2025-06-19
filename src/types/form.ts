
export type CompanyData = {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];               // Will align with OpportunityCategory
  fundingInstrumentTypes: string[];     // NEW: Matches FundingInstrumentType
  eligibleAgencyCodes?: string[];       // NEW: Matches AgencyCode
  city?: string;                        // NEW: City location
  state?: string;                       // NEW: State location
  stage: string;
  teamSize: string;
  foundedYear: string;
  email: string;
};

export type ProjectData = {
  title: string;
  description: string;
  techSpecs: string;
  keywords?: string[];                  // NEW: Keywords for matching
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
};

export type FormData = {
  company: CompanyData;
  project: ProjectData;
};
