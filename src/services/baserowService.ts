// Baserow API service for handling submissions via the backend API
import { getApiBaseUrl } from "@/utils/envConfig";

// Base URL for API requests
const API_BASE_URL = getApiBaseUrl();

// Field mapping between our form fields and Baserow field IDs
// This is now only used for frontend field mapping and validation
export const FIELD_MAPPING = {
  companyName: "field_4128859",
  companyDescription: "field_4128860",
  techCategory: "field_4128861",
  stage: "field_4128862",
  teamSize: "field_4128863",
  foundedYear: "field_4128868",
  website: "field_4128869",
  patents: "field_4128870",
  email: "field_4128871",
  projectTitle: "field_4128872",
  projectDescription: "field_4128873",
  techSpecs: "field_4128874",
  budget: "field_4128875",
  timeline: "field_4128876",
  interests: "field_4128877"
};

// Submit data to Baserow via the backend API
export const submitToBaserow = async (data: any) => {
  console.log("Sending data to Baserow via backend API");

  try {
    const response = await fetch(`${API_BASE_URL}/api/baserow/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("Backend API response:", responseData);

    if (!response.ok) {
      throw new Error(responseData.error || `API Error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error("Error submitting to Baserow via backend API:", error);
    throw error;
  }
};
