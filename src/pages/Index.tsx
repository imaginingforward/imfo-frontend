import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Rocket, Users, Building, DollarSign, Satellite, Cpu, MapPin } from "lucide-react";

const Index = () => {
  const [query, setQuery] = useState("");
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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setQuery(searchQuery);
    
    // Simulate search - replace with actual API call
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* SEO Meta Tags would be handled by helmet or similar */}
      
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Satellite className="h-8 w-8 text-space-blue" />
            <span className="text-xl font-bold bg-gradient-to-r from-space-blue to-space-purple bg-clip-text text-transparent">
              SpaceTech Intelligence
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-clip-text text-transparent">
              Discover the Space
            </span>
            <br />
            <span className="text-foreground">Technology Ecosystem</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect founders, government agencies, suppliers, investors, and ecosystem partners through intelligent search and discovery.
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
                placeholder="Ask anything about the space technology ecosystem..."
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
            
            {/* Loading Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-muted/60 rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted/60 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted/40 rounded-full w-16"></div>
                    <div className="h-6 bg-muted/40 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Satellite className="h-6 w-6 text-space-blue" />
                <span className="text-lg font-bold bg-gradient-to-r from-space-blue to-space-purple bg-clip-text text-transparent">
                  SpaceTech Intelligence
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                The definitive platform for discovering and connecting within the global space technology ecosystem.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Search</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;