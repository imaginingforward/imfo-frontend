import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import debugEnvironmentVariables from './debug-env.js'

// Initialize the app and run environment check in development mode
if (import.meta.env.DEV) {
  console.log("🚀 Starting Aero AI Match Portal in development mode");
  
  // Log environment info for debugging purposes
  setTimeout(() => {
    debugEnvironmentVariables();
    
    // Inform about API endpoint
    console.info(
      "%cAI Matching API Notice", 
      "font-size: 14px; font-weight: bold; color: #2563eb;",
      "Using matching endpoint (/api/match) which requires API key authentication."
    );
  }, 1000);
}

createRoot(document.getElementById("root")!).render(<App />);
