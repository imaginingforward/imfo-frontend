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
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
}));

// Headers for embedding
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

// Serve the RFP match tool directly (BEFORE any other routes)
app.get('/rfp-match', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rfp-match.html'));
});

// Serve static files from public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Try to serve React app, but don't fail if dist doesn't exist
try {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  // Only set up React routing if dist/index.html exists
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    try {
      res.sendFile(indexPath);
    } catch (error) {
      res.status(404).send('React app not built');
    }
  });
} catch (error) {
  console.log('React dist folder not found - serving only static files');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`RFP Match: https://imfo-intelligence-756b7e94aea3.herokuapp.com/rfp-match`);
});
