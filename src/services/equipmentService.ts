import { api } from '@/lib/api';
import { 
  EquipmentDomain, 
  EquipmentFamily,
  EquipmentType,
  CreateEquipmentDomainRequest, 
  UpdateEquipmentDomainRequest,
  CreateEquipmentFamilyRequest,
  UpdateEquipmentFamilyRequest,
  CreateEquipmentTypeRequest,
  UpdateEquipmentTypeRequest,
  ApiResponse,
  PaginatedResponse,
  ServerPaginatedResponse,
  Brand,
  CreateBrandRequest,
  UpdateBrandRequest
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
    // Créer un objet pour l'API qui peut avoir des types différents
    const requestData: any = { ...data };
    
    // Si domainId est présent, essayer de le convertir en nombre pour l'API
    if (requestData.domainId) {
      // Dans le cas où domainId est une chaîne qui représente un nombre
      if (typeof requestData.domainId === 'string' && !isNaN(Number(requestData.domainId))) {
        // Convertir en nombre pour l'API
        requestData.domainId = Number(requestData.domainId);
      }
    }
    
    console.log("Données pour création de famille:", requestData);
    
    const response = await api.post('/equipments/families', requestData);
    return response.data;
  },
  
  async updateFamily(id: string, data: UpdateEquipmentFamilyRequest): Promise<ApiResponse<EquipmentFamily>> {
    // Créer un objet pour l'API qui peut avoir des types différents
    const requestData: any = { ...data };
    
    // Si domainId est présent, essayer de le convertir en nombre pour l'API
    if (requestData.domainId) {
      // Dans le cas où domainId est une chaîne qui représente un nombre
      if (typeof requestData.domainId === 'string' && !isNaN(Number(requestData.domainId))) {
        // Convertir en nombre pour l'API
        requestData.domainId = Number(requestData.domainId);
      }
    }
    
    console.log(`Appel API PATCH /equipments/families/${id} avec données originales:`, data);
    console.log(`Données après transformation pour l'API:`, requestData);
    
    try {
      const response = await api.patch(`/equipments/families/${id}`, requestData);
      console.log("Réponse API updateFamily:", response.data);
      return response.data;
    } catch (error: any) {  // Typer explicitement error comme 'any' pour l'accès aux propriétés
      console.error("Erreur updateFamily:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
        console.error("Headers de la réponse:", error.response.headers);
      }
      throw error;
    }
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
  async getTypes(page: number = 1, limit: number = 10, familyId?: string, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<EquipmentType>> {
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
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/equipments/types${queryString}`);
    return response.data;
  },
  
  async getTypeById(id: string): Promise<ApiResponse<EquipmentType>> {
    const response = await api.get(`/equipments/types/${id}`);
    return response.data;
  },
  
  async getTypeBySerialNumber(serialNumber: string): Promise<ApiResponse<EquipmentType>> {
    const response = await api.get(`/equipments/types/serial/${serialNumber}`);
    return response.data;
  },
  
  async createType(data: CreateEquipmentTypeRequest): Promise<ApiResponse<EquipmentType>> {
    // Créer un objet pour l'API qui peut avoir des types différents
    const requestData: any = { ...data };
    
    // Si familyId est présent, essayer de le convertir en nombre pour l'API
    if (requestData.familyId) {
      // Dans le cas où familyId est une chaîne qui représente un nombre
      if (typeof requestData.familyId === 'string' && !isNaN(Number(requestData.familyId))) {
        // Convertir en nombre pour l'API
        requestData.familyId = Number(requestData.familyId);
      }
    }
    
    console.log("Données pour création de type:", requestData);
    
    const response = await api.post('/equipments/types', requestData);
    return response.data;
  },
  
  async updateType(id: string, data: UpdateEquipmentTypeRequest): Promise<ApiResponse<EquipmentType>> {
    // Créer un objet pour l'API qui peut avoir des types différents
    const requestData: any = { ...data };
    
    // Si familyId est présent, essayer de le convertir en nombre pour l'API
    if (requestData.familyId) {
      // Dans le cas où familyId est une chaîne qui représente un nombre
      if (typeof requestData.familyId === 'string' && !isNaN(Number(requestData.familyId))) {
        // Convertir en nombre pour l'API
        requestData.familyId = Number(requestData.familyId);
      }
    }
    
    console.log(`Appel API PATCH /equipments/types/${id} avec données originales:`, data);
    console.log(`Données après transformation pour l'API:`, requestData);
    
    try {
      const response = await api.patch(`/equipments/types/${id}`, requestData);
      console.log("Réponse API updateType:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur updateType:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
        console.error("Headers de la réponse:", error.response.headers);
      }
      throw error;
    }
  },
  
  async deleteType(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/equipments/types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async restoreType(id: string): Promise<ApiResponse<EquipmentType>> {
    const response = await api.patch(`/equipments/types/${id}/restore`);
    return response.data;
  },

  // Brands (Marques)
  async getBrands(page: number = 1, limit: number = 10, search?: string, showDeleted: boolean = false): Promise<[Brand[], number, number]> {
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
    const response = await api.get(`/brands${queryString}`);
    return response.data;
  },

  async getBrandById(id: string): Promise<ApiResponse<Brand>> {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },
  
  async getBrandBySerialNumber(serialNumber: string): Promise<ApiResponse<Brand>> {
    const response = await api.get(`/brands/serial/${serialNumber}`);
    return response.data;
  },

  async createBrand(data: CreateBrandRequest): Promise<ApiResponse<Brand>> {
    console.log("Données pour création de marque:", data);
    const response = await api.post('/brands', data);
    return response.data;
  },

  async updateBrand(id: string, data: UpdateBrandRequest): Promise<ApiResponse<Brand>> {
    console.log(`Appel API PATCH /brands/${id} avec données:`, data);
    try {
      const response = await api.patch(`/brands/${id}`, data);
      console.log("Réponse API updateBrand:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur updateBrand:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      throw error;
    }
  },
  
  async deleteBrand(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/brands/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async restoreBrand(id: string): Promise<ApiResponse<Brand>> {
    const response = await api.post(`/brands/${id}/restore`);
    return response.data;
  }
};