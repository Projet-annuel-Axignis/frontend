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
  FolderOpen as FolderOpenIcon
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
  const [selectedDomain, setSelectedDomain] = useState<number | ''>('');
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
      console.log("Chargement des familles avec filtres:", {
        page: page + 1,
        rowsPerPage,
        domainId: selectedDomain || undefined,
        search: searchTerm,
        showDeleted
      });
      
      const response = await equipmentService.getFamilies(
        page + 1, 
        rowsPerPage, 
        selectedDomain || undefined, 
        searchTerm, 
        showDeleted
      );
      setFamilies(response.results || []);
      console.log("Réponse familles:", response);
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
  }, []);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      if (editingFamily) {
        console.log("Mise à jour de la famille ID:", editingFamily.id);
        console.log("Données du formulaire avant traitement:", formData);
        
        // Préparer les données pour la mise à jour
        const updateData: UpdateEquipmentFamilyRequest = {
          name: formData.name,
          serialNumber: formData.serialNumber,
        };
        
        // Ajouter domainId seulement s'il est présent et non vide
        if (formData.domainId) {
          updateData.domainId = formData.domainId;
        }
        
        console.log("Données finales pour la requête PATCH:", updateData);
        
        const response = await equipmentService.updateFamily(editingFamily.id, updateData);
        console.log("Réponse de mise à jour réussie:", response);
        
        setSnackbar({
          open: true,
          message: 'Famille mise à jour avec succès',
          severity: 'success'
        });
      } else {
        console.log("Création d'une nouvelle famille:", formData);
        const response = await equipmentService.createFamily(formData);
        console.log("Réponse de création:", response);
        
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
        console.error('Détails de l\'erreur:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 409) {
          errorMessage = 'Une famille avec ce numéro de série existe déjà';
        } else if (error.response.status === 500) {
          errorMessage = 'Erreur serveur interne. Veuillez contacter l\'administrateur.';
          
          // Afficher plus de détails sur l'erreur serveur pour le débogage
          console.error('Corps de la requête qui a provoqué l\'erreur 500:', error.config?.data);
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

  const handleEdit = (family: EquipmentFamily) => {
    setEditingFamily(family);
    
    // Analyser le domainId selon la structure retournée par l'API
    let domainId;
    
    // Log complet de l'objet family pour vérifier sa structure
    console.log("Objet famille complet reçu par handleEdit:", JSON.stringify(family, null, 2));
    
    if (family.domain && family.domain.id) {
      // Si l'API renvoie un objet domain complet
      domainId = family.domain.id;
      console.log("DomainId extrait de l'objet domain:", domainId, "type:", typeof domainId);
    } else if (family.domainId) {
      // Utiliser directement domainId si disponible
      domainId = family.domainId;
      console.log("DomainId extrait directement:", domainId, "type:", typeof domainId);
    } else {
      // Cas où il n'y a pas de domaine associé
      console.warn("Aucun domainId trouvé pour la famille:", family.id);
      domainId = '';
    }
    
    const formattedData = { 
      name: family.name, 
      serialNumber: family.serialNumber,
      domainId: domainId
    };
    
    setFormData(formattedData);
    console.log("FormData préparé pour l'édition:", formattedData);
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
            Familles d&apos;équipements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les familles d&apos;équipements techniques de votre organisation
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
          Nouvelle famille
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
                    Familles total
                  </Typography>
                </Box>
                <FolderOpenIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
              onClick={loadFamilies}
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
            placeholder="Rechercher une famille..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 280, flex: { xs: '1 1 100%', sm: '1 1 280px' } }}
          />
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filtrer par domaine</InputLabel>
            <Select
              value={selectedDomain}
              label="Filtrer par domaine"
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <MenuItem value="">Tous les domaines</MenuItem>
              {domains.map((domain) => (
                <MenuItem key={domain.id} value={domain.id as number}>
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
                          <></>
                        ) : (
                          <>
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
          <Box sx={{ mb: 2, mt: 2, p: 1.5, backgroundColor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              <strong>Note:</strong> Les <u>noms de familles</u> et les <u>numéros de série</u> doivent être uniques dans le système.
            </Typography>
          </Box>
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
    </Box>
  );
}
