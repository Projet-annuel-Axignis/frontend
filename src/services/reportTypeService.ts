import { api } from '@/lib/api';
import { PaginatedResponseDto } from '@/types/apiTypes';

export interface ReportType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportTypeDto {
  code: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateReportTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface ReportTypeFilters {
  search?: string;
  isActive?: boolean;
  sortBy?: 'code' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ReportTypeResponse {
  data: ReportType[];
  total: number;
  page: number;
  limit: number;
}

const reportTypeService = {
  // Obtenir tous les types de rapport avec filtrage
  async getReportTypes(filters: ReportTypeFilters = {}): Promise<ReportTypeResponse> {
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

    const response = await api.get<PaginatedResponseDto<ReportType>>(`/report-types?${params.toString()}`);
    return {
      data: response.data.results,
      total: response.data.totalResults,
      page: filters.page || 1,
      limit: filters.limit || 20
    };
  },

  // Obtenir un type de rapport par code
  async getReportTypeByCode(code: string): Promise<ReportType> {
    const response = await api.get(`/report-types/${code}`);
    return response.data;
  },

  // Créer un nouveau type de rapport
  async createReportType(data: CreateReportTypeDto): Promise<ReportType> {
    const response = await api.post('/report-types', data);
    return response.data;
  },

  // Mettre à jour un type de rapport
  async updateReportType(code: string, data: UpdateReportTypeDto): Promise<ReportType> {
    const response = await api.put(`/report-types/${code}`, data);
    return response.data;
  },

  // Supprimer un type de rapport
  async deleteReportType(code: string): Promise<void> {
    await api.delete(`/report-types/${code}`);
  },

  // Filtrage côté client pour des cas spécifiques
  filterReportTypes(reportTypes: ReportType[], filters: Partial<ReportTypeFilters>): ReportType[] {
    let filtered = [...reportTypes];

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
            bValue = b.createdAt;
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

export default reportTypeService; 