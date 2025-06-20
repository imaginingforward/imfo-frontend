import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  fetchCompanies, 
  type Company, 
  type CompanyFilters 
} from "@/services/companyService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyTable } from "@/components/intelligence/CompanyTable";
import { CompanyCards } from "@/components/intelligence/CompanyCards";
import { Loader2, Search } from 'lucide-react';

const ImFoIntelligencePage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<CompanyFilters>({
    page: 1,
    pageSize: 20,
  });
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const { toast } = useToast();

  useEffect(() => {
    const loadCompanies = async () => {
      setLoading(true);
      try {
        const result = await fetchCompanies(filters);
        setCompanies(result.companies);
        setTotalCount(result.count);
      } catch (error: any) {
        toast({
          title: "Error loading companies",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [filters, toast]);

  // Extract unique sectors for filter
  const sectors = [...new Set(companies.map(c => c.sector).filter(Boolean))];
  
  // Extract unique stages for filter
  const stages = [...new Set(companies.map(c => c.stage?.value).filter(Boolean))];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSectorChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      sector: value === "all" ? undefined : value, 
      page: 1 
    }));
  };

  const handleStageChange = (value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      stage: value === "all" ? undefined : value, 
      page: 1 
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img src="/logo.jpg" alt="IMFO Logo" className="h-16 w-auto" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            ImFo Intelligence
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Comprehensive database of space tech companies and related industries
          </p>
        </div>
        
        <Card className="p-6 bg-white/5 backdrop-blur-lg border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="bg-white/5 border-white/20 pl-10"
                placeholder="Search companies..." 
                value={filters.search || ''}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select onValueChange={handleSectorChange} value={filters.sector || "all"}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20">
                <SelectValue placeholder="All Sectors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select onValueChange={handleStageChange} value={filters.stage || "all"}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={String(stage)} value={String(stage)}>{stage}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards")} className="mb-4">
            <TabsList className="bg-white/10">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-400 mb-4 mt-4">
                  {totalCount} companies found
                </div>
                
                <TabsContent value="table" className="mt-0">
                  <CompanyTable 
                    companies={companies} 
                    currentPage={filters.page || 1}
                    pageSize={filters.pageSize || 20}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                  />
                </TabsContent>
                
                <TabsContent value="cards" className="mt-0">
                  <CompanyCards 
                    companies={companies} 
                    currentPage={filters.page || 1}
                    pageSize={filters.pageSize || 20}
                    totalCount={totalCount}
                    onPageChange={handlePageChange}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ImFoIntelligencePage;
