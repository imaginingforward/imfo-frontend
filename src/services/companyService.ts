// Elasticsearch company interface matching your API response
export interface Company {
  id: string;
  company_name: string;
  business_activity: string;
  business_area: string;
  sector: string;
  stage?: string;
  description: string;
  hq_city: string;
  hq_state: string;
  hq_country: string;
  hq_location: string;
  leadership: string;
  latest_funding_stage: string;
  latest_funding_raised: number;
  total_funding_raised: number;
  annual_revenue?: number;
  capital_partners: string;
  notable_partners: string;
  website_url: string;
  linkedin_url: string;
  crunchbase_url: string;
  twitter_url: string;
  year_founded?: number;
  hiring?: string;
}

export interface CompanyResponse {
  companies: Company[];
  count: number;
}

// Simple search interface for Elasticsearch
export interface SearchFilters {
  query?: string;
}

// Direct Elasticsearch API call - matches your main page implementation
export const searchCompanies = async (query: string = ''): Promise<CompanyResponse> => {
  try {
    console.log('Searching with query:', query);
    
    const response = await fetch('https://imfo-nlp-api-da20e5390e7c.herokuapp.com/parse', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query || 'los angeles' })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CompanyResponse = await response.json();
    console.log('API response:', data);
    
    return data;
  } catch (error: any) {
    console.error('Search error:', error);
    throw error;
  }
};

// Transform function to add IDs if needed
export const transformCompany = (backendCompany: Omit<Company, 'id'>, index: number): Company => {
  return {
    ...backendCompany,
    id: `company-${index}`,
    business_area: backendCompany.business_area || '',
  };
};
