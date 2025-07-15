import { api } from '@/lib/api';
import { 
  EquipmentDomain, 
  EquipmentFamily,
  CreateEquipmentDomainRequest, 
  UpdateEquipmentDomainRequest,
  CreateEquipmentFamilyRequest,
  UpdateEquipmentFamilyRequest,
  ApiResponse,
  PaginatedResponse,
  ServerPaginatedResponse
} from '@/types/equipment';

export const equipmentService = {
  // Domaines d'équipements
  async getDomains(page: number = 1, limit: number = 10, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<EquipmentDomain>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/domains${queryString}`);
    return response.data;
  },

  async getDomainById(id: string): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.get(`/equipments/domains/${id}`);
    return response.data;
  },
  
  async getDomainBySerialNumber(serialNumber: string): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.get(`/equipments/domains/serial/${serialNumber}`);
    return response.data;
  },

  async createDomain(data: CreateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.post('/equipments/domains', data);
    return response.data;
  },

  async updateDomain(id: string, data: UpdateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.patch(`/equipments/domains/${id}`, data);
    return response.data;
  },

  async deleteDomain(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/equipments/domains/${id}`);
      return response.data;
    } catch (error) {
      // Relancer l'erreur pour que le composant puisse la gérer
      throw error;
    }
  },
  
  async restoreDomain(id: string): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.patch(`/equipments/domains/${id}/restore`);
    return response.data;
  },

  // Familles d'équipements
  async getFamilies(page: number = 1, limit: number = 10, domainId?: string, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<EquipmentFamily>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (domainId) {
      params.append('domainId', domainId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/families${queryString}`);
    return response.data;
  },
  
  async getFamilyById(id: string): Promise<ApiResponse<EquipmentFamily>> {
    const response = await api.get(`/equipments/families/${id}`);
    return response.data;
  },
  
  async getFamilyBySerialNumber(serialNumber: string): Promise<ApiResponse<EquipmentFamily>> {
    const response = await api.get(`/equipments/families/serial/${serialNumber}`);
    return response.data;
  },
  
  async createFamily(data: CreateEquipmentFamilyRequest): Promise<ApiResponse<EquipmentFamily>> {
    const response = await api.post('/equipments/families', data);
    return response.data;
  },
  
  async updateFamily(id: string, data: UpdateEquipmentFamilyRequest): Promise<ApiResponse<EquipmentFamily>> {
    const response = await api.patch(`/equipments/families/${id}`, data);
    return response.data;
  },
  
  async deleteFamily(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/equipments/families/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async restoreFamily(id: string): Promise<ApiResponse<EquipmentFamily>> {
    const response = await api.patch(`/equipments/families/${id}/restore`);
    return response.data;
  },

  // Types d'équipements
  async getTypes(page: number = 1, limit: number = 10, familyId?: string, search?: string): Promise<ServerPaginatedResponse<any>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (familyId) {
      params.append('familyId', familyId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/types${queryString}`);
    return response.data;
  },

  // Marques
  async getBrands(page: number = 1, limit: number = 10, search?: string): Promise<ServerPaginatedResponse<any>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/brands${queryString}`);
    return response.data;
  },

  // Produits
  async getProducts(page: number = 1, limit: number = 10, typeId?: string, brandId?: string, search?: string): Promise<ServerPaginatedResponse<any>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (typeId) {
      params.append('typeId', typeId);
    }
    
    if (brandId) {
      params.append('brandId', brandId);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/products${queryString}`);
    return response.data;
  },
}; 