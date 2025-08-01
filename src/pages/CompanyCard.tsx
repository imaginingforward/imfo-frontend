// src/components/CompanyCard.tsx
import React from "react";

interface CompanyCardProps {
  company_name: string;
  description: string;
  hq_location: string;
  total_funding_raised: string;
  business_activity: string[];
  logo_url?: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  company_name,
  description,
  hq_location,
  total_funding_raised,
  business_activity,
  logo_url,
}) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-md mx-auto hover:shadow-xl transition duration-300">
      {logo_url && (
        <img
          src={logo_url}
          alt={`${company_name} logo`}
          className="h-14 w-14 object-contain mb-3"
        />
      )}
      <h3 className="text-lg font-bold mb-1">{company_name}</h3>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      <div className="text-xs text-gray-500 mb-1">📍 {hq_location}</div>
      <div className="text-xs text-gray-500 mb-1">💰 {total_funding_raised}</div>
      <div className="text-xs text-gray-600">
        {business_activity.map((tag) => (
          <span key={tag} className="inline-block bg-gray-200 rounded px-2 py-0.5 mr-1 mb-1">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CompanyCard;

export default ImFoIntelligencePage;
