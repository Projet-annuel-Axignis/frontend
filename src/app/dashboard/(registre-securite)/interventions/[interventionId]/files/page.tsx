'use client';

import { useLoading } from '@/hooks/useLoading';
import fileService from '@/services/fileService';
import reportService from '@/services/reportService';
import { File } from '@/types/intervention';
import {
  Attachment as AttachmentIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

// Styled components pour l'upload
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DropZone = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  '&.dragover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function InterventionFilesPage() {
  const params = useParams();
  const { withLoading } = useLoading();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const interventionId = parseInt(params.interventionId as string);

  // Data states
  const [files, setFiles] = useState<File[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Upload states
  const [isDragOver, setIsDragOver] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (interventionId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        // 1. Charger d'abord les rapports de l'intervention
        const reportsResult = await reportService.getReports({
          interventionId,
          includeDeleted: true,
        });
        setReports(reportsResult.reports);

        // 2. Charger les fichiers de tous ces rapports
        let allFiles: File[] = [];
        for (const report of reportsResult.reports) {
          try {
            const filesResult = await fileService.getFiles({
              reportId: report.id,
              includeDeleted: false,
            });
            // Ajouter les informations du rapport à chaque fichier
            const filesWithReport = filesResult.files.map(file => ({
              ...file,
              report: report
            }));
            allFiles = [...allFiles, ...filesWithReport];
          } catch (error) {
            console.error(`Erreur lors du chargement des fichiers du rapport ${report.id}:`, error);
          }
        }

        setFiles(allFiles);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('Erreur lors du chargement des fichiers', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, file: File) => {
    event.stopPropagation();
    setSelectedFile(file);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = async () => {
    if (!selectedFile) return;

    await withLoading(async () => {
      try {
        const blob = await fileService.downloadFile(selectedFile.fileId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fichier-${selectedFile.id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('Fichier téléchargé avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showNotification('Erreur lors du téléchargement du fichier', 'error');
      }
    });
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedFile) {
      setFileToDelete(selectedFile);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;

    await withLoading(async () => {
      try {
        await fileService.deleteFile(fileToDelete.id);
        await loadData();
        showNotification('Fichier supprimé avec succès', 'success');
        setDeleteDialogOpen(false);
        setFileToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showNotification('Erreur lors de la suppression du fichier', 'error');
      }
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(Array.from(selectedFiles));
    }
  };

  const handleFileUpload = async (filesToUpload: globalThis.File[]) => {
    if (reports.length === 0) {
      showNotification('Aucun rapport disponible pour attacher des fichiers', 'error');
      return;
    }

    // Pour simplifier, on attache au premier rapport non supprimé
    const activeReport = reports.find(r => !r.deletedAt);
    if (!activeReport) {
      showNotification('Aucun rapport actif disponible pour attacher des fichiers', 'error');
      return;
    }

    await withLoading(async () => {
      try {
        for (const file of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);

          // 1. Upload le fichier
          const uploadResult = await fileService.uploadFile(formData);

          // 2. Créer l'entrée File liée au rapport
          await fileService.createFile({
            fileId: uploadResult.id,
          });
        }

        await loadData();
        showNotification(`${filesToUpload.length} fichier(s) téléchargé(s) avec succès`, 'success');
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showNotification('Erreur lors du téléchargement des fichiers', 'error');
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(event.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileIcon />;

    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileIcon color="error" />;
      case 'doc':
      case 'docx':
        return <FileIcon color="primary" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon color="success" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon color="warning" />;
      default:
        return <FileIcon />;
    }
  };



  return (
    <Box>
      {/* Header avec actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AttachmentIcon color="primary" sx={{ fontSize: '2rem' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" fontWeight="600">
            Fichiers de l&apos;intervention
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {files.length} fichier{files.length > 1 ? 's' : ''} trouvé{files.length > 1 ? 's' : ''}
            {reports.length > 0 && ` (depuis ${reports.length} rapport${reports.length > 1 ? 's' : ''})`}
          </Typography>
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            size="small"
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            Télécharger
            <VisuallyHiddenInput
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
            />
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Zone de drop pour upload */}
      {reports.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <DropZone
              className={isDragOver ? 'dragover' : ''}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Glissez-déposez vos fichiers ici
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou cliquez pour sélectionner des fichiers
              </Typography>
            </DropZone>
          </CardContent>
        </Card>
      )}

      {/* Tableau des fichiers */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: 'primary.main',
                '& .MuiTableCell-head': {
                  color: 'white',
                  fontWeight: 600
                }
              }}>
                <TableCell>Fichier</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Taille</TableCell>
                <TableCell>Rapport</TableCell>
                <TableCell>Date d&apos;ajout</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleDownload()}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getFileIcon('fichier')}
                      <Typography variant="body2" fontWeight={500}>
                        Fichier #{file.fileId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label="Document"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      N/A
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {(file as any).report?.label || 'Rapport inconnu'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      N/A
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, file)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {files.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      {reports.length === 0 ?
                        'Aucun rapport trouvé pour cette intervention' :
                        'Aucun fichier trouvé dans les rapports de cette intervention'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          Télécharger
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setFileToDelete(null);
        }}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce fichier ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setFileToDelete(null);
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteFile}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 