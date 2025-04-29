
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import type { FormData } from "@/types/form";
import StartupDetailsForm from "./StartupDetailsForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import { Button } from "@/components/ui/button";

// Baserow public grid URL
const BASEROW_PUBLIC_URL = "https://baserow.io/public/grid/UmTCweArHi7GC3J5vehNJ5FFxf9g3BzX1Wst4UPPrPs";
// Baserow API endpoint for submissions (you'll need to replace this with your actual table ID)
const BASEROW_API_URL = "https://api.baserow.io/api/database/rows/table/YOUR_TABLE_ID/";
// You'll need a Baserow API token with the appropriate permissions
const BASEROW_API_TOKEN = "YOUR_API_TOKEN";

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
      
      // Format data for Baserow
      // Note: Field names must match exactly with your Baserow table column names
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

      // Send to Baserow with authentication header
      const response = await fetch(BASEROW_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${BASEROW_API_TOKEN}`
        },
        body: JSON.stringify(baserowData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit form");
      }

      console.log("Form submitted successfully:", data);
      toast({
        title: "Form Submitted Successfully",
        description: "Your data has been saved to Baserow. We'll match you with relevant RFPs soon.",
      });
      
      // Reset form after successful submission if needed
      // reset();
      // setStep(1);
      
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
