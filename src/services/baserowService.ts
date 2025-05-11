// Baserow API service for handling submissions

// Baserow API endpoint for submissions
const BASEROW_TABLE_ID = "519889";
const BASEROW_API_URL = `https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/`;
// Using the API token provided earlier
const BASEROW_API_TOKEN = "V8TT0pqPOKhwEcYzSysD0COL1oScagiG";

// Field mapping between our form fields and Baserow field IDs
// This makes the code more maintainable by mapping descriptive names to Baserow IDs
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

// Format the form data for Baserow submission
export const formatBaserowData = (data: any) => {
  return {
    [FIELD_MAPPING.companyName]: data.company.name,
    [FIELD_MAPPING.companyDescription]: data.company.description,
    [FIELD_MAPPING.techCategory]: data.company.techCategory.join(", "),
    [FIELD_MAPPING.stage]: data.company.stage,
    [FIELD_MAPPING.teamSize]: data.company.teamSize,
    [FIELD_MAPPING.foundedYear]: data.company.foundedYear,
    [FIELD_MAPPING.website]: data.company.website || "",
    [FIELD_MAPPING.patents]: data.company.patents || "",
    [FIELD_MAPPING.email]: data.company.email,
    [FIELD_MAPPING.projectTitle]: data.project.title,
    [FIELD_MAPPING.projectDescription]: data.project.description,
    [FIELD_MAPPING.techSpecs]: data.project.techSpecs,
    [FIELD_MAPPING.budget]: data.project.budget,
    [FIELD_MAPPING.timeline]: data.project.timeline,
    [FIELD_MAPPING.interests]: data.project.interests.join(", ")
  };
};

// Submit data to Baserow
export const submitToBaserow = async (data: any) => {
  const baserowData = formatBaserowData(data);
  console.log("Sending data to Baserow with field IDs:", baserowData);

  const response = await fetch(BASEROW_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${BASEROW_API_TOKEN}`
    },
    body: JSON.stringify(baserowData),
  });

  const responseData = await response.json();
  console.log("Baserow API response:", responseData);

  if (!response.ok) {
    throw new Error(responseData.error || `API Error: ${response.status}`);
  }

  return responseData;
};