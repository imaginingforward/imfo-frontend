import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

type Company = {
  id: string;
  company_name: string;
  description?: string;
  business_activity?: string[];
  website_url?: string;
  crunchbase_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
};

const ImFoIntelligencePage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: "List companies in space tech" }),
        });

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setCompanies(data);
        } else if (Array.isArray(data.results)) {
          setCompanies(data.results);
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Intelligence Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card
            key={company.id}
            className="relative group p-6 bg-white/10 border border-white/20 text-white hover:shadow-lg transition-all cursor-pointer"
            onClick={() => {
              // Future: navigate(`/company/${company.id}`)
              console.log(`Click: /company/${company.id}`);
            }}
          >
            <h3 className="text-xl font-semibold mb-2">{company.company_name}</h3>

            <p className="text-sm text-gray-300 mb-3">
              {company.description || "No description provided."}
            </p>

            {company.business_activity && (
              <div className="flex flex-wrap gap-1 mb-3 text-xs text-gray-400">
                {company.business_activity.map((tag, i) => (
                  <span key={i} className="bg-white/10 px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            )}

            <div className="absolute bottom-4 right-4 flex gap-3">
              {company.website_url && (
                <a
                  href={`https://${company.website_url.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src="/website.jpg" alt="Website" className="w-4 h-4 hover:opacity-80" />
                </a>
              )}
              {company.linkedin_url && (
                <a
                  href={`https://${company.linkedin_url.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src="/linkedin_logo.jpg" alt="LinkedIn" className="w-4 h-4 hover:opacity-80" />
                </a>
              )}
              {company.twitter_url && (
                <a
                  href={`https://${company.twitter_url.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src="/x_logo.jpg" alt="X" className="w-4 h-4 hover:opacity-80" />
                </a>
              )}
              {company.crunchbase_url && (
                <a
                  href={`https://${company.crunchbase_url.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src="/cb_logo.jpg" alt="Crunchbase" className="w-4 h-4 hover:opacity-80" />
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImFoIntelligencePage;
