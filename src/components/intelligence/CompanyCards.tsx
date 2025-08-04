import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Linkedin, Twitter, DollarSign, Calendar } from 'lucide-react';
import { type Company } from "@/services/companyService";

interface CompanyCardsProps {
  companies: Company[];
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

  // Function to get logo placeholder with company initials
  const getLogoPlaceholder = (name: string) => {
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
    
    return initials;
  };

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
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-primary shadow-md">
                  {getLogoPlaceholder(company.company_name)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">{company.company_name}</h3>
                  <Badge variant="outline" className={`${getSectorColor(company.sector)} bg-opacity-20 text-xs`}>
                    {company.sector}
                  </Badge>
                </div>
              </div>
              
              {company.description && (
                <p className="text-sm text-white mb-4 line-clamp-3">
                  {company.description}
                </p>
              )}
              
              {(company as any).business_activity && (
                <p className="text-sm text-white/80 mb-3">
                  <span className="font-medium">Activities:</span> {(company as any).business_activity}
                </p>
              )}
              
              {/* Location info */}
              {company.hq_location && (
                <div className="text-xs text-white mb-3">
                  {company.hq_location}
                </div>
              )}

              {/* Social Icons using Lucide */}
              <div className="flex gap-3 mb-2">
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
                    <Linkedin className="h-4 w-4" />
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
                    <Twitter className="h-4 w-4" />
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
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
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
