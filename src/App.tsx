
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubmissionResultPage from "./pages/SubmissionResultPage";
import AIMatchingPage from "./pages/AIMatchingPage";
import SpaceForm from "./components/SpaceForm";
import ImFoIntelligencePage from "./pages/ImFoIntelligencePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/standard-form" element={<SpaceForm />} />
          <Route path="/ai-matching" element={<AIMatchingPage />} />
          <Route path="/submission-result" element={<SubmissionResultPage />} />
          <Route path="/intelligence" element={<ImFoIntelligencePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
