/**
 * Populate Database with Mock RFP Data
 * This script loads the generated mock data and populates the database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { submitOpportunityToBaserow, opportunityExistsInBaserow } from '../baserowService.js';
import { Opportunity } from '../src/models/opportunity.js';
import { logger } from '../logger.js';

// Load environment variables
dotenv.config();

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to mock data
const mockDataPath = path.join(__dirname, '..', 'data', 'mock-opportunities.json');

// Check if mock data exists
if (!fs.existsSync(mockDataPath)) {
  console.error('Mock data file not found. Please run generate-mock-rfps.js first.');
  process.exit(1);
}

// Load mock data
const mockOpportunities = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));

/**
 * Connect to MongoDB
 */
const connectToMongoDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/space-rfp-matcher';
  
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to MongoDB');
    return true;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    return false;
  }
};

/**
 * Import opportunities to MongoDB
 */
const importToMongoDB = async (opportunities) => {
  const results = {
    total: opportunities.length,
    imported: 0,
    skipped: 0,
    errors: 0
  };
  
  for (const opportunity of opportunities) {
    try {
      // Check if opportunity already exists
      const existingOpp = await Opportunity.findOne({ noticeId: opportunity.noticeId });
      
      if (existingOpp) {
        logger.info(`Opportunity ${opportunity.noticeId} already exists in MongoDB. Skipping.`);
        results.skipped++;
        continue;
      }
      
      // Convert string dates to Date objects
      const parsedOpp = {
        ...opportunity,
        postedDate: new Date(opportunity.postedDate),
        responseDeadline: new Date(opportunity.responseDeadline),
        lastUpdated: new Date()
      };
      
      // Create new opportunity
      const newOpportunity = new Opportunity(parsedOpp);
      await newOpportunity.save();
      
      logger.info(`Imported opportunity ${opportunity.noticeId} to MongoDB`);
      results.imported++;
    } catch (error) {
      logger.error(`Error importing opportunity ${opportunity.noticeId} to MongoDB:`, error);
      results.errors++;
    }
  }
  
  return results;
};

/**
 * Import opportunities to Baserow
 */
const importToBaserow = async (opportunities) => {
  const results = {
    total: opportunities.length,
    imported: 0,
    skipped: 0,
    errors: 0
  };
  
  for (const opportunity of opportunities) {
    try {
      // Check if opportunity already exists
      const exists = await opportunityExistsInBaserow(opportunity.noticeId);
      
      if (exists) {
        logger.info(`Opportunity ${opportunity.noticeId} already exists in Baserow. Skipping.`);
        results.skipped++;
        continue;
      }
      
      // Submit to Baserow
      await submitOpportunityToBaserow(opportunity);
      
      logger.info(`Imported opportunity ${opportunity.noticeId} to Baserow`);
      results.imported++;
    } catch (error) {
      logger.error(`Error importing opportunity ${opportunity.noticeId} to Baserow:`, error);
      results.errors++;
    }
  }
  
  return results;
};

/**
 * Main function to run the script
 */
const main = async () => {
  logger.info(`Found ${mockOpportunities.length} mock opportunities to import`);
  
  // Import to MongoDB
  logger.info('Importing to MongoDB...');
  const mongodbConnected = await connectToMongoDB();
  
  if (mongodbConnected) {
    const mongoResults = await importToMongoDB(mockOpportunities);
    logger.info('MongoDB import complete:', mongoResults);
  } else {
    logger.warn('Skipping MongoDB import due to connection error');
  }
  
  // Import to Baserow
  if (process.env.BASEROW_API_TOKEN && process.env.BASEROW_OPPORTUNITIES_TABLE_ID) {
    logger.info('Importing to Baserow...');
    const baserowResults = await importToBaserow(mockOpportunities);
    logger.info('Baserow import complete:', baserowResults);
  } else {
    logger.warn('Skipping Baserow import. Missing BASEROW_API_TOKEN or BASEROW_OPPORTUNITIES_TABLE_ID in .env file');
  }
  
  // Disconnect from MongoDB
  if (mongodbConnected) {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
  
  logger.info('Import process complete');
};

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
