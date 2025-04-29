
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import type { FormData } from "@/types/form";
import StartupDetailsForm from "./StartupDetailsForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import { Button } from "@/components/ui/button";

const SpaceForm = () => {
  const [step, setStep] = useState(1);
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
        email: "", // Add default value for email
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
    console.log("Form submitted:", data);
    toast({
      title: "Form Submitted Successfully",
      description: "We'll analyze your data and match you with relevant RFPs soon.",
    });
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
                >
                  Submit
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
