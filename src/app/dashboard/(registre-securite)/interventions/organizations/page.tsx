'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import organizationService from '@/services/organizationService';
import { CreateOrganizationDto, Organization, UpdateOrganizationDto } from '@/types/intervention';
import {
  Add as AddIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useEffect, useState } from 'react';
import OrganizationCard from './_components/OrganizationCard';
import OrganizationDialog from './_components/OrganizationDialog';
import OrganizationFilters from './_components/OrganizationFilters';
import OrganizationTable from './_components/OrganizationTable';

export default function OrganizationsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  useBreadcrumbTitle('organizations', 'Organismes');
  // État des données
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // État des filtres
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // État des dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  // État des notifications
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Chargement initial
  useEffect(() => {
    loadOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrage côté client
  useEffect(() => {
    // Vérification de sécurité pour s'assurer qu'allOrganizations est un tableau
    if (!Array.isArray(allOrganizations)) {
      setOrganizations([]);
      return;
    }

    let filtered = [...allOrganizations];

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (organization) =>
          organization.name.toLowerCase().includes(searchLower) ||
          organization.type.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Organization];
      let bValue: any = b[sortBy as keyof Organization];

      // Gestion des valeurs nulles/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setOrganizations(filtered);
  }, [allOrganizations, search, sortBy, sortOrder]);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const response = await organizationService.getOrganizations({
        limit: 1000,
        page: 1,
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      // response est déjà de type OrganizationResponse avec { data, total, page, limit }
      setAllOrganizations(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des organismes:', error);
      showNotification('Erreur lors du chargement des organismes', 'error');
      setAllOrganizations([]); // S'assurer qu'on a toujours un tableau
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateOrganization = async (data: CreateOrganizationDto | UpdateOrganizationDto) => {
    try {
      await organizationService.createOrganization(data as CreateOrganizationDto);
      showNotification('Organisme créé avec succès', 'success');
      loadOrganizations();
    } catch {
      throw new Error('Erreur lors de la création de l\'organisme');
    }
  };

  const handleEditOrganization = async (data: CreateOrganizationDto | UpdateOrganizationDto) => {
    if (!selectedOrganization) return;

    try {
      await organizationService.updateOrganization(selectedOrganization.id, data as UpdateOrganizationDto);
      showNotification('Organisme modifié avec succès', 'success');
      loadOrganizations();
    } catch {
      throw new Error('Erreur lors de la modification de l\'organisme');
    }
  };

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;

    try {
      await organizationService.deleteOrganization(selectedOrganization.id);
      showNotification('Organisme supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      setSelectedOrganization(null);
      loadOrganizations();
    } catch {
      showNotification('Erreur lors de la suppression de l\'organisme', 'error');
    }
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setEditDialogOpen(true);
  };

  const handleDelete = (organization: Organization) => {
    setSelectedOrganization(organization);
    setDeleteDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <Box sx={{ p: 3 }}>
      <DashBoardHeader
        title="Organismes"
        icon={<BusinessIcon />}
      />

      <Card>
        <CardContent>
          {/* Header avec stats et actions */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {organizations.length} organisme{organizations.length > 1 ? 's' : ''}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez les organismes de contrôle et organismes agréés
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                },
              }}
            >
              {isMobile ? 'Ajouter' : 'Ajouter un organisme'}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filtres */}
          <OrganizationFilters
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onReset={resetFilters}
          />

          {/* Vue conditionnelle desktop/mobile */}
          {isMobile ? (
            <Grid container spacing={2}>
              {organizations.map((organization) => (
                <Grid size={{ xs: 12, sm: 6 }} key={organization.id}>
                  <OrganizationCard
                    organization={organization}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <OrganizationTable
              organizations={organizations}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <OrganizationDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateOrganization}
        isLoading={isLoading}
      />

      {/* Dialog d'édition */}
      <OrganizationDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedOrganization(null);
        }}
        onSubmit={handleEditOrganization}
        organization={selectedOrganization || undefined}
        isLoading={isLoading}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l&apos;organisme &quot;{selectedOrganization?.name}&quot; ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteOrganization}
            color="error"
            variant="contained"
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 