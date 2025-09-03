import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanyCards } from "@/components/intelligence/CompanyCards";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, MapPin, Sparkles, Zap, Target } from "lucide-react";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel outside component
const initializeMixpanel = () => {
  try {
    mixpanel.init("85be2acaaa02972b55b436a76e63cf0c", {
      track_pageview: true,
      persistence: "localStorage",
    });
  } catch (error) {
    console.error("Failed to initialize Mixpanel:", error);
  }
};

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const roles = ["founders", "analysts", "sourcing officers", "sales leads", "buyers", "sellers"];

  // Rotate roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Mixpanel on component mount
  useEffect(() => {
    initializeMixpanel();

    // Track page view
    try {
      mixpanel.track("Page Viewed", {
        page: "Search Landing",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, []);

  const suggestedPrompts = [
    {
      icon: <Rocket className="h-4 w-4" />,
      text: "Companies in PNT",
      category: "Use Case"
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      text: "Avionics in California",
      category: "Suppliers"
    },
    {
      icon: <Satellite className="h-4 w-4" />,
      text: "Earth Observation Data",
      category: "Service"
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "Startups with SBIR Contracts",
      category: "Government"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Engineering Companies",
      category: "Manufacturing"
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      text: "Companies Raised Series A",
      category: "Investment"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Energy security solutions",
      category: "Technology"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Satellite manufacturers",
      category: "Hardware"
    }
  ];
    
  // Search API call with Mixpanel tracking
  const handleSearch = async (searchQuery: string, source: "manual" | "suggested" = "manual") => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setQuery(searchQuery);

    // Track search start
    try {
      mixpanel.track("Search Started", {
        query: searchQuery,
        source: source,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to track search start:", error);
    }

    try {
      const response = await fetch("https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: searchQuery })
      });
      const result = await response.json();

      // Save the companies array from the result
      const companies = result.companies || [];
      setResults(companies);

      // Track successful search
      try {
        mixpanel.track("Search Completed", {
          query: searchQuery,
          source: source,
          results_count: companies.length,
          success: true,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Failed to track search completion:", error);
      }
    } catch (err) {
      console.error("Search failed", err);
      
      // Track failed search
      try {
        mixpanel.track("Search Failed", {
          query: searchQuery,
          source: source,
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Failed to track search failure:", error);
      }
      
      alert("Sorry, search failed. Try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query, "manual");
  };

  const handleSuggestedPromptClick = (promptText: string, category: string) => {
    // Track suggested prompt click
    try {
      mixpanel.track("Suggested Prompt Clicked", {
        prompt: promptText,
        category: category,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to track prompt click:", error);
    }
    
    handleSearch(promptText, "suggested");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="text-center mb-12 sm:mb-16 mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-clip-text text-transparent">
              Win Space Deals Faster</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-4xl text-muted-foreground mx-auto leading-relaxed font-medium">
            Power deals with early signals, direct access, and real-time intelligence
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
          <div className="relative">
            <div className="flex items-center mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">Try these searches</h3>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPromptClick(prompt.text, prompt.category)}
                    className="group flex items-center gap-2 px-3 py-2 bg-prompt hover:bg-prompt-hover border border-prompt-border hover:border-space-blue/30 rounded-full whitespace-nowrap transition-all duration-200 hover:shadow-sm active:scale-95 shrink-0"
                    disabled={isSearching}
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">
                      {prompt.icon}
                    </span>
                    <span className="text-sm font-medium text-foreground group-hover:text-space-blue transition-colors">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Scroll gradient overlay */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16 sm:mb-20 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-foreground">1800+</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide">space companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-foreground">500+</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide">deep tech funds</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-foreground">80+</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide">GOs</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-foreground">$2.3B</div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide">in quarterly deal flow</div>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-16 sm:mb-20">
            <span className="inline-block transition-all duration-500 ease-in-out transform">
              {roles[currentRoleIndex]}
            </span> expend 10+ hours a week on prospecting
          </h2>
          <p className="text-2xl sm:text-3xl text-muted-foreground mb-16 sm:mb-20">
            We collapse discovery to deal from weeks to minutes
          </p>
          
          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="group relative p-6 bg-gradient-to-br from-space-blue/5 via-card to-space-purple/5 border border-space-blue/20 rounded-xl hover:shadow-2xl hover:shadow-space-blue/10 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-space-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-space-blue to-space-purple rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-space-blue transition-colors">Direct access to decision makers</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-space-purple/5 via-card to-space-blue/5 border border-space-purple/20 rounded-xl hover:shadow-2xl hover:shadow-space-purple/10 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-space-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-space-purple to-space-blue rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-space-purple transition-colors">Early buy/sell alerts</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-space-blue/5 via-card to-space-purple/5 border border-space-blue/20 rounded-xl hover:shadow-2xl hover:shadow-space-blue/10 transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-space-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-space-blue to-space-purple rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-space-blue transition-colors">On demand competitor analysis</h3>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-space-blue to-space-purple px-8 sm:px-12 py-4 rounded-lg">
              <span className="text-white text-lg font-medium">Search Deals</span>
            </div>
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
              onKeywordClick={(keyword) => {
                // Track keyword click
                try {
                  mixpanel.track("Keyword Clicked", {
                    keyword: keyword,
                    timestamp: new Date().toISOString()
                  });
                } catch (error) {
                  console.error("Failed to track keyword click:", error);
                }
                handleSearch(keyword, "suggested");
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
