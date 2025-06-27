// Types pour l'application Base d'équipements techniques

export interface EquipmentDomain {
  id: string;
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFamily {
  id: string;
  name: string;
  serialNumber: string;
  domainId: string;
  domain?: EquipmentDomain;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentType {
  id: string;
  title: string;
  subtitle: string;
  serialNumber: string;
  familyId: string;
  family?: EquipmentFamily;
  customFields?: CustomField[];
  inventoryRequired: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface Product {
  id: string;
  name: string;
  serialNumber: string;
  brandId: string;
  brand?: Brand;
  equipmentTypeId: string;
  equipmentType?: EquipmentType;
  associatedProducts?: string[]; // IDs des produits associés
  createdAt: string;
  updatedAt: string;
}

export interface DocumentType {
  id: string;
  name: string;
  serialNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  serialNumber: string;
  productId: string;
  product?: Product;
  documentTypeId: string;
  documentType?: DocumentType;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
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
}

export interface UpdateEquipmentDomainRequest {
  name: string;
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