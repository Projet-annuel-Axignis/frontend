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
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  BrandingWatermark as BrandIcon,
  Label as LabelIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { Brand, CreateBrandRequest, UpdateBrandRequest } from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState<CreateBrandRequest>({ name: '', serialNumber: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les marques
  const loadBrands = async () => {
    try {
      setLoading(true);
      const [brandsData, totalResults, currentResults] = await equipmentService.getBrands(page + 1, rowsPerPage, searchTerm, showDeleted);
      console.log('Réponse de l\'API pour les marques:', { brandsData, totalResults, currentResults });
      
      // Adapter la structure de réponse au format attendu par l'interface
      setBrands(brandsData || []);
      setTotal(totalResults || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des marques',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, showDeleted]);

  // Vérifier si les données sont chargées au montage
  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      if (editingBrand) {
        await equipmentService.updateBrand(editingBrand.id, formData as UpdateBrandRequest);
        setSnackbar({
          open: true,
          message: 'Marque mise à jour avec succès',
          severity: 'success'
        });
      } else {
        await equipmentService.createBrand(formData);
        setSnackbar({
          open: true,
          message: 'Marque créée avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadBrands();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Une marque avec ce nom ou ce numéro de série existe déjà';
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
    setBrandToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteBrand(brandToDelete);
      setSnackbar({
        open: true,
        message: 'Marque supprimée avec succès',
        severity: 'success'
      });
      loadBrands();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Cette marque est utilisée par d\'autres éléments et ne peut pas être supprimée';
        } else if (error.response.status === 404) {
          errorMessage = 'Marque introuvable';
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
      await equipmentService.restoreBrand(id);
      setSnackbar({
        open: true,
        message: 'Marque restaurée avec succès',
        severity: 'success'
      });
      loadBrands();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Marque introuvable';
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

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ 
      name: brand.name, 
      serialNumber: brand.serialNumber 
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingBrand(null);
    setFormData({ name: '', serialNumber: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBrand(null);
    setFormData({ name: '', serialNumber: '' });
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
      {/* Header avec titre et bouton principal */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'flex-start' },
        gap: 2,
        mb: 4 
      }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Marques
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les marques d&apos;équipements de votre organisation
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
            alignSelf: { xs: 'stretch', sm: 'flex-start' },
            height: 'fit-content',
            whiteSpace: 'nowrap'
          }}
        >
          Nouvelle marque
        </Button>
      </Box>

      {/* Statistiques */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
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
                    Marques total
                  </Typography>
                </Box>
                <BrandIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtres */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Rechercher une marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250, flex: { xs: '1 1 auto', sm: '0 1 250px' } }}
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
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
            <IconButton onClick={loadBrands} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nom de la marque</TableCell>
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
              ) : !brands || brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucune marque trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand) => (
                  <TableRow 
                    key={brand.id} 
                    hover
                    sx={{ 
                      opacity: brand.deletedAt ? 0.6 : 1,
                      backgroundColor: brand.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LabelIcon sx={{ color: brand.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: brand.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {brand.name}
                          {brand.deletedAt && (
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
                        label={brand.serialNumber} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(brand.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(brand.updatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {brand.deletedAt ? (
                          <Tooltip title="Restaurer">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleRestore(brand.id)}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(brand)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(brand.id)}
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBrand ? 'Modifier la marque' : 'Nouvelle marque'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la marque"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
            helperText="Ex: Apple, Samsung, etc."
          />
          <TextField
            margin="dense"
            label="Numéro de série"
            fullWidth
            variant="outlined"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            sx={{ mt: 2 }}
            helperText="Ex: BR-APPLE-001 (3-50 caractères)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name.trim() || !formData.serialNumber.trim() || formData.serialNumber.length < 3 || formData.serialNumber.length > 50}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            {editingBrand ? 'Modifier' : 'Créer'}
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
            Êtes-vous sûr de vouloir supprimer cette marque ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. La marque pourra être restaurée ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
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
    </Box>
  );
}
