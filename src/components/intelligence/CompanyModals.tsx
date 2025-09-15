import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, Users, Handshake, TrendingUp, Lightbulb, Zap, Globe, MapPin, Building, Calendar, DollarSign, Award, Target, X, Expand 
} from 'lucide-react';
import { FrontendCompany } from './types';
import { FullModal } from './FullModal';
import { ResponsiveModal } from './ResponsiveModal';
import { isValidUrl, parseBusinessActivities, getEngagementStyle } from '../../lib/utils';

interface CompanyModalsProps {
  companies: FrontendCompany[];
  selectedCompany: FrontendCompany | null;
  isModalOpen: boolean;
  onModalClose: () => void;
  isSidePanelOpen: boolean;
  onSidePanelClose: () => void;
  onExpandToModal: () => void;
  searchQuery?: string;
  onKeywordClick: (keyword: string, e: React.MouseEvent) => void;
  onLinkClick: (company: string, linkType: string, searchQuery?: string) => void;
  handleCardClick: (company: FrontendCompany) => void;
}

export const CompanyModals: React.FC<CompanyModalsProps> = ({
  companies,
  selectedCompany,
  isModalOpen,
  onModalClose,
  isSidePanelOpen,
  onSidePanelClose,
  onExpandToModal,
  searchQuery,
  onKeywordClick,
  onLinkClick,
  handleCardClick
}) => {

  return (
    <>
      {/* Landing Page Company Cards */}
      <div className="mb-16 sm:mb-20">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Companies</h3>
          <p className="text-gray-600">Discover trending space technology companies</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCardClick(company)}
              className="relative group bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl p-6 cursor-pointer active:scale-98"
            >
              {/* Engagement Badge */}
              {company.engagement_label && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getEngagementStyle(company.engagement_type)} shadow-lg`}>
                  {company.engagement_label}
                </div>
              )}

              {/* Company Info */}
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="mb-3 pr-20">
                    <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {company.company_name}
                    </h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs mt-1">
                      {company.sector}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {company.description}
                  </p>

                  {company.business_activity && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {parseBusinessActivities(company.business_activity).slice(0, 3).map((kw, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onKeywordClick(kw, e);
                          }}
                          className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer active:scale-95"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {company.year_founded && (
                      <div className="text-xs">
                        <span className="text-gray-500">Founded:</span>
                        <span className="ml-1 font-semibold text-gray-900">{company.year_founded}</span>
                      </div>
                    )}
                  </div>

                  {company.hq_location && (
                    <div className="mb-3">
                      <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 border border-gray-200 rounded-md">
                        {company.hq_location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex gap-3 items-center">
                  {isValidUrl(company.linkedin_link) && (
                    <a href={company.linkedin_link} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                       title="LinkedIn" onClick={(e) => e.stopPropagation()}>
                      <img src="/linkedin_logo.png" alt="LinkedIn" className="h-4 w-4" />
                    </a>
                  )}
                  {isValidUrl(company.twitter_link) && (
                    <a href={company.twitter_link} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                       title="X" onClick={(e) => e.stopPropagation()}>
                      <img src="/X_logo.jpeg" alt="Twitter" className="h-4 w-4" />
                    </a>
                  )}
                  {isValidUrl(company.crunchbase_link) && (
                    <a href={company.crunchbase_link} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                       title="Crunchbase" onClick={(e) => e.stopPropagation()}>
                      <img src="/cb_logo.png" alt="Crunchbase" className="h-4 w-4" />
                    </a>
                  )}
                  {isValidUrl(company.website_link) && (
                    <a href={company.website_link} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                       title="Website" onClick={(e) => e.stopPropagation()}>
                      <Globe className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Responsive Modal for desktop & mobile */}
      <ResponsiveModal
        companies={companies}
        selectedCompany={selectedCompany}
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        isSidePanelOpen={isSidePanelOpen}
        onSidePanelClose={onSidePanelClose}
        onExpandToModal={onExpandToModal}
        searchQuery={searchQuery}
        onKeywordClick={onKeywordClick}
        onLinkClick={onLinkClick}
        handleCardClick={handleCardClick}
      />
      
      {/* Full Modal Integration */}
      <FullModal
        selectedCompany={selectedCompany}
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        searchQuery={searchQuery}
        onKeywordClick={onKeywordClick}
        onLinkClick={onLinkClick}
        handleCardClick={handleCardClick}
      />
    </>
  );
};

export default CompanyModals;
