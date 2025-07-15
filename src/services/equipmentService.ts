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
  UpdateBrandRequest,
  DocumentType,
  CreateDocumentTypeRequest,
  UpdateDocumentTypeRequest,
  ProductDocument,
  UploadProductDocumentRequest,
  UpdateProductDocumentStatusRequest,
  Product,
  CreateProductRequest,
  UpdateProductRequest
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

  async getDomainById(id: number): Promise<ApiResponse<EquipmentDomain>> {
    try {
      console.log(`Récupération du domaine (ID: ${id})`);
      const response = await api.get(`/equipments/domains/${id}`);
      console.log('Réponse de récupération de domaine:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération du domaine (ID: ${id}):`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Données d\'erreur:', error.response.data);
      }
      throw error;
    }
  },
  
  async getDomainBySerialNumber(serialNumber: string): Promise<ApiResponse<EquipmentDomain>> {
    const response = await api.get(`/equipments/domains/serial/${serialNumber}`);
    return response.data;
  },

  async createDomain(data: CreateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    try {
      console.log('Création d\'un domaine avec les données:', data);
      const response = await api.post('/equipments/domains', data);
      console.log('Réponse de création de domaine:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création du domaine:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Données d\'erreur:', error.response.data);
      }
      throw error;
    }
  },

  async updateDomain(id: number, data: UpdateEquipmentDomainRequest): Promise<ApiResponse<EquipmentDomain>> {
    try {
      console.log(`Mise à jour du domaine (ID: ${id}) avec les données:`, data);
      const response = await api.patch(`/equipments/domains/${id}`, data);
      console.log('Réponse de mise à jour de domaine:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour du domaine (ID: ${id}):`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Données d\'erreur:', error.response.data);
      }
      throw error;
    }
  },

  async deleteDomain(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`Suppression du domaine (ID: ${id})`);
      const response = await api.delete(`/equipments/domains/${id}`);
      console.log('Réponse de suppression de domaine:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du domaine (ID: ${id}):`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Données d\'erreur:', error.response.data);
      }
      throw error;
    }
  },
  
  async restoreDomain(id: number): Promise<ApiResponse<EquipmentDomain>> {
    try {
      console.log(`Restauration du domaine (ID: ${id})`);
      const response = await api.patch(`/equipments/domains/${id}/restore`);
      console.log('Réponse de restauration de domaine:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la restauration du domaine (ID: ${id}):`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Données d\'erreur:', error.response.data);
      }
      throw error;
    }
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
  },

  // Types de documents
  async getDocumentTypes(page: number = 1, limit: number = 10, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<DocumentType>> {
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
    const response = await api.get(`/product-document-types${queryString}`);
    return response.data;
  },
  
  async getDocumentTypeById(id: string): Promise<ApiResponse<DocumentType>> {
    const response = await api.get(`/product-document-types/${id}`);
    return response.data;
  },
  
  async getDocumentTypeBySerialNumber(serialNumber: string): Promise<ApiResponse<DocumentType>> {
    const response = await api.get(`/product-document-types/serial/${serialNumber}`);
    return response.data;
  },
  
  async createDocumentType(data: CreateDocumentTypeRequest): Promise<ApiResponse<DocumentType>> {
    console.log("Données pour création de type de document:", data);
    const response = await api.post('/product-document-types', data);
    return response.data;
  },
  
  async updateDocumentType(id: string, data: UpdateDocumentTypeRequest): Promise<ApiResponse<DocumentType>> {
    console.log(`Appel API PATCH /product-document-types/${id} avec données:`, data);
    try {
      const response = await api.patch(`/product-document-types/${id}`, data);
      console.log("Réponse API updateDocumentType:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur updateDocumentType:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      throw error;
    }
  },
  
  async deleteDocumentType(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/product-document-types/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async restoreDocumentType(id: string): Promise<ApiResponse<DocumentType>> {
    const response = await api.post(`/product-document-types/${id}/restore`);
    return response.data;
  },

  // Documents de produit
  async getProductDocuments(page: number = 1, limit: number = 10, productId?: string, documentTypeId?: string, status?: string, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<ProductDocument>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (productId) {
      params.append('productId', productId);
    }
    
    if (documentTypeId) {
      params.append('documentTypeId', documentTypeId);
    }
    
    if (status) {
      params.append('status', status);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/product-documents${queryString}`);
    return response.data;
  },
  
  async getProductDocumentById(id: string): Promise<ApiResponse<ProductDocument>> {
    const response = await api.get(`/product-documents/${id}`);
    return response.data;
  },
  
  async getProductDocumentBySerialNumber(serialNumber: string): Promise<ApiResponse<ProductDocument>> {
    const response = await api.get(`/product-documents/serial/${serialNumber}`);
    return response.data;
  },

  async getProductDocumentsByProductId(productId: string, page: number = 1, limit: number = 10): Promise<ServerPaginatedResponse<ProductDocument>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/products/${productId}/documents${queryString}`);
    return response.data;
  },
  
  async uploadProductDocument(data: UploadProductDocumentRequest): Promise<ApiResponse<ProductDocument>> {
    console.log("Données pour upload de document:", data);
    
    // Création d'un FormData pour l'upload du fichier
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('reference', data.reference);
    formData.append('serialNumber', data.serialNumber);
    formData.append('productId', data.productId);
    formData.append('documentTypeId', data.documentTypeId);
    formData.append('issueDate', data.issueDate);
    formData.append('version', data.version.toString());
    
    if (data.expiryDate) {
      formData.append('expiryDate', data.expiryDate);
    }
    
    const response = await api.post('/product-documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  async updateProductDocumentStatus(id: string, data: UpdateProductDocumentStatusRequest): Promise<ApiResponse<ProductDocument>> {
    console.log(`Mise à jour du statut du document (ID: ${id})`, data);
    const response = await api.patch(`/product-documents/${id}/status`, data);
    return response.data;
  },
  
  async downloadProductDocument(id: string): Promise<Blob> {
    const response = await api.get(`/product-documents/${id}/file`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  async validateProductDocumentChecksum(id: string, checksum: string): Promise<ApiResponse<{ valid: boolean }>> {
    const response = await api.post(`/product-documents/${id}/validate-checksum`, { checksum });
    return response.data;
  },
  
  async deleteProductDocument(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/product-documents/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async restoreProductDocument(id: string): Promise<ApiResponse<ProductDocument>> {
    const response = await api.patch(`/product-documents/${id}/restore`);
    return response.data;
  },

  // Produits
  async getProducts(page: number = 1, limit: number = 10, brandId?: number, typeId?: number, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<Product>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    if (brandId) {
      params.append('brandId', brandId.toString());
    }
    
    if (typeId) {
      params.append('typeId', typeId.toString());
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    try {
      console.log(`Appel API GET /products${queryString}`);
      const response = await api.get(`/products${queryString}`);
      console.log("Réponse API getProducts:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur getProducts:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      throw error;
    }
  },
  
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      console.log(`Appel API GET /products/${id}`);
      const response = await api.get(`/products/${id}`);
      console.log("Réponse API getProductById:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur getProductById:", error);
      throw error;
    }
  },
  
  async getProductBySerialNumber(serialNumber: string): Promise<ApiResponse<Product>> {
    try {
      console.log(`Appel API GET /products/serial/${serialNumber}`);
      const response = await api.get(`/products/serial/${serialNumber}`);
      console.log("Réponse API getProductBySerialNumber:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur getProductBySerialNumber:", error);
      throw error;
    }
  },
  
  async createProduct(data: CreateProductRequest): Promise<ApiResponse<Product>> {
    console.log("Données pour création de produit:", data);
    
    try {
      const response = await api.post('/products', data);
      console.log("Réponse API createProduct:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur createProduct:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      throw error;
    }
  },
  
  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse<Product>> {
    console.log(`Appel API PATCH /products/${id} avec données:`, data);
    
    try {
      const response = await api.patch(`/products/${id}`, data);
      console.log("Réponse API updateProduct:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur updateProduct:", error);
      if (error.response) {
        console.error("Statut de l'erreur:", error.response.status);
        console.error("Données d'erreur:", error.response.data);
      }
      throw error;
    }
  },
  
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    try {
      console.log(`Appel API DELETE /products/${id}`);
      const response = await api.delete(`/products/${id}`);
      console.log("Réponse API deleteProduct:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur deleteProduct:", error);
      throw error;
    }
  },
  
  async restoreProduct(id: number): Promise<ApiResponse<Product>> {
    try {
      console.log(`Appel API POST /products/${id}/restore`);
      const response = await api.patch(`/products/${id}/restore`);
      console.log("Réponse API restoreProduct:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur restoreProduct:", error);
      throw error;
    }
  }
};