
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import type { CompanyData } from "@/types/form";

// Define tech categories and stages here if needed
const techCategories = ["Propulsion", "Satellites", "Robotics", "AI/ML", "Earth Observation", "Communications", "Manufacturing", "Materials Science", "Other"];
const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C+", "Public"];
const teamSizes = ["1-5", "6-15", "16-30", "31-50", "51-100", "101+"];

interface StartupDetailsFormProps {
  data: CompanyData;
  onChange: (data: Partial<CompanyData>) => void;
}

const StartupDetailsForm = ({ data, onChange }: StartupDetailsFormProps) => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="space-y-6 text-white">
        <h2 className="text-2xl font-semibold mb-6">Startup Details</h2>
        
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
            <Label htmlFor="companyDescription">Company Description *</Label>
            <Textarea
              id="companyDescription"
              className="bg-white/5 border-white/20"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell us about your company..."
              required
            />
          </div>

          <div>
            <Label htmlFor="techCategory">Technology Category *</Label>
            {techCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id={category}
                  className="bg-white/5 border-white/20"
                  // checked={data.techCategory.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ techCategory: [...data.techCategory, category] });
                    } else {
                      onChange({
                        techCategory: data.techCategory.filter((item) => item !== category),
                      });
                    }
                  }}
                />
                <Label htmlFor={category} className="text-sm font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </div>

          <div>
            <Label htmlFor="stage">Stage *</Label>
            <select
              id="stage"
              className="w-full bg-white/5 border-white/20 text-white rounded-md py-2 px-3"
              value={data.stage}
              onChange={(e) => onChange({ stage: e.target.value })}
              required
            >
              <option value="">Select Stage</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="teamSize">Team Size *</Label>
            <select
              id="teamSize"
              className="w-full bg-white/5 border-white/20 text-white rounded-md py-2 px-3"
              value={data.teamSize}
              onChange={(e) => onChange({ teamSize: e.target.value })}
              required
            >
              <option value="">Select Team Size</option>
              {teamSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="foundedYear">Founded Year *</Label>
            <Input
              type="number"
              id="foundedYear"
              className="bg-white/5 border-white/20"
              value={data.foundedYear}
              onChange={(e) => onChange({ foundedYear: e.target.value })}
              placeholder="e.g., 2018"
              required
            />
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              type="url"
              id="website"
              className="bg-white/5 border-white/20"
              value={data.website || ""}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="e.g., https://yourcompany.com"
            />
          </div>

          <div>
            <Label htmlFor="patents">Patents</Label>
            <Input
              id="patents"
              className="bg-white/5 border-white/20"
              value={data.patents || ""}
              onChange={(e) => onChange({ patents: e.target.value })}
              placeholder="List any patents"
            />
          </div>

          <div>
            <Label htmlFor="companyEmail">Company Email *</Label>
            <Input
              id="companyEmail"
              type="email"
              className="bg-white/5 border-white/20"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="contact@yourcompany.com"
              required
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StartupDetailsForm;
