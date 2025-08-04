import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, DollarSign, Calendar } from 'lucide-react';

interface FrontendCompany {
  id: string;
  company_name: string;
  business_activity: string;
  business_area: string;
  sector: string;
  description: string;
  hq_city: string;
  hq_state: string;
  hq_country: string;
  hq_location: string;
  leadership: string;
  latest_funding_stage: string;
  latest_funding_raised: string;
  total_funding_raised: string;
  capital_partners: string;
  notable_partners: string;
  website_url: string;
  linkedin_url: string;
  crunchbase_url: string;
  twitter_url: string;
}

interface CompanyCardsProps {
  companies: FrontendCompany[];
  onKeywordClick?: (keyword: string) => void;
}

export const CompanyCards: React.FC<CompanyCardsProps> = 
  ({ companies, onKeywordClick }) => {
  
  // Debug: Log company data to see URLs  
  useEffect(() => {
    if (companies.length > 0) {
      console.log('Full company object keys:', Object.keys(companies[0]));
      console.log('Sample company:', companies[0]);
    }
  }, [companies]);

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
            className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:border-purple-300/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
          >
            <CardContent className="p-6">
            {/* Company Name */}
              <div className="mb-3">
                <h3 className="font-bold text-lg text-white text-left">{company.company_name}</h3>
                <Badge variant="outline" className={`${getSectorColor(company.sector)} bg-opacity-20 text-xs mt-1`}>
                  {company.sector}
                </Badge>
              </div>

            {/* Description */}
            {company.description && (
              <p className="text-sm text-gray-200 mb-4 text-left line-clamp-3 leading-relaxed">
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
                        className="px-3 py-1 text-xs bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full hover:bg-purple-500/30 hover:border-purple-300/50 transition-all duration-200 cursor-pointer"
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
                  <span className="text-sm text-white/90">{company.hq_location}</span>
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
                  className="text-blue-300 hover:text-blue-200 transition-colors p-1 hover:bg-white/10 rounded"
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
                  className="text-silver-300 hover:text-silver-200 transition-colors p-1 hover:bg-white/10 rounded"
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
                  className="text-blue-300 hover:text-blue-200 transition-colors p-1 hover:bg-white/10 rounded"
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
                  className="text-purple-300 hover:text-purple-200 transition-colors p-1 hover:bg-white/10 rounded"
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
        <div className="text-center py-12 text-white">
          No companies found matching your criteria
        </div>
      )}
    </div>
  );
};
