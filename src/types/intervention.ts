import { User } from "./auth";
import { Part, Typologies } from "./site";

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

export type InterventionStatus = 'PLANNED' | 'IN_PROGRESS' | 'TERMINATED';
export type Periodicity = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

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
  type: string;
  terminatedBy: User;
}

export interface CreateInterventionDto {
  label: string;
  companyName: string;
  employeeName: string;
  status: InterventionStatus;
  periodicity: Periodicity;
  plannedAt: string;
  startedAt: string;
  endedAt: string;
  typeId: number;
  terminatedById: number;
}

export interface UpdateInterventionDto {
  label?: string;
  companyName?: string;
  employeeName?: string;
  status?: InterventionStatus;
  periodicity?: Periodicity;
  plannedAt?: string;
  startedAt?: string;
  endedAt?: string;
  typeId?: number;
  terminatedById?: number;
}

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

export type OrganizationType = 'OA' | 'TC';

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

export interface File {
  id: number;
  fileId: number;
  report?: Report;
}

export interface CreateFileDto {
  fileId: number;
}

export interface UpdateFileDto {
  fileId?: number;
}

export type ObservationStatus = 'OPEN' | 'IN_PROGRESS' | 'FINISHED';

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
