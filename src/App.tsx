import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubmissionResultPage from "./pages/SubmissionResultPage";
import MatchingPage from "./pages/MatchingPage";
import ImFoIntelligencePage from "./pages/ImFoIntelligencePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Search Engine Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/intelligence" element={<ImFoIntelligencePage />} />
          
          {/* RFP Match Tool Routes */}
          <Route path="/match" element={<MatchingPage />} />
          <Route path="/submission-result" element={<SubmissionResultPage />} />
          
          {/* Catch-all not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
