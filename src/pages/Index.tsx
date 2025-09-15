import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CompanyCards from "@/components/intelligence/CompanyCards";
import CompanyModals from "@/components/intelligence/CompanyModals";
import { FrontendCompany } from "@/components/intelligence/types";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, Target, Zap, Sparkles, Eye, Flame } from "lucide-react";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
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
  const [selectedCompany, setSelectedCompany] = useState<FrontendCompany | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("Ask anything...");
  const [isTyping, setIsTyping] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [highlightSearchBar, setHighlightSearchBar] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const roles = ["founders", "analysts", "sourcing officers", "sales leads", "buyers", "sellers"];

  const typingPrompts = [
    "Startups in ISR",
    "Companies in SoCal", 
    "Earth Observation Data",
    "Startups with SBIR Contracts",
    "Antenna suppliers",
    "Satellite manufacturers"
  ];

  // Rotate roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Typing animation effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const startTypingAnimation = () => {
      if (query.length === 0) { // Only animate when search bar is empty
        setIsTyping(true);
        const currentPrompt = typingPrompts[currentPromptIndex];
        let currentText = "";
        let charIndex = 0;

        const typeNextChar = () => {
          if (charIndex < currentPrompt.length) {
            currentText += currentPrompt[charIndex];
            setPlaceholderText(currentText + "|");
            charIndex++;
            timeout = setTimeout(typeNextChar, 100);
          } else {
            // Show completed text for 1 second
            setPlaceholderText(currentText);
            timeout = setTimeout(() => {
              // Clear text with backspace effect
              let backspaceIndex = currentText.length;
              const backspace = () => {
                if (backspaceIndex > 0) {
                  currentText = currentText.slice(0, -1);
                  setPlaceholderText(currentText + "|");
                  backspaceIndex--;
                  timeout = setTimeout(backspace, 50);
                } else {
                  setPlaceholderText("Ask anything...");
                  setCurrentPromptIndex((prev) => (prev + 1) % typingPrompts.length);
                  setIsTyping(false);
                  // Wait 2 seconds before next prompt
                  timeout = setTimeout(startTypingAnimation, 2000);
                }
              };
              backspace();
            }, 1000);
          }
        };

        typeNextChar();
      }
    };

    // Start first animation after 3 seconds
    timeout = setTimeout(startTypingAnimation, 3000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentPromptIndex, query]);

  // Reset placeholder when user types
  useEffect(() => {
    if (query.length > 0) {
      setPlaceholderText("Ask anything...");
      setIsTyping(false);
    }
  }, [query]);

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


  // Rotate suggestedPrompts every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % typingPrompts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const suggestedPrompts = [
    { icon: <Rocket className="h-4 w-4" />, text: "Startups in ISR" },
    { icon: <Cpu className="h-4 w-4" />, text: "Companies in SoCal" },
    { icon: <Satellite className="h-4 w-4" />, text: "Earth Observation" },
    { icon: <DollarSign className="h-4 w-4" />, text: "Startups with SBIR Contracts" },
    { icon: <Building className="h-4 w-4" />, text: "Engineering Companies" },
    { icon: <Users className="h-4 w-4" />, text: "Antenna suppliers" },
  ];

  // Search API call with Mixpanel tracking
  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setQuery(searchQuery);
    setError(null);

    mixpanel.track("Search Initiated", { search_term: searchQuery, timestamp: new Date().toISOString() });

    try {
      const response = await fetch("https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      // Save the companies array from the result
      const companies = result.companies || [];
      setResults(companies);

      mixpanel.track("Search Completed", { search_term: searchQuery, result_count: companies.length, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error("Search failed", err);
      setError(err.message);
      setResults([]);  
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

  const onKeywordClick = (keyword: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    setHighlightSearchBar(true);
    setTimeout(() => setHighlightSearchBar(false), 2000);
    
    setQuery(keyword);
    handleSearch(keyword);

    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
      searchInput?.focus();
    }, 500);
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

  const handleSearchDeals = () => {
    // Scroll to top
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Highlight search bar
    setHighlightSearchBar(true);
    setTimeout(() => setHighlightSearchBar(false), 2000);

    // Focus search bar
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Ask"]') as HTMLInputElement;
      searchInput?.focus();
    }, 500);
  };

  const getEngagementBadge = (engagement: string) => {
    const badges = {
      "trending": { icon: <TrendingUp className="h-3 w-3" />, color: "bg-orange-500/20 text-orange-200 border-orange-400/30" },
      "most searched": { icon: <Eye className="h-3 w-3" />, color: "bg-blue-500/20 text-blue-200 border-blue-400/30" },
      "breaking news": { icon: <Flame className="h-3 w-3" />, color: "bg-red-500/20 text-red-200 border-red-400/30" }
    };
    
    const badge = badges[engagement as keyof typeof badges];
    return badge ? (
      <Badge className={`${badge.color} text-xs px-2 py-1 animate-pulse`}>
        {badge.icon}
        <span className="ml-1 uppercase font-semibold tracking-wide">{engagement}</span>
      </Badge>
    ) : null;
  }; 

  const featuredCompanies: FrontendCompany[] = [
    {
      id: "spacex",
      company_name: "SpaceX",
      sector: "Space Tech",
      business_area: "Launch Services",
      description: "space vehicle manufacturer & launch service",
      business_activity: "launch services. spacecraft manufacturing. satellite internet. satcom. payload. transportation",
      capital_partners: "Google, Fidelity, Baillie Gifford",
      hq_location: "Hawthorne, California",
      website_link: "https://spacex.com",
      linkedin_link: "https://linkedin.com/company/spacex",
      twitter_link: "https://twitter.com/spacex",
      crunchbase_link: "https://crunchbase.com/organization/space-exploration-technologies",
      engagement_label: "Most Trending",
      engagement_type: "trending"
    },
    {
      id: "archer-aviation",
      company_name: "Archer Aviation",
      sector: "Space Tech",
      business_area: "Urban Air Mobility",
      description: "manufacturer of eVTOL aircrafts",
      business_activity: "eVTOL. aircraft. urban air mobility. electric aviation. transportation",
      capital_partners: "United Airlines, Stellantis, Atlas Crest",
      hq_location: "San Jose, California",
      website_link: "https://archer.com",
      linkedin_link: "https://linkedin.com/company/archeraviation",
      twitter_link: "https://twitter.com/archerAviation",
      crunchbase_link: "https://crunchbase.com/organization/archer-aviation",
      engagement_label: "Most Searched",
      engagement_type: "most_searched"
    },
    {
      id: "planet-labs",
      company_name: "Planet Labs",
      sector: "Space Tech", 
      business_area: "Earth Observation",
      description: "manufacturer of satellite constellation.",
      business_activity: "satellite imagery. earth observation. geospatial analytics",
      capital_partners: "Google, Geodesic Capital, Data Collective",
      hq_location: "San Francisco, California",
      website_link: "https://planet.com",
      linkedin_link: "https://linkedin.com/company/planet-labs",
      twitter_link: "https://twitter.com/planetlabs",
      crunchbase_link: "https://crunchbase.com/organization/planet-labs",
      engagement_label: "Breaking News",
      engagement_type: "breaking_news"
    },
    {
      id: "portal-space-systems",
      company_name: "Portal Space Systems",
      sector: "Space Tech",
      business_area: "Space Logistics",
      description: "manufacturer of space bus vehicle",
      business_activity: "orbital transfer vehicles. space logistics. in-orbit transport. thermal propulsion. ",
      capital_partners: "Lockheed Martin Ventures, Toyota Ventures",
      hq_location: "Los Angeles, California",
      website_link: "https://portalspacesystems.com",
      linkedin_link: "https://linkedin.com/company/portal-space-systems",
      twitter_link: "https://twitter.com/portalspacesys",
      crunchbase_link: "https://crunchbase.com/organization/portal-space-systems",
      engagement_label: "Most Trending",
      engagement_type: "trending"
    },
    {
      id: "xanadu",
      company_name: "Xanadu",
      sector: "Quantum",
      business_area: "Quantum Computing",
      description: "Manufacturer of quantum computers",
      business_activity: "quantum compute. photonic processors. quantum cloud service. quantum chips",
      capital_partners: "Georgian Partners, BDC Capital, Bessemer Venture Partners",
      hq_location: "Toronto, Ontario",
      website_link: "https://xanadu.ai",
      linkedin_link: "https://linkedin.com/company/xanaduai",
      twitter_link: "https://twitter.com/xanaduai",
      crunchbase_link: "https://crunchbase.com/organization/xanadu",
      engagement_label: "Most Searched",
      engagement_type: "most_searched"
    },
    {
      id: "axiom-space",
      company_name: "Axiom Space",
      sector: "Space Tech",
      business_area: "Commercial Space Stations",
      description: "Manufacturer of first commercial space station.",
      business_activity: "space station. space commerce. space exploration",
      capital_partners: "C5 Capital, Declaration Partners, Raine Capital",
      hq_location: "Houston, Texas",
      website_link: "https://axiomspace.com",
      linkedin_link: "https://linkedin.com/company/axiom-space",
      twitter_link: "https://twitter.com/axiomspace",
      crunchbase_link: "https://crunchbase.com/organization/axiom-space",
      engagement_label: "Breaking News",
      engagement_type: "breaking_news"
    }
  ];

  const handleFeaturedCardClick = (company: FrontendCompany) => {
    setSelectedCompany(company);
    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      setIsModalOpen(true);
    } else {
      setIsSidePanelOpen(true);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 pt-16 sm:pt-24 pb-16 sm:pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Win Space Deals Faster
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-4xl text-gray-600 mx-auto leading-relaxed font-medium">
            Your edge: early signals, direct access, real-time intel
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-12 sm:mb-16">
          <form onSubmit={handleSubmit} className="relative mb-6 sm:mb-8">
            <div 
              ref={searchBarRef}
              className={`relative transition-all duration-300 ${
                highlightSearchBar ? 'ring-4 ring-primary/50 ring-offset-2 ring-offset-background' : ''
              }`}
            >
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholderText}
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
          
          {error && (
            <div className="text-red-600 text-center mt-2">
              {error}
            </div>
          )}
          
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
        <div className="mb-32 sm:mb-40 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-gray-900">1800+</div>
              <div className="text-sm text-gray-600 font-medium tracking-wide">space companies</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-gray-900">500+</div>
              <div className="text-sm text-gray-600 font-medium tracking-wide">deep tech funds</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-gray-900">80+</div>
              <div className="text-sm text-gray-600 font-medium tracking-wide">GOs</div>
            </div>
            <div className="space-y-1">
              <div className="text-4xl md:text-5xl font-light text-gray-900">$2.3B</div>
              <div className="text-sm text-gray-600 font-medium tracking-wide">in quarterly deal flow</div>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="mb-12 sm:mb-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-16 sm:mb-20">
            <span className="inline-block transition-all duration-500 ease-in-out transform">{roles[currentRoleIndex]}</span> waste 10+ hours a week prospecting
          </h2>
          <p className="text-2xl sm:text-3xl text-gray-600 mb-16 sm:mb-20">
            We cut that to minutes
          </p>

          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 rounded-xl hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Reach decision makers instantly</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 border border-purple-200 rounded-xl hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Get early buying alerts</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 rounded-xl hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Track competitor moves real time</h3>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleSearchDeals}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 sm:px-12 py-4 rounded-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="text-white text-lg font-medium">Search Deals</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-12">
            <CompanyCards
              companies={results}
              onKeywordClick={onKeywordClick}
              searchQuery={query}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              isSidePanelOpen={isSidePanelOpen}
              setIsSidePanelOpen={setIsSidePanelOpen}
            />
          </div>
        )}

        {/* Company Modal */}
        <CompanyModals
          companies={featuredCompanies}
          selectedCompany={selectedCompany}
          isModalOpen={isModalOpen}
          isSidePanelOpen={isSidePanelOpen}
          onModalClose={() => setIsModalOpen(false)}
          onSidePanelClose={() => setIsSidePanelOpen(false)}
          onExpandToModal={() => {setIsSidePanelOpen(false); setIsModalOpen(true);}}
          searchQuery={query}
          onKeywordClick={onKeywordClick}
          onLinkClick={(company, linkType, searchQuery) => {console.log(`Link clicked: ${company} - ${linkType}`);}}
          handleCardClick={handleFeaturedCardClick}
        />
      </main>
    </div>
  );
};

export default Index;
