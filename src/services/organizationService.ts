import { api } from '@/lib/api';

// Utiliser les types de intervention.ts
export type OrganizationType = 'OA' | 'TC';

export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
}

export interface CreateOrganizationDto {
  name: string;
  type: OrganizationType;
}

export interface UpdateOrganizationDto {
  name?: string;
  type?: OrganizationType;
}

export interface OrganizationFilters {
  search?: string;
  sortBy?: 'name' | 'type';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrganizationResponse {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
}

const organizationService = {
  // Obtenir tous les organismes avec filtrage
  async getOrganizations(filters: OrganizationFilters = {}): Promise<OrganizationResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortField', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    if (filters.page !== undefined && filters.limit !== undefined) {
      params.append('offset', ((filters.page - 1) * filters.limit).toString());
      params.append('limit', filters.limit.toString());
    } else if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }

    const response = await api.get(`/organizations?${params.toString()}`);
    return response.data;
  },

  // Obtenir un organisme par ID
  async getOrganization(id: number): Promise<Organization> {
    const response = await api.get(`/organizations/${id}`);
    return response.data;
  },

  // Créer un nouvel organisme
  async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
    const response = await api.post('/organizations', data);
    return response.data;
  },

  // Mettre à jour un organisme
  async updateOrganization(id: number, data: UpdateOrganizationDto): Promise<Organization> {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data;
  },

  // Supprimer un organisme
  async deleteOrganization(id: number): Promise<void> {
    await api.delete(`/organizations/${id}`);
  },

  // Filtrage côté client pour des cas spécifiques
  filterOrganizations(organizations: Organization[], filters: Partial<OrganizationFilters>): Organization[] {
    let filtered = [...organizations];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(org =>
        org.name.toLowerCase().includes(searchLower) ||
        org.type.toLowerCase().includes(searchLower)
      );
    }

    // Tri côté client
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'type':
            aValue = a.type;
            bValue = b.type;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return filtered;
  }
};

export default organizationService; 