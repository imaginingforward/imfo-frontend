/**
 * Enhanced Matching Client Example
 * 
 * This example demonstrates how to use the Enhanced Matching API
 * to match a company profile with relevant opportunities.
 */

import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3002/api';
const API_KEY = process.env.API_KEY || 'your-api-key';

// Sample company profile
const sampleCompanyProfile = {
  company: {
    name: "Orbital Systems",
    description: "Orbital Systems develops advanced propulsion systems for small satellites and cubesats, focusing on high-efficiency electric propulsion technologies that extend satellite lifespan and capabilities.",
    website: "https://www.orbitalsystems-example.com",
    patents: "US10925409B2, US11027929B2",
    techCategory: [
      "Propulsion Systems",
      "Small Satellites",
      "Electric Propulsion",
      "Space Hardware"
    ],
    stage: "Growth Stage",
    teamSize: "25-50",
    foundedYear: "2019",
    email: "contact@orbitalsystems-example.com"
  },
  project: {
    title: "Next-Gen Ion Thruster for CubeSats",
    description: "Development of a miniaturized ion thruster system specifically designed for the constraints and power limitations of CubeSat platforms, enabling extended mission lifespans and complex orbital maneuvers.",
    techSpecs: "Specific impulse >1200s, thrust 0.5-2mN, power consumption <20W, compatible with 3U CubeSat form factor, propellant: xenon or iodine, thrust vectoring capabilities.",
    budget: "$500,000 - $1,500,000",
    timeline: "12-18 months",
    interests: [
      "Space Propulsion",
      "Miniaturization",
      "CubeSats",
      "Ion Thrusters",
      "Low Power Systems"
    ]
  }
};

/**
 * Get matching statistics
 */
const getMatchingStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/matching/enhanced/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      }
    });
    
    console.log('=== Matching Algorithm Configuration ===');
    console.log(`Algorithm Version: ${response.data.algorithmVersion}`);
    console.log('Weights:');
    for (const [factor, weight] of Object.entries(response.data.weights)) {
      console.log(`  - ${factor}: ${weight}`);
    }
    console.log('Confidence Levels:');
    for (const [level, threshold] of Object.entries(response.data.confidenceLevels)) {
      console.log(`  - ${level}: ${threshold}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting matching statistics:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Find matching opportunities
 */
const findMatchingOpportunities = async (profile: any, limit: number = 5) => {
  try {
    const response = await axios.post(
      `${API_URL}/matching/enhanced`,
      profile,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        params: { limit }
      }
    );
    
    console.log(`\n=== Found ${response.data.matchCount} Matches ===`);
    
    response.data.matches.forEach((match: any, index: number) => {
      const opportunity = match.opportunity;
      
      console.log(`\n#${index + 1}: ${opportunity.title} (${match.score.toFixed(2)} - ${match.confidenceLevel} confidence)`);
      console.log(`Agency: ${opportunity.agency}`);
      console.log(`Notice ID: ${opportunity.noticeId}`);
      console.log(`Award Amount: $${opportunity.awardAmount?.toLocaleString() || 'N/A'}`);
      console.log(`Deadline: ${new Date(opportunity.responseDeadline).toLocaleDateString()}`);
      console.log(`Tech Focus: ${opportunity.techFocus.join(', ')}`);
      console.log('Match Details:');
      Object.entries(match.matchDetails).forEach(([factor, score]) => {
        if (factor !== 'matchedKeywords') {
          console.log(`  - ${factor}: ${(score as number).toFixed(2)}`);
        }
      });
      
      if (match.matchDetails.matchedKeywords?.length) {
        console.log(`  - Matched Keywords: ${match.matchDetails.matchedKeywords.join(', ')}`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error finding matching opportunities:', error.response?.data || error.message);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    console.log('Starting Enhanced Matching Client Test\n');
    
    // Get matching stats
    await getMatchingStats();
    
    // Find matching opportunities
    await findMatchingOpportunities(sampleCompanyProfile);
    
    console.log('\nTest completed successfully');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the main function
if (require.main === module) {
  main();
}
