import { api } from '@/lib/api';
import { CreateInterventionDto, Intervention, UpdateInterventionDto } from '@/types/intervention';

export const interventionService = {
  async getInterventions(params: {
    status?: string;
    type?: string;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ interventions: Intervention[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');
    searchParams.append('offset', '0');
    searchParams.append('sortOrder', 'desc');
    searchParams.append('sortField', 'createdAt');

    if (params.status) {
      searchParams.append('filterField', 'status');
      searchParams.append('filterOp', 'equals');
      searchParams.append('filter', params.status);
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<{ results: Intervention[]; total: number }>(`/interventions?${searchParams}`);
    let interventions = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      interventions = interventions.filter(intervention =>
        intervention.label.toLowerCase().includes(searchLower) ||
        intervention.companyName.toLowerCase().includes(searchLower) ||
        intervention.employeeName.toLowerCase().includes(searchLower) ||
        intervention.type.toLowerCase().includes(searchLower)
      );
    }

    if (params.type) {
      interventions = interventions.filter(intervention =>
        intervention.type === params.type
      );
    }

    return {
      interventions,
      total: interventions.length,
    };
  },

  async getIntervention(id: number): Promise<Intervention> {
    const response = await api.get<Intervention>(`/interventions/${id}`);
    return response.data;
  },

  async createIntervention(data: CreateInterventionDto): Promise<Intervention> {
    const response = await api.post<Intervention>('/interventions', data);
    return response.data;
  },

  async updateIntervention(id: number, data: UpdateInterventionDto): Promise<Intervention> {
    const response = await api.patch<Intervention>(`/interventions/${id}`, data);
    return response.data;
  },

  async deleteIntervention(id: number): Promise<void> {
    await api.delete(`/interventions/${id}`);
  },

  async startIntervention(id: number): Promise<Intervention> {
    const response = await api.patch<Intervention>(`/interventions/${id}/start`);
    return response.data;
  },

  async terminateIntervention(id: number): Promise<Intervention> {
    const response = await api.patch<Intervention>(`/interventions/${id}/terminate`);
    return response.data;
  },

  async restoreIntervention(id: number): Promise<Intervention> {
    const response = await api.patch<Intervention>(`/interventions/${id}/restore`);
    return response.data;
  },
};

export default interventionService; 