import { api } from '@/lib/api';
import { 
  EquipmentDomain, 
  CreateEquipmentDomainRequest, 
  UpdateEquipmentDomainRequest,
  ApiResponse,
  PaginatedResponse 
} from '@/types/equipment';

export const equipmentService = {
  // Domaines d'équipements
  async getDomains(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<EquipmentDomain>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/equipment/domains?${params}`);
    return response.data;
  },

  async getDomainById(id: string): Promise<EquipmentDomain> {
    const response = await api.get(`/equipment/domains/${id}`);
    return response.data;
  },

  async createDomain(data: CreateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.post('/equipment/domains', data);
    return response.data;
  },

  async updateDomain(id: string, data: UpdateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.put(`/equipment/domains/${id}`, data);
    return response.data;
  },

  async deleteDomain(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/equipment/domains/${id}`);
    return response.data;
  },

  // Familles d'équipements
  async getFamilies(page: number = 1, limit: number = 10, domainId?: string, search?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (domainId) {
      params.append('domainId', domainId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/equipment/families?${params}`);
    return response.data;
  },

  // Types d'équipements
  async getTypes(page: number = 1, limit: number = 10, familyId?: string, search?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (familyId) {
      params.append('familyId', familyId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/equipment/types?${params}`);
    return response.data;
  },

  // Marques
  async getBrands(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/equipment/brands?${params}`);
    return response.data;
  },

  // Produits
  async getProducts(page: number = 1, limit: number = 10, typeId?: string, brandId?: string, search?: string): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (typeId) {
      params.append('typeId', typeId);
    }
    
    if (brandId) {
      params.append('brandId', brandId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/equipment/products?${params}`);
    return response.data;
  },
}; 