'use client';

import { fileService } from '@/services/fileService';
import { File } from '@/types/intervention';
import {
  Archive as ArchiveIcon,
  AudioFile as AudioIcon,
  CloudUpload as CloudUploadIcon,
  Code as CodeIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  PictureAsPdf as PdfIcon,
  Slideshow as PresentationIcon,
  TableChart as SpreadsheetIcon,
  TextSnippet as TextIcon,
  VideoFile as VideoIcon
} from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface FileManagerProps {
  /** Type d'entité (report ou observation) */
  entityType: 'report' | 'observation';
  /** ID de l'entité */
  entityId: number;
  /** Titre de la section */
  title?: string;
  /** Callback appelé quand les fichiers changent */
  onFilesChange?: () => void;
}

interface FileWithMenu {
  file: File;
  anchorEl: HTMLElement | null;
}

const FileManager: React.FC<FileManagerProps> = ({
  entityType,
  entityId,
  title = "Fichiers",
  onFilesChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileMenu, setFileMenu] = useState<FileWithMenu | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Fonction pour déterminer l'icône selon le type MIME
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <PdfIcon color="error" />;
    if (mimeType.includes('image/')) return <ImageIcon color="primary" />;
    if (mimeType.includes('video/')) return <VideoIcon color="secondary" />;
    if (mimeType.includes('audio/')) return <AudioIcon color="info" />;
    if (mimeType.includes('text/')) return <TextIcon color="success" />;
    if (mimeType.includes('application/vnd.ms-excel') || mimeType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml')) return <SpreadsheetIcon color="success" />;
    if (mimeType.includes('application/vnd.ms-powerpoint') || mimeType.includes('application/vnd.openxmlformats-officedocument.presentationml')) return <PresentationIcon color="warning" />;
    if (mimeType.includes('application/zip') || mimeType.includes('application/x-rar') || mimeType.includes('application/x-7z')) return <ArchiveIcon color="info" />;
    if (mimeType.includes('application/json') || mimeType.includes('application/xml') || mimeType.includes('text/html') || mimeType.includes('text/css') || mimeType.includes('text/javascript')) return <CodeIcon color="secondary" />;
    return <DescriptionIcon color="primary" />;
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType]);

  const loadFiles = async () => {
    setLoading(true);
    setError('');
    try {
      let filesData;
      if (entityType === 'report') {
        // Utiliser le service pour récupérer les fichiers d'un rapport
        filesData = await fileService.getReportFiles(entityId);
      } else {
        // Pour les observations, utiliser une route similaire
        const response = await fetch(`/api/v1/observations/${entityId}/files`);
        if (!response.ok) throw new Error('Erreur lors du chargement des fichiers');
        filesData = await response.json();
      }
      setFiles(filesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers:', error);
      setError('Erreur lors du chargement des fichiers');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (filesToUpload: FileList) => {
    setUploading(true);
    setError('');

    try {
      for (const file of Array.from(filesToUpload)) {
        // 1. Upload du fichier physique
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fileService.uploadFile(formData);

        // 2. Attacher le fichier à l'entité
        if (entityType === 'report') {
          await fileService.attachFileToReport(entityId, uploadResponse.id);
        } else {
          const response = await fetch(`/api/v1/observations/${entityId}/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileId: uploadResponse.id })
          });
          if (!response.ok) throw new Error('Erreur lors de l\'attachement du fichier');
        }
      }

      await loadFiles();
      onFilesChange?.();
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      setError('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;
    await uploadFiles(selectedFiles);
  };

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      await uploadFiles(droppedFiles);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType]);

  const handleDownload = async (file: File) => {
    try {
      const { blob, fileName } = await fileService.downloadFile(file);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      setError('Erreur lors du téléchargement du fichier');
    }
  };

  const handleDelete = async (file: File) => {
    try {
      if (entityType === 'report') {
        await fileService.removeFileFromReport(entityId, file.id);
      } else {
        const response = await fetch(`/api/v1/observations/${entityId}/files/${file.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erreur lors de la suppression');
      }

      await loadFiles();
      onFilesChange?.();
      setDeleteDialog(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du fichier');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, file: File) => {
    setFileMenu({ file, anchorEl: event.currentTarget });
  };

  const handleMenuClose = () => {
    setFileMenu(null);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          {title}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Zone de drop */}
        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 4,
            mb: 3,
            textAlign: 'center',
            border: dragOver ? '2px dashed var(--color-axignis-primary)' : '2px dashed #ccc',
            backgroundColor: dragOver ? 'rgba(var(--color-background), 0.05)' : '',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.02)',
              borderColor: 'var(--color-axignis-primary)',
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
            accept="*/*"
          />

          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: dragOver ? 'var(--color-axignis-primary)' : 'grey.400',
              mb: 2
            }}
          />

          <Typography variant="h6" gutterBottom>
            {dragOver ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ou cliquez pour sélectionner des fichiers
          </Typography>

          <Button
            variant="outlined"
            disabled={uploading}
            startIcon={<CloudUploadIcon />}
            sx={{
              borderColor: 'var(--color-axignis-primary)',
              color: 'var(--color-axignis-primary)',
              '&:hover': {
                borderColor: 'var(--color-axignis-secondary)',
                backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.05)',
              },
            }}
          >
            {uploading ? 'Upload en cours...' : 'Sélectionner des fichiers'}
          </Button>
        </Paper>

        {/* Liste des fichiers */}
        {loading ? (
          <Typography>Chargement des fichiers...</Typography>
        ) : files.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              Aucun fichier attaché
            </Typography>
          </Paper>
        ) : (
          <List>
            {files.map((file) => (
              <ListItem
                key={file.id}
                divider
                secondaryAction={
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, file)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  {getFileIcon(file.file.mimeType)}
                </ListItemIcon>

                <ListItemText
                  primary={`${file.file.fileName}`}
                  secondary={`${(file.file.size / 1024).toFixed(2)} Ko`}
                />

              </ListItem>
            ))}
          </List>
        )}
      </CardContent>

      {/* Menu contextuel */}
      <Menu
        anchorEl={fileMenu?.anchorEl}
        open={Boolean(fileMenu)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            if (fileMenu) handleDownload(fileMenu.file);
            handleMenuClose();
          }}
        >
          <DownloadIcon sx={{ mr: 1 }} />
          Télécharger
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (fileMenu) setDeleteDialog(fileMenu.file);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={Boolean(deleteDialog)}
        onClose={() => setDeleteDialog(null)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>
            Annuler
          </Button>
          <Button
            onClick={() => deleteDialog && handleDelete(deleteDialog)}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FileManager; 