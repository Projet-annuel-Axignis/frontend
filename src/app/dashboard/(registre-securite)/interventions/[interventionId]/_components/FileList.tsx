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
  Box,
  Button,
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
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

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

// FileList avec ref pour rafraîchissement externe
const FileList = forwardRef(function FileList(
  {
    entityType,
    entityId,
    title = "Fichiers",
    onFilesChange
  }: FileListProps,
  ref
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Expose la méthode imperative pour le parent
  useImperativeHandle(ref, () => ({
    refresh: loadFiles
  }));

  useEffect(() => {
    loadFiles();
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

  const renderFileActions = (file: File) => {
    if (isMobile) {
      // Sur mobile : menu avec 3 points
      return (
        <IconButton
          onClick={(e) => handleMenuOpen(e, file)}
          size="small"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      );
    } else {
      // Sur desktop : boutons directs
      return (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(file)}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            Télécharger
          </Button>
          <IconButton
            size="small"
            color="error"
            onClick={() => setDeleteDialog(file)}
            sx={{
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      );
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        {title}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Liste des fichiers */}
      {loading ? (
        <Typography variant="body2">Chargement des fichiers...</Typography>
      ) : files.length === 0 ? (
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <Typography variant="caption" color="text.secondary">
            Aucun fichier attaché
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {files.map((file) => (
            <ListItem
              key={file.id}
              divider
              sx={{ px: 0 }}
              secondaryAction={renderFileActions(file)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getFileIcon(file.file.mimeType)}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography variant="body2">
                    {file.file.fileName}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {(file.file.size / 1024).toFixed(2)} Ko
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Menu contextuel (mobile uniquement) */}
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
    </Box>
  );
});

export default FileList;

// Exemple de composant parent garantissant l'actualisation automatique
// à placer dans le dossier _components si besoin
import { useRef } from 'react';
import FileUpload from './FileUpload';

export function FileSection({ entityType, entityId, title }: { entityType: 'report' | 'observation', entityId: number, title?: string }) {
  const fileListRef = useRef<{ refresh: () => void }>(null);

  const handleUploadComplete = () => {
    fileListRef.current?.refresh();
  };

  return (
    <>
      <FileUpload
        entityType={entityType}
        entityId={entityId}
        onUploadComplete={handleUploadComplete}
      />
      <FileList
        ref={fileListRef}
        entityType={entityType}
        entityId={entityId}
        title={title}
      />
    </>
  );
} 