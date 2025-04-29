
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import type { FormData } from "@/types/form";
import StartupDetailsForm from "./StartupDetailsForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import { Button } from "@/components/ui/button";

// Baserow API endpoint for submissions - using public grid ID from your URL
const BASEROW_TABLE_ID = "519889";
const BASEROW_API_URL = `https://api.baserow.io/api/database/rows/table/${BASEROW_TABLE_ID}/`;
// Using the API token provided earlier
const BASEROW_API_TOKEN = "V8TT0pqPOKhwEcYzSysD0COL1oScagiG";

const SpaceForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    try {
      setIsSubmitting(true);
      
      // Format data for Baserow - make sure field names match exactly with your Baserow columns
      const baserowData = {
        "Company Name": data.company.name,
        "Company Description": data.company.description, 
        "Tech Categories": data.company.techCategory.join(", "),
        "Stage": data.company.stage,
        "Team Size": data.company.teamSize,
        "Founded Year": data.company.foundedYear,
        "Website": data.company.website || "",
        "Patents": data.company.patents || "",
        "Email": data.company.email,
        "Project Title": data.project.title,
        "Project Description": data.project.description,
        "Technical Specs": data.project.techSpecs,
        "Budget": data.project.budget,
        "Timeline": data.project.timeline,
        "Interests": data.project.interests.join(", ")
      };

      console.log("Sending data to Baserow:", baserowData);
      console.log("API URL:", BASEROW_API_URL);

      // Send to Baserow with authentication header
      const response = await fetch(BASEROW_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${BASEROW_API_TOKEN}`
        },
        body: JSON.stringify(baserowData),
      });

      const responseData = await response.json();
      console.log("Baserow API response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `API Error: ${response.status}`);
      }

      toast({
        title: "Form Submitted Successfully",
        description: "Your data has been saved to Baserow. We'll match you with relevant RFPs soon.",
      });
      
      // Reset form or redirect after successful submission if needed
      // reset();
      // setStep(1);
      
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message || "Failed to submit data"}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Space Tech RFP Matchmaker
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Connect your space tech startup with government opportunities
          </p>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded-full mb-8">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <div className="animate-fadeIn">
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
            <div className="animate-fadeIn">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SpaceForm;
