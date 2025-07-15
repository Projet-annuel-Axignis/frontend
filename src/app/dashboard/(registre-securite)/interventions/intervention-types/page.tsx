'use client';

import interventionTypeService, { CreateInterventionTypeDto, InterventionType, InterventionTypeFilters, UpdateInterventionTypeDto } from '@/services/interventionTypeService';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuItem as MenuItemAction,
  MenuList,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

// Fonction utilitaire pour formater les dates de manière sûre
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  const date = parseISO(dateString);
  if (!isValid(date)) return '-';

  return format(date, 'dd/MM/yy', { locale: fr });
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';

  const date = parseISO(dateString);
  if (!isValid(date)) return '-';

  return format(date, 'dd MMMM yyyy à HH:mm', { locale: fr });
};

export default function InterventionTypesPage() {
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // États des filtres
  const [filters, setFilters] = useState<InterventionTypeFilters>({
    search: '',
    isActive: undefined,
    sortBy: 'name',
    sortOrder: 'asc',
    page: 1,
    limit: 50
  });

  // États du dialogue
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedType, setSelectedType] = useState<InterventionType | null>(null);
  const [formData, setFormData] = useState<CreateInterventionTypeDto>({
    code: '',
    name: '',
    description: '',
    isActive: true
  });

  // États du menu contextuel
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuType, setMenuType] = useState<InterventionType | null>(null);

  // Chargement des données
  useEffect(() => {
    loadInterventionTypes();
  }, [filters]);

  const loadInterventionTypes = async () => {
    try {
      setLoading(true);
      const response = await interventionTypeService.getInterventionTypes(filters);
      setInterventionTypes(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des types d&apos;intervention');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof InterventionTypeFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'isActive' ? (value === '' ? undefined : value === 'true') : value,
      page: key !== 'page' ? 1 : value // Reset page sauf si on change la page
    }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, type: InterventionType) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuType(null);
  };

  const handleDialogOpen = (mode: 'create' | 'edit' | 'view', type?: InterventionType) => {
    setDialogMode(mode);
    setSelectedType(type || null);

    if (mode === 'create') {
      setFormData({
        code: '',
        name: '',
        description: '',
        isActive: true
      });
    } else if (type) {
      setFormData({
        code: type.code,
        name: type.name,
        description: type.description || '',
        isActive: type.isActive
      });
    }

    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedType(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      isActive: true
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await interventionTypeService.createInterventionType(formData);
        setSuccess('Type d&apos;intervention créé avec succès');
      } else if (dialogMode === 'edit' && selectedType) {
        const updateData: UpdateInterventionTypeDto = {
          name: formData.name,
          description: formData.description,
          isActive: formData.isActive
        };
        await interventionTypeService.updateInterventionType(selectedType.code, updateData);
        setSuccess('Type d&apos;intervention modifié avec succès');
      }

      handleDialogClose();
      loadInterventionTypes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l&apos;opération');
    }
  };

  const handleDelete = async (type: InterventionType) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le type d&apos;intervention "${type.name}" ?`)) {
      try {
        await interventionTypeService.deleteInterventionType(type.code);
        setSuccess('Type d&apos;intervention supprimé avec succès');
        loadInterventionTypes();
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
    handleMenuClose();
  };

  const columns: GridColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Nom',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value || '-'}
        </Typography>
      )
    },
    {
      field: 'isActive',
      headerName: 'Statut',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Actif' : 'Inactif'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {formatDate(params.value)}
        </Typography>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="menu"
          icon={<MoreVertIcon />}
          label="Plus d&apos;actions"
          onClick={(event) => handleMenuOpen(event, params.row)}
        />
      ]
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Types d&apos;intervention
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les différents types d&apos;intervention disponibles
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen('create')}
        >
          Ajouter un type
        </Button>
      </Box>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher par code, nom ou description..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{ minWidth: 300 }}
          size="small"
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={filters.isActive === undefined ? '' : filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value)}
            label="Statut"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="true">Actif</MenuItem>
            <MenuItem value="false">Inactif</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={filters.sortBy || 'name'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            label="Trier par"
          >
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="name">Nom</MenuItem>
            <MenuItem value="createdAt">Date de création</MenuItem>
            <MenuItem value="updatedAt">Dernière mise à jour</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tableau */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={interventionTypes}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 }
            }
          }}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      </Box>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItemAction onClick={() => handleDialogOpen('view', menuType || undefined)}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Voir les détails</ListItemText>
          </MenuItemAction>
          <MenuItemAction onClick={() => handleDialogOpen('edit', menuType || undefined)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Modifier</ListItemText>
          </MenuItemAction>
          <MenuItemAction
            onClick={() => menuType && handleDelete(menuType)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItemAction>
        </MenuList>
      </Menu>

      {/* Dialogue de création/édition/vue */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Ajouter un type d&apos;intervention'}
          {dialogMode === 'edit' && 'Modifier le type d&apos;intervention'}
          {dialogMode === 'view' && 'Détails du type d&apos;intervention'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              disabled={dialogMode !== 'create'}
              required
              fullWidth
              helperText={dialogMode === 'create' ? 'Le code ne peut pas être modifié après création' : ''}
            />

            <TextField
              label="Nom"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={dialogMode === 'view'}
              required
              fullWidth
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={dialogMode === 'view'}
              multiline
              rows={3}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  disabled={dialogMode === 'view'}
                />
              }
              label="Type actif"
            />

            {dialogMode === 'view' && selectedType && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Créé le : {formatDateTime(selectedType.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modifié le : {formatDateTime(selectedType.updatedAt)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            {dialogMode === 'view' ? 'Fermer' : 'Annuler'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.code || !formData.name}
            >
              {dialogMode === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
} 