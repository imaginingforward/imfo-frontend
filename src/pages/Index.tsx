
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Rocket, Zap, Database } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Land contracts fast.
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Get matched to high value commercial deep tech RFPs — powered by our AI discovery and intelligence engines.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          
                    {/* AI RFP Match Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col relative overflow-hidden">
            {/* Highlight Banner */}
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-black py-1 px-3 transform rotate-45 translate-x-8 translate-y-3">
                <span className="text-xs font-medium">New</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Contract Matching by AI</h2>
              <p className="text-gray-300 mb-6">
                Use our new AI-powered direct matching system.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <span>Skip the noise, access relevant, winnable opportunities.</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <span>Smart filters on tech stack, TRL and region for you to act on today.</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/ai-matching')} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Try AI Matching
            </Button>
          </div>
          
          {/* ImFo Intelligence Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col">
            <div className="flex-1">
              <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">ImFo Intelligence</h2>
              <p className="text-gray-300 mb-6">
                We map the deep tech frontier from stealth to IPO. Updated weekly.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <span> Spot emerging competitors & collaborators early.</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <span>Leverage capital raises, defense wins, and policy signals.</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/intelligence')} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              View Companies
            </Button>
          </div>
        
          
          {/* Standard Submission Card - Commented out for now
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col">
            <div className="flex-1">
              <div className="bg-primary/10 p-4 rounded-lg inline-block mb-4">
                <Rocket className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Standard Submission</h2>
              <p className="text-gray-300 mb-6">
                Submit your company and project details through our traditional form.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                  <span>Receive matches you can store in PDF/CSV</span>
                </li>
              </ul>
            </div>
            <Button 
              onClick={() => navigate('/standard-form')} 
              className="w-full bg-primary hover:bg-primary/90"
            >
              Start Standard Submission
            </Button>
          </div>
          */}
        </div>
        
        <div className="text-center text-sm text-gray-400">
          <p>All matching powered by OpenAI's advanced language models</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
