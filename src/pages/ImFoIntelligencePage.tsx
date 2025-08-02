import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CompanyCards } from "@/components/intelligence/CompanyCards";
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the backend response type to match API
interface BackendCompany {
  company_name: string;
  business_activity: string;
  business_area: string;
  sector: string;
  description: string;
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

interface BackendResponse {
  companies: BackendCompany[];
  count: number;
}

// Transform backend data to match frontend expectations
interface FrontendCompany {
  id: string;
  company_name: string;
  business_activity: string;
  business_area: string;
  sector: string;
  description: string;
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

const ImFoIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const { toast } = useToast();

// Function to transform backend company to frontend format
const transformCompany = (backendCompany: BackendCompany, index: number): FrontendCompany => {
  return {
    id: `company-${index}`,
    company_name: backendCompany.company_name,
    sector: backendCompany.sector || 'Unknown',
    description: backendCompany.description,
    business_activity: backendCompany.business_activity,
    hq_location: backendCompany.hq_location,
    website_url: backendCompany.website_url,
    linkedin_url: backendCompany.linkedin_url,
    twitter_url: backendCompany.twitter_url,
    crunchbase_url: backendCompany.crunchbase_url,
    total_funding_raised: backendCompany.total_funding_raised,
    capital_partners: backendCompany.capital_partners,
    notable_partners: backendCompany.notable_partners,
    leadership: backendCompany.leadership,
    latest_funding_stage: backendCompany.latest_funding_stage,
    latest_funding_raised: backendCompany.latest_funding_raised,
    };
  };
  
  // Direct API call function
  const searchCompanies = async (query: string = '') => {
    setLoading(true);
    try {
      console.log('Searching with query:', query);
      
      const response = await fetch('https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query || 'los angeles' }) // Default to 'los angeles' if empty
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendResponse = await response.json();
      console.log('Raw API response:', data);
      
      // Transform the data
      const transformedCompanies = data.companies.map(transformCompany);
      console.log('Transformed companies:', transformedCompanies);
      
      setCompanies(transformedCompanies);
      setTotalCount(data.count);
      
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: error.message || 'Failed to search companies',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchCompanies(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost" 
            size="sm"
            className="text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="IMFO Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ImFo Intelligence
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Intel for founders, government, investors, and operators.
          </p>
        </div>
        
        <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="bg-white/5 border-white/20 pl-10 text-gray-100"
                placeholder="Ask anything" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </div>

          {/* Debug Information */}
          <div className="text-sm text-gray-400 mb-4 p-3 bg-white/5 rounded">
            <strong>Debug Info:</strong><br/>
            Query: "{searchQuery}"<br/>
            Companies found: {companies.length}<br/>
            Total count: {totalCount}<br/>
            Loading: {loading.toString()}
          </div>
         
         <div className="text-sm text-white-400 mb-4 mt-4">
            {loading 
              ? "Searching..." 
              : (totalCount > 0
              ? `Displaying ${companies.length} compan${companies.length === 1 ? 'y' : 'ies'} of ${totalCount} total`
              : companies.length === 0 && searchQuery ? "No companies found" : "Enter a search query to get started")
            } 
          </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <CompanyCards 
                  companies={companies} 
                  currentPage={1}
                  pageSize={20}
                  totalCount={totalCount}
                  onPageChange={() => {}}
              />
            )}
        </Card>
      </div>
    </div>
  );
};

export default ImFoIntelligencePage;
