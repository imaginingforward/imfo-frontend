import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ExternalLink, Users, Handshake, TrendingUp, Lightbulb, Zap, Globe, MapPin, Building, Calendar, DollarSign, Award, Target, X 
} from 'lucide-react';
import { FrontendCompany } from './types';
import { FullModal } from './FullModal';
import { isValidUrl, parseBusinessActivities, getEngagementStyle, formatCurrency } from '../../lib/utils';

interface ResponsiveModalProps {
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

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
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
      {/* Side Panel */}
      {selectedCompany && (
        <>
          <div className={`fixed inset-y-0 right-0 z-50 w-[500px] transform transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/90 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold mb-2 line-clamp-2">{selectedCompany.company_name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/20 text-primary border-primary/30">{selectedCompany.sector}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={onExpandToModal} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 active:scale-95" title="Expand to full view">
                    <Expand className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      onSidePanelClose();
                      handleCardClick(null as unknown as FrontendCompany);
                    }}
                    className="p-2 rounded-lg bg-muted/50 hover:bg-muted/70 active:scale-95" 
                    title="Close panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Overview */}
                <div className="bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3"><Building className="h-5 w-5 text-primary" /><h3 className="font-semibold">Company Overview</h3></div>
                  <p className="text-muted-foreground leading-relaxed">{selectedCompany.description}</p>
                  {selectedCompany.business_area && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-muted-foreground">Business Area: </span>
                      <span className="text-sm">{selectedCompany.business_area}</span>
                    </div>
                  )}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {selectedCompany.hq_location && <div className="bg-gradient-to-br from-secondary/5 to-muted/5 border border-secondary/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-secondary" /><span className="text-sm text-muted-foreground">Location</span></div><p className="text-lg font-semibold">{selectedCompany.hq_location}</p></div>}
                  {selectedCompany.year_founded && <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Founded</span></div><p className="text-lg font-semibold">{selectedCompany.year_founded}</p></div>}
                  {selectedCompany.latest_funding_stage && <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-orange-600" /><span className="text-sm text-muted-foreground">Funding Stage</span></div><p className="text-lg font-semibold">{selectedCompany.latest_funding_stage}</p></div>}
                  {selectedCompany.latest_funding_raised && <div className="bg-gradient-to-br from-green-300/5 to-green-500/10 border border-green-400/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-green-700" /><span className="text-sm text-muted-foreground">Latest Funding</span></div><p className="text-lg font-semibold">{formatCurrency(selectedCompany.latest_funding_raised)}</p></div>}
                  {selectedCompany.total_funding_raised && <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-green-600" /><span className="text-sm text-muted-foreground">Total Funding</span></div><p className="text-lg font-semibold">{formatCurrency(selectedCompany.total_funding_raised)}</p></div>}
                  {selectedCompany.public_ticker && <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20 rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-orange-600" /><span className="text-sm text-muted-foreground">Ticker</span></div><p className="text-lg font-semibold">{selectedCompany.public_ticker}</p></div>}
                </div>

                {/* Financial Metrics (Web-scraped) */}
                {(selectedCompany.revenue_arr || selectedCompany.annual_revenue || selectedCompany.ebitda || selectedCompany.free_cash_flow) && (
                  <div className="bg-gradient-to-br from-card/50 to-muted/30 border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-4 w-4 text-primary" /><h3 className="font-semibold">Financial Metrics</h3></div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {selectedCompany.revenue_arr && <div><span className="text-muted-foreground">ARR:</span> <span className="font-medium">{formatCurrency(selectedCompany.revenue_arr)}</span></div>}
                      {selectedCompany.annual_revenue && <div><span className="text-muted-foreground">Annual Revenue:</span> <span className="font-medium">{formatCurrency(selectedCompany.annual_revenue)}</span></div>}
                      {selectedCompany.ebitda && <div><span className="text-muted-foreground">EBITDA:</span> <span className="font-medium">{formatCurrency(selectedCompany.ebitda)}</span></div>}
                      {selectedCompany.free_cash_flow && <div><span className="text-muted-foreground">Free Cash Flow:</span> <span className="font-medium">{formatCurrency(selectedCompany.free_cash_flow)}</span></div>}
                      {selectedCompany.debt_current && <div><span className="text-muted-foreground">Current Debt:</span> <span className="font-medium">{formatCurrency(selectedCompany.debt_current)}</span></div>}
                      {selectedCompany.debt_net && <div><span className="text-muted-foreground">Net Debt:</span> <span className="font-medium">{formatCurrency(selectedCompany.debt_net)}</span></div>}
                    </div>
                  </div>
                )}

                {/* Business Activities */}
                {selectedCompany.business_activity && (
                  <div className="bg-gradient-to-br from-card/50 to-muted/30 border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-primary" /><h3 className="font-semibold">Business Activities</h3></div>
                    <div className="flex flex-wrap gap-2">
                      {parseBusinessActivities(selectedCompany.business_activity).slice(0, 6).map((activity, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); onKeywordClick(activity, e); }}
                          className="px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 active:scale-95"
                        >
                          {activity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leadership */}
                {selectedCompany.leadership && (
                   <div className="bg-gradient-to-br from-card/50 to-muted/30 border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><Users className="h-4 w-4 text-primary" /><h3 className="font-semibold">Leadership</h3></div>
                    <p className="text-sm text-muted-foreground">{selectedCompany.leadership}</p>
                  </div>
                )}
                
                {/* Partners & Contracts */}
                {(selectedCompany.capital_partners || selectedCompany.notable_partners || selectedCompany.notable_contracts) && (
                  <div className="bg-gradient-to-br from-card/50 to-muted/30 border border-border/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3"><Handshake className="h-4 w-4 text-primary" /><h3 className="font-semibold">Partnerships & Contracts</h3></div>
                    {selectedCompany.capital_partners && <div className="mb-2"><span className="text-sm font-medium text-muted-foreground">Capital Partners: </span><span className="text-sm">{selectedCompany.capital_partners}</span></div>}
                    {selectedCompany.notable_partners && <div className="mb-2"><span className="text-sm font-medium text-muted-foreground">Notable Partners: </span><span className="text-sm">{selectedCompany.notable_partners}</span></div>}
                    {selectedCompany.notable_contracts && <div><span className="text-sm font-medium text-muted-foreground">Notable Contracts: </span><span className="text-sm">{selectedCompany.notable_contracts}</span></div>}
                  </div>
                )}
                
                {/* Market & Operations */}
                {(selectedCompany.consumer_base_size || selectedCompany.concentration || selectedCompany.segment_local_vs_international || selectedCompany.buyer_types) && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Globe className="h-5 w-5" /> Market & Operations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCompany.consumer_base_size && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Consumer Base Size</div><div className="text-lg font-semibold">{selectedCompany.consumer_base_size}</div></div>}
                      {selectedCompany.concentration && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Market Concentration</div><div className="text-lg font-semibold">{selectedCompany.concentration}</div></div>}
                      {selectedCompany.segment_local_vs_international && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Market Segments</div><div className="text-lg font-semibold">{selectedCompany.segment_local_vs_international}</div></div>}
                      {selectedCompany.buyer_types && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Buyer Types</div><div className="text-lg font-semibold">{selectedCompany.buyer_types}</div></div>}
                    </div>
                  </div>
                )}

                {/* Products & Capabilities */}
                {(selectedCompany.products_services || selectedCompany.capabilities) && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="h-5 w-5" /> Products & Capabilities</h3>
                    {selectedCompany.products_services && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Products & Services</h4>
                        <p className="text-muted-foreground">{selectedCompany.products_services}</p>
                      </div>
                    )}
                    {selectedCompany.capabilities && (
                      <div>
                        <h4 className="font-medium mb-2">Core Capabilities</h4>
                        <p className="text-muted-foreground">{selectedCompany.capabilities}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Innovation & IP */}
                {(selectedCompany.patent_highlights || selectedCompany.government_announcements) && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Innovation & IP</h3>
                    {selectedCompany.patent_highlights && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Patent Highlights</h4>
                        <p className="text-muted-foreground">{selectedCompany.patent_highlights}</p>
                      </div>
                    )}
                    {selectedCompany.government_announcements && (
                      <div>
                        <h4 className="font-medium mb-2">Government Announcements</h4>
                        <p className="text-muted-foreground">{selectedCompany.government_announcements}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Resources & Links */}
                {(selectedCompany.key_press_links?.length > 0 || selectedCompany.job_board_links?.length > 0 || selectedCompany.hiring) && (
                  <div className="bg-card border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ExternalLink className="h-5 w-5" /> Resources & Opportunities</h3>
        
                    {selectedCompany.hiring && (
                      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-800 mb-2">Hiring Information</h4>
                        <p className="text-sm text-green-700">{selectedCompany.hiring}</p>
                      </div>
                    )}

                    {selectedCompany.key_press_links?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Key Press Coverage</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCompany.key_press_links.slice(0, 3).map((link, idx) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full hover:bg-blue-100 active:scale-95"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Press Article {idx + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
        
                {/* Request Intro Button */}
                <div className="pt-4">
                  <a
                    href="https://calendly.com/imaginingforward/techweek-discovery?"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95"
                    onClick={(e) => { e.stopPropagation(); onLinkClick(selectedCompany.company_name, 'calendly_sidepanel', searchQuery); }}
                  >
                    Request Intro
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" 
            onClick={() => {
              onSidePanelClose();
              handleCardClick(null as unknown as FrontendCompany);
            }} 
            />
        </>
      )}
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
