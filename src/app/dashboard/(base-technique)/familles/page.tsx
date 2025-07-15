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
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  EquipmentFamily, 
  EquipmentDomain,
  CreateEquipmentFamilyRequest, 
  UpdateEquipmentFamilyRequest 
} from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function FamiliesPage() {
  const [families, setFamilies] = useState<EquipmentFamily[]>([]);
  const [domains, setDomains] = useState<EquipmentDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [familyToDelete, setFamilyToDelete] = useState<string | null>(null);
  const [editingFamily, setEditingFamily] = useState<EquipmentFamily | null>(null);
  const [formData, setFormData] = useState<CreateEquipmentFamilyRequest>({ 
    name: '', 
    serialNumber: '',
    domainId: ''
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les familles
  const loadFamilies = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getFamilies(
        page + 1, 
        rowsPerPage, 
        selectedDomain || undefined, 
        searchTerm, 
        showDeleted
      );
      setFamilies(response.results || []);
      console.log(response);
      setTotal(response.totalResults || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des familles:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des familles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les domaines (pour le formulaire)
  const loadDomains = async () => {
    try {
      setDomainsLoading(true);
      const response = await equipmentService.getDomains(1, 100);
      setDomains(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des domaines:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des domaines',
        severity: 'error'
      });
    } finally {
      setDomainsLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, showDeleted, selectedDomain]);

  // Charger les domaines au montage
  useEffect(() => {
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      if (editingFamily) {
        await equipmentService.updateFamily(editingFamily.id, formData as UpdateEquipmentFamilyRequest);
        setSnackbar({
          open: true,
          message: 'Famille mise à jour avec succès',
          severity: 'success'
        });
      } else {
        await equipmentService.createFamily(formData);
        setSnackbar({
          open: true,
          message: 'Famille créée avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadFamilies();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Une famille avec ce numéro de série existe déjà';
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
    setFamilyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFamilyToDelete(null);
  };

  const handleDelete = async () => {
    if (!familyToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteFamily(familyToDelete);
      setSnackbar({
        open: true,
        message: 'Famille supprimée avec succès',
        severity: 'success'
      });
      loadFamilies();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Cette famille est utilisée par d\'autres éléments et ne peut pas être supprimée';
        } else if (error.response.status === 404) {
          errorMessage = 'Famille introuvable';
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
      await equipmentService.restoreFamily(id);
      setSnackbar({
        open: true,
        message: 'Famille restaurée avec succès',
        severity: 'success'
      });
      loadFamilies();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Famille introuvable';
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

  const handleEdit = (family: EquipmentFamily) => {
    setEditingFamily(family);
    setFormData({ 
      name: family.name, 
      serialNumber: family.serialNumber,
      domainId: family.domainId
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingFamily(null);
    setFormData({ name: '', serialNumber: '', domainId: selectedDomain || '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFamily(null);
    setFormData({ name: '', serialNumber: '', domainId: '' });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction pour obtenir le nom du domaine
  const getDomainName = (family: EquipmentFamily) => {
    // Si la famille a un objet domain, utiliser ce nom
    if (family.domain) {
      return family.domain.name;
    }
    // Sinon, essayer de trouver le domaine par ID
    const domain = domains.find(d => d.id === family.domainId);
    return domain ? domain.name : 'Domaine inconnu';
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
          Familles d&apos;équipements
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les familles d&apos;équipements techniques de votre organisation
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
                    Familles total
                  </Typography>
                </Box>
                <FolderOpenIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
            placeholder="Rechercher une famille..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250 }}
          />
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="domain-select-label">Filtrer par domaine</InputLabel>
            <Select
              labelId="domain-select-label"
              id="domain-select"
              value={selectedDomain}
              label="Filtrer par domaine"
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <MenuItem value="">Tous les domaines</MenuItem>
              {domains.map((domain) => (
                <MenuItem key={domain.id} value={domain.id}>
                  {domain.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
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
            <IconButton onClick={loadFamilies} disabled={loading}>
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
            Nouvelle famille
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nom de la famille</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Numéro de série</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Domaine parent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dernière modification</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !families || families.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucune famille trouvée
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                families.map((family) => (
                  <TableRow 
                    key={family.id} 
                    hover
                    sx={{ 
                      opacity: family.deletedAt ? 0.6 : 1,
                      backgroundColor: family.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FolderOpenIcon sx={{ color: family.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: family.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {family.name}
                          {family.deletedAt && (
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
                        label={family.serialNumber} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<FolderIcon />}
                        label={getDomainName(family)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(family.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(family.updatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {family.deletedAt ? (
                          <Tooltip title="Restaurer">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleRestore(family.id)}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Voir les détails">
                              <IconButton size="small" color="primary">
                                <ViewIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(family)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(family.id)}
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
          {editingFamily ? 'Modifier la famille' : 'Nouvelle famille'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la famille"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 2 }}
            helperText="Ex: éclairage"
          />
          <TextField
            margin="dense"
            label="Numéro de série"
            fullWidth
            variant="outlined"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            sx={{ mt: 2 }}
            helperText="Ex: LIGHT001 (3-50 caractères)"
          />
          <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
            <InputLabel id="domain-select-label-form">Domaine parent</InputLabel>
            <Select
              labelId="domain-select-label-form"
              id="domain-select-form"
              value={formData.domainId}
              label="Domaine parent"
              onChange={(e) => setFormData({ ...formData, domainId: e.target.value })}
            >
              {domainsLoading ? (
                <MenuItem disabled>Chargement des domaines...</MenuItem>
              ) : domains.length === 0 ? (
                <MenuItem disabled>Aucun domaine disponible</MenuItem>
              ) : (
                domains.map((domain) => (
                  <MenuItem key={domain.id} value={domain.id}>
                    {domain.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.name.trim() || 
              !formData.serialNumber.trim() || 
              formData.serialNumber.length < 3 || 
              formData.serialNumber.length > 50 ||
              !formData.domainId
            }
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            {editingFamily ? 'Modifier' : 'Créer'}
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
            Êtes-vous sûr de vouloir supprimer cette famille d&apos;équipement ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. La famille pourra être restaurée ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
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
        aria-label="Ajouter une famille"
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
