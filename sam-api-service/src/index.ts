import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { opportunityRoutes } from './routes/opportunityRoutes.js';
import { matchingRoutes } from './routes/matchingRoutes.js';
import { enhancedMatchingRoutes } from './routes/enhancedMatchingRoutes.js';
import { baserowRoutes } from './routes/baserowRoutes.js';
import { fetchOpportunitiesJob } from './services/schedulerService.js';
import { logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGINS ? 
    process.env.CORS_ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:5173', 'https://aero-ai-match-portal-f0c29419c37e.herokuapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/matching', matchingRoutes);     // /api/matching/ (basic routes, now using AI matching)
app.use('/api/matching', enhancedMatchingRoutes); // /api/matching/enhanced and /api/matching/ai (both using AI matching)
app.use('/api/baserow', baserowRoutes);

// Log that we're using AI-based matching for all endpoints
logger.info('Server configured to use AI-based matching for all matching endpoints');

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
    return true;
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.warn('Continuing without MongoDB connection - some features will be disabled');
    return false;
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
    // Connect to database but continue even if it fails
    const dbConnected = await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      
      // Schedule jobs after server starts
      scheduleJobs();
      
      // Run initial fetch if in development mode and DB is connected
      if (process.env.NODE_ENV === 'development' && dbConnected) {
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
