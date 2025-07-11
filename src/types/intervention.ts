import { User } from "./auth";

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
  periodicity: Periodicity;
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
}

export interface CreateReportTypeDto {
  name: string;
  code: string;
}