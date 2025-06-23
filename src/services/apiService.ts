/**
 * API Service
 * 
 * This service handles API calls to our backend server on Heroku,
 * which securely manages Baserow data access and matching algorithms.
 */

import type { FormData } from "@/types/form";
import { getApiBaseUrl, getBackendApiKey } from "@/utils/envConfig";
import type { MatchOpportunity, MatchResponse } from "./matchingService";

// Base URL for API requests
const API_BASE_URL = getApiBaseUrl();

/**
 * Fetches opportunities from the backend API
 * @param page Optional page number for pagination
 * @param fetchAll Whether to fetch all pages
 * @returns Promise that resolves to an array of opportunities
 */
export async function fetchOpportunities(
  page: number = 1,
  fetchAll: boolean = false
): Promise<MatchOpportunity[]> {
  try {
    console.log(`Fetching opportunities from API (page ${page}, fetchAll: ${fetchAll})...`);
    
    // Construct the API URL with query parameters
    const url = `${API_BASE_URL}/api/opportunities?page=${page}&fetchAll=${fetchAll}`;
    
    // Make the request to the API
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": getBackendApiKey()
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.success || !data.opportunities || !Array.isArray(data.opportunities)) {
      console.warn("Invalid or empty response from API");
      return [];
    }
    
    console.log(`Retrieved ${data.opportunities.length} opportunities from API`);
    
    return data.opportunities;
    
  } catch (error) {
    console.error("Error fetching opportunities from API:", error);
    return [];
  }
}

/**
 * Submits form data to the backend matching API
 * @param formData Form data with company and project information
 * @returns Promise with match results
 */
export async function submitMatch(formData: FormData): Promise<MatchResponse> {
  try {
    console.log("Submitting match request to API:", formData);
    
    // Prepare normalized form data
    const normalizedFormData = {
      ...formData,
      company: {
        ...formData.company,
        techCategory: Array.isArray(formData.company.techCategory) ? formData.company.techCategory : [],
      },
      project: {
        ...formData.project,
        categoryOfFundingActivity: Array.isArray(formData.project.categoryOfFundingActivity) ? 
          formData.project.categoryOfFundingActivity : [],
      }
    };
    
    // Make the request to the API
    const response = await fetch(`${API_BASE_URL}/api/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': getBackendApiKey()
      },
      body: JSON.stringify(normalizedFormData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);
      throw new Error(`API match error: ${response.status}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Check if we have valid data
    if (!data.success || !data.matches || !Array.isArray(data.matches)) {
      console.warn("Invalid or empty response from match API");
      throw new Error('Invalid response from match API');
    }
    
    console.log(`Received ${data.matches.length} matches from API`);
    
    // Return the match response
    return {
      success: true,
      matchCount: data.matches.length,
      matches: data.matches
    };
    
  } catch (error: any) {
    console.error("Error in API matching:", error);
    throw error;
  }
}
