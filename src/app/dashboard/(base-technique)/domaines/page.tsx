'use client';

import { equipmentService } from '@/services/equipmentService';
import { CreateEquipmentDomainRequest, EquipmentDomain, UpdateEquipmentDomainRequest } from '@/types/equipment';
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
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Switch,
  Typography
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Folder as FolderIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';

export default function DomainesPage() {
  const [domains, setDomains] = useState<EquipmentDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDomain, setEditingDomain] = useState<EquipmentDomain | null>(null);
  const [formData, setFormData] = useState<CreateEquipmentDomainRequest>({ name: '', serialNumber: '' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Charger les domaines
  const loadDomains = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getDomains(page + 1, rowsPerPage, searchTerm, showDeleted);
      console.log(response);
      // Adapter la structure de réponse
      setDomains(response.results || []);
      setTotal(response.totalResults || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des domaines:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des domaines',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, showDeleted]);

  // Vérifier si les données sont chargées au montage
  useEffect(() => {
    loadDomains();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      if (editingDomain) {
        await equipmentService.updateDomain(editingDomain.id, formData as UpdateEquipmentDomainRequest);
        setSnackbar({
          open: true,
          message: 'Domaine mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await equipmentService.createDomain(formData);
        setSnackbar({
          open: true,
          message: 'Domaine créé avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadDomains();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        console.error('Status code:', error.response.status);
        console.error('Error data:', error.response.data);
        
        // Erreurs spécifiques selon le code HTTP
        if (error.response.status === 409) {
          if (error.response.data && error.response.data.message) {
            if (error.response.data.message.includes('name already exists')) {
              errorMessage = 'Un domaine avec ce nom existe déjà';
            } else if (error.response.data.message.includes('serial number already exists')) {
              errorMessage = 'Un domaine avec ce numéro de série existe déjà';
            } else {
              errorMessage = error.response.data.message;
            }
          } else {
            errorMessage = 'Conflit : cette ressource existe déjà';
          }
        } else if (error.response.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier les champs du formulaire.';
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
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

  const openDeleteDialog = (id: number) => {
    setDomainToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDomainToDelete(null);
  };

  const handleDelete = async () => {
    if (!domainToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteDomain(domainToDelete);
      setSnackbar({
        open: true,
        message: 'Domaine supprimé avec succès',
        severity: 'success'
      });
      loadDomains();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Ce domaine est utilisé par d\'autres éléments et ne peut pas être supprimé';
        } else if (error.response.status === 404) {
          errorMessage = 'Domaine introuvable';
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

  const handleEdit = (domain: EquipmentDomain) => {
    setEditingDomain(domain);
    setFormData({ 
      name: domain.name, 
      serialNumber: domain.serialNumber 
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingDomain(null);
    setFormData({ name: '', serialNumber: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDomain(null);
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
            Domaines d&apos;équipements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les domaines d&apos;équipements techniques de votre organisation
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
          Nouveau domaine
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
                    Domaines total
                  </Typography>
                </Box>
                <FolderIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Barre de filtres */}
      <Paper sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        {/* En-tête des filtres */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            <SearchIcon sx={{ color: 'var(--color-axignis-primary)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--color-axignis-primary)' }}>
              Filtres et recherche
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={loadDomains}
              disabled={loading}
              startIcon={<RefreshIcon />}
              sx={{ 
                borderColor: 'var(--color-axignis-primary)',
                color: 'var(--color-axignis-primary)',
                '&:hover': {
                  borderColor: 'var(--color-axignis-secondary)',
                  backgroundColor: 'rgba(var(--color-axignis-primary-rgb), 0.1)'
                }
              }}
            >
              Actualiser
            </Button>
          </Box>
        </Box>
        
        {/* Grille de filtres responsive */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center'
        }}>
          <TextField
            size="small"
            placeholder="Rechercher un domaine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 280, flex: { xs: '1 1 100%', sm: '1 1 280px' } }}
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
              py: 1,
              backgroundColor: 'background.paper'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Inclure supprimés
            </Typography>
            <Switch
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Nom du domaine</TableCell>
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
              ) : !domains || domains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun domaine trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                domains.map((domain) => (
                  <TableRow 
                    key={domain.id} 
                    hover
                    sx={{ 
                      opacity: domain.deletedAt ? 0.6 : 1,
                      backgroundColor: domain.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FolderIcon sx={{ color: domain.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: domain.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {domain.name}
                          {domain.deletedAt && (
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
                        label={domain.serialNumber}
                        size="small"
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(domain.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(domain.updatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {domain.deletedAt ? (
                          <></>
                        ) : (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(domain)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(domain.id)}
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
          {editingDomain ? 'Modifier le domaine' : 'Nouveau domaine'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 2, p: 1.5, backgroundColor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Note:</strong> Les <u>noms de domaines</u> et les <u>numéros de série</u> doivent être uniques dans le système.
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du domaine"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            helperText="Ex: électricité (doit être unique)"
          />
          <TextField
            margin="dense"
            label="Numéro de série"
            fullWidth
            variant="outlined"
            value={formData.serialNumber}
            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            required
            helperText="Ex: ELEC001 (3-50 caractères, doit être unique)"
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
            {editingDomain ? 'Modifier' : 'Créer'}
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
            Êtes-vous sûr de vouloir supprimer ce domaine d&apos;équipement ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. Le domaine pourra être restauré ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
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