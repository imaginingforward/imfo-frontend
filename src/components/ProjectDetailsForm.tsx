
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { ProjectData } from "@/types/form";

const interests = [
  "AFWERX",
  "DARPA",
  "DOD",
  "DOE",
  "Maritime",
  "Space Force",
  "Other"
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
            <Label htmlFor="techSpecs">Technical Specifications *</Label>
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
            <Label>Agency Interests *</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={data.interests?.includes(interest)}
                    onCheckedChange={(checked) => {
                      const newInterests = checked
                        ? [...(data.interests || []), interest]
                        : (data.interests || []).filter((i) => i !== interest);
                      onChange({ interests: newInterests });
                    }}
                  />
                  <Label htmlFor={interest} className="text-sm font-normal">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="budget">Estimated Budget Range *</Label>
            <Input
              id="budget"
              className="bg-white/5 border-white/20"
              value={data.budget}
              onChange={(e) => onChange({ budget: e.target.value })}
              placeholder="e.g., $100K - $500K"
              required
            />
          </div>

          <div>
            <Label htmlFor="timeline">Project Timeline *</Label>
            <Input
              id="timeline"
              className="bg-white/5 border-white/20"
              value={data.timeline}
              onChange={(e) => onChange({ timeline: e.target.value })}
              placeholder="e.g., 12 months"
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectDetailsForm;
