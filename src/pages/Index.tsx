import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, MapPin, Sparkles, Zap, Target, ExternalLink, Globe, Calendar, Award, Briefcase, TrendingUp, Bell, X, Expand, ArrowRight } from "lucide-react";

// Sample company data for tiles
const sampleCompanies = [
  {
    id: "sample-1",
    company_name: "SpaceX",
    sector: "Space Tech",
    description: "Advanced rockets and spacecraft for Earth orbit and Mars colonization missions.",
    hq_location: "Hawthorne, CA",
    business_activity: "Launch services; Satellite internet; Mars exploration",
    latest_funding_stage: "Private",
    total_funding_raised: "$9.5B",
    year_founded: "2002",
    leadership: "Elon Musk (CEO), Gwynne Shotwell (President)",
    website_url: "https://spacex.com",
    linkedin_url: "https://linkedin.com/company/spacex",
    engagement_label: "Trending",
    engagement_type: "trending"
  },
  {
    id: "sample-2", 
    company_name: "Relativity Space",
    sector: "Space Tech",
    description: "3D-printed rockets and autonomous rocket factories for affordable access to space.",
    hq_location: "Long Beach, CA",
    business_activity: "3D printed rockets; Launch services; Orbital manufacturing",
    latest_funding_stage: "Series E",
    total_funding_raised: "$1.3B",
    year_founded: "2015",
    leadership: "Tim Ellis (CEO), Jordan Noone (CTO)",
    website_url: "https://relativityspace.com",
    linkedin_url: "https://linkedin.com/company/relativity-space",
    engagement_label: "Most Searched",
    engagement_type: "most_searched"
  },
  {
    id: "sample-3",
    company_name: "Planet Labs",
    sector: "Space Tech", 
    description: "Daily satellite imagery and geospatial analytics for monitoring Earth changes.",
    hq_location: "San Francisco, CA",
    business_activity: "Earth observation; Satellite imagery; Geospatial analytics",
    latest_funding_stage: "Public",
    total_funding_raised: "$374M",
    year_founded: "2010",
    leadership: "Will Marshall (CEO), Robbie Schingler (Chief Strategy Officer)",
    website_url: "https://planet.com",
    linkedin_url: "https://linkedin.com/company/planet-labs",
    engagement_label: "Breaking News",
    engagement_type: "breaking_news"
  },
  {
    id: "sample-4",
    company_name: "Firefly Aerospace",
    sector: "Space Tech",
    description: "Small satellite launch services and in-space transportation solutions.",
    hq_location: "Cedar Park, TX",
    business_activity: "Small satellite launches; In-space transportation; Orbital services",
    latest_funding_stage: "Series A",
    total_funding_raised: "$200M",
    year_founded: "2014",
    leadership: "Bill Weber (CEO), Tom Markusic (CTO)",
    website_url: "https://firefly.com",
    linkedin_url: "https://linkedin.com/company/firefly-space-systems",
    engagement_label: "Trending",
    engagement_type: "trending"
  }
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isSlideUpOpen, setIsSlideUpOpen] = useState(false);
  const [error, setError] = useState(null);
  const searchSectionRef = useRef(null);

  const roles = ["founders", "analysts", "sourcing officers", "sales leads", "buyers", "sellers"];

  // Fixed: Add proper placeholder text
  const placeholderText = `Search for ${roles[currentRoleIndex]} in space technology...`;

  // Rotate roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
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
    
  // Search API call with better error handling
  const handleSearch = async (searchQuery, source = "manual") => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setQuery(searchQuery);
    setError(null);

    try {
      const response = await fetch("https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: searchQuery })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const companies = result.companies || [];
      setResults(companies);

      console.log("Search results:", companies.length, "companies found");
    } catch (err) {
      console.error("Search failed", err);
      setError(err.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query, "manual");
  };

  const handleSuggestedPromptClick = (promptText, category) => {
    handleSearch(promptText, "suggested");
  };

  // Handle Search Deals button click
  const handleSearchDealsClick = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      const searchInput = searchSectionRef.current.querySelector('input');
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus();
        }, 500);
      }
    }
  };

  // Handle sample company tile click
  const handleSampleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsSlideUpOpen(true);
  };

  // Get engagement style
  const getEngagementStyle = (type) => {
    const styles = {
      trending: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      most_searched: "bg-gradient-to-r from-blue-500 to-purple-500 text-white", 
      breaking_news: "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
    };
    return styles[type] || "bg-gray-500 text-white";
  };

  // Helper functions
  const isValidUrl = (url) => {
    return !!url && typeof url === "string" && url.trim().length > 5;
  };

  const parseBusinessActivities = (activities) => {
    if (!activities) return [];
    return activities
      .split(/[;.]/)
      .map(activity => activity.trim())
      .filter(activity => activity.length > 0 && activity.length < 50)
      .slice(0, 6);
  };

  // Add error boundary and loading states
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="text-center mb-12 sm:mb-16 mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Win Space Deals Faster</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-4xl text-gray-600 mx-auto leading-relaxed font-medium">
            Power deals with early signals, direct access, and real-time intelligence
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-12 sm:mb-16" ref={searchSectionRef}>
          <form onSubmit={handleSubmit} className="relative mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholderText}
                className="w-full pl-10 sm:pl-12 pr-20 sm:pr-24 py-4 sm:py-6 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg focus:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-200"
                disabled={isSearching}
              />
              <Button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 sm:px-6 py-2 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
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
              <h3 className="text-sm font-medium text-gray-600">Try these searches</h3>
            </div>
            <div className="relative overflow-hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestedPromptClick(prompt.text, prompt.category)}
                    className="group flex items-center gap-2 px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-full whitespace-nowrap transition-all duration-200 hover:shadow-sm active:scale-95 shrink-0"
                    disabled={isSearching}
                  >
                    <span className="text-base group-hover:scale-110 transition-transform duration-200">
                      {prompt.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Scroll gradient overlay */}
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16 sm:mb-20 text-center">
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
            <span className="inline-block transition-all duration-500 ease-in-out transform">
              {roles[currentRoleIndex]}
            </span> expend 10+ hours a week on prospecting
          </h2>
          <p className="text-2xl sm:text-3xl text-gray-600 mb-16 sm:mb-20">
            We collapse discovery to deal from weeks to minutes
          </p>
          
          {/* Feature Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 sm:mb-12">
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 rounded-xl hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Direct access to decision makers</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 border border-purple-200 rounded-xl hover:shadow-2xl hover:shadow-purple-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Early buy/sell alerts</h3>
              </div>
            </div>
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-blue-200 rounded-xl hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <div className="relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">On demand competitor analysis</h3>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleSearchDealsClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 sm:px-12 py-4 rounded-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="text-white text-lg font-medium">Search Deals</span>
            </button>
          </div>
        </div>

        {/* Sample Company Cards Section */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Featured Companies</h3>
            <p className="text-gray-600">Discover trending space technology companies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleCompanies.map((company) => (
              <div 
                key={company.id}
                onClick={() => handleSampleCompanyClick(company)}
                className="relative group bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl p-6 cursor-pointer active:scale-98"
              >
                {/* Engagement Indicator */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${getEngagementStyle(company.engagement_type)} shadow-lg`}>
                  {company.engagement_label}
                </div>

                {/* Company Content */}
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

                    {/* Business Activity Tags */}
                    {company.business_activity && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {parseBusinessActivities(company.business_activity).slice(0, 3).map((keyword, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {company.year_founded && (
                        <div className="text-xs">
                          <span className="text-gray-500">Founded:</span>
                          <span className="ml-1 font-semibold text-gray-900">{company.year_founded}</span>
                        </div>
                      )}
                      {company.total_funding_raised && (
                        <div className="text-xs">
                          <span className="text-gray-500">Funding:</span>
                          <span className="ml-1 font-semibold text-gray-900">{company.total_funding_raised}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
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
                    {isValidUrl(company.linkedin_url) && (
                      <a 
                        href={company.linkedin_url}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                        title="LinkedIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    
                    {isValidUrl(company.website_url) && (
                      <a 
                        href={company.website_url}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded active:scale-95"
                        title="Website"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Search Results */}
        {isSearching && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                <span>Searching the space technology ecosystem...</span>
              </div>
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Search Results ({results.length} companies)</h3>
            <div className="grid gap-6">
              {results.map((company, index) => (
                <div key={company.id || `company-${index}`} className="bg-white border rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-bold mb-2">{company.company_name || "Unknown Company"}</h4>
                  <p className="text-gray-600 mb-4">{company.description || "No description available"}</p>
                  {company.sector && (
                    <Badge className="bg-blue-100 text-blue-800">{company.sector}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Slide Up Panel for Sample Company Details */}
      {isSlideUpOpen && selectedCompany && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSlideUpOpen(false)}
          />
          <div className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-in-out ${isSlideUpOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-white border-t shadow-2xl max-h-[80vh] overflow-hidden">
              <div className="flex flex-col h-full max-h-[80vh]">
                {/* Header */}
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCompany.company_name}</h2>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          {selectedCompany.sector}
                        </Badge>
                        {selectedCompany.engagement_label && (
                          <Badge className={`${getEngagementStyle(selectedCompany.engagement_type)} border-0`}>
                            {selectedCompany.engagement_label}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsSlideUpOpen(false)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Close panel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <a 
                      href="https://calendly.com/imaginingforward/techweek-discovery?" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 font-medium"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Request Intro
                    </a>
                    
                    {/* Social Links */}
                    <div className="flex gap-2">
                      {isValidUrl(selectedCompany.website_url) && (
                        <a 
                          href={selectedCompany.website_url.trim().startsWith('http') 
                            ? selectedCompany.website_url.trim() 
                            : `https://${selectedCompany.website_url.trim()}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          title="Website"
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      )}
                      {isValidUrl(selectedCompany.linkedin_url) && (
                        <a 
                          href={selectedCompany.linkedin_url.trim().startsWith('http') 
                            ? selectedCompany.linkedin_url.trim()
                            : `https://${selectedCompany.linkedin_url.trim()}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          title="LinkedIn"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Description */}
                  <div className="bg-gray-50 border rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">{selectedCompany.description}</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCompany.year_founded && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Founded</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">{selectedCompany.year_founded}</p>
                      </div>
                    )}
                    
                    {selectedCompany.hq_location && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Location</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{selectedCompany.hq_location}</p>
                      </div>
                    )}
                    
                    {selectedCompany.total_funding_raised && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Funding</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{selectedCompany.total_funding_raised}</p>
                      </div>
                    )}
                    
                    {selectedCompany.latest_funding_stage && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-orange-600" />
                          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Stage</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">{selectedCompany.latest_funding_stage}</p>
                      </div>
                    )}
                  </div>

                  {/* Leadership */}
                  {selectedCompany.leadership && (
                    <div className="bg-gray-50 border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Leadership</h3>
                      </div>
                      <p className="text-sm text-gray-700">{selectedCompany.leadership}</p>
                    </div>
                  )}

                  {/* Business Activities */}
                  {selectedCompany.business_activity && (
                    <div className="bg-gray-50 border rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Business Activities</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {parseBusinessActivities(selectedCompany.business_activity).slice(0, 6).map((activity, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 border border-blue-200 rounded-full"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
