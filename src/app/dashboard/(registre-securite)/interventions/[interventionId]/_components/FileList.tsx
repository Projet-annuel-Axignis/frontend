'use client';

import { fileService } from '@/services/fileService';
import { File } from '@/types/intervention';
import {
  Archive as ArchiveIcon,
  AudioFile as AudioIcon,
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
import React, { useEffect, useState } from 'react';

interface FileListProps {
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

const FileList: React.FC<FileListProps> = ({
  entityType,
  entityId,
  title = "Fichiers",
  onFilesChange
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [fileMenu, setFileMenu] = useState<FileWithMenu | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<File | null>(null);

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
        // Utiliser le service pour récupérer les fichiers d'une observation
        filesData = await fileService.getObservationFiles(entityId);
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
        await fileService.removeFileFromObservation(entityId, file.id);
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

export default FileList; 