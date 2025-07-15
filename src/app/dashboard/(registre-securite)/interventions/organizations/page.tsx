'use client';

import organizationService, { CreateOrganizationDto, Organization, OrganizationFilters, UpdateOrganizationDto } from '@/services/organizationService';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // États des filtres
  const [filters, setFilters] = useState<OrganizationFilters>({
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
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<CreateOrganizationDto>({
    code: '',
    name: '',
    description: '',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    isActive: true
  });

  // États du menu contextuel
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOrganization, setMenuOrganization] = useState<Organization | null>(null);

  // Chargement des données
  useEffect(() => {
    loadOrganizations();
  }, [filters]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getOrganizations(filters);
      setOrganizations(response.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des organismes');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof OrganizationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: key === 'isActive' ? (value === '' ? undefined : value === 'true') : value,
      page: key !== 'page' ? 1 : value // Reset page sauf si on change la page
    }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, organization: Organization) => {
    setAnchorEl(event.currentTarget);
    setMenuOrganization(organization);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuOrganization(null);
  };

  const handleDialogOpen = (mode: 'create' | 'edit' | 'view', organization?: Organization) => {
    setDialogMode(mode);
    setSelectedOrganization(organization || null);

    if (mode === 'create') {
      setFormData({
        code: '',
        name: '',
        description: '',
        contactInfo: {
          email: '',
          phone: '',
          address: ''
        },
        isActive: true
      });
    } else if (organization) {
      setFormData({
        code: organization.code,
        name: organization.name,
        description: organization.description || '',
        contactInfo: {
          email: organization.contactInfo?.email || '',
          phone: organization.contactInfo?.phone || '',
          address: organization.contactInfo?.address || ''
        },
        isActive: organization.isActive
      });
    }

    setDialogOpen(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedOrganization(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      contactInfo: {
        email: '',
        phone: '',
        address: ''
      },
      isActive: true
    });
  };

  const handleContactInfoChange = (field: 'email' | 'phone' | 'address', value: string) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await organizationService.createOrganization(formData);
        setSuccess('Organisme créé avec succès');
      } else if (dialogMode === 'edit' && selectedOrganization) {
        const updateData: UpdateOrganizationDto = {
          name: formData.name,
          description: formData.description,
          contactInfo: formData.contactInfo,
          isActive: formData.isActive
        };
        await organizationService.updateOrganization(selectedOrganization.id, updateData);
        setSuccess('Organisme modifié avec succès');
      }

      handleDialogClose();
      loadOrganizations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l&apos;opération');
    }
  };

  const handleDelete = async (organization: Organization) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l&apos;organisme "${organization.name}" ?`)) {
      try {
        await organizationService.deleteOrganization(organization.id);
        setSuccess('Organisme supprimé avec succès');
        loadOrganizations();
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
      flex: 1,
      minWidth: 200,
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
      field: 'contactInfo',
      headerName: 'Contact',
      width: 200,
      renderCell: (params) => {
        const contact = params.value;
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {contact?.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {contact.email}
                </Typography>
              </Box>
            )}
            {contact?.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {contact.phone}
                </Typography>
              </Box>
            )}
          </Box>
        );
      }
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
          {format(new Date(params.value), 'dd/MM/yy', { locale: fr })}
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
            Organismes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez les organismes de contrôle et d&apos;inspection
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen('create')}
        >
          Ajouter un organisme
        </Button>
      </Box>

      {/* Filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Rechercher par code, nom, description ou email..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{ minWidth: 350 }}
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
          rows={organizations}
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
          <MenuItemAction onClick={() => handleDialogOpen('view', menuOrganization || undefined)}>
            <ListItemIcon>
              <ViewIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Voir les détails</ListItemText>
          </MenuItemAction>
          <MenuItemAction onClick={() => handleDialogOpen('edit', menuOrganization || undefined)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Modifier</ListItemText>
          </MenuItemAction>
          <MenuItemAction
            onClick={() => menuOrganization && handleDelete(menuOrganization)}
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
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' && 'Ajouter un organisme'}
          {dialogMode === 'edit' && 'Modifier l&apos;organisme'}
          {dialogMode === 'view' && 'Détails de l&apos;organisme'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            {/* Informations de base */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    disabled={dialogMode !== 'create'}
                    required
                    sx={{ flex: 1, minWidth: 200 }}
                    helperText={dialogMode === 'create' ? 'Le code ne peut pas être modifié après création' : ''}
                  />
                  <TextField
                    label="Nom"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={dialogMode === 'view'}
                    required
                    sx={{ flex: 1, minWidth: 200 }}
                  />
                </Box>
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={dialogMode === 'view'}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Box>
            </Box>

            {/* Informations de contact */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Informations de contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Email"
                    type="email"
                    value={formData.contactInfo?.email || ''}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    disabled={dialogMode === 'view'}
                    sx={{ flex: 1, minWidth: 200 }}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                  />
                  <TextField
                    label="Téléphone"
                    value={formData.contactInfo?.phone || ''}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    disabled={dialogMode === 'view'}
                    sx={{ flex: 1, minWidth: 200 }}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    }}
                  />
                </Box>
                <TextField
                  label="Adresse"
                  value={formData.contactInfo?.address || ''}
                  onChange={(e) => handleContactInfoChange('address', e.target.value)}
                  disabled={dialogMode === 'view'}
                  multiline
                  rows={2}
                  fullWidth
                  InputProps={{
                    startAdornment: <LocationOnIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Box>
            </Box>

            {/* Statut */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  disabled={dialogMode === 'view'}
                />
              }
              label="Organisme actif"
            />

            {dialogMode === 'view' && selectedOrganization && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Créé le : {format(new Date(selectedOrganization.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modifié le : {format(new Date(selectedOrganization.updatedAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
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