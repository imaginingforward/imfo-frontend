import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, Target, Zap, Sparkles } from "lucide-react";
import mixpanel from "mixpanel-browser";

// Import your new components
import CompanyCards from "@/components/intelligence/CompanyCards";
import CompanyModals from "@/components/intelligence/CompanyModals";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const searchSectionRef = useRef(null);

  const roles = ["founders", "analysts", "sourcing officers", "sales leads", "buyers", "sellers"];
  const placeholderText = `Search for ${roles[currentRoleIndex]} in space technology...`;

  // Rotate roles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const suggestedPrompts = [
    { icon: <Rocket className="h-4 w-4" />, text: "Companies in PNT" },
    { icon: <Cpu className="h-4 w-4" />, text: "Avionics in California" },
    { icon: <Satellite className="h-4 w-4" />, text: "Earth Observation Data" },
    { icon: <Users className="h-4 w-4" />, text: "Startups with SBIR Contracts" },
    { icon: <Building className="h-4 w-4" />, text: "Engineering Companies" },
    { icon: <DollarSign className="h-4 w-4" />, text: "Companies Raised Series A" },
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
      const companies = result.companies || [];
      setResults(companies);

      mixpanel.track("Search Completed", { search_term: searchQuery, result_count: companies.length, timestamp: new Date().toISOString() });
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
    handleSearch(query);
  };

  const handleSuggestedPromptClick = (promptText) => {
    handleSearch(promptText);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
    mixpanel.track("Company Clicked", { company_name: company.company_name, timestamp: new Date().toISOString() });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-24 pb-16 sm:pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Win Space Deals Faster
            </span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-4xl text-gray-600 mx-auto leading-relaxed font-medium">
            Power deals with early signals, direct access, and real-time intelligence
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12 sm:mb-16" ref={searchSectionRef}>
          <form onSubmit={handleSubmit} className="relative mb-6 sm:mb-8">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholderText}
              className="w-full pl-10 pr-20 py-4 sm:py-6 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-lg focus:ring-2 focus:ring-blue-200"
            />
            <Button type="submit" disabled={isSearching || !query.trim()} className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {isSearching ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : "Search"}
            </Button>
          </form>

          <div className="flex gap-2 overflow-x-auto">
            {suggestedPrompts.map((prompt, index) => (
              <Button key={index} onClick={() => handleSuggestedPromptClick(prompt.text)} className="shrink-0">
                {prompt.icon} {prompt.text}
              </Button>
            ))}
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
            <span className="inline-block transition-all duration-500 ease-in-out transform">{roles[currentRoleIndex]}</span> expend 10+ hours a week on prospecting
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
              onClick={() => searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 sm:px-12 py-4 rounded-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            >
              <span className="text-white text-lg font-medium">Search Deals</span>
            </button>
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-12">
            <CompanyCards companies={results} onCompanyClick={handleCompanyClick} />
          </div>
        )}

        {/* Company Modal */}
        {selectedCompany && (
          <CompanyModals
            company={selectedCompany}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
