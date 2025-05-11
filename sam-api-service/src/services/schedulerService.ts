import { logger } from '../utils/logger.js';
import { fetchSamOpportunities, transformSamOpportunities } from './samApiService.js';
import { Opportunity } from '../models/opportunity.js';

/**
 * Job to fetch opportunities from SAM.gov API and store them in the database
 */
export const fetchOpportunitiesJob = async (): Promise<void> => {
  try {
    logger.info('Starting scheduled job to fetch opportunities from SAM.gov API');
    
    // Fetch opportunities from SAM.gov API
    const samOpportunities = await fetchSamOpportunities(100);
    
    if (!samOpportunities || samOpportunities.length === 0) {
      logger.warn('No opportunities fetched from SAM.gov API');
      return;
    }
    
    // Transform opportunities to our format
    const transformedOpportunities = transformSamOpportunities(samOpportunities);
    
    logger.info(`Transformed ${transformedOpportunities.length} opportunities`);
    
    // Store opportunities in the database
    let newCount = 0;
    let updatedCount = 0;
    
    for (const opp of transformedOpportunities) {
      // Check if opportunity already exists
      const existingOpp = await Opportunity.findOne({ noticeId: opp.noticeId });
      
      if (existingOpp) {
        // Update existing opportunity
        await Opportunity.updateOne(
          { noticeId: opp.noticeId },
          { 
            $set: { 
              ...opp,
              lastUpdated: new Date()
            } 
          }
        );
        updatedCount++;
      } else {
        // Create new opportunity
        await Opportunity.create(opp);
        newCount++;
      }
    }
    
    logger.info(`Job completed: ${newCount} new opportunities created, ${updatedCount} opportunities updated`);
  } catch (error) {
    logger.error('Error in fetchOpportunitiesJob:', error);
    throw error;
  }
};

/**
 * Generate sample opportunities for testing
 */
export const generateSampleOpportunities = async (count: number = 10): Promise<void> => {
  try {
    logger.info(`Generating ${count} sample opportunities`);
    
    const agencies = [
      'NASA', 'Space Force', 'DARPA', 'Air Force Research Laboratory', 
      'Department of Defense', 'Department of Energy', 'NOAA', 'AFWERX',
      'Naval Research Laboratory', 'Missile Defense Agency'
    ];
    
    const titles = [
      'Advanced Satellite Communication Systems',
      'Space Debris Monitoring and Mitigation',
      'Autonomous Drone Swarm Technology',
      'Next-Generation Space Propulsion',
      'Secure Space-to-Ground Communications',
      'Space-Based Sensor Networks',
      'Hypersonic Vehicle Materials Research',
      'Satellite Cybersecurity Solutions',
      'Lunar Surface Exploration Robotics',
      'Small Satellite Launch Technologies'
    ];
    
    const descriptions = [
      'Research and development of advanced technologies for next-generation satellite communication systems with improved bandwidth, security, and resilience.',
      'Development of technologies for tracking, monitoring, and mitigating space debris to protect critical space assets.',
      'Creation of AI-driven drone swarm capabilities for reconnaissance and surveillance in contested environments.',
      'Research into novel propulsion technologies for more efficient and powerful space propulsion systems.',
      'Development of secure, high-bandwidth communication systems between space assets and ground stations.',
      'Creation of interconnected sensor networks for space domain awareness and threat detection.',
      'Research into advanced materials capable of withstanding extreme conditions of hypersonic flight.',
      'Development of cybersecurity solutions specifically designed for satellite systems and space infrastructure.',
      'Creation of robotic systems capable of operating on the lunar surface for exploration and resource utilization.',
      'Development of cost-effective launch technologies for small satellite deployment.'
    ];
    
    const techFocusOptions = [
      ['Satellites', 'Signals', 'Software'],
      ['Satellites', 'Software', 'AI/ML'],
      ['Drones', 'AI/ML', 'Software', 'Robotics'],
      ['Propulsion', 'Materials', 'Components'],
      ['Signals', 'Cybersecurity', 'Software'],
      ['Satellites', 'Sensors', 'Software', 'AI/ML'],
      ['Materials', 'Components'],
      ['Cybersecurity', 'Software', 'Satellites'],
      ['Robotics', 'AI/ML', 'Materials'],
      ['Propulsion', 'Components', 'Materials']
    ];
    
    const eligibleStagesOptions = [
      ['Seed', 'Series A', 'Series B+'],
      ['Seed', 'Series A', 'Series B+', 'Growth'],
      ['Pre-seed', 'Seed', 'Series A'],
      ['Series A', 'Series B+', 'Growth'],
      ['Pre-seed', 'Seed', 'Series A']
    ];
    
    const timelineOptions = [
      '12-24 months',
      '24-48 months',
      '18-36 months',
      '36-60 months',
      '12-24 months'
    ];
    
    const budgetOptions = [
      500000,
      2000000,
      5000000,
      10000000,
      20000000
    ];
    
    // Generate sample opportunities
    for (let i = 0; i < count; i++) {
      const index = i % titles.length;
      const agencyIndex = i % agencies.length;
      const techIndex = i % techFocusOptions.length;
      const stageIndex = i % eligibleStagesOptions.length;
      const timelineIndex = i % timelineOptions.length;
      const budgetIndex = i % budgetOptions.length;
      
      // Generate dates
      const postedDate = new Date();
      postedDate.setMonth(postedDate.getMonth() - Math.floor(Math.random() * 3)); // 0-3 months ago
      
      const responseDeadline = new Date();
      responseDeadline.setMonth(responseDeadline.getMonth() + 3 + Math.floor(Math.random() * 9)); // 3-12 months from now
      
      // Create opportunity
      const opportunity = {
        noticeId: `SAMPLE-${new Date().getFullYear()}-${i + 1}`,
        title: titles[index],
        agency: agencies[agencyIndex],
        description: descriptions[index],
        postedDate,
        responseDeadline,
        awardAmount: budgetOptions[budgetIndex],
        naicsCode: '336414', // Guided Missile and Space Vehicle Manufacturing
        techFocus: techFocusOptions[techIndex],
        eligibleStages: eligibleStagesOptions[stageIndex],
        timeline: timelineOptions[timelineIndex],
        rawData: { sample: true },
        url: `https://sam.gov/sample/${i + 1}`
      };
      
      // Check if opportunity already exists
      const existingOpp = await Opportunity.findOne({ noticeId: opportunity.noticeId });
      
      if (!existingOpp) {
        // Create new opportunity
        await Opportunity.create(opportunity);
      }
    }
    
    logger.info(`Generated ${count} sample opportunities`);
  } catch (error) {
    logger.error('Error generating sample opportunities:', error);
    throw error;
  }
};
