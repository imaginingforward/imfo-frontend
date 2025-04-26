
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import type { FormData } from "@/types/form";

const techCategories = [
  "Satellites",
  "Drones",
  "Propulsion",
  "Communications",
  "Signals",
  "Components",
  "AI/ML",
  "Robotics",
  "Other",
];

const stages = ["Pre-seed", "Seed", "Series A", "Series B+", "Growth"];

const SpaceForm = () => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "Form Submitted Successfully",
      description: "We'll analyze your data and match you with relevant RFPs soon.",
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
            <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6">Company Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("company.name", { required: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Company Description *</Label>
                    <Textarea
                      id="description"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("company.description", { required: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("company.website")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="patents">Patents (if any)</Label>
                    <Textarea
                      id="patents"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("company.patents")}
                      placeholder="List any relevant patents..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="stage">Company Stage *</Label>
                    <Select>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6">Project Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title *</Label>
                    <Input
                      id="projectTitle"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("project.title", { required: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("project.description", { required: true })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="techSpecs">Technical Specifications *</Label>
                    <Textarea
                      id="techSpecs"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("project.techSpecs", { required: true })}
                      placeholder="Describe your technology's specifications..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Estimated Budget Range *</Label>
                    <Input
                      id="budget"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("project.budget", { required: true })}
                      placeholder="e.g., $100K - $500K"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Project Timeline *</Label>
                    <Input
                      id="timeline"
                      className="bg-white/5 border-white/20 text-white"
                      {...register("project.timeline", { required: true })}
                      placeholder="e.g., 12 months"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
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
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default SpaceForm;
