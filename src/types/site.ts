// Base types for site management

export interface Site {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  streetNumber: string;
  street: string;
  postalCode: number;
  city: string;
  reference?: string;
  companyId: number;
}

export interface CreateSiteDto {
  name: string;
  streetNumber: string;
  street: string;
  postalCode: number;
  city: string;
  reference?: string;
  companyId: number;
}

export interface UpdateSiteDto {
  name?: string;
  streetNumber?: string;
  street?: string;
  postalCode?: number;
  city?: string;
  reference?: string;
}

// Building types
export interface Building {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  siteId: number;
  typologies: Typologies[];
  ighClasses: IghClass[];
  erpCategory: ErpCategory | null;
  authorizedUserIds: string[];
}

export interface ErpCategory {
  description: string;
  category: number;
  group: string;
}

export interface Typologies {
  description: string;
  code: string;
}

export interface IghClass {
  description: string;
  code: string;
}

export interface CreateBuildingDto {
  name: string;
  siteId: number;
  typologyCodes: string[];
  ighClassCodes: string[];
  erpCategory: number;
  authorizedUserIds: string[];
}

export interface UpdateBuildingDto {
  name?: string;
  typologyCodes?: string[];
  ighClassCodes?: string[];
  erpCategory?: number;
  authorizedUserIds?: string[];
}

// Building Floor types
export interface BuildingFloor {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  building: Building;
}

export interface CreateBuildingFloorDto {
  name: string;
  buildingId: number;
}

export interface UpdateBuildingFloorDto {
  name?: string;
}

// Part types
export type PartType = 'PRIVATE' | 'COMMUNAL';

export type HabFamilyName =
  | 'FIRST_FAMILY_SINGLE'
  | 'SECOND_FAMILY_SINGLE'
  | 'SECOND_FAMILY_COMMUNITY'
  | 'THIRD_FAMILY_COMMUNITY'
  | 'FOURTH_FAMILY_COMMUNITY'
  | 'RESIDENTIAL_ACCOMMODATION'
  | 'ELDERLY_ACCOMMODATION'
  | 'RESIDENTIAL_COVERED_CAR_PARK';

export type ErpTypeCode =
  | 'J' | 'L' | 'M' | 'N' | 'O' | 'P' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y'
  | 'PA' | 'CTS' | 'SG' | 'PS' | 'GA' | 'OA' | 'EF' | 'REF';

export interface Part {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  isIcpe: boolean;
  type: PartType;
  buildingId?: number;
  partFloorId?: number;
  habFamilyName?: HabFamilyName;
  erpTypeCodes?: ErpTypeCode;
}

export interface CreatePartDto {
  name: string;
  isIcpe?: boolean;
  type: PartType;
  buildingId: number;
  partFloorId: number;
  habFamilyName?: HabFamilyName;
  erpTypeCodes: ErpTypeCode;
}

export interface UpdatePartDto {
  name?: string;
  isIcpe?: boolean;
  type?: PartType;
  habFamilyName?: HabFamilyName;
  erpTypeCodes?: ErpTypeCode;
}

// Part Floor types
export interface PartFloor {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  publicCount: number;
  staffCount: number;
  exploitationSurface: number;
  glaSurface: number;
  publicAccessSurface: number;
  buildingFloorId?: number;
}

export interface CreatePartFloorDto {
  name: string;
  publicCount: number;
  staffCount: number;
  exploitationSurface: number;
  glaSurface: number;
  publicAccessSurface: number;
  buildingFloorId: number;
}

export interface UpdatePartFloorDto {
  name?: string;
  publicCount?: number;
  staffCount?: number;
  exploitationSurface?: number;
  glaSurface?: number;
  publicAccessSurface?: number;
  buildingFloorId?: number;
}

// Lot types
export interface Lot {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  buildingId: number;
  buildingFloorId: number;
  partFloorId?: number;
}

export interface CreateLotDto {
  name: string;
  buildingId: number;
  buildingFloorId: number;
  partFloorId?: number;
}

export interface UpdateLotDto {
  name?: string;
  partFloorId?: number;
}

// API Response types
export interface SitesResponse {
  results: Site[];
  totalResults: number;
}

export interface BuildingsResponse {
  results: Building[];
  totalResults: number;
}

export interface BuildingFloorsResponse {
  results: BuildingFloor[];
  totalResults: number;
}

export interface PartsResponse {
  results: Part[];
  totalResults: number;
}

export interface PartFloorsResponse {
  results: PartFloor[];
  totalResults: number;
}

export interface LotsResponse {
  results: Lot[];
  totalResults: number;
}

// Utility types for hierarchical data
export interface SiteWithBuildings extends Site {
  buildings?: Building[];
}

export interface BuildingWithFloors extends Building {
  buildingFloors?: BuildingFloor[];
  parts?: Part[];
}

export interface BuildingFloorWithPartFloors extends BuildingFloor {
  partFloors?: PartFloor[];
} 