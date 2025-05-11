/**
 * Example client integration with the SAM.gov API microservice
 * 
 * This example shows how to:
 * 1. Submit a form to the matching API
 * 2. Get matching opportunities
 * 3. Display the results
 */

// Example using fetch API
async function findMatchingOpportunities(formData: any) {
  try {
    const response = await fetch('http://localhost:3002/api/matching', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'your-api-key-here'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Unknown error');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error finding matching opportunities:', error);
    throw error;
  }
}

// Example using axios
// import axios from 'axios';
// 
// async function findMatchingOpportunities(formData: any) {
//   try {
//     const response = await axios.post('http://localhost:3002/api/matching', formData, {
//       headers: {
//         'x-api-key': 'your-api-key-here'
//       }
//     });
//     
//     return response.data.data;
//   } catch (error) {
//     console.error('Error finding matching opportunities:', error);
//     throw error;
//   }
// }

// Example usage
async function handleFormSubmission(formData: any) {
  try {
    // Find matching opportunities
    const matches = await findMatchingOpportunities(formData);
    
    console.log(`Found ${matches.length} matching opportunities:`);
    
    // Display matches
    matches.forEach((match: any, index: number) => {
      const { opportunity, score, matchDetails } = match;
      
      console.log(`\nMatch #${index + 1}: ${opportunity.title}`);
      console.log(`Agency: ${opportunity.agency}`);
      console.log(`Match Score: ${Math.round(score * 100)}%`);
      console.log(`Tech Focus Match: ${Math.round(matchDetails.techFocusMatch * 100)}%`);
      console.log(`Stage Match: ${Math.round(matchDetails.stageMatch * 100)}%`);
      console.log(`Timeline Match: ${Math.round(matchDetails.timelineMatch * 100)}%`);
      console.log(`Deadline: ${new Date(opportunity.responseDeadline).toLocaleDateString()}`);
      console.log(`URL: ${opportunity.url}`);
    });
    
    return matches;
  } catch (error) {
    console.error('Error handling form submission:', error);
    throw error;
  }
}

// Example form data
const exampleFormData = {
  company: {
    name: "Orbital Dynamics",
    description: "We develop advanced satellite propulsion systems",
    techCategory: ["Satellites", "Propulsion", "Materials"],
    stage: "Series A",
    teamSize: "25",
    foundedYear: "2020",
    website: "https://orbitaldynamics.example.com",
    patents: "Multiple patents on ion propulsion technology",
    email: "contact@orbitaldynamics.example.com"
  },
  project: {
    title: "Next-Gen Ion Propulsion System",
    description: "Development of a high-efficiency ion propulsion system for small satellites",
    techSpecs: "Specific impulse: 3000s, Thrust: 5mN, Power: 200W",
    budget: "$2M - $5M",
    timeline: "18-24 months",
    interests: ["NASA", "Space Force", "DARPA"]
  }
};

// Run the example
handleFormSubmission(exampleFormData)
  .then(() => console.log('\nExample completed successfully'))
  .catch(error => console.error('\nExample failed:', error));

// React hook example
// 
// import { useState } from 'react';
// 
// export function useMatchingService() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [matches, setMatches] = useState<any[]>([]);
// 
//   const findMatches = async (formData: any) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       
//       const matchResults = await findMatchingOpportunities(formData);
//       setMatches(matchResults);
//       
//       return matchResults;
//     } catch (err: any) {
//       setError(err);
//       return [];
//     } finally {
//       setIsLoading(false);
//     }
//   };
// 
//   return { findMatches, matches, isLoading, error };
// }
