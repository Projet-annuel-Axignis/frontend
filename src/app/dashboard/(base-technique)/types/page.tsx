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
  Select,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  ViewList as ViewListIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { equipmentService } from '@/services/equipmentService';
import { 
  EquipmentType, 
  EquipmentFamily,
  CreateEquipmentTypeRequest, 
  UpdateEquipmentTypeRequest 
} from '@/types/equipment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function EquipmentTypesPage() {
  const [types, setTypes] = useState<EquipmentType[]>([]);
  const [families, setFamilies] = useState<EquipmentFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [familiesLoading, setFamiliesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<number | ''>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<EquipmentType | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTypeDetails, setSelectedTypeDetails] = useState<EquipmentType | null>(null);
  const [formData, setFormData] = useState<CreateEquipmentTypeRequest>({
    title: '', 
    subTitle: '',
    serialNumber: '',
    inventoryRequired: false,
    extraSchema: {},
    familyId: ''
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [extraFields, setExtraFields] = useState<{key: string, label: string, type: string, values?: string[]}[]>([]);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldValues, setNewFieldValues] = useState('');
  const [extraFieldDialogOpen, setExtraFieldDialogOpen] = useState(false);

  // Charger les types
  const loadTypes = async () => {
    try {
      setLoading(true);
      console.log("Chargement des types avec filtres:", {
        page: page + 1,
        rowsPerPage,
        familyId: selectedFamily || undefined,
        search: searchTerm,
        showDeleted
      });
      
      const response = await equipmentService.getTypes(
        page + 1, 
        rowsPerPage, 
        selectedFamily || undefined, 
        searchTerm, 
        showDeleted
      );
      setTypes(response.results || []);
      console.log("Réponse types:", response);
      setTotal(response.totalResults || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des types:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des types',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les familles (pour le formulaire)
  const loadFamilies = async () => {
    try {
      setFamiliesLoading(true);
      const response = await equipmentService.getFamilies(1, 100);
      setFamilies(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement des familles:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des familles',
        severity: 'error'
      });
    } finally {
      setFamiliesLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, showDeleted, selectedFamily]);

  // Charger les familles au montage
  useEffect(() => {
    loadFamilies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Gestion des champs personnalisés
  const addExtraField = () => {
    if (!newFieldKey || !newFieldLabel) return;

    const field = {
      key: newFieldKey,
      label: newFieldLabel,
      type: newFieldType,
      values: newFieldType === 'enum' ? newFieldValues.split(',').map(s => s.trim()) : undefined
    };

    setExtraFields([...extraFields, field]);
    setNewFieldKey('');
    setNewFieldLabel('');
    setNewFieldType('text');
    setNewFieldValues('');
    setExtraFieldDialogOpen(false);
  };

  const removeExtraField = (key: string) => {
    setExtraFields(extraFields.filter(field => field.key !== key));
  };

  const convertExtraFieldsToSchema = () => {
    const schema: Record<string, any> = {};
    extraFields.forEach(field => {
      schema[field.key] = {
        label: field.label,
        type: field.type,
        ...(field.values && { values: field.values })
      };
    });
    return schema;
  };

  // Charger les champs personnalisés à l'édition
  useEffect(() => {
    if (editingType && editingType.extraSchema) {
      const fields: {key: string, label: string, type: string, values?: string[]}[] = [];
      
      Object.entries(editingType.extraSchema).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const fieldDef = value as any;
          fields.push({
            key,
            label: fieldDef.label || key,
            type: fieldDef.type || 'text',
            values: fieldDef.values || undefined
          });
        }
      });
      
      setExtraFields(fields);
    } else {
      setExtraFields([]);
    }
  }, [editingType]);

  // Gestion des formulaires
  const handleSubmit = async () => {
    try {
      const formDataWithSchema = {
        ...formData,
        extraSchema: convertExtraFieldsToSchema()
      };

      console.log("handleSubmit - Données du formulaire avant soumission:", formDataWithSchema);
      console.log("handleSubmit - Type de familyId:", typeof formDataWithSchema.familyId);

      if (editingType) {
        console.log(`Mise à jour du type d'équipement (ID: ${editingType.id})`);
        await equipmentService.updateType(editingType.id, formDataWithSchema as UpdateEquipmentTypeRequest);
        setSnackbar({
          open: true,
          message: 'Type mis à jour avec succès',
          severity: 'success'
        });
      } else {
        console.log("Création d'un nouveau type d'équipement");
        await equipmentService.createType(formDataWithSchema);
        setSnackbar({
          open: true,
          message: 'Type créé avec succès',
          severity: 'success'
        });
      }
      handleCloseDialog();
      loadTypes();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      let errorMessage = 'Erreur lors de la sauvegarde';
      
      if (error.response) {
        console.error("Code d'erreur:", error.response.status);
        console.error("Détails de l'erreur:", error.response.data);
        
        if (error.response.status === 409) {
          errorMessage = 'Un type avec ce numéro de série existe déjà';
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
    setTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTypeToDelete(null);
  };

  const handleDelete = async () => {
    if (!typeToDelete) return;
    
    try {
      setLoading(true);
      await equipmentService.deleteType(typeToDelete);
      setSnackbar({
        open: true,
        message: 'Type supprimé avec succès',
        severity: 'success'
      });
      loadTypes();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la suppression';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Ce type est utilisé par d\'autres éléments et ne peut pas être supprimé';
        } else if (error.response.status === 404) {
          errorMessage = 'Type introuvable';
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
      await equipmentService.restoreType(id);
      setSnackbar({
        open: true,
        message: 'Type restauré avec succès',
        severity: 'success'
      });
      loadTypes();
    } catch (error: any) {
      console.error('Erreur lors de la restauration:', error);
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de la restauration';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Type introuvable';
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

  const handleViewDetails = (equipmentType: EquipmentType) => {
    setSelectedTypeDetails(equipmentType);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (equipmentType: EquipmentType) => {
    setEditingType(equipmentType);
    
    // Assurons-nous que familyId est traité correctement
    const processedFamilyId = equipmentType.family?.id;
    
    // Si c'est un nombre sous forme de chaîne, nous pouvons le conserver tel quel,
    // le service s'occupera de la conversion
    console.log("handleEdit - Type d'équipement à éditer:", equipmentType);
    console.log("handleEdit - Type de familyId:", typeof processedFamilyId);
    
    setFormData({ 
      title: equipmentType.title, 
      subTitle: equipmentType.subTitle || '',
      serialNumber: equipmentType.serialNumber,
      inventoryRequired: equipmentType.inventoryRequired,
      familyId: processedFamilyId ?? '',
      extraSchema: equipmentType.extraSchema || {}
    });
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ 
      title: '', 
      subTitle: '', 
      serialNumber: '', 
      inventoryRequired: false,
      extraSchema: {},
      familyId: selectedFamily || '' 
    });
    setExtraFields([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingType(null);
    setFormData({ 
      title: '', 
      subTitle: '', 
      serialNumber: '', 
      inventoryRequired: false, 
      extraSchema: {},
      familyId: '' 
    });
    setExtraFields([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction pour obtenir le nom de la famille
  const getFamilyName = (equipmentType: EquipmentType) => {
    // Si le type a un objet family, utiliser ce nom
    if (equipmentType.family) {
      return equipmentType.family.name;
    }
    // Sinon, essayer de trouver la famille par ID
    const family = families.find(f => f.id === equipmentType.familyId);
    return family ? family.name : 'Famille inconnue';
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
            Types d&apos;équipements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les types d&apos;équipements techniques de votre organisation
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
          Nouveau type
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
                    Types total
                  </Typography>
                </Box>
                <CategoryIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
            placeholder="Rechercher un type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 250, flex: { xs: '1 1 auto', sm: '0 1 250px' } }}
          />
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="family-select-label">Filtrer par famille</InputLabel>
            <Select
              labelId="family-select-label"
              id="family-select"
              value={selectedFamily}
              label="Filtrer par famille"
              onChange={(e) => setSelectedFamily(e.target.value)}
            >
              <MenuItem value="">Toutes les familles</MenuItem>
              {families.map((family) => (
                <MenuItem key={family.id} value={family.id as number}>
                  {family.name}
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
            <IconButton onClick={loadTypes} disabled={loading}>
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
                <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sous-titre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Numéro de série</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Famille parent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Inventaire requis</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Champs personnalisés</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : !types || types.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Aucun type trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                types.map((equipmentType) => (
                  <TableRow 
                    key={equipmentType.id} 
                    hover
                    sx={{ 
                      opacity: equipmentType.deletedAt ? 0.6 : 1,
                      backgroundColor: equipmentType.deletedAt ? 'rgba(244, 67, 54, 0.05)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon sx={{ color: equipmentType.deletedAt ? 'text.disabled' : 'var(--color-axignis-primary)' }} />
                        <Typography 
                          variant="body1" 
                          fontWeight={500}
                          sx={{ 
                            textDecoration: equipmentType.deletedAt ? 'line-through' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {equipmentType.title}
                          {equipmentType.deletedAt && (
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
                    <TableCell>{equipmentType.subTitle || '-'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={equipmentType.serialNumber} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<ViewListIcon />}
                        label={getFamilyName(equipmentType)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {equipmentType.inventoryRequired ? (
                        <Chip 
                          icon={<InventoryIcon />} 
                          label="Requis" 
                          size="small" 
                          color="success" 
                        />
                      ) : (
                        <Chip 
                          label="Non requis" 
                          size="small" 
                          variant="outlined" 
                          color="default" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {equipmentType.extraSchema && Object.keys(equipmentType.extraSchema).length > 0 ? (
                        <Chip 
                          icon={<SettingsIcon />}
                          label={`${Object.keys(equipmentType.extraSchema).length} champ(s)`} 
                          size="small" 
                          color="info"
                          variant="outlined" 
                        />
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(equipmentType.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {equipmentType.deletedAt ? (
                          <Tooltip title="Restaurer">
                            <IconButton 
                              size="small" 
                              color="success"
                              onClick={() => handleRestore(equipmentType.id)}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip title="Voir les détails">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={() => handleViewDetails(equipmentType)}
                                >
                                  <ViewIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Modifier">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleEdit(equipmentType)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => openDeleteDialog(equipmentType.id)}
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
          {editingType ? 'Modifier le type' : 'Nouveau type'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Titre"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              helperText="Ex: Éclairage de sécurité (2-100 caractères)"
              required
            />
            
            <TextField
              margin="dense"
              label="Sous-titre"
              fullWidth
              variant="outlined"
              value={formData.subTitle}
              onChange={(e) => setFormData({ ...formData, subTitle: e.target.value })}
              helperText="Description optionnelle (max 200 caractères)"
            />
            
            <TextField
              margin="dense"
              label="Numéro de série"
              fullWidth
              variant="outlined"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              helperText="Ex: LIGHT001 (3-50 caractères)"
              required
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel id="family-select-label-form">Famille parent</InputLabel>
              <Select
                labelId="family-select-label-form"
                id="family-select-form"
                value={formData.familyId}
                label="Famille parent"
                onChange={(e) => setFormData({ ...formData, familyId: e.target.value })}
                required
              >
                {familiesLoading ? (
                  <MenuItem disabled>Chargement des familles...</MenuItem>
                ) : families.length === 0 ? (
                  <MenuItem disabled>Aucune famille disponible</MenuItem>
                ) : (
                  families.map((family) => (
                    <MenuItem key={family.id} value={family.id as number}>
                      {family.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              <FormHelperText>Sélectionnez la famille à laquelle ce type appartient</FormHelperText>
            </FormControl>
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.inventoryRequired}
                  onChange={(e) => setFormData({ ...formData, inventoryRequired: e.target.checked })}
                />
              } 
              label="Inventaire requis"
              sx={{ mt: 1, display: 'block' }}
            />
            <FormHelperText sx={{ mt: -0.5 }}>
              Cochez si ce type d&apos;équipement nécessite un inventaire
            </FormHelperText>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Champs personnalisés
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ajoutez des champs personnalisés pour ce type d&apos;équipement (ex: capacité, puissance, etc.)
            </Typography>
            
            {extraFields.length > 0 ? (
              <Box sx={{ mb: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Clé</TableCell>
                      <TableCell>Libellé</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Valeurs</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {extraFields.map((field) => (
                      <TableRow key={field.key}>
                        <TableCell><Typography variant="body2" fontFamily="monospace">{field.key}</Typography></TableCell>
                        <TableCell>{field.label}</TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              field.type === 'text' ? 'Texte' :
                              field.type === 'decimal' ? 'Nombre' :
                              field.type === 'enum' ? 'Liste' :
                              field.type === 'date' ? 'Date' : field.type
                            }
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {field.values ? field.values.join(', ') : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="error" onClick={() => removeExtraField(field.key)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  Aucun champ personnalisé défini
                </Typography>
              </Box>
            )}
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => setExtraFieldDialogOpen(true)}
              size="small"
            >
              Ajouter un champ personnalisé
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={
              !formData.title.trim() || 
              formData.title.length < 2 || 
              formData.title.length > 100 ||
              !formData.serialNumber.trim() || 
              formData.serialNumber.length < 3 || 
              formData.serialNumber.length > 50 ||
              !formData.familyId ||
              (formData.subTitle && formData.subTitle.length > 200)
            }
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              }
            }}
          >
            {editingType ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour ajouter un champ personnalisé */}
      <Dialog open={extraFieldDialogOpen} onClose={() => setExtraFieldDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un champ personnalisé</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Clé"
            fullWidth
            variant="outlined"
            value={newFieldKey}
            onChange={(e) => setNewFieldKey(e.target.value)}
            helperText="Identifiant unique du champ (ex: capacity, power)"
          />
          
          <TextField
            margin="dense"
            label="Libellé"
            fullWidth
            variant="outlined"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            helperText="Label affiché à l'utilisateur (ex: Capacité (L), Puissance (W))"
          />
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Type de champ</InputLabel>
            <Select
              value={newFieldType}
              label="Type de champ"
              onChange={(e) => setNewFieldType(e.target.value)}
            >
              <MenuItem value="text">Texte</MenuItem>
              <MenuItem value="decimal">Nombre</MenuItem>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="enum">Liste de valeurs</MenuItem>
            </Select>
          </FormControl>
          
          {newFieldType === 'enum' && (
            <TextField
              margin="dense"
              label="Valeurs possibles"
              fullWidth
              variant="outlined"
              value={newFieldValues}
              onChange={(e) => setNewFieldValues(e.target.value)}
              helperText="Liste de valeurs séparées par des virgules (ex: EAU, CO2, Poudre)"
              multiline
              rows={2}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtraFieldDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={addExtraField}
            variant="contained"
            disabled={!newFieldKey.trim() || !newFieldLabel.trim() || (newFieldType === 'enum' && !newFieldValues.trim())}
          >
            Ajouter
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
            Êtes-vous sûr de vouloir supprimer ce type d&apos;équipement ?
          </Typography>
          <Box sx={{ mt: 2, bgcolor: 'rgba(244, 67, 54, 0.08)', p: 2, borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Note :</strong> Cette action effectuera une suppression réversible. Le type pourra être restauré ultérieurement en activant l&apos;option &quot;Inclure les supprimés&quot;.
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

      {/* Dialog pour afficher les détails */}
      <Dialog 
        open={detailsDialogOpen} 
        onClose={() => setDetailsDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          color: 'white'
        }}>
          <CategoryIcon /> Détails du type d&apos;équipement
        </DialogTitle>
        <DialogContent dividers>
          {selectedTypeDetails && (
            <Box sx={{ p: 1 }}>
              {/* Informations générales */}
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Informations générales
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Titre</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedTypeDetails.title}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Sous-titre</Typography>
                    <Typography variant="body1">{selectedTypeDetails.subTitle || '-'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Numéro de série</Typography>
                    <Chip 
                      label={selectedTypeDetails.serialNumber} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontFamily: 'monospace' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Inventaire requis</Typography>
                    {selectedTypeDetails.inventoryRequired ? (
                      <Chip 
                        icon={<InventoryIcon />} 
                        label="Requis" 
                        size="small" 
                        color="success" 
                      />
                    ) : (
                      <Chip 
                        label="Non requis" 
                        size="small" 
                        variant="outlined" 
                        color="default" 
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Famille</Typography>
                    <Chip
                      icon={<ViewListIcon />}
                      label={getFamilyName(selectedTypeDetails)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Date de création</Typography>
                    <Typography variant="body1">{format(new Date(selectedTypeDetails.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Dernière modification</Typography>
                    <Typography variant="body1">{format(new Date(selectedTypeDetails.updatedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</Typography>
                  </Box>
                  {selectedTypeDetails.deletedAt && (
                    <Box>
                      <Typography variant="subtitle2" color="error">Date de suppression</Typography>
                      <Typography variant="body1" color="error">{format(new Date(selectedTypeDetails.deletedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Champs personnalisés */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Champs personnalisés
                </Typography>
                {selectedTypeDetails.extraSchema && Object.keys(selectedTypeDetails.extraSchema).length > 0 ? (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Clé</TableCell>
                        <TableCell>Libellé</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Valeurs</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(selectedTypeDetails.extraSchema).map(([key, value]: [string, any]) => (
                        <TableRow key={key}>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">{key}</Typography>
                          </TableCell>
                          <TableCell>{value.label || key}</TableCell>
                          <TableCell>
                            <Chip 
                              label={
                                value.type === 'text' ? 'Texte' :
                                value.type === 'decimal' ? 'Nombre' :
                                value.type === 'enum' ? 'Liste' :
                                value.type === 'date' ? 'Date' : value.type
                              }
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {value.values ? value.values.join(', ') : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Aucun champ personnalisé défini
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Fermer</Button>
          {selectedTypeDetails && !selectedTypeDetails.deletedAt && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => {
                setDetailsDialogOpen(false);
                handleEdit(selectedTypeDetails);
              }}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                }
              }}
            >
              Modifier
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
