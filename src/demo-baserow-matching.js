/**
 * Demo script to demonstrate Baserow opportunity matching
 * 
 * This script shows the complete flow of:
 * 1. Fetching opportunities from Baserow
 * 2. Using mock company/project data to perform matching
 * 3. Displaying the match results
 * 
 * To run: node src/demo-baserow-matching.js
 */

import { getBaserowOpportunities } from "./services/baserowOpportunityService.js";

// Sample company and project data for matching
const sampleFormData = {
  company: {
    name: "Aero Tech Solutions",
    description: "We develop advanced propulsion systems for small satellites and CubeSats with a focus on green propellant alternatives and efficient miniaturized solutions.",
    techCategory: ["Science and Technology", "Transportation"],
    fundingInstrumentTypes: ["SBIR", "STTR"],
    eligibleAgencyCodes: ["NASA", "DOE"],
    stage: "Series A",
    teamSize: "1-5",
    foundedYear: "2020",
    email: "test@example.com",
    website: "https://www.aerotechsolutions.example.com"
  },
  project: {
    title: "Eco-friendly Microthrusters for CubeSats",
    description: "Development of efficient, eco-friendly microthrusters that use non-toxic propellants for small satellites and CubeSats. Our innovative design minimizes weight while maximizing delta-v capabilities.",
    techSpecs: "- Thrust: 1-5 mN\n- Specific Impulse: 250s\n- Total Impulse: 50-500 Ns\n- Mass: < 200g\n- Power Consumption: < 10W peak, 2W average\n- Compatible with CubeSat form factors",
    budget: {
      min: 250000,
      max: 750000,
      currency: "USD"
    },
    timeline: {
      duration: "6-12 months",
      startDate: "2025-08-01"
    },
    categoryOfFundingActivity: ["Science and Technology and other Research and Development"]
  }
};

// Simple scoring function to demonstrate matching algorithm
function scoreOpportunity(opportunity, formData) {
  // Initial score
  let score = 0;
  let matchDetails = {
    techFocusMatch: 0,
    stageMatch: 0,
    timelineMatch: 0,
    budgetMatch: 0,
    keywordMatch: 0,
    matchedKeywords: []
  };
  
  // Tech focus matching (35% weight)
  const techCategory = formData.company.techCategory[0]?.toLowerCase() || '';
  const oppCategory = opportunity.OpportunityCategory?.toLowerCase() || '';
  if (techCategory && oppCategory && (techCategory.includes(oppCategory) || oppCategory.includes(techCategory))) {
    matchDetails.techFocusMatch = 0.9;
  } else {
    matchDetails.techFocusMatch = 0.3;
  }
  
  // Funding instrument matching (part of tech focus)
  const fundingType = opportunity.FundingInstrumentType || '';
  if (fundingType && formData.company.fundingInstrumentTypes.some(type => 
    fundingType.toLowerCase().includes(type.toLowerCase()))) {
    matchDetails.techFocusMatch = Math.min(1.0, matchDetails.techFocusMatch + 0.3);
  }
  
  // Agency matching (part of tech focus)
  const agencyCode = opportunity.AgencyCode || '';
  if (agencyCode && formData.company.eligibleAgencyCodes.some(code => 
    agencyCode.toLowerCase().includes(code.toLowerCase()))) {
    matchDetails.techFocusMatch = Math.min(1.0, matchDetails.techFocusMatch + 0.2);
  }
  
  // Stage matching (25% weight) - simplified
  matchDetails.stageMatch = 0.7; // Assume moderate match
  
  // Timeline matching (15% weight) - simplified
  matchDetails.timelineMatch = 0.6; // Assume moderate match
  
  // Budget matching (15% weight)
  const awardCeiling = opportunity.AwardCeiling || opportunity.EstimatedTotalProgramFunding;
  if (awardCeiling) {
    const numericAward = parseFloat(awardCeiling);
    if (!isNaN(numericAward) && 
        numericAward >= formData.project.budget.min && 
        numericAward <= formData.project.budget.max) {
      matchDetails.budgetMatch = 0.9; // Very good match
    } else {
      // If outside budget range but close
      const closestBoundary = numericAward < formData.project.budget.min ? 
                             formData.project.budget.min : formData.project.budget.max;
      const distance = Math.abs(numericAward - closestBoundary);
      const maxDistance = closestBoundary * 0.5; // 50% leeway
      
      if (distance <= maxDistance) {
        matchDetails.budgetMatch = 0.5 - (distance / maxDistance) * 0.5;
      } else {
        matchDetails.budgetMatch = 0.3; // Poor match
      }
    }
  } else {
    matchDetails.budgetMatch = 0.4; // No budget info, assume neutral
  }
  
  // Keyword matching (10% weight)
  const keywords = ["satellite", "cubesat", "propulsion", "green", "eco-friendly", "sustainable", "space"];
  const descLower = opportunity.Description?.toLowerCase() || '';
  const matchedKeywords = keywords.filter(keyword => descLower.includes(keyword.toLowerCase()));
  
  if (matchedKeywords.length > 0) {
    matchDetails.keywordMatch = 0.4 + (matchedKeywords.length / keywords.length) * 0.6;
    matchDetails.matchedKeywords = matchedKeywords;
  } else {
    matchDetails.keywordMatch = 0.3;
  }
  
  // Calculate weighted score
  score = (
    matchDetails.techFocusMatch * 0.35 + 
    matchDetails.stageMatch * 0.25 + 
    matchDetails.timelineMatch * 0.15 + 
    matchDetails.budgetMatch * 0.15 + 
    matchDetails.keywordMatch * 0.10
  );
  
  return {
    score,
    matchDetails,
    confidenceLevel: score >= 0.75 ? 'high' : (score >= 0.5 ? 'medium' : 'low')
  };
}

async function runDemo() {
  console.log("=".repeat(70));
  console.log("Baserow Opportunity Matching Demo");
  console.log("=".repeat(70));
  
  try {
    // Fetch opportunities from Baserow
    console.log("\nFetching opportunities from Baserow...");
    const opportunities = await getBaserowOpportunities();
    
    if (!opportunities || opportunities.length === 0) {
      console.error("No opportunities found in Baserow. Check your API connection.");
      return;
    }
    
    console.log(`Found ${opportunities.length} opportunities in Baserow.`);
    
    // Sample the first 20 opportunities
    const sampled = opportunities.slice(0, 20);
    
    console.log("\nPerforming matching on sample opportunities...");
    console.log("Using the following company/project data:");
    console.log(`Company: ${sampleFormData.company.name}`);
    console.log(`Project: ${sampleFormData.project.title}`);
    console.log(`Tech Categories: ${sampleFormData.company.techCategory.join(", ")}`);
    console.log(`Budget Range: $${sampleFormData.project.budget.min} - $${sampleFormData.project.budget.max}`);
    
    // Score each opportunity
    const matches = sampled.map(opportunity => {
      const matchResult = scoreOpportunity(opportunity, sampleFormData);
      return {
        opportunity,
        score: matchResult.score,
        matchDetails: matchResult.matchDetails,
        confidenceLevel: matchResult.confidenceLevel
      };
    });
    
    // Sort by score descending
    const sortedMatches = matches.sort((a, b) => b.score - a.score);
    
    // Display top 3 matches
    console.log("\nTop 3 Matching Opportunities:\n");
    sortedMatches.slice(0, 3).forEach((match, index) => {
      console.log(`Match #${index + 1} (Score: ${match.score.toFixed(2)} - ${match.confidenceLevel.toUpperCase()})`);
      console.log(`Title: ${match.opportunity.title}`);
      console.log(`Agency: ${match.opportunity.agency}`);
      console.log(`Posted: ${new Date(match.opportunity.postedDate).toLocaleDateString()}`);
      console.log(`Deadline: ${new Date(match.opportunity.responseDeadline).toLocaleDateString()}`);
      console.log(`Award Amount: ${match.opportunity.awardAmount ? '$' + match.opportunity.awardAmount.toLocaleString() : 'Not specified'}`);
      console.log(`Match Breakdown:`);
      console.log(`  Tech Focus: ${(match.matchDetails.techFocusMatch * 100).toFixed(0)}%`);
      console.log(`  Stage: ${(match.matchDetails.stageMatch * 100).toFixed(0)}%`);
      console.log(`  Timeline: ${(match.matchDetails.timelineMatch * 100).toFixed(0)}%`);
      console.log(`  Budget: ${(match.matchDetails.budgetMatch * 100).toFixed(0)}%`);
      console.log(`  Keywords: ${(match.matchDetails.keywordMatch * 100).toFixed(0)}%`);
      if (match.matchDetails.matchedKeywords.length > 0) {
        console.log(`  Matched Keywords: ${match.matchDetails.matchedKeywords.join(", ")}`);
      }
      console.log("-".repeat(50));
    });
    
  } catch (error) {
    console.error("Error running demo:", error);
  }
}

// Run the demo
runDemo();
