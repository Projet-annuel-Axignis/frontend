import { api } from '@/lib/api';
import { Company } from '@/types/company';

export interface CompaniesResponse {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
}

export interface CompanyFilters {
  search?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateCompanyData {
  name: string;
  siretNumber: string;
  planId: number;
}

export interface UpdateCompanyData {
  name?: string;
  siretNumber?: string;
  planId?: number;
}

class CompanyService {
  /**
   * Récupère la liste des entreprises avec filtres optionnels
   */
  async getCompanies(filters: CompanyFilters = {}): Promise<CompaniesResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.includeDeleted) params.append('includeDeleted', 'true');
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const url = `/companies?${params.toString()}`;
    const response = await api.get(url);
    const data = response.data;

    // Adapter la réponse API à notre interface
    return {
      companies: data.results || [], // L'API retourne "results" et non "companies"
      total: data.totalResults || 0, // L'API retourne "totalResults"
      page: filters.page || 1,
      limit: data.limit || filters.limit || 10,
    };
  }

  /**
   * Récupère une entreprise par son ID
   */
  async getCompanyById(id: string | number): Promise<Company> {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  }

  /**
   * Met à jour une entreprise
   */
  async updateCompany(id: string | number, companyData: UpdateCompanyData): Promise<Company> {
    try {
      const response = await api.patch(`/companies/${id}`, companyData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Bascule l'état d'une entreprise (suppression/restauration)
   */
  async toggleCompanyState(id: string | number): Promise<{ message: string; id: number }> {
    const response = await api.patch(`/companies/${id}/update-state`);
    return response.data;
  }

  /**
   * Crée une nouvelle entreprise
   */
  async createCompany(companyData: CreateCompanyData): Promise<Company> {
    try {
      const response = await api.post('/companies', companyData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new CompanyService(); 