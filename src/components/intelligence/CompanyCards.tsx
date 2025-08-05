import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Globe, MapPin, Building, Users, Calendar, DollarSign, Award, Target } from 'lucide-react';

interface FrontendCompany {
  id: string;
  company_name: string;
  business_activity: string;
  business_area: string;
  sector: string;
  subsector_tags?: string;
  stage?: string;
  description: string;
  hq_city: string;
  hq_state: string;
  hq_country: string;
  hq_location: string;
  leadership: string;
  latest_funding_stage: string;
  latest_funding_raised: string;
  total_funding_raised: string;
  annual_revenue?: string;
  capital_partners: string;
  notable_partners: string;
  website_url: string;
  linkedin_url: string;
  crunchbase_url: string;
  twitter_url: string;
  year_founded?: string;
  hiring?: string;
}

interface CompanyCardsProps {
  companies: FrontendCompany[];
  onKeywordClick?: (keyword: string) => void;
}

export const CompanyCards: React.FC<CompanyCardsProps> = 
  ({ companies, onKeywordClick }) => {
  
  const [selectedCompany, setSelectedCompany] = useState<FrontendCompany | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Debug: Log company data to see URLs  
  useEffect(() => {
    if (companies.length > 0) {
      console.log('Full company object keys:', Object.keys(companies[0]));
      console.log('Sample company:', companies[0]);
    }
  }, [companies]);

  const openCompanyDetails = (company: FrontendCompany) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  // Helper function to validate URLs
  const isValidUrl = (url?: string): boolean => {
    return !!url && typeof url === "string" && url.trim().length > 5;
  };

  // Function to parse business activities into clickable keywords
  const parseBusinessActivities = (activities: string): string[] => {
    if (!activities) return [];
    
    // Split by period, semicolon, and clean up
    return activities
      .split(/[;.]/)
      .map(activity => activity.trim())
      .filter(activity => activity.length > 0 && activity.length < 50) // Filter reasonable lengths
      .slice(0, 6); // Limit to 6 keywords max
  };

  // Function to get a color based on sector
  const getSectorColor = (sector: string) => {
    const colorMap: Record<string, string> = {
      'Space Tech': 'bg-blue-500/20 text-blue-200 border-blue-400/30',
      'Health Tech': 'bg-green-500/20 text-green-200 border-green-400/30',
      'Industrial Tech': 'bg-amber-500/20 text-amber-200 border-amber-400/30',
      'Robotics': 'bg-violet-500/20 text-violet-200 border-violet-400/30',
      'Cybersecurity': 'bg-red-500/20 text-red-200 border-red-400/30',
      'Climate Tech': 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
      'Quantum': 'bg-purple-500/20 text-purple-200 border-purple-400/30',
      'Bio Tech': 'bg-teal-500/20 text-teal-200 border-teal-400/30'
    };
    
    return colorMap[sector] || 'bg-gray-500/20 text-gray-200 border-gray-400/30';
  };
  
  // Handle keyword click
  const handleKeywordClick = (keyword: string) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };
    
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <Card 
            key={company.id} 
            className="bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <CardContent className="p-6">
            {/* Company Name */}
              <div className="mb-3">
                <h3 
                  className="font-bold text-lg text-foreground text-left cursor-pointer hover:text-primary transition-colors" 
                  onClick={() => openCompanyDetails(company)}
                >
                  {company.company_name}
                </h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs mt-1">
                  {company.sector}
                </Badge>
              </div>

            {/* Description */}
            {company.description && (
              <p className="text-sm text-muted-foreground mb-4 text-left line-clamp-3 leading-relaxed">
                {company.description}
              </p>
            )}

            {/* Keywords and Tags */}
            {company.business_activity && (
                <div className="mb-4 text-left">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {parseBusinessActivities(company.business_activity).map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleKeywordClick(keyword)}
                        className="px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
            {/* Location */}
            {company.hq_location && (
              <div className="mb-3 text-left">
                  <span className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground border border-muted rounded-md">
                  </span>
              </div>
            )}

            {/* Social Icons using Lucide */}
            <div className="flex gap-3 items-center">
              {isValidUrl(company.linkedin_url) && (
                <a 
                  href={company.linkedin_url.trim().startsWith('http') 
                    ? company.linkedin_url.trim()
                    : `https://${company.linkedin_url.trim()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:text-blue-500 transition-colors p-1 hover:bg-accent rounded"
                  title="LinkedIn"
                >
                  <img src="/linkedin_logo.png" alt="LinkedIn" className="h-4 w-4" />
                </a>
              )}
              
              {isValidUrl(company.twitter_url) && (
                <a 
                  href={company.twitter_url.trim().startsWith('http') 
                    ? company.twitter_url.trim()
                    : `https://${company.twitter_url.trim()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-accent rounded"
                  title="X"
                >
                  <img src="/X_logo.png" alt="X" className="h-4 w-4" />
                </a>
              )}
              
              {isValidUrl(company.crunchbase_url) && (
                <a 
                  href={company.crunchbase_url.trim().startsWith('http') 
                    ? company.crunchbase_url.trim()
                    : `https://${company.crunchbase_url.trim()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-orange-600 hover:text-orange-500 transition-colors p-1 hover:bg-accent rounded"
                  title="Crunchbase"
                >
                  <img src="/cb_logo.png" alt="Crunchbase" className="h-4 w-4" />
                </a>
              )}
              
              {isValidUrl(company.website_url) && (
                <a 
                  href={company.website_url.trim().startsWith('http') 
                    ? company.website_url.trim() 
                    : `https://${company.website_url.trim()}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-accent rounded"
                  title="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {companies.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No companies found matching your criteria
        </div>
      )}

      {/* Company Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Building className="h-6 w-6 text-primary" />
              {selectedCompany?.company_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6 mt-6">
              {/* Header Section */}
              <div className="border-b pb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {selectedCompany.sector}
                  </Badge>
                  {selectedCompany.stage && (
                    <Badge variant="outline" className="border-border">
                      {selectedCompany.stage}
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{selectedCompany.description}</p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Location */}
                  {selectedCompany.hq_location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Location</h4>
                        <p className="text-muted-foreground">{selectedCompany.hq_location}</p>
                      </div>
                    </div>
                  )}

                  {/* Leadership */}
                  {selectedCompany.leadership && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Leadership</h4>
                        <p className="text-muted-foreground">{selectedCompany.leadership}</p>
                      </div>
                    </div>
                  )}

                  {/* Founded */}
                  {selectedCompany.year_founded && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Founded</h4>
                        <p className="text-muted-foreground">{selectedCompany.year_founded}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Funding Stage */}
                  {selectedCompany.latest_funding_stage && (
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Funding Stage</h4>
                        <p className="text-muted-foreground">{selectedCompany.latest_funding_stage}</p>
                      </div>
                    </div>
                  )}

                  {/* Total Funding */}
                  {selectedCompany.total_funding_raised && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Total Funding</h4>
                        <p className="text-muted-foreground">{selectedCompany.total_funding_raised}</p>
                      </div>
                    </div>
                  )}

                  {/* Revenue */}
                  {selectedCompany.annual_revenue && (
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Annual Revenue</h4>
                        <p className="text-muted-foreground">{selectedCompany.annual_revenue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Activity */}
              {selectedCompany.business_activity && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Business Activities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {parseBusinessActivities(selectedCompany.business_activity).map((activity, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 cursor-pointer"
                        onClick={() => handleKeywordClick(activity)}
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Partners */}
              {(selectedCompany.capital_partners || selectedCompany.notable_partners) && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Partners & Investors</h4>
                  <div className="space-y-2">
                    {selectedCompany.capital_partners && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Capital Partners: </span>
                        <span className="text-foreground">{selectedCompany.capital_partners}</span>
                      </div>
                    )}
                    {selectedCompany.notable_partners && (
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Notable Partners: </span>
                        <span className="text-foreground">{selectedCompany.notable_partners}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-4 pt-4 border-t">
                {isValidUrl(selectedCompany.website_url) && (
                  <a 
                    href={selectedCompany.website_url.trim().startsWith('http') 
                      ? selectedCompany.website_url.trim() 
                      : `https://${selectedCompany.website_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                {isValidUrl(selectedCompany.linkedin_url) && (
                  <a 
                    href={selectedCompany.linkedin_url.trim().startsWith('http') 
                      ? selectedCompany.linkedin_url.trim()
                      : `https://${selectedCompany.linkedin_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 rounded-md hover:bg-blue-500/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {isValidUrl(selectedCompany.crunchbase_url) && (
                  <a 
                    href={selectedCompany.crunchbase_url.trim().startsWith('http') 
                      ? selectedCompany.crunchbase_url.trim()
                      : `https://${selectedCompany.crunchbase_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 rounded-md hover:bg-orange-500/20 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Crunchbase
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
