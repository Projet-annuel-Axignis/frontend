'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  Fab,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  DocumentType, 
  CreateDocumentTypeRequest, 
  UpdateDocumentTypeRequest 
} from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DocumentTypesPage() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState<string | null>(null);
  const [editingDocumentType, setEditingDocumentType] = useState<DocumentType | null>(null);
  const [formData, setFormData] = useState<CreateDocumentTypeRequest>({
    name: '', 
    serialNumber: ''
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les types de documents
  const loadDocumentTypes = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getDocumentTypes(
        page + 1, 
        rowsPerPage, 
        searchTerm, 
        showDeleted
      );
      
      // La réponse est un tableau [results, totalResults, totalPages]
      if (Array.isArray(response)) {
        const [results, totalResults, totalPages] = response;
        setDocumentTypes(Array.isArray(results) ? results : []);
        setTotal(typeof totalResults === 'number' ? totalResults : 0);
        console.log(`Types de documents chargés: ${results?.length || 0} résultats sur ${totalResults} total (${totalPages} pages)`);
      } else if (response && typeof response === 'object') {
        // Compatibilité avec l'ancien format de réponse (objet)
        const { results, totalResults } = response as any;
        setDocumentTypes(Array.isArray(results) ? results : []);
        setTotal(typeof totalResults === 'number' ? totalResults : 0);
      } else {
        // Fallback au cas où la structure de réponse ne serait pas celle attendue
        console.error('Format de réponse API inattendu:', response);
        setDocumentTypes([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des types de documents:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des types de documents',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocumentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, showDeleted]);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      console.log("handleSubmit - Données du formulaire avant soumission:", formData);

      if (editingDocumentType) {
        console.log(`Mise à jour du type de document (ID: ${editingDocumentType.id})`);
        await equipmentService.updateDocumentType(editingDocumentType.id, formData as UpdateDocumentTypeRequest);
        setSnackbar({
          open: true,
          message: 'Type de document mis à jour avec succès',
          severity: 'success'
        });
      } else {
        console.log("Création d'un nouveau type de document");
        await equipmentService.createDocumentType(formData);
        setSnackbar({
          open: true,
          message: 'Type de document créé avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadDocumentTypes();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        console.error("Code d'erreur:", error.response.status);
        console.error("Détails de l'erreur:", error.response.data);
        
        if (error.response.status === 409) {
          errorMessage = 'Un type de document avec ce numéro de série existe déjà';
        } else if (error.response.status === 500) {
          errorMessage = 'Erreur serveur. Vérifiez les formats de données et réessayez.';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setDocumentTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDocumentTypeToDelete(null);
  };

  const handleDelete = async () => {
    if (!documentTypeToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteDocumentType(documentTypeToDelete);
      setSnackbar({
        open: true,
        message: 'Type de document supprimé avec succès',
        severity: 'success'
      });
      loadDocumentTypes();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Ce type de document est utilisé par d\'autres éléments et ne peut pas être supprimé';
        } else if (error.response.status === 404) {
          errorMessage = 'Type de document introuvable';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
      closeDeleteDialog();
    }
  };

  const handleRestore = async (id: string) => {
    try {
      setLoading(true);
      await equipmentService.restoreDocumentType(id);
      setSnackbar({
        open: true,
        message: 'Type de document restauré avec succès',
        severity: 'success'
      });
      loadDocumentTypes();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Type de document introuvable';
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (documentType: DocumentType) => {
    setEditingDocumentType(documentType);
    
    // Convertir en string si nécessaire pour le formulaire
    setFormData({ 
      name: documentType.name,
      serialNumber: documentType.serialNumber
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingDocumentType(null);
    setFormData({ 
      name: '', 
      serialNumber: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDocumentType(null);
    setFormData({ 
      name: '', 
      serialNumber: ''
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Types de documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les types de documents utilisés pour vos produits
        </Typography>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 280px', minWidth: 0 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                    {total}
                  </Typography>
                  <Typography variant="body2">
                    Types de documents total
                  </Typography>
                </Box>
                <DescriptionIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barre d'outils */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Rechercher un type de document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250 }}
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              ml: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 2,
              py: 0.5
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Inclure les supprimés
            </Typography>
            <Switch
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              size="small"
            />
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Tooltip title="Actualiser">
            <IconButton onClick={loadDocumentTypes} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            Nouveau type de document
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Numéro de série</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dernière modification</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !documentTypes || documentTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun type de document trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                documentTypes.map((docType) => (
                  <TableRow 
                    key={docType.id} 
                    hover
                    sx={{ 
                      opacity: docType.deletedAt ? 0.6 : 1,
                      backgroundColor: docType.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon sx={{ color: docType.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: docType.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {docType.name}
                          {docType.deletedAt && (
                            <Chip 
                              label="Supprimé" 
                              size="small" 
                              color="error" 
                              variant="outlined" 
                              sx={{ fontSize: '0.7rem', height: 20 }} 
                            />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={docType.serialNumber} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(docType.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(docType.updatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {docType.deletedAt ? (
                          /* Ne rien faire */
                          <></>
                        ) : (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(docType)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(docType.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
        />
      </Paper>

      {/* Dialog pour créer/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingDocumentType ? 'Modifier le type de document' : 'Nouveau type de document'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Nom"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="Ex: Manuel d'utilisation (2-100 caractères)"
              required
            />
            
            <TextField
              margin="dense"
              label="Numéro de série"
              fullWidth
              variant="outlined"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              helperText="Ex: DOC-MANUAL-001 (3-50 caractères)"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.name.trim() || 
              formData.name.length < 2 || 
              formData.name.length > 100 ||
              !formData.serialNumber.trim() || 
              formData.serialNumber.length < 3 || 
              formData.serialNumber.length > 50
            }
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            {editingDocumentType ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour confirmer la suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderTop: '4px solid #f44336',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon color="error" /> Confirmation de suppression
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce type de document ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. Le type de document pourra être restauré ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
          <Button 
            onClick={closeDeleteDialog} 
            variant="outlined"
            startIcon={<RefreshIcon />}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ 
              bgcolor: 'error.main',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            Confirmer la suppression
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* FAB pour mobile */}
      <Fab
        color="primary"
        aria-label="Ajouter un type de document"
        onClick={handleAdd}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
          },
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
