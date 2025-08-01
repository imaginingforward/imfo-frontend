import React, { useState } from "react";

interface CompanyCardProps {
  company_name: string;
  description: string;
  hq_location?: string;
  business_activity?: string[];
  logo_url?: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  crunchbase_url?: string;
}

const truncate = (text: string = "", n: number = 70) => text.length > n ? text.slice(0, n-1) + "..." : text;

const CompanyCard: React.FC<CompanyCardProps> = ({
  company_name,
  description,
  hq_location,
  business_activity = [],
  logo_url,
  website_url,
  linkedin_url,
  twitter_url,
  crunchbase_url,
}) => {
  const [logoVisible, setLogoVisible] = useState(true);

  const socialLinks = [
    { url: website_url, icon: "/website_logo.png", alt: "Website" },
    { url: linkedin_url, icon: "/linkedin_logo.png", alt: "LinkedIn" },
    { url: twitter_url, icon: "/X_logo.jpeg", alt: "X (Twitter)" },
    { url: crunchbase_url, icon: "/cb_logo.png", alt: "Crunchbase" },
  ].filter(link => link.url); // Only show icons for existing URLs

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-5 w-full max-w-md mx-auto flex flex-col gap-2 relative">
      {logo_url && logoVisible && (
        <div className="bg-gray-100 rounded-md flex items-center justify-center h-14 w-14 mb-3 overflow-hidden">
          <img
            src={logo_url}
            alt={`${company_name} logo`}
            className="object-contain h-12 w-12"
            onError={() => setLogoVisible(false)}
            loading="lazy"
          />
        </div>
      )}
      <h3 className="text-lg font-bold mb-1 truncate">{company_name}</h3>
      <p className="text-sm text-gray-700 mb-2 truncate">
        {description || "No description provided."}
      </p>
      {business_activity?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {business_activity.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {hq_location && (
        <div className="text-xs text-gray-500 mb-1">{hq_location}</div>
      )}
      
      {/* Social Media Icons - Bottom Right */}
      {socialLinks.length > 0 && (
        <div className="flex gap-2 justify-end mt-auto pt-2">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url?.startsWith('http') ? link.url : `https://${link.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img
                src={link.icon}
                alt={link.alt}
                className="h-4 w-4 object-contain"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
