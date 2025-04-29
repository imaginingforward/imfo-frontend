
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

// Field mapping between our form fields and Baserow field IDs
// This makes the code more maintainable by mapping descriptive names to Baserow IDs
const FIELD_MAPPING = {
  companyName: "field_4128859",
  companyDescription: "field_4128860",
  techCategory: "field_4128861",
  stage: "field_4128862",
  teamSize: "field_4128863",
  foundedYear: "field_4128868",
  website: "field_4128869",
  patents: "field_4128870",
  email: "field_4128871",
  projectTitle: "field_4128872",
  projectDescription: "field_4128873",
  techSpecs: "field_4128874",
  budget: "field_4128875",
  timeline: "field_4128876",
  interests: "field_4128877"
};

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
      
      // Format data using our mapping to Baserow field IDs
      const baserowData = {
        [FIELD_MAPPING.companyName]: data.company.name,
        [FIELD_MAPPING.companyDescription]: data.company.description,
        [FIELD_MAPPING.techCategory]: data.company.techCategory.join(", "),
        [FIELD_MAPPING.stage]: data.company.stage,
        [FIELD_MAPPING.teamSize]: data.company.teamSize,
        [FIELD_MAPPING.foundedYear]: data.company.foundedYear,
        [FIELD_MAPPING.website]: data.company.website || "",
        [FIELD_MAPPING.patents]: data.company.patents || "",
        [FIELD_MAPPING.email]: data.company.email,
        [FIELD_MAPPING.projectTitle]: data.project.title,
        [FIELD_MAPPING.projectDescription]: data.project.description,
        [FIELD_MAPPING.techSpecs]: data.project.techSpecs,
        [FIELD_MAPPING.budget]: data.project.budget,
        [FIELD_MAPPING.timeline]: data.project.timeline,
        [FIELD_MAPPING.interests]: data.project.interests.join(", ")
      };

      console.log("Sending data to Baserow with field IDs:", baserowData);

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
