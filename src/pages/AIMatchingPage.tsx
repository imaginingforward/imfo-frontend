import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/types/form";
import StartupDetailsForm from "@/components/StartupDetailsForm";
import ProjectDetailsForm from "@/components/ProjectDetailsForm";
import FormHeader from "@/components/FormHeader";
import FormProgressIndicator from "@/components/FormProgressIndicator";
import { Button } from "@/components/ui/button";
import RFPMatchList from "@/components/RFPMatchList";
import { getMatchingOpportunities, MatchResult } from "@/services/matchingService";
import { Loader2 } from "lucide-react";

const AIMatchingPage = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [matchingError, setMatchingError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      company: {
        name: "",
        description: "",
        techCategory: [],
        stage: "",
        teamSize: "",
        foundedYear: "",
        website: "",
        patents: "",
        email: "",
      },
      project: {
        title: "",
        description: "",
        techSpecs: "",
        budget: "",
        timeline: "",
        interests: [],
      },
    },
  });

  const formData = watch();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setMatchingError(null);
    
    try {
      // Call OpenAI directly through our service
      const result = await getMatchingOpportunities(data);
      setMatches(result.matches);
      setShowResults(true);
      
      toast({
        title: "AI Matching Complete",
        description: `Found ${result.matches.length} matching opportunities.`,
      });
    } catch (error: any) {
      console.error("Error in AI matching:", error);
      setMatchingError(error.message || "An error occurred during matching.");
      
      toast({
        title: "Matching Failed",
        description: "There was an error performing the AI match.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyDataChange = (data: Partial<typeof formData.company>) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(`company.${key as keyof typeof formData.company}`, value);
    });
  };

  const handleProjectDataChange = (data: Partial<typeof formData.project>) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(`project.${key as keyof typeof formData.project}`, value);
    });
  };
  
  const handleReset = () => {
    setShowResults(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            AI Space Tech RFP Matchmaker
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Find the perfect government contract opportunities for your space tech company using AI
          </p>
        </div>
        
        {!showResults ? (
          <>
            <FormProgressIndicator currentStep={step} totalSteps={2} />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="animate-fadeIn bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Company Details</h2>
                  <StartupDetailsForm 
                    data={formData.company}
                    onChange={handleCompanyDataChange}
                  />
                  <div className="mt-6">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fadeIn bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold mb-6">Project Details</h2>
                  <ProjectDetailsForm
                    data={formData.project}
                    onChange={handleProjectDataChange}
                  />
                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finding Matches...
                        </>
                      ) : (
                        "Find Matches with AI"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 mb-6">
              <div className="mb-6">
                <Button onClick={handleReset} variant="outline">
                  ← Start New Match
                </Button>
              </div>
              
              {matchingError ? (
                <div className="p-4 bg-red-500/20 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">Error</h3>
                  <p>{matchingError}</p>
                </div>
              ) : (
                <RFPMatchList 
                  matches={matches} 
                  companyName={formData.company.name} 
                />
              )}
            </div>
          </div>
        )}
        
        {/* Backend API Information */}
        <div className="mt-8 text-center text-sm text-gray-400">
        </div>
      </div>
    </div>
  );
};

export default AIMatchingPage;
