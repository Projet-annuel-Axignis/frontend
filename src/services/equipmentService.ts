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
  ServerPaginatedResponse,
  ArrayPaginatedResponse,
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
  UpdateProductRequest,
  CompatibilityGroup,
  CreateCompatibilityGroupRequest,
  AttachProductToGroupRequest,
  DetachProductFromGroupRequest
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
  async getFamilies(page: number = 1, limit: number = 10, domainId?: number | string, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<EquipmentFamily>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    // Utilisation des paramètres de filtrage pour le domainId
    if (domainId) {
      params.append('filterField', 'domain');
      params.append('filterOp', 'equals');
      params.append('filter', domainId.toString());
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    console.log("Paramètres de requête pour getFamilies:", params.toString());
    
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
  async getTypes(page: number = 1, limit: number = 10, familyId?: number | string, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<EquipmentType>> {
    const params = new URLSearchParams();
    
    if (page) {
      params.append('page', page.toString());
    }
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    // Utilisation des paramètres de filtrage pour la famille
    if (familyId) {
      params.append('filterField', 'family');
      params.append('filterOp', 'equals');
      params.append('filter', familyId.toString());
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (showDeleted) {
      params.append('includeDeleted', 'true');
    }
    
    console.log("Paramètres de requête pour getTypes:", params.toString());
    
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
  async getDocumentTypes(page: number = 1, limit: number = 10, search?: string, showDeleted: boolean = false): Promise<ArrayPaginatedResponse<DocumentType>> {
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
    // La réponse est au format [results, totalResults, totalPages]
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
    // Utilisation de PATCH comme spécifié dans l'API
    const response = await api.patch(`/product-document-types/${id}/restore`);
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

  async getProductDocumentsByProductId(
    productId: string, 
    page: number = 1, 
    limit: number = 10, 
    forceRefresh: boolean = false
  ): Promise<ServerPaginatedResponse<ProductDocument>> {
    try {
      const params = new URLSearchParams();
      
      if (page) {
        params.append('page', page.toString());
      }
      
      if (limit) {
        params.append('limit', limit.toString());
      }
      
      // Ajouter un paramètre timestamp pour éviter le cache si nécessaire
      if (forceRefresh) {
        params.append('_t', Date.now().toString());
      }
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      console.log(`Récupération des documents pour le produit ${productId} avec refresh=${forceRefresh}`);
      const response = await api.get(`/product-documents/product/${productId}${queryString}`);
      console.log(`Documents récupérés pour le produit ${productId}:`, response.data);
      
      // Format de réponse détecté: vérifier si c'est un objet unique ou un tableau dans results
      // Si la réponse est un document unique (avec id, createdAt, etc.) ou un tableau direct,
      // nous devons le transformer en format ServerPaginatedResponse
      if (response.data && !response.data.results) {
        // Vérifier si la réponse est un document unique ou un tableau direct
        if (Array.isArray(response.data)) {
          // Si c'est un tableau, on le met dans le format attendu
          console.log("Réponse détectée comme un tableau direct de documents");
          response.data = {
            results: response.data,
            totalResults: response.data.length,
            totalPages: 1,
            currentResults: response.data.length
          };
        } 
        else if (response.data.id) {
          // Si c'est un document unique (avec un id), on le transforme en tableau
          console.log("Réponse détectée comme un document unique");
          const singleDocument = response.data;
          response.data = {
            results: [singleDocument],
            totalResults: 1,
            totalPages: 1,
            currentResults: 1
          };
        }
      }
      
      // Maintenant que nous avons un format uniforme, on peut traiter les résultats
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        // Ajout de propriétés compatibles pour l'UI existante
        response.data.results = response.data.results.map((doc: any) => {
          // Créer un nouvel objet pour éviter les références
          const transformedDoc: any = { ...doc };
          
          // Pour la compatibilité, ajouter productId et documentTypeId s'ils n'existent pas
          if (doc.products && Array.isArray(doc.products) && doc.products.length > 0 && !doc.productId) {
            transformedDoc.productId = doc.products[0].id.toString();
            if (!doc.product) {
              transformedDoc.product = { ...doc.products[0] };
            }
          }
          
          if (doc.type && doc.type.id && !doc.documentTypeId) {
            transformedDoc.documentTypeId = doc.type.id.toString();
            if (!doc.documentType) {
              transformedDoc.documentType = { ...doc.type };
            }
          }
          
          console.log("Document préparé pour l'affichage:", {
            id: transformedDoc.id,
            fileName: transformedDoc.fileName || "MANQUANT",
            type: transformedDoc.type?.name || "MANQUANT",
            product: transformedDoc.products?.[0]?.name || "MANQUANT"
          });
          
          return transformedDoc;
        });
        
        console.log(`${response.data.results.length} documents prêts pour l'affichage`);
      }
      
      return response.data;
    } catch (error: any) {
      // Si l'erreur est 404 (pas de documents), on retourne un objet vide mais valide
      if (error.response && error.response.status === 404) {
        console.log(`Aucun document trouvé pour le produit ${productId}`);
        return {
          results: [],
          totalResults: 0,
          totalPages: 0,
          currentResults: 0
        };
      }
      
      // Sinon on propage l'erreur
      console.error(`Erreur lors de la récupération des documents pour le produit ${productId}:`, error);
      throw error;
    }
  },

  async uploadProductDocument(data: UploadProductDocumentRequest): Promise<ApiResponse<ProductDocument>> {
    console.log("Données pour upload de document:", data);
    
    // Création d'un FormData pour l'upload du fichier
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('serialNumber', data.serialNumber);
    formData.append('reference', data.reference || '');
    
    // Champs obligatoires selon la spec API
    formData.append('title', data.reference); // Utiliser la référence comme titre par défaut
    formData.append('issueDate', data.issueDate);
    formData.append('version', data.version.toString());
    formData.append('uploadedBy', '1'); // ID utilisateur par défaut
    
    // Champs optionnels
    if (data.expiryDate) {
      formData.append('expiryDate', data.expiryDate);
    }
    
    // typeId - ID du type de document (obligatoire)
    if (data.type && data.type.id) {
      const typeId = typeof data.type.id === 'string' ? parseInt(data.type.id, 10) : data.type.id;
      formData.append('typeId', typeId.toString());
    } else if (data.documentTypeId) {
      const typeId = typeof data.documentTypeId === 'string' ? parseInt(data.documentTypeId, 10) : data.documentTypeId;
      formData.append('typeId', typeId.toString());
    }
    
    // productIds - Array des IDs de produits (obligatoire)
    const productIds: number[] = [];
    if (data.products && data.products.length > 0) {
      // Convertir tous les IDs de produits en nombres
      productIds.push(...data.products.map(product => 
        typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
      ));
    } else if (data.productId) {
      // Si un seul productId est fourni
      const productId = typeof data.productId === 'string' ? parseInt(data.productId, 10) : data.productId;
      productIds.push(productId);
    }
    
    // Ajouter le tableau des IDs de produits
    if (productIds.length > 0) {
      // Envoyer chaque ID comme un élément séparé du array
      productIds.forEach(id => {
        formData.append('productIds[]', id.toString());
      });
    }
    
    console.log("Envoi de la requête d'upload avec formData:", {
      file: data.file.name,
      serialNumber: formData.get('serialNumber'),
      reference: formData.get('reference'),
      title: formData.get('title'),
      typeId: formData.get('typeId'),
      productIds: formData.getAll('productIds[]'),
      issueDate: formData.get('issueDate'),
      expiryDate: formData.get('expiryDate'),
      version: formData.get('version'),
      uploadedBy: formData.get('uploadedBy')
    });
    
    try {
      const response = await api.post('/product-documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log("Réponse de l'API après upload:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de l'upload du document:", error);
      
      if (error.response) {
        console.error("Statut:", error.response.status);
        console.error("Données:", error.response.data);
      }
      
      throw error;
    }
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
    try {
      const response = await api.get(`/product-documents/${id}/validate-checksum?checksum=${encodeURIComponent(checksum)}`);
      return response.data;
    } catch (error: any) {
      // Si l'erreur est 404, cela signifie que le document n'existe pas
      if (error.response && error.response.status === 404) {
        return {
          data: { valid: false },
          message: "Document introuvable ou supprimé",
          success: false
        };
      }
      throw error;
    }
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
  async getProducts(page: number = 1, limit: number = 10, brandId?: number, typeId?: number, compatibilityGroupId?: number, search?: string, showDeleted: boolean = false): Promise<ServerPaginatedResponse<Product>> {
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
    
    if (compatibilityGroupId) {
      params.append('compatibilityGroupId', compatibilityGroupId.toString());
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
      
      // Adapter le format de réponse [results, totalResults, totalPages]
      if (Array.isArray(response.data) && response.data.length === 3) {
        return {
          results: response.data[0] || [],
          totalResults: response.data[1] || 0,
          totalPages: response.data[2] || 0
        };
      }
      
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
  },

  // Groupes de compatibilité
  async getCompatibilityGroups(): Promise<CompatibilityGroup[]> {
    try {
      console.log(`Appel API GET /compatibility-groups`);
      const response = await api.get(`/compatibility-groups`);
      console.log("Réponse API getCompatibilityGroups:", response.data);
      
      // Vérifier si la réponse est directement un tableau de groupes
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si la réponse a une structure paginée spécifique
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
      }
      
      // Si format inconnu, retourner un tableau vide
      console.warn("Format de réponse inattendu pour les groupes de compatibilité");
      return [];
    } catch (error: any) {
      console.error("Erreur getCompatibilityGroups:", error);
      throw error;
    }
  },
  
  async createCompatibilityGroup(data: { name: string }): Promise<ApiResponse<CompatibilityGroup>> {
    console.log("Données pour création de groupe de compatibilité:", data);
    try {
      const response = await api.post('/compatibility-groups', data);
      console.log("Réponse API createCompatibilityGroup:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur createCompatibilityGroup:", error);
      throw error;
    }
  },
  
  async deleteCompatibilityGroup(id: number): Promise<void> {
    try {
      console.log(`Suppression du groupe de compatibilité (ID: ${id})`);
      await api.delete(`/compatibility-groups/${id}`);
      console.log("Groupe de compatibilité supprimé avec succès");
    } catch (error: any) {
      console.error(`Erreur lors de la suppression du groupe de compatibilité (ID: ${id}):`, error);
      throw error;
    }
  },
  
  async attachProductToGroup(groupId: number, productId: number): Promise<void> {
    try {
      console.log(`Attachement du produit ${productId} au groupe ${groupId}`);
      await api.post('/compatibility-groups/attach-product', {
        groupId,
        productId
      });
      console.log("Produit attaché au groupe avec succès");
    } catch (error: any) {
      console.error(`Erreur lors de l'attachement du produit ${productId} au groupe ${groupId}:`, error);
      throw error;
    }
  },
  
  async detachProductFromGroup(groupId: number, productId: number): Promise<void> {
    try {
      console.log(`Détachement du produit ${productId} du groupe ${groupId}`);
      await api.post('/compatibility-groups/detach-product', {
        groupId,
        productId
      });
      console.log("Produit détaché du groupe avec succès");
    } catch (error: any) {
      console.error(`Erreur lors du détachement du produit ${productId} du groupe ${groupId}:`, error);
      throw error;
    }
  },
};