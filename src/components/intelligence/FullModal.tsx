import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ExternalLink, Users, Handshake, TrendingUp, Lightbulb, Zap, Globe, MapPin, Building, Calendar, DollarSign, Award, Target, X 
} from 'lucide-react';
import { FrontendCompany } from './types';
import { isValidUrl, parseBusinessActivities, getEngagementStyle, formatCurrency } from '../../lib/utils';

interface FullModalProps {
  selectedCompany: FrontendCompany | null;
  isModalOpen: boolean;
  onModalClose: () => void;
  searchQuery?: string;
  onKeywordClick: (keyword: string, e: React.MouseEvent) => void;
  onLinkClick: (company: string, linkType: string, searchQuery?: string) => void;
  handleCardClick: (company: FrontendCompany) => void;
}

export const FullModal: React.FC<FullModalProps> = ({
  selectedCompany,
  isModalOpen,
  onModalClose,
  searchQuery,
  onKeywordClick,
  onLinkClick,
  handleCardClick
}) => {

  return (
    <>
      {/* Full Modal */}
      {selectedCompany && (
        <Dialog
          open={isModalOpen} 
          onOpenChange={(open) => {
            if (!open) {
              onModalClose();
              handleCardClick(null as unknown as FrontendCompany);
            }
          }}
        >
          <DialogContent className="max-w-6xl w-[95vw] h-[95vh] md:overflow-hidden bg-background text-foreground border border-border p-0 flex flex-col">
            <DialogHeader className="p-6 border-b flex-shrink-0 bg-muted/30 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl sm:text-3xl font-bold mb-3 line-clamp-2">{selectedCompany.company_name}</DialogTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">{selectedCompany.sector}</Badge>
                  {selectedCompany.stage && <Badge variant="outline" className="text-sm px-3 py-1">{selectedCompany.stage}</Badge>}
                </div>
              </div>
              <div className="ml-4">
                <a
                  href="https://calendly.com/imaginingforward/techweek-discovery?"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95"
                  onClick={(e) => { e.stopPropagation(); onLinkClick(selectedCompany.company_name, 'calendly_modal', searchQuery); }}
                >
                  Request Intro
                </a>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Overview */}
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building className="h-5 w-5" /> Company Overview</h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-4">{selectedCompany.description}</p>
                {selectedCompany.business_area && (
                  <div className="bg-muted/30 rounded-lg p-3">
                    <span className="text-sm font-medium">Business Area: </span>
                    <span className="text-sm text-muted-foreground">{selectedCompany.business_area}</span>
                  </div>
                )}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedCompany.year_founded && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Founded</span></div><p className="text-xl font-bold">{selectedCompany.year_founded}</p></div>}
                {selectedCompany.latest_funding_stage && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Funding Stage</span></div><p className="text-lg font-semibold">{selectedCompany.latest_funding_stage}</p></div>}
                {selectedCompany.total_funding_raised && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Total Funding</span></div><p className="text-lg font-semibold">{formatCurrency(selectedCompany.total_funding_raised)}</p></div>}
                {selectedCompany.latest_funding_raised && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Latest Funding</span></div><p className="text-lg font-semibold">{formatCurrency(selectedCompany.latest_funding_raised)}</p></div>}
                {selectedCompany.hq_location && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Headquarters</span></div><p className="text-lg font-semibold">{selectedCompany.hq_location}</p></div>}
                {selectedCompany.public_ticker && <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Ticker</span></div><p className="text-lg font-semibold">{selectedCompany.public_ticker}</p></div>}
              </div>
              

              {/* Financial Performance */}
              {(selectedCompany.revenue_arr || selectedCompany.annual_revenue || selectedCompany.ebitda || selectedCompany.free_cash_flow || selectedCompany.debt_current || selectedCompany.debt_net) && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-5 w-5" /> Financial Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedCompany.revenue_arr && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Annual Recurring Revenue</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.revenue_arr)}</div></div>}
                    {selectedCompany.annual_revenue && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Annual Revenue</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.annual_revenue)}</div></div>}
                    {selectedCompany.ebitda && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">EBITDA</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.ebitda)}</div></div>}
                    {selectedCompany.free_cash_flow && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Free Cash Flow</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.free_cash_flow)}</div></div>}
                    {selectedCompany.debt_current && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Current Debt</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.debt_current)}</div></div>}
                    {selectedCompany.debt_net && <div className="bg-muted/30 rounded-lg p-4"><div className="text-sm text-muted-foreground mb-1">Net Debt</div><div className="text-xl font-bold">{formatCurrency(selectedCompany.debt_net)}</div></div>}
                  </div>
                  {selectedCompany.revenue_forecast && (
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800 mb-1">Revenue Forecast</div>
                      <div className="text-sm text-blue-700">{selectedCompany.revenue_forecast}</div>
                    </div>
                  )}
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

              {/* Business Activities */}
              {selectedCompany.business_activity && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Target className="h-5 w-5" /> Business Activities</h3>
                  <div className="flex flex-wrap gap-3">
                    {parseBusinessActivities(selectedCompany.business_activity).map((activity, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); onKeywordClick(activity, e); }}
                        className="px-4 py-2 text-sm bg-primary/10 text-primary border border-primary/20 rounded-lg hover:bg-primary/20 active:scale-95"
                      >
                        {activity}
                      </button>
                    ))}
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

              {/* Leadership */}
              {selectedCompany.leadership && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" /> Leadership Team</h3>
                  <p className="text-muted-foreground leading-relaxed">{selectedCompany.leadership}</p>
                </div>
              )}

              {/* Partnerships & Strategic Relationships */}
              {(selectedCompany.capital_partners || selectedCompany.notable_partners || selectedCompany.notable_contracts) && (
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Handshake className="h-5 w-5" /> Partnerships & Contracts</h3>
                  <div className="space-y-4">
                    {selectedCompany.capital_partners && (
                      <div>
                        <h4 className="font-medium mb-2">Capital Partners</h4>
                        <p className="text-muted-foreground">{selectedCompany.capital_partners}</p>
                      </div>
                    )}
                    {selectedCompany.notable_partners && (
                      <div>
                        <h4 className="font-medium mb-2">Notable Partners</h4>
                        <p className="text-muted-foreground">{selectedCompany.notable_partners}</p>
                      </div>
                    )}
                    {selectedCompany.notable_contracts && (
                      <div>
                        <h4 className="font-medium mb-2">Notable Contracts</h4>
                        <p className="text-muted-foreground">{selectedCompany.notable_contracts}</p>
                      </div>
                    )}
                  </div>
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

                  {selectedCompany.job_board_links?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Career Opportunities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.job_board_links.slice(0, 3).map((link, idx) => (
                          <a
                            key={idx}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-full hover:bg-purple-100 active:scale-95"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Job Board {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )}
