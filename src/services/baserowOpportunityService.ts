/**
 * Baserow Opportunity Service
 * 
 * This service connects to Baserow to fetch government opportunities
 * and converts them to the format expected by our matching system.
 */

import type { MatchOpportunity } from "./matchingService";
import { getBackendApiKey } from "@/utils/envConfig";

// Baserow API details from environment variables
const BASEROW_API_URL = import.meta.env.VITE_BASEROW_API_URL;
const BASEROW_API_KEY = import.meta.env.VITE_BASEROW_API_KEY;
const BASEROW_TABLE_ID = import.meta.env.VITE_BASEROW_TABLE_ID;

// Interface for raw Baserow opportunity data
interface BaserowOpportunity {
  id: number;
  OpportunityID: string;
  OpportunityTitle: string;
  OpportunityNumber: string;
  OpportunityCategory: string;
  FundingInstrumentType: string;
  CategoryOfFundingActivity: string;
  AgencyCode: string;
  AgencyName: string;
  Description: string;
  PostDate: string;
  CloseDate: string;
  LastUpdatedDate: string;
  AwardCeiling: number;
  AwardFloor: number;
  EstimatedTotalProgramFunding: number;
  ExpectedNumberOfAwards: number;
  AdditionalInformationURL: string;
  active: boolean;
  source: string;
}

/**
 * Fetches government opportunities from Baserow
 * @returns Promise that resolves to an array of opportunities
 */
export async function getBaserowOpportunities(): Promise<MatchOpportunity[]> {
  try {
    console.log("Fetching opportunities from Baserow...");
    
    // Construct the Baserow API URL
    const url = `${BASEROW_API_URL}/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true`;
    
    // Make the request to the Baserow API
    const response = await fetch(url, {
      headers: {
        "Authorization": `Token ${BASEROW_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": getBackendApiKey()
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Baserow API error:", response.status, errorText);
      throw new Error(`Baserow API error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if we have results
    if (!data.results || !Array.isArray(data.results)) {
      console.warn("Invalid or empty response from Baserow");
      return [];
    }
    
    console.log(`Retrieved ${data.results.length} opportunities from Baserow`);
    
    // Map Baserow data to MatchOpportunity format
    const opportunities: MatchOpportunity[] = data.results.map((item: BaserowOpportunity) => {
      // Extract tech focus categories
      const techFocus = [
        item.OpportunityCategory,
        item.CategoryOfFundingActivity
      ].filter(Boolean);
      
      // Create a duration string based on post and close dates
      let timeline = "";
      if (item.PostDate && item.CloseDate) {
        // Try to calculate duration in months
        try {
          const postDate = new Date(item.PostDate);
          const closeDate = new Date(item.CloseDate);
          const diffTime = Math.abs(closeDate.getTime() - postDate.getTime());
          const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
          
          if (diffMonths <= 6) {
            timeline = "0-6 months";
          } else if (diffMonths <= 12) {
            timeline = "6-12 months";
          } else if (diffMonths <= 18) {
            timeline = "12-18 months";
          } else if (diffMonths <= 24) {
            timeline = "18-24 months";
          } else if (diffMonths <= 36) {
            timeline = "24-36 months";
          } else {
            timeline = "36+ months";
          }
        } catch (e) {
          timeline = `${item.PostDate} - ${item.CloseDate}`;
        }
      }
      
      // Set eligible stages based on funding type
      let eligibleStages: string[] = ["Any"];
      if (item.FundingInstrumentType?.includes("SBIR") || 
          item.FundingInstrumentType?.includes("STTR")) {
        eligibleStages = ["Pre-seed", "Seed", "Early Stage", "Small Business"];
      }
      
      // Use the higher of AwardCeiling or EstimatedTotalProgramFunding
      const awardAmount = Math.max(
        item.AwardCeiling || 0,
        item.EstimatedTotalProgramFunding || 0
      );
      
      return {
        noticeId: item.OpportunityID || item.OpportunityNumber || `baserow-${item.id}`,
        title: item.OpportunityTitle || "Untitled Opportunity",
        agency: item.AgencyName || "Unknown Agency",
        description: item.Description || "",
        postedDate: item.PostDate || new Date().toISOString(),
        responseDeadline: item.CloseDate || new Date().toISOString(),
        archiveDate: item.LastUpdatedDate || (() => {
          const deadline = item.CloseDate ? new Date(item.CloseDate) : new Date();
          const archive = new Date(deadline);
          archive.setDate(archive.getDate() + 30); // Add 30 days to deadline date
          return archive.toISOString();
        })(),
        awardAmount: awardAmount > 0 ? awardAmount : undefined,
        naicsCode: "",
        setAside: "",
        placeOfPerformance: "",
        techFocus,
        eligibleStages,
        timeline,
        url: item.AdditionalInformationURL || "",
        pointOfContact: {}
      };
    });
    
    return opportunities.filter(opp => opp.title && opp.description);
    
  } catch (error) {
    console.error("Error fetching opportunities from Baserow:", error);
    return [];
  }
}
