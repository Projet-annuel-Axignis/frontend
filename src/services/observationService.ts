import { api } from '@/lib/api';
import { CreateObservationsDto, Observations, UpdateObservationsDto } from '@/types/intervention';

export const observationService = {
  async getObservations(params: {
    reportId?: number;
    status?: string;
    priority?: number;
    includeDeleted?: boolean;
    search?: string;
  } = {}): Promise<{ observations: Observations[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');
    searchParams.append('offset', '0');
    searchParams.append('sortOrder', 'desc');
    searchParams.append('sortField', 'createdAt');

    if (params.reportId) {
      searchParams.append('filterField', 'report.id');
      searchParams.append('filterOp', 'equals');
      searchParams.append('filter', params.reportId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<{ results: Observations[]; total: number }>(`/observations?${searchParams}`);
    let observations = response.data.results;

    // Client-side filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      observations = observations.filter(observation =>
        observation.title.toLowerCase().includes(searchLower) ||
        observation.reference.toLowerCase().includes(searchLower) ||
        observation.location.toLowerCase().includes(searchLower)
      );
    }

    if (params.status) {
      observations = observations.filter(observation =>
        observation.status === params.status
      );
    }

    if (params.priority !== undefined) {
      observations = observations.filter(observation =>
        observation.priority === params.priority
      );
    }

    return {
      observations,
      total: observations.length,
    };
  },

  async getObservation(id: number): Promise<Observations> {
    const response = await api.get<Observations>(`/observations/${id}`);
    return response.data;
  },

  async createObservation(data: CreateObservationsDto): Promise<Observations> {
    const response = await api.post<Observations>('/observations', data);
    return response.data;
  },

  async updateObservation(id: number, data: UpdateObservationsDto): Promise<Observations> {
    const response = await api.patch<Observations>(`/observations/${id}`, data);
    return response.data;
  },

  async deleteObservation(id: number): Promise<void> {
    await api.delete(`/observations/${id}`);
  },

  async restoreObservation(id: number): Promise<Observations> {
    const response = await api.patch<Observations>(`/observations/${id}/restore`);
    return response.data;
  },

  async startObservation(id: number): Promise<Observations> {
    const response = await api.patch<Observations>(`/observations/${id}/start`);
    return response.data;
  },

  async finishObservation(id: number): Promise<Observations> {
    const response = await api.patch<Observations>(`/observations/${id}/finish`);
    return response.data;
  },
};

export default observationService; 