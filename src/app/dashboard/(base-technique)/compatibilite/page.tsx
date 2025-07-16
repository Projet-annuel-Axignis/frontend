'use client';

import { equipmentService } from '@/services/equipmentService';
import {
  CompatibilityGroup,
  CreateCompatibilityGroupRequest,
  Product,
  UpdateCompatibilityGroupRequest
} from '@/types/equipment';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  LinkOff as LinkOffIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export default function CompatibilityGroupsPage() {
  // États principaux
  const [groups, setGroups] = useState<CompatibilityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  // États des dialogues
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [editingGroup, setEditingGroup] = useState<CompatibilityGroup | null>(null);
  const [productsDialogOpen, setProductsDialogOpen] = useState(false);
  const [currentGroupProducts, setCurrentGroupProducts] = useState<Product[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<number | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsPage, setProductsPage] = useState(0);
  const [productsRowsPerPage, setProductsRowsPerPage] = useState(5);
  const [productsTotal, setProductsTotal] = useState(0);

  // État du formulaire
  const [formData, setFormData] = useState<CreateCompatibilityGroupRequest>({
    name: '',
    serialNumber: '',
    description: ''
  });

  // État des notifications
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les groupes de compatibilité
  const loadGroups = async () => {
    try {
      setLoading(true);
      console.log("Paramètres loadGroups:", {
        page: page + 1,
        rowsPerPage,
        searchTerm,
        showDeleted
      });

      const groups = await equipmentService.getCompatibilityGroups(
        page + 1,
        rowsPerPage,
        searchTerm,
        showDeleted
      );

      console.log("Réponse loadGroups:", groups);
      setGroups(groups || []);
      // Pour le moment, on utilise la longueur du tableau comme total
      // Idéalement, l'API devrait retourner le nombre total dans des entêtes ou un champ dédié
      setTotal(groups?.length || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes de compatibilité:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des groupes de compatibilité',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les produits d'un groupe
  const loadGroupProducts = async (groupId: number) => {
    try {
      setProductsLoading(true);
      setCurrentGroupId(groupId);

      const products = await equipmentService.getProductsInCompatibilityGroup(
        groupId,
        productsPage + 1,
        productsRowsPerPage
      );

      console.log("Réponse loadGroupProducts:", products);
      setCurrentGroupProducts(products || []);
      setProductsTotal(products?.length || 0);
      setProductsDialogOpen(true);
    } catch (error) {
      console.error(`Erreur lors du chargement des produits du groupe ${groupId}:`, error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des produits du groupe',
        severity: 'error'
      });
    } finally {
      setProductsLoading(false);
    }
  };

  // Gestion du changement de page
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Gestion du changement de nombre de lignes par page
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Gestion du changement de page pour la liste des produits
  const handleChangeProductsPage = (_: unknown, newPage: number) => {
    setProductsPage(newPage);
    if (currentGroupId) {
      loadGroupProducts(currentGroupId);
    }
  };

  // Gestion du changement de nombre de lignes par page pour la liste des produits
  const handleChangeProductsRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProductsRowsPerPage(parseInt(event.target.value, 10));
    setProductsPage(0);
    if (currentGroupId) {
      loadGroupProducts(currentGroupId);
    }
  };

  // Recherche
  const handleSearch = () => {
    setPage(0);
    loadGroups();
  };

  // Gestion de la fermeture des Snackbars
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Ouverture du dialogue de création/édition
  const handleOpenDialog = (group: CompatibilityGroup | null = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        serialNumber: group.serialNumber,
        description: group.description || ''
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
        serialNumber: '',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  // Fermeture du dialogue de création/édition
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGroup(null);
    setFormData({
      name: '',
      serialNumber: '',
      description: ''
    });
  };

  // Soumission du formulaire
  const handleSubmit = async () => {
    try {
      if (editingGroup) {
        // Mise à jour d'un groupe existant
        const updateData: UpdateCompatibilityGroupRequest = {};

        if (formData.name !== editingGroup.name) {
          updateData.name = formData.name;
        }

        if (formData.serialNumber !== editingGroup.serialNumber) {
          updateData.serialNumber = formData.serialNumber;
        }

        if (formData.description !== editingGroup.description) {
          updateData.description = formData.description;
        }

        if (Object.keys(updateData).length === 0) {
          handleCloseDialog();
          return;
        }

        await equipmentService.updateCompatibilityGroup(editingGroup.id, updateData);
        setSnackbar({
          open: true,
          message: 'Groupe de compatibilité mis à jour avec succès',
          severity: 'success'
        });
      } else {
        // Création d'un nouveau groupe
        await equipmentService.createCompatibilityGroup(formData);
        setSnackbar({
          open: true,
          message: 'Groupe de compatibilité créé avec succès',
          severity: 'success'
        });
      }

      handleCloseDialog();
      loadGroups();
    } catch (error: any) {
      console.error('Erreur lors de la soumission du formulaire:', error);

      // Gestion spécifique des erreurs
      if (error.response?.status === 409) {
        setSnackbar({
          open: true,
          message: 'Un groupe avec ce nom ou ce numéro de série existe déjà',
          severity: 'error'
        });
      } else if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue lors de l\'opération',
          severity: 'error'
        });
      }
    }
  };

  // Ouverture du dialogue de suppression
  const openDeleteDialog = (id: number) => {
    setGroupToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Fermeture du dialogue de suppression
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  // Suppression d'un groupe
  const handleDeleteGroup = async () => {
    if (groupToDelete === null) return;

    try {
      await equipmentService.deleteCompatibilityGroup(groupToDelete);
      setSnackbar({
        open: true,
        message: 'Groupe de compatibilité supprimé avec succès',
        severity: 'success'
      });
      loadGroups();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du groupe:', error);

      if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue lors de la suppression',
          severity: 'error'
        });
      }
    } finally {
      closeDeleteDialog();
    }
  };

  // Restauration d'un groupe supprimé
  const handleRestoreGroup = async (id: number) => {
    try {
      await equipmentService.restoreCompatibilityGroup(id);
      setSnackbar({
        open: true,
        message: 'Groupe de compatibilité restauré avec succès',
        severity: 'success'
      });
      loadGroups();
    } catch (error: any) {
      console.error('Erreur lors de la restauration du groupe:', error);

      if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue lors de la restauration',
          severity: 'error'
        });
      }
    }
  };

  // Gestion du retrait d'un produit du groupe
  const handleRemoveProductFromGroup = async (productId: number) => {
    if (!currentGroupId) return;

    try {
      await equipmentService.removeProductFromCompatibilityGroup(currentGroupId, productId);
      setSnackbar({
        open: true,
        message: 'Produit retiré du groupe avec succès',
        severity: 'success'
      });

      // Recharger les produits du groupe
      loadGroupProducts(currentGroupId);
    } catch (error: any) {
      console.error('Erreur lors du retrait du produit:', error);

      if (error.response?.data?.message) {
        setSnackbar({
          open: true,
          message: error.response.data.message,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Une erreur est survenue lors du retrait du produit',
          severity: 'error'
        });
      }
    }
  };

  // Chargement initial
  useEffect(() => {
    loadGroups();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, showDeleted]);

  // Affichage d'une date formatée ou "N/A"
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';

    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch {
      return 'Date invalide';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        color: 'text.primary',
        borderLeft: '4px solid var(--color-axignis-primary)',
        paddingLeft: 2,
        mb: 4
      }}>
        Gestion des groupes de compatibilité
      </Typography>

      <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { xs: 'stretch', md: 'center' }, mb: 3 }}>
            <TextField
              label="Rechercher"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ flexGrow: 1 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                minWidth: '120px',
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                }
              }}
            >
              Rechercher
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setPage(0);
                loadGroups();
              }}
              startIcon={<RefreshIcon />}
            >
              Réinitialiser
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Afficher les groupes supprimés
              </Typography>
              <Switch
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                color="primary"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                }
              }}
            >
              Nouveau groupe
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>N° de série</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de création</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date de modification</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={30} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : groups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun groupe de compatibilité trouvé
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  groups.map((group) => (
                    <TableRow
                      key={group.id}
                      sx={{
                        '&:hover': { bgcolor: 'action.hover' },
                        ...(group.deletedAt && { opacity: 0.6, bgcolor: 'rgba(0, 0, 0, 0.04)' })
                      }}
                    >
                      <TableCell>{group.name}</TableCell>
                      <TableCell>{group.serialNumber}</TableCell>
                      <TableCell>{group.description || '-'}</TableCell>
                      <TableCell>{formatDate(group.createdAt)}</TableCell>
                      <TableCell>{formatDate(group.updatedAt)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {!group.deletedAt ? (
                            <>
                              <Tooltip title="Voir les produits du groupe">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => loadGroupProducts(group.id)}
                                >
                                  <GroupIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={() => handleOpenDialog(group)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => openDeleteDialog(group.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip title="Restaurer">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleRestoreGroup(group.id)}
                              >
                                <RefreshIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
          />
        </CardContent>
      </Card>

      {/* Dialog pour créer/modifier un groupe */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: '4px solid var(--color-axignis-primary)',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {editingGroup ? 'Modifier un groupe de compatibilité' : 'Créer un groupe de compatibilité'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Nom du groupe"
                variant="outlined"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={formData.name.trim().length < 2 || formData.name.trim().length > 100}
                helperText={
                  formData.name.trim().length < 2
                    ? 'Le nom doit contenir au moins 2 caractères'
                    : formData.name.trim().length > 100
                      ? 'Le nom ne doit pas dépasser 100 caractères'
                      : 'Le nom doit être unique'
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Numéro de série"
                variant="outlined"
                fullWidth
                required
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                error={formData.serialNumber.trim().length < 3 || formData.serialNumber.trim().length > 50}
                helperText={
                  formData.serialNumber.trim().length < 3
                    ? 'Le numéro de série doit contenir au moins 3 caractères'
                    : formData.serialNumber.trim().length > 50
                      ? 'Le numéro de série ne doit pas dépasser 50 caractères'
                      : 'Le numéro de série doit être unique'
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                helperText="Description optionnelle du groupe de compatibilité"
              />
            </Grid>
          </Grid>
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
            {editingGroup ? 'Modifier' : 'Créer'}
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
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce groupe de compatibilité ? Cette action est réversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteGroup}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour afficher les produits d'un groupe */}
      <Dialog
        open={productsDialogOpen}
        onClose={() => setProductsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: '4px solid var(--color-axignis-primary)',
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
          <GroupIcon color="primary" /> Produits dans le groupe
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>N° de série</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Marque</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={30} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                ) : currentGroupProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun produit dans ce groupe
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentGroupProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.serialNumber}</TableCell>
                      <TableCell>{product.type?.title || '-'}</TableCell>
                      <TableCell>{product.brand?.name || '-'}</TableCell>
                      <TableCell>
                        <Tooltip title="Retirer du groupe">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveProductFromGroup(product.id)}
                          >
                            <LinkOffIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={productsTotal}
            rowsPerPage={productsRowsPerPage}
            page={productsPage}
            onPageChange={handleChangeProductsPage}
            onRowsPerPageChange={handleChangeProductsRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductsDialogOpen(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* FAB pour ajouter (mobile) */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { sm: 'none' },
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          '&:hover': {
            background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
          }
        }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
