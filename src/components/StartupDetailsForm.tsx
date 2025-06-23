
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/ui/tag-input";
import type { CompanyData } from "@/types/form";

// Define options aligned with government categories and funding types
const techCategories = [
  "Propulsion", "Satellites", "Robotics", "AI/ML", "Earth Observation", 
  "Communications", "Manufacturing", "Materials Science", "Other"
];

// Agency codes
const agencyCodes = [
  "DARPA", "DOD", "NASA", "DOE", "DOT", "NSF", "DHS", "USDA", "HHS", 
  "EPA", "DOC", "DOI", "DOJ", "DOS", "ED", "HUD", "DOL", "VA"
];

// US States for dropdown
const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC", "PR", "VI", "AS", "GU", "MP"
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

// Generate years from current year down to 1950
const currentYear = new Date().getFullYear();
const foundedYears = Array.from(
  { length: currentYear - 1950 + 1 },
  (_, index) => (currentYear - index).toString()
);

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
            <Label htmlFor="teamSize">Team Size</Label>
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
            <Label htmlFor="foundedYear">Founded Year</Label>
            <select
              id="foundedYear"
              className="w-full bg-white/5 border-white/20 text-white rounded-md py-2 px-3"
              value={data.foundedYear || ""}
              onChange={(e) => onChange({ foundedYear: e.target.value })}
              required
            >
              <option value="">Select Year</option>
              {foundedYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                className="bg-white/5 border-white/20"
                value={data.city || ""}
                onChange={(e) => onChange({ city: e.target.value })}
                placeholder="e.g., Austin"
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <select
                id="state"
                className="w-full bg-white/5 border-white/20 text-white rounded-md py-2 px-3"
                value={data.state || ""}
                onChange={(e) => onChange({ state: e.target.value })}
              >
                <option value="">Select State</option>
                {usStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
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
            <Label htmlFor="keywords">Keywords *</Label>
            <TagInput
              value={data.keywords || []}
              onChange={(tags) => onChange({ keywords: tags })}
              placeholder="Type keyword and press Enter or comma..."
              className="mt-1"
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
