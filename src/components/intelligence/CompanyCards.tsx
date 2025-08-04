import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Linkedin, Twitter, DollarSign, Calendar } from 'lucide-react';

interface ElasticsearchCompany {
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
  companies: ElasticsearchCompany[];
}

export const CompanyCards: React.FC<CompanyCardsProps> = 
  ({ companies }) => {
  
  // Debug: Log company data to see URLs  
  useEffect(() => {
    if (companies.length > 0) {
      console.log('Full company object keys:', Object.keys(companies[0]));
      console.log('Sample company:', companies[0]);
    }
  }, [companies]);

  // Helper function
  const isValidUrl = (url?: string): boolean => {
    return !!url && typeof url === "string" && url.trim().length > 5;
  };
  
  // Function to get a color based on sector
  const getSectorColor = (sector: string) => {
    const colorMap: Record<string, string> = {
      'Space Tech': 'bg-blue-500',
      'Health Tech': 'bg-green-500',
      'Industrial Tech': 'bg-amber-500',
      'Robotics': 'bg-violet-500',
      'Cybersecurity': 'bg-red-500',
      'Climate Tech': 'bg-emerald-500',
      'Quantum': 'bg-purple-500',
      'Bio Tech': 'bg-teal-500'
    };
    
    return colorMap[sector] || 'bg-gray-500';
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <Card 
            key={company.id} 
            className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} border-white/20 overflow-hidden hover:border-white/30 transition-all`}
          >
            {/* Company Name */}
            <div className="mb-3">
              <h3 className="font-bold text-lg text-white text-left">{company.company_name}</h3>
              <Badge variant="outline" className={`${getSectorColor(company.sector)} bg-opacity-20 text-xs mt-1`}>
                {company.sector}
              </Badge>
            </div>

            {/* Description */}
            {company.description && (
              <p className="text-sm text-white mb-3 text-left line-clamp-3">
                {company.description}
              </p>
            )}

            {/* Keywords and Tags */}
            {(company as any).business_activity && (
              <div className="mb-3 text-left">
                <span className="text-xs text-white/60 font-medium">Activities:</span>
                <p className="text-sm text-white/90 mt-1">{company.business_activity}</p>
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
                  className="text-blue-400 hover:text-blue-300 transition-colors"
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
                  className="text-sky-400 hover:text-sky-300 transition-colors"
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
                  className="text-orange-400 hover:text-orange-300 transition-colors"
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
                  className="text-primary hover:text-primary/80 transition-colors"
                  title="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
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
