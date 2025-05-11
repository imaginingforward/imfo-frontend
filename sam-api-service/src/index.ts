import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { opportunityRoutes } from './routes/opportunityRoutes.js';
import { matchingRoutes } from './routes/matchingRoutes.js';
import { enhancedMatchingRoutes } from './routes/enhancedMatchingRoutes.js';
import { fetchOpportunitiesJob } from './services/schedulerService.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/matching', enhancedMatchingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sam-rfp-db';
    await mongoose.connect(mongoURI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Schedule jobs
const scheduleJobs = () => {
  const schedule = process.env.RFP_FETCH_SCHEDULE || '0 2 * * *'; // Default: daily at 2 AM
  
  logger.info(`Scheduling RFP fetch job with schedule: ${schedule}`);
  
  cron.schedule(schedule, async () => {
    logger.info('Running scheduled RFP fetch job');
    try {
      await fetchOpportunitiesJob();
      logger.info('RFP fetch job completed successfully');
    } catch (error) {
      logger.error('Error in RFP fetch job:', error);
    }
  });
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // Schedule jobs after server starts
      scheduleJobs();
      
      // Run initial fetch if in development mode
      if (process.env.NODE_ENV === 'development') {
        logger.info('Development mode: Running initial RFP fetch');
        fetchOpportunitiesJob().catch(err => 
          logger.error('Error in initial RFP fetch:', err)
        );
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
