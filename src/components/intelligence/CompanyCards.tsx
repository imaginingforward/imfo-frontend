import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Linkedin, Twitter, ChevronLeft, ChevronRight, DollarSign, MapPin, Calendar } from 'lucide-react';
import { type Company } from "@/services/companyService";

interface CompanyCardsProps {
  companies: Company[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const CompanyCards: React.FC<CompanyCardsProps> = ({
  companies,
  currentPage,
  pageSize,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

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
              
              <div className="grid grid-cols-2 gap-2 text-xs text-white">
                {company.hq_location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{company.hq_location.value}</span>
                  </div>
                )}
                
                {company.year_founded && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>Founded {company.year_founded}</span>
                  </div>
                )}
                
                {company.total_funding_raised && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{company.total_funding_raised}</span>
                  </div>
                )}
                
                {company.stage && (
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="h-5 py-0 px-1 text-white border-white/30 bg-white/10">
                      {company.stage.value}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <CardFooter className="border-t border-white/20 bg-white/10 p-3 flex justify-between">
              <div className="flex gap-3">
                {company.website_url && (
                  <a 
                    href={company.website_url.startsWith('http') ? company.website_url : `http://${company.website_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:text-primary/80"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                
                {company.linkedin_url && (
                  <a 
                    href={company.linkedin_url.startsWith('http') ? company.linkedin_url : `http://${company.linkedin_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                
                {company.twitter_url && (
                  <a 
                    href={company.twitter_url.startsWith('http') ? company.twitter_url : `http://${company.twitter_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sky-400 hover:text-sky-300"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
              
              {company.subsector_tags && (
                <div className="text-xs text-white truncate max-w-[150px]">
                  {company.subsector_tags.value}
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {companies.length === 0 && (
        <div className="text-center py-12 text-white">
          No companies found matching your criteria
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-white">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)} of {totalCount}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <Button 
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
