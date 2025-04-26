
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import type { CompanyData } from "@/types/form";

const techCategories = [
  "Drones",
  "Signals",
  "Satellites",
  "Components",
  "Software",
  "Materials",
  "Propulsion",
  "Robotics",
  "AI/ML",
  "Cybersecurity",
  "Other"
];

const stages = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B+",
  "Growth"
];

interface StartupDetailsFormProps {
  data: CompanyData;
  onChange: (data: Partial<CompanyData>) => void;
}

const StartupDetailsForm = ({ data, onChange }: StartupDetailsFormProps) => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="space-y-6 text-white">
        <h2 className="text-2xl font-semibold mb-6">Company Details</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              className="bg-white/5 border-white/20"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Company Description *</Label>
            <Textarea
              id="description"
              className="bg-white/5 border-white/20"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe your company's mission and core technology..."
              required
            />
          </div>

          <div>
            <Label>Technology Categories *</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {techCategories.map((tech) => (
                <div key={tech} className="flex items-center space-x-2">
                  <Checkbox
                    id={tech}
                    checked={data.techCategory?.includes(tech)}
                    onCheckedChange={(checked) => {
                      const newTech = checked
                        ? [...(data.techCategory || []), tech]
                        : (data.techCategory || []).filter((t) => t !== tech);
                      onChange({ techCategory: newTech });
                    }}
                  />
                  <Label htmlFor={tech} className="text-sm font-normal">
                    {tech}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="stage">Company Stage *</Label>
            <select
              id="stage"
              className="w-full bg-white/5 border-white/20 rounded-md p-2 text-white"
              value={data.stage}
              onChange={(e) => onChange({ stage: e.target.value })}
              required
            >
              <option value="">Select stage...</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="teamSize">Team Size *</Label>
            <Input
              id="teamSize"
              type="number"
              className="bg-white/5 border-white/20"
              value={data.teamSize}
              onChange={(e) => onChange({ teamSize: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="foundedYear">Founded Year *</Label>
            <Input
              id="foundedYear"
              type="number"
              className="bg-white/5 border-white/20"
              value={data.foundedYear}
              onChange={(e) => onChange({ foundedYear: e.target.value })}
              required
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              className="bg-white/5 border-white/20"
              value={data.website}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <Label htmlFor="patents">Patents/IP Description</Label>
            <Textarea
              id="patents"
              className="bg-white/5 border-white/20"
              value={data.patents}
              onChange={(e) => onChange({ patents: e.target.value })}
              placeholder="Describe any relevant patents or intellectual property..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StartupDetailsForm;
