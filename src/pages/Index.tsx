import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, MapPin } from "lucide-react";

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const suggestedPrompts = [
    {
      icon: <Rocket className="h-4 w-4" />,
      text: "Propulsion companies that have raised > $5M",
      category: "Funding"
    },
    {
      icon: <Cpu className="h-4 w-4" />,
      text: "What companies supply electrical components in California",
      category: "Suppliers"
    },
    {
      icon: <Satellite className="h-4 w-4" />,
      text: "Where can I buy cameras to build my satellite",
      category: "Components"
    },
    {
      icon: <Users className="h-4 w-4" />,
      text: "Space tech startups with government contracts",
      category: "Government"
    },
    {
      icon: <Building className="h-4 w-4" />,
      text: "Manufacturing facilities for space hardware",
      category: "Manufacturing"
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      text: "Recent Series A investments in space technology",
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
 
      // TODO: Save the result in a new state variable for rendering cards
      setResults(result.results || []); // assuming backend returns { results: [...] }
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-clip-text text-transparent">
              Discover the Aerospace Ecosystem</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A smart hub to connect spacetech founders, government agencies, investors, and industry partners
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-16">
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything..."
                className="w-full pl-12 pr-24 py-6 text-lg border-2 border-muted focus:border-primary rounded-xl shadow-lg focus:shadow-xl transition-all duration-200"
                disabled={isSearching}
              />
              <Button
                type="submit"
                disabled={isSearching || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-space-blue to-space-purple hover:from-space-purple hover:to-space-blue transition-all duration-200"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>

          {/* Suggested Prompts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSearch(prompt.text)}
                className="group p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/50 rounded-lg transition-all duration-200 text-left hover:shadow-md"
                disabled={isSearching}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary/20 transition-colors">
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
    {results.map((item: any, index: number) => (
      <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-2">{item.company_name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {item.business_activity && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {item.business_activity}
            </span>
          )}
          {item.hq_location && (
            <span className="px-2 py-1 bg-secondary text-muted-foreground rounded">
              {item.hq_location}
            </span>
          )}
          {item.total_funding_raised && (
            <span className="px-2 py-1 bg-accent text-foreground rounded">
              ${item.total_funding_raised}
            </span>
          )}
        </div>
      </div>
    ))}
</div>
)}

        {/* Trust Indicators */}
        <div className="mt-24 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by space technology leaders worldwide
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span className="text-sm font-medium">500+ Companies</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">10K+ Professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">50+ Countries</span>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Index;
