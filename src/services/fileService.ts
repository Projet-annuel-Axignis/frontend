import { api } from '@/lib/api';
import { File } from '@/types/intervention';

export const fileService = {
  // Obtenir tous les fichiers attachés à un rapport
  async getReportFiles(reportId: number): Promise<File[]> {
    const response = await api.get<File[]>(`/reports/${reportId}/files`);
    return response.data;
  },

  // Obtenir un fichier spécifique
  async getFile(id: number): Promise<File> {
    const response = await api.get<File>(`/files/${id}`);
    return response.data;
  },

  // Attacher un fichier à un rapport
  async attachFileToReport(reportId: number, fileId: number): Promise<File> {
    const response = await api.post<File>(`/reports/${reportId}/files`, { fileId });
    return response.data;
  },

  // Supprimer un fichier d'un rapport
  async removeFileFromReport(reportId: number, fileId: number): Promise<void> {
    await api.delete(`/reports/${reportId}/files/${fileId}`);
  },

  // Uploader un fichier
  async uploadFile(file: FormData): Promise<{ id: number; filename: string; size: number; mimeType: string }> {
    const response = await api.post('/upload', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Télécharger un fichier
  async downloadFile(fileId: number): Promise<Blob> {
    const response = await api.get(`/upload/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default fileService; 