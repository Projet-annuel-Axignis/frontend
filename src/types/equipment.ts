// Types pour l'application Base d'équipements techniques

export interface EquipmentDomain {
  id: number;
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EquipmentFamily {
  id: string;
  name: string;
  serialNumber: string;
  domainId: string;
  domain?: EquipmentDomain;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface EquipmentType {
  id: string;
  title: string;
  subTitle?: string;
  serialNumber: string;
  familyId: string;
  family?: EquipmentFamily;
  extraSchema?: Record<string, any>;
  inventoryRequired: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  required: boolean;
  options?: string[]; // Pour les champs de type select
}

export interface Brand {
  id: string;
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CompatibilityGroup {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Product {
  id: number;
  name: string;
  serialNumber: string;
  brandId?: number;
  brand?: Brand;
  typeId?: number;
  type?: EquipmentType;
  groups?: {id: number, name: string}[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface DocumentType {
  id: string | number;  // Peut être string ou number selon l'API
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateDocumentTypeRequest {
  name: string;
  serialNumber: string;
}

export interface UpdateDocumentTypeRequest {
  name?: string;
  serialNumber?: string;
}

export interface ProductDocument {
  id: string;
  reference: string;
  serialNumber: string;
  fileName: string;
  filePath: string;
  size: number;
  issueDate: string;
  expiryDate: string;
  version: number;
  mimeType: string;
  checksum: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  uploadedBy?: number;
  // Propriétés originales pour la compatibilité avec l'UI
  productId?: string;
  product?: Product;
  documentTypeId?: string;
  documentType?: DocumentType;
  // Nouvelles propriétés provenant du backend
  products?: Product[];  // Tableau de produits associés
  type?: DocumentType;   // Type de document complet
  // Autres propriétés
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title?: string;
  description?: string;
}

export interface UploadProductDocumentRequest {
  reference: string;
  serialNumber: string;
  title?: string; // Titre du document (optionnel, utilisera reference par défaut)
  description?: string; // Description (optionnelle)
  issueDate: string;
  expiryDate?: string;
  version: number;
  typeId?: number; // ID du type de document (format backend)
  productIds?: number[]; // Array des IDs de produits (format backend)
  uploadedBy?: number; // ID de l'utilisateur qui téléverse le document
  checksum?: string; // Checksum pour vérification d'intégrité (optionnel)
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // Statut du document (optionnel)
  file: File;
  
  // Champs de compatibilité avec le format frontend existant
  products?: Product[]; // Tableau d'objets produits (conversion vers productIds)
  type?: DocumentType;  // Objet type de document complet (conversion vers typeId)
  productId?: string | number; // ID de produit unique (conversion vers productIds)
  documentTypeId?: string | number; // ID de type de document (conversion vers typeId)
}

export interface UpdateProductDocumentStatusRequest {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface InventoryItem {
  id: string;
  serialNumber: string;
  productId: string;
  product?: Product;
  location: string;
  brandId: string;
  brand?: Brand;
  installationDate: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Types pour les formulaires
export interface CreateEquipmentDomainRequest {
  name: string;
  serialNumber: string;
}

export interface UpdateEquipmentDomainRequest {
  name?: string;
  serialNumber?: string;
}

// Types pour les marques
export interface CreateBrandRequest {
  name: string;
  serialNumber: string;
}

export interface UpdateBrandRequest {
  name?: string;
  serialNumber?: string;
}

export interface CreateEquipmentFamilyRequest {
  name: string;
  serialNumber: string;
  domainId: string | number;  // Accepter à la fois une chaîne ou un nombre
}

export interface UpdateEquipmentFamilyRequest {
  name?: string;
  serialNumber?: string;
  domainId?: string | number;  // Accepter à la fois une chaîne ou un nombre
}

export interface CreateEquipmentTypeRequest {
  title: string;
  subTitle?: string;
  serialNumber: string;
  inventoryRequired: boolean;
  extraSchema?: Record<string, any>;
  familyId: string | number;  // Accepter à la fois une chaîne ou un nombre
}

export interface UpdateEquipmentTypeRequest {
  title?: string;
  subTitle?: string;
  serialNumber?: string;
  inventoryRequired?: boolean;
  extraSchema?: Record<string, any>;
  familyId?: string | number;  // Accepter à la fois une chaîne ou un nombre
}

// Types pour les produits
export interface CreateProductRequest {
  name: string;
  serialNumber: string;
  brandId: number;
  typeId: number;
  groupIds?: number[];
}

export interface UpdateProductRequest {
  name?: string;
  serialNumber?: string;
  brandId?: number;
  typeId?: number;
  groupIds?: number[];
}

// Types pour les groupes de compatibilité
export interface CreateCompatibilityGroupRequest {
  name: string;
}

export interface UpdateCompatibilityGroupRequest {
  name?: string;
}

export interface AttachProductToGroupRequest {
  productId: number;
  groupId: number;
}

export interface DetachProductFromGroupRequest {
  productId: number;
  groupId: number;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 

export interface ServerPaginatedResponse<T> {
  sortField?: string;
  totalResults: number;
  currentResults?: number;
  totalPages?: number;
  results: T[];
}

// Type pour les réponses API paginées qui utilisent le format tableau [results, totalResults, totalPages]
export type ArrayPaginatedResponse<T> = [T[], number, number];