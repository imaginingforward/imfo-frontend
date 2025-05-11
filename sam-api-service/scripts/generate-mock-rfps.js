/**
 * Generate Mock RFP Data for Space Tech Opportunities
 * This script generates realistic mock data for space technology RFPs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tech focus areas for space technology
const techFocusOptions = [
  'Propulsion Systems',
  'Satellite Technology',
  'Launch Vehicles',
  'Space Robotics',
  'Remote Sensing',
  'Materials Science',
  'Space Communications',
  'AI/ML in Space',
  'Earth Observation',
  'Life Support Systems',
  'Space Manufacturing',
  'Spacecraft Design',
  'Orbital Mechanics',
  'Space Energy Systems',
  'Guidance Systems',
  'Radiation Protection',
  'Mars Technology',
  'Lunar Technology',
  'Space Mining',
  'Space Debris Management',
  'Quantum Communications',
  'Deep Space Navigation',
  'Small Satellites',
  'Space Weather',
  'Rocket Engines'
];

// Eligible company stages
const companyStageOptions = [
  'Seed',
  'Early Stage',
  'Growth Stage',
  'Established',
  'Any'
];

// Government agencies
const agencies = [
  'NASA',
  'Department of Defense (DoD)',
  'DARPA',
  'Space Force',
  'FAA Office of Commercial Space',
  'National Science Foundation (NSF)',
  'Department of Energy (DOE)',
  'NOAA',
  'National Reconnaissance Office (NRO)',
  'Air Force Research Laboratory (AFRL)',
  'Naval Research Laboratory (NRL)',
  'Army Space and Missile Defense Command'
];

// NAICS codes relevant to space tech
const naicsCodes = [
  '336414', // Guided Missile and Space Vehicle Manufacturing
  '336415', // Guided Missile and Space Vehicle Propulsion Unit and Parts Manufacturing
  '336419', // Other Guided Missile and Space Vehicle Parts and Auxiliary Equipment Manufacturing
  '517410', // Satellite Telecommunications
  '334220', // Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing
  '541715', // Research and Development in the Physical, Engineering, and Life Sciences
  '541330', // Engineering Services
  '334511', // Search, Detection, Navigation, Guidance, Aeronautical, and Nautical System and Instrument Manufacturing
  '541380', // Testing Laboratories
  '334419', // Other Electronic Component Manufacturing
];

// Set-aside categories
const setAsideOptions = [
  'Small Business',
  'Woman-Owned Small Business',
  'Service-Disabled Veteran-Owned Small Business',
  '8(a) Program',
  'HUBZone',
  'None'
];

// Location options
const locationOptions = [
  'Alabama (Huntsville)',
  'California (Multiple)',
  'Colorado (Denver)',
  'Florida (Kennedy Space Center)',
  'Maryland (Goddard)',
  'Massachusetts (Boston)',
  'New Mexico (White Sands)',
  'Texas (Houston)',
  'Virginia (Langley)',
  'Washington (Seattle)',
  'Washington DC'
];

// Timeline options
const timelineOptions = [
  '3-6 months',
  '6-12 months',
  '1-2 years',
  '2-3 years',
  '3-5 years'
];

/**
 * Generate a random title for a space tech RFP
 */
const generateTitle = () => {
  const titleStarters = [
    'Development of',
    'Research on',
    'Advanced',
    'Innovative',
    'Next-Generation',
    'Prototype',
    'Study for',
    'Design and Implementation of',
    'Improvement of',
    'Integration of'
  ];
  
  const titleTechnologies = [
    'Propulsion System',
    'Satellite Communication',
    'Debris Mitigation Technology',
    'Earth Observation Platform',
    'Mars Mission Component',
    'Lunar Landing System',
    'Spacecraft Navigation',
    'Space Habitat Technology',
    'Launch Vehicle Technology',
    'Reentry Systems',
    'On-Orbit Servicing Technology',
    'Space-Based Manufacturing',
    'Radiation Shielding',
    'Optical Communication',
    'Quantum Encryption for Space',
    'AI-Driven Space Systems',
    'Autonomous Robot for Space Exploration',
    'Space Resource Extraction Technology',
    'Space Weather Monitoring',
    'In-Space Propellant Storage',
    'Space Nuclear Power System',
    'Small Satellite Formation Flying',
    'Materials for Extreme Space Environments',
    'Micro-Gravity Research Platform',
    'Space Logistics System'
  ];
  
  const titleSuffix = [
    'for Space Applications',
    'for Future Missions',
    'for Lunar Operations',
    'for Mars Missions',
    'for Small Satellites',
    'with AI/ML Integration',
    'for Commercial Space',
    'with Enhanced Reliability',
    'for Deep Space Missions',
    'for Space Station Support',
    'with Reduced Mass',
    'for Extended Duration Missions',
    'with Automated Features',
    'for Human Spaceflight',
    'for Space Habitation',
    ''
  ];
  
  const starter = titleStarters[Math.floor(Math.random() * titleStarters.length)];
  const tech = titleTechnologies[Math.floor(Math.random() * titleTechnologies.length)];
  const suffix = titleSuffix[Math.floor(Math.random() * titleSuffix.length)];
  
  return `${starter} ${tech} ${suffix}`.trim();
};

/**
 * Generate a realistic description for a space tech RFP
 */
const generateDescription = (title, techFocus, agency) => {
  const openings = [
    `${agency} is seeking proposals for the ${title.toLowerCase()}. This opportunity aims to address critical challenges in ${techFocus.join(', ')}.`,
    `${agency} invites proposals for innovative solutions related to ${title.toLowerCase()}. Research and development efforts should focus on ${techFocus[0]} technologies.`,
    `The ${agency} announces this funding opportunity for the ${title.toLowerCase()} to advance capabilities in ${techFocus.join(' and ')}.`,
    `${agency} is soliciting proposals for ${title.toLowerCase()} that will support future space missions through advancements in ${techFocus[0]}.`,
    `This ${agency} solicitation seeks innovative approaches to ${title.toLowerCase()} with a particular emphasis on ${techFocus.join(', ')}.`
  ];

  const objectives = [
    `The primary objective is to develop technologies that improve performance, reduce cost, and enhance reliability.`,
    `This program aims to advance the state-of-the-art in these technologies for both government and commercial applications.`,
    `Successful proposals will demonstrate novel approaches that significantly advance beyond current capabilities.`,
    `The goal of this solicitation is to accelerate technology development for future space missions and commercial applications.`,
    `This opportunity supports innovative research to address technical challenges and capability gaps in current systems.`
  ];

  const expectations = [
    `Proposals should demonstrate a clear path to technology demonstration and eventual integration into space systems.`,
    `Applicants should clearly describe the technical approach, expected outcomes, and potential impact on future missions.`,
    `Successful proposals will include a detailed development plan with clear milestones and performance metrics.`,
    `Proposals are expected to address technical feasibility, system integration challenges, and testing methodologies.`,
    `Applicants should highlight innovative aspects of their approach and competitive advantages over existing solutions.`
  ];

  const opening = openings[Math.floor(Math.random() * openings.length)];
  const objective = objectives[Math.floor(Math.random() * objectives.length)];
  const expectation = expectations[Math.floor(Math.random() * expectations.length)];

  return `${opening}\n\n${objective}\n\n${expectation}`;
};

/**
 * Generate a random date within a range
 * @param start Start date
 * @param end End date
 * @returns Random date between start and end
 */
const randomDate = (start, end) => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
};

/**
 * Generate a mock opportunity/RFP
 * @returns Mock opportunity object
 */
const generateMockOpportunity = (index) => {
  // Generate random dates
  const now = new Date();
  const pastDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const futureDate = new Date(now.getFullYear(), now.getMonth() + 6, 1);
  
  // Generate random tech focus (2-4 areas)
  const numTechAreas = Math.floor(Math.random() * 3) + 2; // 2-4 tech areas
  const techFocus = [];
  for (let i = 0; i < numTechAreas; i++) {
    const randomTech = techFocusOptions[Math.floor(Math.random() * techFocusOptions.length)];
    if (!techFocus.includes(randomTech)) {
      techFocus.push(randomTech);
    }
  }
  
  // Generate random company stages (1-3 stages)
  const numStages = Math.floor(Math.random() * 3) + 1; // 1-3 stages
  const eligibleStages = [];
  for (let i = 0; i < numStages; i++) {
    const randomStage = companyStageOptions[Math.floor(Math.random() * (companyStageOptions.length - 1))]; // Exclude "Any"
    if (!eligibleStages.includes(randomStage)) {
      eligibleStages.push(randomStage);
    }
  }
  
  // Add "Any" with 20% probability
  if (Math.random() < 0.2) {
    eligibleStages.push('Any');
  }
  
  // Select an agency
  const agency = agencies[Math.floor(Math.random() * agencies.length)];
  
  // Generate award amount between $50K and $10M
  const minAward = 50000;
  const maxAward = 10000000;
  const awardAmount = Math.floor(Math.random() * (maxAward - minAward + 1) + minAward);
  
  // Generate a random title
  const title = generateTitle();
  
  // Generate a random NAICS code
  const naicsCode = naicsCodes[Math.floor(Math.random() * naicsCodes.length)];
  
  // Generate set-aside
  const setAside = setAsideOptions[Math.floor(Math.random() * setAsideOptions.length)];
  
  // Generate place of performance
  const placeOfPerformance = locationOptions[Math.floor(Math.random() * locationOptions.length)];
  
  // Generate timeline
  const timeline = timelineOptions[Math.floor(Math.random() * timelineOptions.length)];
  
  // Generate posted date and response deadline
  const postedDate = randomDate(pastDate, now);
  const responseDeadline = randomDate(now, futureDate);
  
  // Generate notice ID
  const noticeYear = postedDate.getFullYear().toString().slice(-2);
  const noticeNum = Math.floor(Math.random() * 9000) + 1000;
  const noticeId = `${agency.slice(0, 3).toUpperCase()}-${noticeYear}-${noticeNum}`;
  
  // Generate point of contact
  const firstNames = ['Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jennifer', 'William', 'Lisa'];
  const lastNames = ['Johnson', 'Smith', 'Martinez', 'Brown', 'Davis', 'Wilson', 'Miller', 'Taylor'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const contactName = `${firstName} ${lastName}`;
  const contactEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${agency.split(' ')[0].toLowerCase()}.gov`;
  const contactPhone = `(${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  
  // Generate opportunity URL
  const url = `https://sam.gov/opportunity/${noticeId}`;
  
  // Generate description
  const description = generateDescription(title, techFocus, agency);
  
  return {
    noticeId,
    title,
    agency,
    description,
    postedDate,
    responseDeadline,
    awardAmount,
    naicsCode,
    setAside,
    placeOfPerformance,
    pointOfContact: {
      name: contactName,
      email: contactEmail,
      phone: contactPhone
    },
    techFocus,
    eligibleStages,
    timeline,
    rawData: {
      solicitation_number: noticeId,
      agency_code: agency.slice(0, 3).toUpperCase(),
      opportunity_type: Math.random() < 0.7 ? 'SBIR' : 'Research Grant'
    },
    lastUpdated: new Date(),
    url
  };
};

/**
 * Generate a collection of mock opportunities
 * @param count Number of mock opportunities to generate
 * @returns Array of mock opportunities
 */
const generateMockOpportunities = (count) => {
  const opportunities = [];
  
  for (let i = 0; i < count; i++) {
    opportunities.push(generateMockOpportunity(i));
  }
  
  return opportunities;
};

// Generate 25 mock opportunities
const mockOpportunities = generateMockOpportunities(25);

// Save to JSON file
const outputPath = path.join(__dirname, '..', 'data', 'mock-opportunities.json');

// Ensure the data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

fs.writeFileSync(outputPath, JSON.stringify(mockOpportunities, null, 2));

console.log(`Generated ${mockOpportunities.length} mock opportunities`);
console.log(`Saved to: ${outputPath}`);
