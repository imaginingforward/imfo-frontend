
export type CompanyData = {
  name: string;
  description: string;
  website?: string;
  patents?: string;
  techCategory: string[];               // Will align with OpportunityCategory
  fundingInstrumentTypes: string[];     // NEW: Matches FundingInstrumentType
  eligibleAgencyCodes?: string[];       // NEW: Matches AgencyCode
  stage: string;
  teamSize: string;
  foundedYear: string;
  email: string;
};

export type ProjectData = {
  title: string;
  description: string;
  techSpecs: string;
  budget: {                             // ENHANCED: More structured for matching
    min: number;                        // Matches AwardFloor
    max: number;                        // Matches AwardCeiling
    currency: string;                   // For display purposes
  };
  timeline: {                           // ENHANCED: More structured for matching
    startDate?: string;                 // Can be compared with PostDate
    duration: string;                   // For matching with duration between PostDate and CloseDate
  };
  categoryOfFundingActivity: string[];  // RENAMED from interests to match Baserow field
};

export type FormData = {
  company: CompanyData;
  project: ProjectData;
};
