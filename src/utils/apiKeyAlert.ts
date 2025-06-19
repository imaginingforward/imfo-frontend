import { getBackendApiKey } from "./envConfig";

/**
 * Check for API key and show a warning message if it's not set
 * This can be called on application startup to alert users about missing API keys
 */
export function checkApiKeyAndAlert() {
  // Wait a moment to let the app initialize
  setTimeout(() => {
    const apiKey = getBackendApiKey();
    
    if (!apiKey) {
      console.warn("⚠️ Backend API key not set - matching features will not work correctly");
      
      // Show alert to user in non-production environments
      if (import.meta.env.MODE !== "production") {
        const message = 
          "Backend API key not configured. Matching features will not work correctly.\n\n" +
          "To fix this:\n" +
          "1. Create a .env file in the project root (copy from .env.example)\n" +
          "2. Set VITE_AERO_AI_BACKEND_API_KEY with your API key\n" +
          "3. Restart the development server\n\n" +
          "See README-API-Connection.md for details.";
          
        // Use a slightly nicer alert via DOM if possible
        if (typeof document !== 'undefined') {
          const alertDiv = document.createElement('div');
          alertDiv.style.position = 'fixed';
          alertDiv.style.top = '10px';
          alertDiv.style.right = '10px';
          alertDiv.style.backgroundColor = '#FEF2F2';
          alertDiv.style.color = '#991B1B';
          alertDiv.style.padding = '12px 16px';
          alertDiv.style.borderRadius = '4px';
          alertDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
          alertDiv.style.maxWidth = '360px';
          alertDiv.style.zIndex = '9999';
          alertDiv.style.fontFamily = 'sans-serif';
          
          const title = document.createElement('div');
          title.style.fontWeight = 'bold';
          title.style.marginBottom = '8px';
          title.textContent = '⚠️ API Key Missing';
          
          const content = document.createElement('div');
          content.style.fontSize = '14px';
          content.style.lineHeight = '1.5';
          content.textContent = message;
          
          const closeButton = document.createElement('button');
          closeButton.textContent = '✕';
          closeButton.style.position = 'absolute';
          closeButton.style.top = '8px';
          closeButton.style.right = '8px';
          closeButton.style.border = 'none';
          closeButton.style.background = 'transparent';
          closeButton.style.cursor = 'pointer';
          closeButton.style.fontSize = '16px';
          closeButton.style.color = '#991B1B';
          closeButton.onclick = () => document.body.removeChild(alertDiv);
          
          alertDiv.appendChild(title);
          alertDiv.appendChild(content);
          alertDiv.appendChild(closeButton);
          
          // Add to DOM when body is available
          if (document.body) {
            document.body.appendChild(alertDiv);
          } else {
            window.addEventListener('DOMContentLoaded', () => {
              document.body.appendChild(alertDiv);
            });
          }
        } else {
          // Fallback to console.warn if DOM is not available
          console.warn(message);
        }
      }
    }
  }, 1000); // Wait 1 second to ensure app is initialized
}
