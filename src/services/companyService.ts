// Elasticsearch company interface matching your API response
export interface Company {
  id: string;
  company_name: string;
  sector: string;
  business_area: string;
  description: string;
  business_activity: string;
  latest_funding_stage: string;
  latest_funding_raised: string;
  total_funding_raised: string;
  capital_partners: string;
  notable_partners?: string;
  public_ticker?:string;
  stage?: string;
  annual_revenue?: string;
  hq_city: string;
  hq_state: string;
  hq_country: string;
  hq_location: string;
  leadership: string;
  year_founded?: number;
  hiring?: string;
  notable_contracts?: string;
  website_link: string;
  linkedin_link: string;
  crunchbase_link: string;
  twitter_link: string;
  revenue_arr: string;
  ebitda?: string;
  free_cash_flow?: string;
  debt_current?: string;
  debt_net?: string;
  consumer_base_size?: string;
  concentration?: string;
  segment_local_vs_international?: string;
  revenue_forecast?: string;
  key_press_links: string[];
  job_board_links: string[];
  patent_highlights?: string;
  government_announcements?: string;
  products_services?: string;
  capabilities?: string;
  buyer_types?: string;
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
  };
};
