import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCards } from "@/components/intelligence/CompanyCards";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, MapPin } from "lucide-react";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const suggestedPrompts = [
    {
      icon: <Rocket className="h-4 w-4" />,
      text: "Companies in PNT",
      category: "Use Case"
      //Propulsion companies that have raised > $5M
      //category: "Funding"
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      text: "Cables in California",
      category: "Suppliers"
    },
    {
      icon: <Satellite className="h-4 w-4" />,
      text: "Cameras for space",
      category: "Components"
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "Startups with SBIR contracts",
      category: "Government"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Engineering companies",
      category: "Manufacturing"
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      text: "Companies raised Series A",
      category: "Investment"
    }
  ];
    
    // Search API call
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setQuery(searchQuery);

    try {
    const response = await fetch("https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: searchQuery })
    });

      const result = await response.json();
      console.log("Parsed result:", result);
 
      // Save the companies array from the result
      setResults(result.companies || []);
      console.log("Updated results state:", result.companies || []);
    } catch (err) {
      console.error("Search failed", err);
      alert("Sorry, search failed. Try again.");
    } finally {
      setIsSearching(false);
    }
  };
      

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* SEO Meta Tags would be handled by helmet or similar */}

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-16 sm:pb-24">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-clip-text text-transparent">
              Search Engine for Space Tech</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            Intel for founders, government, investors, and operators
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-12 sm:mb-16">
          <form onSubmit={handleSubmit} className="relative mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-4 sm:py-6 text-base sm:text-lg border-2 border-muted focus:border-primary rounded-xl shadow-lg focus:shadow-xl transition-all duration-200"
                disabled={isSearching}
              />
              <Button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-space-blue to-space-purple hover:from-space-purple hover:to-space-blue transition-all duration-200"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span className="hidden sm:inline">Search</span>
                    <Search className="h-4 w-4 sm:hidden" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Suggested Prompts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSearch(prompt.text)}
                className="group p-3 sm:p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/50 rounded-lg transition-all duration-200 text-left hover:shadow-md active:scale-95"
                disabled={isSearching}
              >
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary/20 transition-colors shrink-0">
                    {prompt.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                      {prompt.category}
                    </div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {prompt.text}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Placeholder */}
        {isSearching && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                <span>Searching the space technology ecosystem...</span>
              </div>
            </div>
          </div>
      )}

{results.length > 0 && (
  <div className="mt-12">
    <CompanyCards 
      companies={results.map((company: any, index: number) => ({
        id: company.id || `company-${index}`,
        ...company
      }))}
      onKeywordClick={(keyword) => handleSearch(keyword)}
    />
  </div>
)}

        {/* Trust Indicators */}
        <div className="mt-16 sm:mt-24 text-center">
          <p className="text-sm text-muted-foreground mb-6 sm:mb-8">
            Trusted by deep tech leaders worldwide
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">500+ Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">10K+ Professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm font-medium">50+ Countries</span>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
