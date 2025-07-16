'use client';

import { equipmentService } from '@/services/equipmentService';
import {
  CompatibilityGroup,
  Product,
} from '@/types/equipment';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  LinkOff as LinkOffIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
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
import { useEffect, useState } from 'react';

export default function CompatibilityGroupsPage() {
  // États principaux
  const [groups, setGroups] = useState<CompatibilityGroup[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // États des dialogues
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openProductsDialog, setOpenProductsDialog] = useState(false);
  const [openAttachDialog, setOpenAttachDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<CompatibilityGroup | null>(null);
  const [selectedGroupProducts, setSelectedGroupProducts] = useState<Product[]>([]);

  // État du formulaire
  const [groupName, setGroupName] = useState('');

  // État des notifications
  const [snackbar, setSnackbar] = useState<{ 
    open: boolean; 
    message: string; 
    severity: 'success' | 'error' 
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les groupes de compatibilité
  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getCompatibilityGroups();
      setGroups(response || []);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des groupes de compatibilité',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger tous les produits pour les sélections
  const loadProducts = async () => {
    try {
      const response = await equipmentService.getProducts();
      setProducts(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  // Créer un nouveau groupe
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await equipmentService.createCompatibilityGroup({ name: groupName });
      setSnackbar({
        open: true,
        message: 'Groupe créé avec succès',
        severity: 'success'
      });
      setOpenCreateDialog(false);
      setGroupName('');
      loadGroups();
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la création du groupe',
        severity: 'error'
      });
    }
  };

  // Supprimer un groupe
  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await equipmentService.deleteCompatibilityGroup(groupToDelete);
      setSnackbar({
        open: true,
        message: 'Groupe supprimé avec succès',
        severity: 'success'
      });
      setOpenDeleteDialog(false);
      setGroupToDelete(null);
      loadGroups();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la suppression du groupe',
        severity: 'error'
      });
    }
  };

  // Voir les produits d'un groupe
  const handleViewProducts = (group: CompatibilityGroup) => {
    setSelectedGroup(group);
    // Pour simplifier, on affiche tous les produits qui ont ce groupe dans leur liste
    const groupProducts = products.filter(product => 
      product.groups?.some(g => g.id === group.id)
    );
    setSelectedGroupProducts(groupProducts);
    setOpenProductsDialog(true);
  };

  // Attacher un produit à un groupe
  const handleAttachProduct = async (productId: number) => {
    if (!selectedGroup) return;

    try {
      await equipmentService.attachProductToGroup(selectedGroup.id, productId);
      setSnackbar({
        open: true,
        message: 'Produit attaché avec succès',
        severity: 'success'
      });
      loadProducts(); // Recharger pour voir les changements
      handleViewProducts(selectedGroup); // Refresh de la liste des produits du groupe
    } catch (error: any) {
      console.error('Erreur lors de l\'attachement:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de l\'attachement du produit',
        severity: 'error'
      });
    }
  };

  // Détacher un produit d'un groupe
  const handleDetachProduct = async (productId: number) => {
    if (!selectedGroup) return;

    try {
      await equipmentService.detachProductFromGroup(selectedGroup.id, productId);
      setSnackbar({
        open: true,
        message: 'Produit détaché avec succès',
        severity: 'success'
      });
      loadProducts(); // Recharger pour voir les changements
      handleViewProducts(selectedGroup); // Refresh de la liste des produits du groupe
    } catch (error: any) {
      console.error('Erreur lors du détachement:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors du détachement du produit',
        severity: 'error'
      });
    }
  };

  // Filtrer les groupes selon la recherche et le statut
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeleted = showDeleted ? !!group.deletedAt : !group.deletedAt;
    return matchesSearch && matchesDeleted;
  });

  // Pagination
  const paginatedGroups = filteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Produits disponibles pour attachement (pas déjà dans le groupe)
  const availableProducts = products.filter(product =>
    !selectedGroupProducts.some(gp => gp.id === product.id)
  );

  // Gestion de la pagination
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Chargement initial
  useEffect(() => {
    loadGroups();
    loadProducts();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* En-tête */}
      <Typography variant="h5" component="h1" gutterBottom sx={{
        fontWeight: 'bold',
        color: 'text.primary',
        borderLeft: '4px solid var(--color-axignis-primary)',
        paddingLeft: 2,
        mb: 4
      }}>
        Gestion des groupes de compatibilité
      </Typography>

      {/* Message informatif */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Les groupes de compatibilité permettent d&apos;organiser les produits par catégories. 
        Vous pouvez créer des groupes et y associer des produits pour faciliter la gestion.
      </Alert>

      {/* Filtres et actions */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            alignItems: { xs: 'stretch', md: 'center' },
            mb: 2
          }}>
            <Typography variant="h6" sx={{ 
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600
            }}>
              Filtres avancés
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateDialog(true)}
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

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 2, 
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            <TextField
              label="Rechercher un groupe"
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
              }}
              sx={{ flexGrow: 1 }}
            />

            <Button
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setPage(0);
              }}
              startIcon={<RefreshIcon />}
            >
              Réinitialiser
            </Button>

          </Box>
        </CardContent>
      </Card>

      {/* Tableau des groupes */}
      <Card elevation={3}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', px: 3, py: 2 }}>Nom du groupe</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', px: 3, py: 2 }}>Produits associés</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', px: 3, py: 2, textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : paginatedGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm ? 'Aucun groupe trouvé pour cette recherche' : 'Aucun groupe de compatibilité créé'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGroups.map((group) => {
                    const groupProducts = products.filter(product => 
                      product.groups?.some(g => g.id === group.id)
                    );
                    
                    return (
                      <TableRow
                        key={group.id}
                        sx={{ 
                          '&:hover': { bgcolor: 'action.hover' },
                          ...(group.deletedAt && { opacity: 0.6, bgcolor: 'rgba(0, 0, 0, 0.04)' })
                        }}
                      >
                        <TableCell sx={{ px: 3, py: 2 }}>
                          <Typography variant="body2" fontWeight={500}>
                            {group.name}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ px: 3, py: 2 }}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {groupProducts.length > 0 ? (
                              groupProducts.slice(0, 2).map((product) => (
                                <Chip
                                  key={product.id}
                                  label={product.name}
                                  size="small"
                                  variant="outlined"
                                />
                              ))
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Aucun produit
                              </Typography>
                            )}
                            {groupProducts.length > 2 && (
                              <Chip
                                label={`+${groupProducts.length - 2}`}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: 3, py: 2, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            {!group.deletedAt ? (
                              <>
                                <Tooltip title="Gérer les produits">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewProducts(group)}
                                  >
                                    <GroupIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Supprimer">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      setGroupToDelete(group.id);
                                      setOpenDeleteDialog(true);
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Supprimé
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredGroups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
            }
            sx={{ px: 3 }}
          />
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
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
        <DialogTitle>Créer un groupe de compatibilité</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Nom du groupe"
            variant="outlined"
            fullWidth
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            helperText="Le nom doit être unique"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenCreateDialog(false);
            setGroupName('');
          }}>
            Annuler
          </Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            disabled={!groupName.trim()}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
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
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <DeleteIcon color="error" /> Confirmation de suppression
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer ce groupe de compatibilité ? 
            Cette action supprimera également toutes les associations avec les produits.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
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

      {/* Dialog de gestion des produits */}
      <Dialog
        open={openProductsDialog}
        onClose={() => setOpenProductsDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderTop: '4px solid var(--color-axignis-primary)',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            height: '80vh'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon color="primary" />
            Produits du groupe &ldquo;{selectedGroup?.name}&rdquo;
          </Box>
          {availableProducts.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setOpenAttachDialog(true)}
            >
              Ajouter un produit
            </Button>
          )}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ height: '100%' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Nom</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>N° de série</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Marque</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedGroupProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun produit dans ce groupe
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedGroupProducts.map((product) => (
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
                            onClick={() => handleDetachProduct(product.id)}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductsDialog(false)}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'attachement de produit */}
      <Dialog
        open={openAttachDialog}
        onClose={() => setOpenAttachDialog(false)}
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
        <DialogTitle>Ajouter un produit au groupe</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sélectionnez un produit à ajouter au groupe &ldquo;{selectedGroup?.name}&rdquo;.
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 300 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Produit</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {availableProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Tous les produits sont déjà dans ce groupe
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  availableProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            N° {product.serialNumber}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {product.type?.title || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            handleAttachProduct(product.id);
                            setOpenAttachDialog(false);
                          }}
                        >
                          Ajouter
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAttachDialog(false)}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

      {/* FAB pour mobile */}
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
        onClick={() => setOpenCreateDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
