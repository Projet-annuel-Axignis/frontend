import { api } from '@/lib/api';
import { CreateReportDto, Report, UpdateReportDto } from '@/types/intervention';

export const reportService = {
  async getReports(params: {
    interventionId?: number;
    typeCode?: string;
    organizationId?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ reports: Report[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');
    searchParams.append('offset', '0');
    searchParams.append('sortOrder', 'desc');
    searchParams.append('sortField', 'createdAt');

    if (params.interventionId) {
      searchParams.append('filterField', 'intervention.id');
      searchParams.append('filterOp', 'equals');
      searchParams.append('filter', params.interventionId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<{ results: Report[]; total: number }>(`/reports?${searchParams}`);
    let reports = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      reports = reports.filter(report =>
        report.label.toLowerCase().includes(searchLower) ||
        report.type.name.toLowerCase().includes(searchLower) ||
        report.organization.name.toLowerCase().includes(searchLower)
      );
    }

    if (params.typeCode) {
      reports = reports.filter(report =>
        report.type.code === params.typeCode
      );
    }

    if (params.organizationId) {
      reports = reports.filter(report =>
        report.organization.id === params.organizationId
      );
    }

    return {
      reports,
      total: reports.length,
    };
  },

  async getReport(id: number): Promise<Report> {
    const response = await api.get<Report>(`/reports/${id}`);
    const report = response.data;
    return report;
  },

  async createReport(data: CreateReportDto): Promise<Report> {
    const response = await api.post<Report>('/reports', data);
    return response.data;
  },

  async updateReport(id: number, data: UpdateReportDto): Promise<Report> {
    const response = await api.patch<Report>(`/reports/${id}`, data);
    return response.data;
  },

  async deleteReport(id: number): Promise<void> {
    await api.delete(`/reports/${id}`);
  },

  async restoreReport(id: number): Promise<Report> {
    const response = await api.patch<Report>(`/reports/${id}/restore`);
    return response.data;
  },

  async downloadReport(id: number): Promise<Blob> {
    const response = await api.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default reportService; 