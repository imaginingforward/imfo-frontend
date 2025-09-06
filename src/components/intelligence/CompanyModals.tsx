import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ExternalLink, Globe, MapPin, Building, Calendar, DollarSign, Award, Target, X, Expand, ArrowRight 
} from 'lucide-react';
import { FrontendCompany } from './types';
import { isValidUrl, parseBusinessActivities } from './utils';

interface CompanyModalsProps {
  selectedCompany: FrontendCompany | null;
  isModalOpen: boolean;
  isSidePanelOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  setIsSidePanelOpen: (open: boolean) => void;
  onExpandToModal: () => void;
  onKeywordClick: (keyword: string, e: React.MouseEvent) => void;
  onLinkClick: (company: string, linkType: string, searchQuery?: string) => void;
  searchQuery?: string;
}

export const CompanyModals: React.FC<CompanyModalsProps> = ({
  selectedCompany,
  isModalOpen,
  isSidePanelOpen,
  setIsModalOpen,
  setIsSidePanelOpen,
  onExpandToModal,
  onKeywordClick,
  onLinkClick,
  searchQuery
}) => {
  if (!selectedCompany) return null;

  return (
    <>
      {/* Side Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-[500px] transform transition-transform duration-300 ease-in-out ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/90 backdrop-blur-xl border-l border-border/50 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold mb-2 line-clamp-2">{selectedCompany.company_name}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/20 text-primary border-primary/30">{selectedCompany.sector}</Badge>
                {selectedCompany.stage && <Badge variant="outline" className="bg-muted/50 border-muted-foreground/20">{selectedCompany.stage}</Badge>}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button onClick={onExpandToModal} className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 active:scale-95" title="Expand to full view">
                <Expand className="h-4 w-4" />
              </button>
              <button onClick={() => setIsSidePanelOpen(false)} className="p-2 rounded-lg bg-muted/50 hover:bg-muted/70 active:scale-95" title="Close panel">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-gradient-to-br from-card/50 to-muted/30 backdrop-blur-sm border border-border/30 rounded-xl p-4">
              <p className="text-muted-foreground leading-relaxed">{selectedCompany.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedCompany.year_founded && (
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-xs uppercase text-muted-foreground">Founded</span></div>
                  <p className="text-lg font-bold">{selectedCompany.year_founded}</p>
                </div>
              )}
              {selectedCompany.hq_location && (
                <div className="bg-gradient-to-br from-secondary/5 to-muted/5 border border-secondary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-secondary" /><span className="text-xs uppercase text-muted-foreground">Location</span></div>
                  <p className="text-sm font-semibold line-clamp-2">{selectedCompany.hq_location}</p>
                </div>
              )}
              {selectedCompany.total_funding_raised && (
                <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-green-600" /><span className="text-xs uppercase text-muted-foreground">Funding</span></div>
                  <p className="text-sm font-semibold">{selectedCompany.total_funding_raised}</p>
                </div>
              )}
              {selectedCompany.latest_funding_stage && (
                <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-orange-600" /><span className="text-xs uppercase text-muted-foreground">Stage</span></div>
                  <p className="text-sm font-semibold">{selectedCompany.latest_funding_stage}</p>
                </div>
              )}
            </div>

            {selectedCompany.business_activity && (
              <div className="bg-gradient-to-br from-card/50 to-muted/30 border border-border/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3"><Target className="h-4 w-4 text-primary" /><h3 className="font-semibold">Business Activities</h3></div>
                <div className="flex flex-wrap gap-2">
                  {parseBusinessActivities(selectedCompany.business_activity).slice(0, 6).map((activity, idx) => (
                    <button key={idx} onClick={(e) => { e.stopPropagation(); onKeywordClick(activity, e); }} className="px-3 py-1 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary/20 active:scale-95">{activity}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-4">
              <button onClick={onExpandToModal} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 rounded-xl hover:from-primary/20 hover:to-accent/20 active:scale-95 font-medium">
                <Expand className="h-4 w-4" /> View Full Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidePanelOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsSidePanelOpen(false)} />}

      {/* Full Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[95vh] overflow-hidden bg-background text-foreground border border-border p-0 flex flex-col">
          <DialogHeader className="p-6 border-b flex-shrink-0 bg-muted/30 flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl sm:text-3xl font-bold mb-3 line-clamp-2">{selectedCompany.company_name}</DialogTitle>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1">{selectedCompany.sector}</Badge>
                {selectedCompany.stage && <Badge variant="outline" className="text-sm px-3 py-1">{selectedCompany.stage}</Badge>}
              </div>
            </div>
            <div className="ml-4">
              <a href="https://calendly.com/imaginingforward/techweek-discovery?" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 active:scale-95" onClick={(e) => { e.stopPropagation(); onLinkClick(selectedCompany.company_name, 'calendly_modal', searchQuery); }}>Request Intro</a>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Company Overview */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Building className="h-5 w-5" /> Company Overview</h3>
              <p className="text-base text-muted-foreground leading-relaxed">{selectedCompany.description}</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedCompany.year_founded && (
                <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Calendar className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Founded</span></div><p className="text-xl font-bold">{selectedCompany.year_founded}</p></div>
              )}
              {selectedCompany.latest_funding_stage && (
                <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><Award className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Funding Stage</span></div><p className="text-lg font-semibold">{selectedCompany.latest_funding_stage}</p></div>
              )}
              {selectedCompany.total_funding_raised && (
                <div className="bg-card border rounded-lg p-4"><div className="flex items-center gap-2 mb-2"><DollarSign className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Total Funding</span></div><p className="text-lg font-semibold">{selectedCompany.total_funding_raised}</p></div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
