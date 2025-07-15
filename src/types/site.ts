// ============================================================================
// TYPES POUR LA GESTION DES SITES ET DE LA HIÉRARCHIE IMMOBILIÈRE
// ============================================================================
// Ce fichier contient tous les types TypeScript pour la gestion des sites,
// bâtiments, parties, étages et lots dans l'application de registre de sécurité.

import { User } from "./auth";
import { Company } from "./company";
import { Intervention } from "./intervention";

// ============================================================================
// SITES - Niveau racine de la hiérarchie
// ============================================================================

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
  company?: Company;
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

// ============================================================================
// BÂTIMENTS - Niveau 2 de la hiérarchie
// ============================================================================

export interface Building {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  site?: Site;
  typologies: Typologies[];
  ighClasses: IghClass[];
  erpCategory: ErpCategory | null;
  authorizedUserIds: string[];
  users?: User[];
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
  deletedAt?: string;
}

// Types de classification des bâtiments
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

// ============================================================================
// ÉTAGES DE BÂTIMENT - Structure physique des bâtiments
// ============================================================================

export interface BuildingFloor {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  levelNumber: number;
  building: Building;
}

export interface CreateBuildingFloorDto {
  name: string;
  levelNumber: number;
  buildingId: number;
}

export interface UpdateBuildingFloorDto {
  name?: string;
  levelNumber?: number;
}

// ============================================================================
// PARTIES - Divisions fonctionnelles des bâtiments
// ============================================================================

export type PartType = 'PRIVATE' | 'COMMUNAL';

export interface Part {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  isIcpe: boolean;
  type?: PartType;
  building?: Building;
  partFloors?: PartFloor[];
  habFamily?: HabFamily;
  erpTypes?: ErpType[];
  interventions?: Intervention[];
}

export interface CreatePartDto {
  name: string;
  isIcpe?: boolean;
  type: PartType;
  buildingId: number;
  habFamilyName?: HabFamilyName;
  erpTypeCodes?: ErpTypeCode[];
}

export interface UpdatePartDto {
  name?: string;
  isIcpe?: boolean;
  type?: PartType;
  habFamilyName?: HabFamilyName;
  erpTypeCodes?: ErpTypeCode[];
}

// Classification des familles d'habitation
export interface HabFamily {
  name: HabFamilyName;
  description: string;
}

export type HabFamilyName =
  | 'FIRST_FAMILY_SINGLE'
  | 'SECOND_FAMILY_SINGLE'
  | 'SECOND_FAMILY_COMMUNITY'
  | 'THIRD_FAMILY_COMMUNITY'
  | 'FOURTH_FAMILY_COMMUNITY'
  | 'RESIDENTIAL_ACCOMMODATION'
  | 'ELDERLY_ACCOMMODATION'
  | 'RESIDENTIAL_COVERED_CAR_PARK';

// Classification ERP (Établissement Recevant du Public)
export interface ErpType {
  code: ErpTypeCode;
  description: string;
  tag: string;
}

export type ErpTypeCode =
  | 'J' | 'L' | 'M' | 'N' | 'O' | 'P' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y'
  | 'PA' | 'CTS' | 'SG' | 'PS' | 'GA' | 'OA' | 'EF' | 'REF';

// ============================================================================
// ÉTAGES DE PARTIE - Données détaillées par niveau de partie
// ============================================================================

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
  levelNumber: number;
  buildingFloor: BuildingFloor;
}

export interface CreatePartFloorDto {
  name: string;
  publicCount: number;
  staffCount: number;
  exploitationSurface: number;
  glaSurface: number;
  publicAccessSurface: number;
  buildingFloorId: number;
  levelNumber: number;
  partId: number;
}

export interface UpdatePartFloorDto {
  name?: string;
  publicCount?: number;
  staffCount?: number;
  exploitationSurface?: number;
  glaSurface?: number;
  publicAccessSurface?: number;
  buildingFloorId?: number;
  levelNumber?: number;
}

// ============================================================================
// LOTS - Unités spécifiques dans les bâtiments
// ============================================================================

export interface Lot {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  building: Building;
  buildingFloor: BuildingFloor;
  partFloor: PartFloor;
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

// ============================================================================
// TYPES UTILITAIRES POUR LA GESTION DES FORMULAIRES
// ============================================================================

// Type pour l'assignation des niveaux lors de la création/modification des parties
export interface LevelAssignment {
  levelNumber: number;
  buildingFloorId: number | null;
  partFloorData?: Omit<CreatePartFloorDto, 'buildingFloorId' | 'partId'>;
}

// ============================================================================
// TYPES DE RÉPONSE API - Structures de données retournées par le backend
// ============================================================================

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

// ============================================================================
// TYPES HIÉRARCHIQUES - Extensions pour la navigation et l'affichage
// ============================================================================

// Types étendus pour inclure les relations hiérarchiques
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