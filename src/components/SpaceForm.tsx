import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import type { FormData } from "@/types/form";
import StartupDetailsForm from "./StartupDetailsForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import { Button } from "@/components/ui/button";

const SHEET_API_URL = "https://sheetdb.io/api/v1/5w1taeq2uy0bl";

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
      
      // Format data for the sheet
      const sheetData = {
        company_name: data.company.name,
        company_description: data.company.description,
        tech_categories: data.company.techCategory.join(", "),
        stage: data.company.stage,
        team_size: data.company.teamSize,
        founded_year: data.company.foundedYear,
        website: data.company.website || "",
        patents: data.company.patents || "",
        email: data.company.email,
        project_title: data.project.title,
        project_description: data.project.description,
        technical_specs: data.project.techSpecs,
        budget: data.project.budget,
        timeline: data.project.timeline,
        interests: data.project.interests.join(", "),
      };

      // Send to SheetDB - no auth needed for demo endpoint
      const response = await fetch(SHEET_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: sheetData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      console.log("Form submitted successfully:", data);
      toast({
        title: "Form Submitted Successfully",
        description: "Your data has been saved to our database. We'll match you with relevant RFPs soon.",
      });
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
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
