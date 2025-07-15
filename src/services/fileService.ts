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

  // Uploader un fichier directement vers un rapport
  async uploadReportFile(reportId: number, file: globalThis.File): Promise<File> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<File>(`/reports/${reportId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
  async downloadFile(file: File): Promise<{ blob: Blob; fileName: string }> {
    const response = await api.get(`/product-documents/${file.fileId}/file`, {
      responseType: 'blob',
      headers: {
        'Content-Type': file.file.mimeType,
      },
    });

    // Récupérer le nom du fichier depuis le header content-disposition
    let fileName = file.file.fileName; // fallback
    const disposition = response.headers['content-disposition'];
    if (disposition) {
      const match = disposition.match(/filename="?([^";]+)"?/);
      if (match) fileName = match[1];
    }

    return { blob: response.data, fileName };
  },
};

export default fileService; 