import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
app.use(cors({
  origin: '*', // Allow all for now - we'll restrict later
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Middleware for embedding support
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

// SPECIFIC route for RFP match tool (BEFORE the catch-all)
app.get('/rfp-match', (req, res) => {
  console.log('RFP match route hit');
  res.sendFile(path.join(__dirname, 'public', 'rfp-match.html'));
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the dist directory (your React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all handler: send back React's index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Main app: https://imfo-intelligence-756b7e94aea3.herokuapp.com/`);
  console.log(`RFP Match: https://imfo-intelligence-756b7e94aea3.herokuapp.com/rfp-match`);
});
