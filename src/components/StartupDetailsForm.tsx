
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { CompanyData } from "@/types/form";

// Define options aligned with government categories and funding types
const techCategories = [
  "Agriculture", "Cybersecurity", "Disaster Prevention and Relief",
  "Science and Technology", "Transportation", "Propulsion Systems", 
  "Satellite Technology", "Aerospace Engineering"
];

// Agency codes
const agencyCodes = [
  "DARPA", "DOD", "NASA", "DOE", "DOT", "NSF", "DHS", "USDA", "HHS", 
  "EPA", "DOC", "DOI", "DOJ", "DOS", "ED", "HUD", "DOL", "VA"
];

// Funding instrument types from grants.gov
const fundingInstrumentTypes = [
  "Grant", "Cooperative Agreement", "Procurement Contract",
  "Other Financial Assistance", "SBIR", "STTR"
];

const stages = [
  "Pre-seed", "Seed", "Series A", "Series B", "Series C+", 
  "Public", "Small Business", "Disadvantaged Business", 
  "Women-Owned Business", "Veteran-Owned Business", "HUBZone"
];

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
            <Label htmlFor="techCategory" className="mb-2 block">Technology Category *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {techCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={data.techCategory?.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange({ techCategory: [...(data.techCategory || []), category] });
                      } else {
                        onChange({
                          techCategory: (data.techCategory || []).filter((item) => item !== category),
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
          </div>

          <div>
            <Label htmlFor="fundingInstrumentTypes" className="mb-2 block">Funding Instrument Types *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fundingInstrumentTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={data.fundingInstrumentTypes?.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange({ 
                          fundingInstrumentTypes: [...(data.fundingInstrumentTypes || []), type] 
                        });
                      } else {
                        onChange({
                          fundingInstrumentTypes: (data.fundingInstrumentTypes || []).filter(
                            (item) => item !== type
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={type} className="text-sm font-normal">
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="eligibleAgencyCodes" className="mb-2 block">Eligible Agency Codes</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {agencyCodes.map((code) => (
                <div key={code} className="flex items-center space-x-2">
                  <Checkbox
                    id={code}
                    checked={data.eligibleAgencyCodes?.includes(code)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange({ 
                          eligibleAgencyCodes: [...(data.eligibleAgencyCodes || []), code] 
                        });
                      } else {
                        onChange({
                          eligibleAgencyCodes: (data.eligibleAgencyCodes || []).filter(
                            (item) => item !== code
                          ),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={code} className="text-sm font-normal">
                    {code}
                  </Label>
                </div>
              ))}
            </div>
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
