// ============================================================================
// TYPES POUR LA GESTION DES INTERVENTIONS ET DES RAPPORTS
// ============================================================================
// Ce fichier contient tous les types TypeScript pour la gestion des interventions,
// rapports, organisations, fichiers et observations dans l'application.
// ============================================================================

import { User } from "./auth";
import { Part, Typologies } from "./site";

// =========================
// ENUMS & TYPES UTILITAIRES
// =========================

export type InterventionStatus = 'PLANNED' | 'IN_PROGRESS' | 'TERMINATED';
export type Periodicity = 'MONTHLY' | 'QUARTER' | 'SEMESTER' | 'ANNUAL';
export type ObservationStatus = 'OPEN' | 'IN_PROGRESS' | 'FINISHED';
export type OrganizationType = 'OA' | 'TC';

// =========================
// INTERVENTION
// =========================

export interface Intervention {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  label: string;
  companyName: string;
  employeeName: string;
  status: InterventionStatus;
  plannedAt: string;
  startedAt: string;
  endedAt: string;
  type: InterventionType;
  terminatedBy: User;
  parts: Part[];
}

export interface CreateInterventionDto {
  label: string;
  companyName: string;
  employeeName: string;
  status: InterventionStatus;
  plannedAt?: string;
  startedAt?: string;
  endedAt?: string;
  typeId: number;
  terminatedById?: number;
  partIds: number[];
}

export interface UpdateInterventionDto {
  label?: string;
  companyName?: string;
  employeeName?: string;
  status?: InterventionStatus;
  plannedAt?: string;
  startedAt?: string;
  endedAt?: string;
  typeId?: number;
  terminatedById?: number;
  partIds?: number[];
}


export interface InterventionType {
  id: number;
  name: string;
  code: string;
  interventions?: Intervention[];
}

export interface CreateInterventionTypeDto {
  name: string;
  code: string;
}

export interface UpdateInterventionTypeDto {
  name?: string;
  code?: string;
}

// =========================
// RAPPORT
// =========================

export interface ReportType {
  id: number;
  name: string;
  code: string;
  periodicity: Periodicity;
}

export interface CreateReportTypeDto {
  name: string;
  code: string;
  periodicity: Periodicity;
}

export interface UpdateReportTypeDto {
  name?: string;
  code?: string;
  periodicity?: Periodicity;
}

export interface Report {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  label: string;
  type: ReportType;
  typology: Typologies;
  organization: Organization;
  intervention?: Intervention;
  parts?: Part[];
  files?: File[];
  obsevations?: Observations[];
}

export interface CreateReportDto {
  label: string;
  typeCode: string;
  typologyCode: string;
  organizationId: number;
  interventionId: number;
  partIds: number[];
  fileIds: number[];
}

export interface UpdateReportDto {
  label?: string;
  typeCode?: string;
  typologyCode?: string;
  organizationId?: number;
  interventionId?: number;
  partIds?: number[];
  fileIds?: number[];
}

// =========================
// ORGANISATION
// =========================

export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
}

export interface CreateOrganizationDto {
  name: string;
  type: OrganizationType;
}

export interface UpdateOrganizationDto {
  name?: string;
  type?: OrganizationType;
}

// =========================
// FICHIER
// =========================

export interface File {
  id: number;
  fileId: number; //id sur la BDD BET
  report?: Report;
  file: Document;
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
}

export interface Document {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
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
  status: DocumentStatus;
  uploadedBy: number;
  type: DocumentType;
  product?: any;
}

export interface CreateReportFileDto {
  fileId: number;
}

export interface UpdateReportFileDto {
  fileId?: number;
}

// =========================
// OBSERVATION
// =========================

export interface Observations {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  title: string;
  reference: string;
  location: string;
  priority: number;
  status: ObservationStatus;
  startedAt: string;
  endedAt: string;
  report: Report;
  parts: Part[];
  files: File[];
}

export interface CreateObservationsDto {
  title: string;
  reference: string;
  location: string;
  priority: number;
  status: ObservationStatus;
  startedAt: string;
  endedAt: string;
  reportId: number;
  partIds: number[];
  fileIds: number[];
}

export interface UpdateObservationsDto {
  title?: string;
  reference?: string;
  location?: string;
  priority?: number;
  status?: ObservationStatus;
  startedAt?: string;
  endedAt?: string;
  reportId?: number;
  partIds?: number[];
  fileIds?: number[];
}
