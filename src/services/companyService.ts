import { getApiBaseUrl, getBackendApiKey } from "@/utils/envConfig";

// Interface for the value object structure used in many fields
interface ValueObject {
  id: number;
  value: string;
  color: string;
}

export interface Company {
  id: number;
  company_name: string;
  sector: string;
  subsector_tags: ValueObject | null;
  description: string | null;
  stage: ValueObject | null;
  latest_funding_raised: string | null;
  total_funding_raised: string | null;
  capital_partners: ValueObject[] | [];
  annual_revenue: string | null;
  hq_location: ValueObject | null;
  founder: string | null;
  year_founded: string | null;
  hiring: string | null;
  notable_partners: ValueObject[] | [];
  competitors: string | null;
  public_ticker: string | null;
  business_activity: ValueObject[] | [];
  website_url: string | null;
  crunchbase_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

export interface CompanyResponse {
  companies: Company[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface CompanyFilters {
  search?: string;
  sector?: string;
  stage?: string;
  page?: number;
  pageSize?: number;
}

export const fetchCompanies = async (filters: CompanyFilters = {}): Promise<CompanyResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sector) queryParams.append('sector', filters.sector);
    if (filters.stage) queryParams.append('stage', filters.stage);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.pageSize) queryParams.append('pageSize', filters.pageSize.toString());
    
    const url = `${getApiBaseUrl()}/api/companies?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': getBackendApiKey()
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const fetchCompanyById = async (id: number): Promise<Company> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/companies/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': getBackendApiKey()
      }
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching company ${id}:`, error);
    throw error;
  }
};
