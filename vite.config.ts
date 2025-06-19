import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// Importing lovable-tagger conditionally to avoid issues in production

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Only use componentTagger in development mode
    mode === 'development' && (() => {
      try {
        // Dynamic import for development only
        const { componentTagger } = require("lovable-tagger");
        return componentTagger();
      } catch(e) {
        console.warn('lovable-tagger not available, skipping in production');
        return null;
      }
    })(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
