import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CompanyCards } from "@/components/intelligence/CompanyCards";
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchCompanies, transformCompany, type Company, type CompanyResponse } from "@/services/companyService";

const ImFoIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const { toast } = useToast();

// Keyword click handler function
const handleKeywordClick = async (keyword: string) => {
  setSearchQuery(keyword);
  setLoading(true);
  
  try {
    const data: CompanyResponse = await searchCompanies(keyword);
    const transformed = data.companies.map((company, index) => {
      if (company.id) {
        return company;
      } else {
        const { id, ...companyWithoutId } = company;
        return transformCompany(companyWithoutId, index);
      }
    });
    
    setCompanies(transformed);
    setTotalCount(data.count);
    
    // Optional: Show toast notification
    toast({
      title: "Search Updated",
      description: `Searching for companies with "${keyword}"`,
    });
    
  } catch (error: any) {
    toast({
      title: "Search Error",
      description: error.message || "Failed to search companies",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};
  
  const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  setLoading(true);
  try {
    const data: CompanyResponse = await searchCompanies(searchQuery);
    const transformed = data.companies.map((company, index) =>
      company.id ? company : transformCompany(company, index)
    );
    setCompanies(transformed);
    setTotalCount(data.count);
  } catch (error: any) {
    toast({
      title: "Search Error",
      description: error.message || "Failed to search companies",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
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
            Search Engine for Space Tech
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Intel for founders, government, investors, operators
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
                  onKeywordClick={handleKeywordClick}
              />
            )}
        </Card>
      </div>
    </div>
  );
};

export default ImFoIntelligencePage;
