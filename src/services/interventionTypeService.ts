import { api } from '@/lib/api';
import { PaginatedResponseDto } from '@/types/apiTypes';

export interface InterventionType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterventionTypeDto {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateInterventionTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface InterventionTypeFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'code' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InterventionTypeResponse {
  data: InterventionType[];
  total: number;
  page: number;
  limit: number;
}

const interventionTypeService = {
  // Obtenir tous les types d'intervention avec filtrage
  async getInterventionTypes(filters: InterventionTypeFilters = {}): Promise<InterventionTypeResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.isActive !== undefined) params.append('includeDeleted', (!filters.isActive).toString());
    if (filters.sortBy) params.append('sortField', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    if (filters.page !== undefined && filters.limit !== undefined) {
      params.append('offset', ((filters.page - 1) * filters.limit).toString());
      params.append('limit', filters.limit.toString());
    } else if (filters.limit !== undefined) {
      params.append('limit', filters.limit.toString());
    }

    const response = await api.get<PaginatedResponseDto<InterventionType>>(`/intervention-types?${params.toString()}`);

    return {
      data: response.data.results,
      total: response.data.totalResults,
      page: filters.page || 1,
      limit: filters.limit || 20
    };
  },

  // Obtenir un type d'intervention par code
  async getInterventionTypeByCode(code: string): Promise<InterventionType> {
    const response = await api.get(`/intervention-types/${code}`);
    return response.data;
  },

  // Créer un nouveau type d'intervention
  async createInterventionType(data: CreateInterventionTypeDto): Promise<InterventionType> {
    const response = await api.post('/intervention-types', data);
    return response.data;
  },

  // Mettre à jour un type d'intervention
  async updateInterventionType(code: string, data: UpdateInterventionTypeDto): Promise<InterventionType> {
    const response = await api.put(`/intervention-types/${code}`, data);
    return response.data;
  },

  // Supprimer un type d'intervention
  async deleteInterventionType(code: string): Promise<void> {
    await api.delete(`/intervention-types/${code}`);
  },

  // Filtrage côté client pour des cas spécifiques
  filterInterventionTypes(types: InterventionType[], filters: Partial<InterventionTypeFilters>): InterventionType[] {
    let filtered = [...types];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(type =>
        type.code.toLowerCase().includes(searchLower) ||
        type.name.toLowerCase().includes(searchLower) ||
        (type.description && type.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(type => type.isActive === filters.isActive);
    }

    // Tri côté client
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (filters.sortBy) {
          case 'code':
            aValue = a.code;
            bValue = b.code;
            break;
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'createdAt':
            aValue = new Date(a.createdAt);
            bValue = new Date(b.createdAt);
            break;
          case 'updatedAt':
            aValue = new Date(a.updatedAt);
            bValue = new Date(b.updatedAt);
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

export default interventionTypeService; 