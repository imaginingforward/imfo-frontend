import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import debugEnvironmentVariables from "@/debug-env";
import { useToast } from "@/hooks/use-toast";
import TypeformContainer from "@/components/TypeformContainer";
import type { FormData, MatchResult } from "@/types/form";
import { Button } from "@/components/ui/button";
import RFPMatchList from "@/components/RFPMatchList";
import { getMatchingOpportunities } from "@/services/matchingService";
import { getBackendApiKey } from "@/utils/envConfig";
import { ArrowLeft } from "lucide-react";

const AIMatchingPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const [submittedCompanyName, setSubmittedCompanyName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Check environment variables on component load
    debugEnvironmentVariables();
  }, []);

  // This function will be called by the TypeformContainer when form is submitted
  const handleFormSubmission = async (formData: FormData) => {
    setMatchingError(null);
    setSubmittedCompanyName(formData.company.name);
    
    try {
      // Debug environment variables before making the API call
      console.log("Environment check before API call:");
      debugEnvironmentVariables();
      console.log("Form data being submitted:", formData);
      
      // Transform form data to match backend expectations
      const backendData = {
        company: {
          name: formData.company.name,
          description: formData.company.description,
          website: formData.company.website,
          patents: formData.company.patents,
          techCategory: formData.company.techCategory,
          eligibleAgencyCodes: formData.company.eligibleAgencyCodes || [],
          preferredDepartments: formData.company.preferredDepartments || [],
          stage: formData.company.stage,
          teamSize: formData.company.teamSize,
          foundedYear: formData.company.foundedYear,
          email: formData.company.email,
          location: formData.company.location || {
            city: formData.company.city || "",
            state: formData.company.state || ""
          }
        },
        project: {
          title: formData.project.title,
          description: formData.project.description,
          techSpecs: formData.project.techSpecs,
          budget: typeof formData.project.budget === 'object' && formData.project.budget.min && formData.project.budget.max
            ? `$${formData.project.budget.min} - $${formData.project.budget.max}`
            : formData.project.budget || "",
          timeline: formData.project.timeline,
          interests: formData.project.interests || [],
          deadline: formData.project.deadline
        },
        keywords: formData.keywords || []
      };
      
      // Call matching service
      const result = await getMatchingOpportunities(backendData);
      setMatches(result.matches);
      setShowForm(false);
      setShowResults(true);
      
      toast({
        title: "AI Matching Complete",
        description: `Found ${result.matches.length} matching opportunities.`,
      });
    } catch (error: any) {
      console.error("Error in AI matching:", error);
      
      // More detailed error logging
      const errorDetail = error.response ? 
        `Status: ${error.response.status} - ${JSON.stringify(error.response.data)}` : 
        error.message || "Unknown error";
      
      console.error("Error details:", errorDetail);
      
      setMatchingError(`${error.message || "An error occurred during matching."}\n\nPlease check the console for more details.`);
      
      toast({
        title: "Matching Failed",
        description: "There was an error performing the AI match. Check console for details.",
        variant: "destructive",
      });
      
      // Show results page with error
      setShowForm(false);
      setShowResults(true);
    }
  };
  
  const handleReset = () => {
    setShowResults(false);
    setShowForm(true);
    setMatches([]);
    setMatchingError(null);
    setSubmittedCompanyName("");
  };

  // If showing the Typeform, render TypeformContainer
  if (showForm) {
    return <TypeformContainer onSubmit={handleFormSubmission} />;
  }

  // If showing results, render results page
  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost" 
            size="sm"
            className="text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="IMFO Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Match Results
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Here are your personalized government funding opportunities
          </p>
        </div>
        
        <div className="animate-fadeIn">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 mb-6">
            <div className="mb-6">
              <Button onClick={handleReset} variant="outline" className="text-black">
                ← Start New Match
              </Button>
            </div>
            
            {matchingError ? (
              <div className="p-4 bg-red-500/20 rounded-lg text-center">
                <h3 className="text-xl font-bold mb-2">Error</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{matchingError}</p>
                <div className="mt-4">
                  <details>
                    <summary className="cursor-pointer text-sm">Debug Information</summary>
                    <div className="text-left mt-2 p-2 bg-black/20 text-xs rounded">
                      <p>API URL: https://aero-matching-backend-5d1bd860f515.herokuapp.com/api/match</p>
                      <p>Environment: {'production'}</p>
                      <p>API Key Set: {getBackendApiKey() ? 'Yes' : 'No'}</p>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <RFPMatchList 
                matches={matches} 
                companyName={submittedCompanyName} 
              />
            )}
          </div>
        </div>
        
        {/* Backend API Information */}
        <div className="mt-8 text-center text-sm text-gray-400">
        </div>
      </div>
    </div>
  );
};

export default AIMatchingPage;
