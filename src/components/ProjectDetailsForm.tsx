
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TagInput } from "@/components/ui/tag-input";
import type { ProjectData } from "@/types/form";

// Timeline duration options
const durationOptions = [
  "0-6 months", "6-12 months", "12-18 months", 
  "18-24 months", "24-36 months", "36+ months"
];

interface ProjectDetailsFormProps {
  data: ProjectData;
  onChange: (data: Partial<ProjectData>) => void;
}

const ProjectDetailsForm = ({ data, onChange }: ProjectDetailsFormProps) => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="space-y-6 text-white">
        <h2 className="text-2xl font-semibold mb-6">Project Details</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectTitle">Project Title *</Label>
            <Input
              id="projectTitle"
              className="bg-white/5 border-white/20"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="projectDescription">Project Description *</Label>
            <Textarea
              id="projectDescription"
              className="bg-white/5 border-white/20"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe your project and its objectives..."
              required
            />
          </div>

          <div>
            <Label htmlFor="techSpecs">Technical Specifications</Label>
            <Textarea
              id="techSpecs"
              className="bg-white/5 border-white/20"
              value={data.techSpecs}
              onChange={(e) => onChange({ techSpecs: e.target.value })}
              placeholder="Detail the technical specifications of your project..."
              required
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords *</Label>
            <TagInput
              value={data.keywords || []}
              onChange={(tags) => onChange({ keywords: tags })}
              placeholder="Type keyword and press Enter or comma..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="budget">Estimated Budget Range *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budgetMin" className="text-sm">Minimum ($)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  className="bg-white/5 border-white/20"
                  value={data.budget?.min || ""}
                  onChange={(e) => onChange({ 
                    budget: { 
                      ...(data.budget || {max: 0}), 
                      min: Number(e.target.value),
                      currency: "USD"
                    } 
                  })}
                  placeholder="e.g., 100000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="budgetMax" className="text-sm">Maximum ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  className="bg-white/5 border-white/20"
                  value={data.budget?.max || ""}
                  onChange={(e) => onChange({ 
                    budget: { 
                      ...(data.budget || {min: 0}), 
                      max: Number(e.target.value),
                      currency: "USD"
                    } 
                  })}
                  placeholder="e.g., 500000"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="timeline">Project Timeline *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timelineDuration" className="text-sm">Duration</Label>
                <select
                  id="timelineDuration"
                  className="w-full bg-white/5 border-white/20 text-white rounded-md py-2 px-3"
                  value={data.timeline?.duration || ""}
                  onChange={(e) => onChange({ 
                    timeline: { ...(data.timeline || {startDate: ""}), duration: e.target.value } 
                  })}
                  required
                >
                  <option value="">Select Duration</option>
                  {durationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="timelineDeadline" className="text-sm">Preferred Deadline</Label>
                <Input
                  id="timelineDeadline"
                  type="date"
                  className="bg-white/5 border-white/20"
                  value={data.timeline?.deadline || ""}
                  onChange={(e) => onChange({ 
                    timeline: { ...(data.timeline || {duration: ""}), deadline: e.target.value } 
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectDetailsForm;
