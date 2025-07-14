import { api } from '@/lib/api';
import { CreateFileDto, File, UpdateFileDto } from '@/types/intervention';

export const fileService = {
  async getFiles(params: {
    reportId?: number;
    includeDeleted?: boolean;
  } = {}): Promise<{ files: File[]; total: number }> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', '1000');
    searchParams.append('offset', '0');
    searchParams.append('sortOrder', 'desc');
    searchParams.append('sortField', 'id');

    if (params.reportId) {
      searchParams.append('filterField', 'report.id');
      searchParams.append('filterOp', 'equals');
      searchParams.append('filter', params.reportId.toString());
    }
    if (params.includeDeleted) {
      searchParams.append('includeDeleted', 'true');
    }

    const response = await api.get<{ results: File[]; total: number }>(`/files?${searchParams}`);
    return {
      files: response.data.results,
      total: response.data.total,
    };
  },

  async getFile(id: number): Promise<File> {
    const response = await api.get<File>(`/files/${id}`);
    return response.data;
  },

  async createFile(data: CreateFileDto): Promise<File> {
    const response = await api.post<File>('/files', data);
    return response.data;
  },

  async updateFile(id: number, data: UpdateFileDto): Promise<File> {
    const response = await api.patch<File>(`/files/${id}`, data);
    return response.data;
  },

  async deleteFile(id: number): Promise<void> {
    await api.delete(`/files/${id}`);
  },

  async uploadFile(file: FormData): Promise<{ id: number; filename: string; size: number; mimeType: string }> {
    const response = await api.post('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async downloadFile(fileId: number): Promise<Blob> {
    const response = await api.get(`/upload/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default fileService; 