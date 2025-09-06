import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Globe, MapPin, Building, Users, Calendar, DollarSign, Award, Target, Briefcase, TrendingUp, Shield, Bell, X, Expand, ArrowRight } from 'lucide-react';
import mixpanel from "mixpanel-browser";

interface FrontendCompany {
  id: string;
  company_name: string;
  sector: string;
  business_activity: string;
  business_area: string;
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
  public_ticker?: string;
  year_founded?: string;
  hiring?: string;
  products_services?: string;
  capabilities?: string;
  buyer_types?: string;
  name?: string; // Duplicate company_name
  business_activity_new?: string;  // Duplicate business_activity
  capital_partners?: string; // Duplicate capital_partners
  market_ticker?: string; // Duplicate public_ticker
  certifications_trl?: string;
  notable_contracts?: string;
  signals?: string;
  location?: string;
}

interface CompanyCardsProps {
  companies: FrontendCompany[];
  onKeywordClick?: (keyword: string) => void;
  searchQuery?: string;
}

export const CompanyCards: React.FC<CompanyCardsProps> = 
  ({ companies, onKeywordClick, searchQuery }) => {
  
  const [selectedCompany, setSelectedCompany] = useState<FrontendCompany | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  
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

  const openSidePanel = (company: FrontendCompany) => {
    setSelectedCompany(company);
    setIsSidePanelOpen(true);
  };

  const expandToFullModal = () => {
    setIsSidePanelOpen(false);
    setIsModalOpen(true);
  };

  const openCompanyDetailsResponsive = (company: FrontendCompany) => {
    const isMobile = window.innerWidth < 640; // tailwind 'sm' breakpoint
    setSelectedCompany(company);

    if (isMobile) {
      setIsModalOpen(true); // Slide-up modal for mobile
    } else {
      setIsSidePanelOpen(true); // Side panel for desktop
    }
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
  const handleKeywordClick = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
  };

  // Mixpanel
  const trackClick = (company: string, linkType: string, searchTerm?: string) => {
    mixpanel.track("Result Clicked", {
      result_type: linkType,           
      result_id: company,
      search_term: searchTerm || 'unknown',
      timestamp: new Date().toISOString(),
      click_position: companies.findIndex(c => c.company_name === company) + 1
    });
  };

  const trackCompanyCardClick = (company: string, searchTerm?: string) => {
    mixpanel.track("Result Clicked", {
      result_type: "company_card",
      result_id: company,
      search_term: searchTerm || 'unknown',
      timestamp: new Date().toISOString(),
      click_position: companies.findIndex(c => c.company_name === company) + 1
    });
  };

  // Results in grid form  
  return (
    <div className="space-y-4 sm:space-y-6">
      {companies.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {companies.length} companies found
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {companies.map((company, index) => (
          <Card 
            key={company.id} 
            className="bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-98 cursor-pointer"
            onClick={() => {
              console.log('Card clicked for:', company.company_name);
              trackCompanyCardClick(company.company_name, searchQuery);
              openCompanyDetailsResponsive(company);
            }}
          >
            <CardContent className="p-4 sm:p-6 flex flex-col h-full">
              <div className="flex-1">
                
                {/* Company Name */}
                <div className="mb-3">
                  <h3 className="font-bold text-base sm:text-lg text-foreground text-left hover:text-primary transition-colors line-clamp-2">
                    {company.company_name || company.name}
                  </h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs mt-1">
                    {company.sector || company.sector_new}
                  </Badge>
                </div>

                {/* Description */}
                {(company.description || company.description_new) && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 text-left line-clamp-3 leading-relaxed">
                    {company.description || company.description_new}
                  </p>
                )}

                {/* Business Activity Tag */}
                {(company.business_activity || company.business_activity_new) && (
                  <div className="mb-3 sm:mb-4 text-left">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {parseBusinessActivities(company.business_activity || company.business_activity_new).slice(0, 4).map((keyword, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => handleKeywordClick(keyword, e)}
                          className="px-2 sm:px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 hover:border-primary/30 transition-all duration-200 cursor-pointer active:scale-95"
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Location */}
               {(company.hq_location || company.location) && (
                 <div className="mb-3 text-left">
                   <span className="px-3 py-1 text-xs bg-muted/50 text-muted-foreground border border-muted rounded-md">
                     {company.hq_location || company.location}
                  </span>
                 </div>
               )}

              {/* Social Icons using /public */}
              <div className="flex gap-2 sm:gap-3 items-center">
                {isValidUrl(company.linkedin_url) && (
                  <a 
                    href={company.linkedin_url.trim().startsWith('http') 
                      ? company.linkedin_url.trim()
                      : `https://${company.linkedin_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-500 transition-colors p-1.5 sm:p-2 hover:bg-accent rounded active:scale-95"
                    title="LinkedIn"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackClick(company.company_name, 'linkedin', searchQuery);
                    }}
                  >
                    <img src="/linkedin_logo.png" alt="LinkedIn" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
                
                {isValidUrl(company.twitter_url) && (
                  <a 
                    href={company.twitter_url.trim().startsWith('http') 
                      ? company.twitter_url.trim()
                      : `https://${company.twitter_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 sm:p-2 hover:bg-accent rounded active:scale-95"
                    title="X"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackClick(company.company_name, 'twitter', searchQuery);
                    }}
                  >
                    <img src="/X_logo.jpeg" alt="X" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
                
                {isValidUrl(company.crunchbase_url) && (
                  <a 
                    href={company.crunchbase_url.trim().startsWith('http') 
                      ? company.crunchbase_url.trim()
                      : `https://${company.crunchbase_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-orange-600 hover:text-orange-500 transition-colors p-1.5 sm:p-2 hover:bg-accent rounded active:scale-95"
                    title="Crunchbase"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackClick(company.company_name, 'crunchbase', searchQuery);
                    }}
                  >
                    <img src="/cb_logo.png" alt="Crunchbase" className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
                
                {isValidUrl(company.website_url) && (
                  <a 
                    href={company.website_url.trim().startsWith('http') 
                      ? company.website_url.trim() 
                      : `https://${company.website_url.trim()}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary/80 transition-colors p-1.5 sm:p-2 hover:bg-accent rounded active:scale-95"
                    title="Website"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackClick(company.company_name, 'website', searchQuery);
                    }}
                  >
                    <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </a>
                )}
              </div>

              {/* Request Intro Button Company List */}
              <div className="mt-auto -mb-6 -mx-6">
                <a 
                  href="https://calendly.com/imaginingforward/techweek-discovery?" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center px-3 py-3 text-xs font-medium bg-primary/20 text-primary rounded-md hover:bg-primary/40 hover:shadow-md transition-colors active:scale-95 text-center border-t border-primary/20"
                  title="Request Intro"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackClick(company.company_name, 'calendly', searchQuery);
                  }}
                >
                  Request Intro
                </a>
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
    </div>
