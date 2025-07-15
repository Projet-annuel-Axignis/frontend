'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useLoading } from '@/hooks/useLoading';
import interventionTypeService, { CreateInterventionTypeDto, InterventionType, UpdateInterventionTypeDto } from '@/services/interventionTypeService';
import { Add as AddIcon, Refresh as RefreshIcon, Settings as SettingsIcon } from '@mui/icons-material';
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
  Snackbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import InterventionTypeCard from './_components/InterventionTypeCard';
import InterventionTypeDialog from './_components/InterventionTypeDialog';
import InterventionTypeFilters from './_components/InterventionTypeFilters';
import InterventionTypeTable from './_components/InterventionTypeTable';

const InterventionTypesPage = () => {
  const { isLoading: loading, withLoading } = useLoading();

  // Data states
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<InterventionType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<InterventionType | null>(null);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load initial data
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        await loadInterventionTypes();
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  };

  const loadInterventionTypes = async () => {
    try {
      const result = await interventionTypeService.getInterventionTypes({
        search,
        isActive,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: 1,
        limit: 1000,
      });
      setInterventionTypes(result.data);
    } catch (error) {
      console.error('Error loading intervention types:', error);
      showNotification('Erreur lors du chargement des types d\'intervention', 'error');
    }
  };

  // Reload types when filters change
  useEffect(() => {
    loadInterventionTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, isActive, sortBy, sortOrder]);

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateType = () => {
    setEditingType(null);
    setDialogOpen(true);
  };

  const handleEditType = (type: InterventionType) => {
    setEditingType(type);
    setDialogOpen(true);
  };

  const handleDeleteType = (type: InterventionType) => {
    setTypeToDelete(type);
    setDeleteDialogOpen(true);
  };

  const handleRestoreType = async (type: InterventionType) => {
    await withLoading(async () => {
      try {
        await interventionTypeService.updateInterventionType(type.code, { isActive: true });
        await loadInterventionTypes();
        showNotification('Type d\'intervention restauré avec succès', 'success');
      } catch (error) {
        console.error('Error restoring intervention type:', error);
        showNotification('Erreur lors de la restauration du type d\'intervention', 'error');
      }
    });
  };

  const confirmDeleteType = async () => {
    if (!typeToDelete) return;

    await withLoading(async () => {
      try {
        await interventionTypeService.updateInterventionType(typeToDelete.code, { isActive: false });
        await loadInterventionTypes();
        showNotification('Type d\'intervention désactivé avec succès', 'success');
        setDeleteDialogOpen(false);
        setTypeToDelete(null);
      } catch (error) {
        console.error('Error deleting intervention type:', error);
        showNotification('Erreur lors de la désactivation du type d\'intervention', 'error');
      }
    });
  };

  const handleSubmitType = async (data: CreateInterventionTypeDto | UpdateInterventionTypeDto) => {
    await withLoading(async () => {
      try {
        if (editingType) {
          // Update existing type
          await interventionTypeService.updateInterventionType(editingType.code, data as UpdateInterventionTypeDto);
          showNotification('Type d\'intervention modifié avec succès', 'success');
        } else {
          // Create new type
          await interventionTypeService.createInterventionType(data as CreateInterventionTypeDto);
          showNotification('Type d\'intervention créé avec succès', 'success');
        }

        await loadInterventionTypes();
        setDialogOpen(false);
        setEditingType(null);
      } catch (error) {
        console.error('Error submitting intervention type:', error);
        throw error; // Let the dialog handle the error display
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setIsActive(undefined);
    setSortBy('name');
    setSortOrder('asc');
  };

  // Filter types based on current filters (client-side for better UX)
  const filteredTypes = interventionTypes.filter(type => {
    if (isActive !== undefined && type.isActive !== isActive) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        type.code.toLowerCase().includes(searchLower) ||
        type.name.toLowerCase().includes(searchLower) ||
        type.description?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title="Types d'intervention"
        icon={<SettingsIcon />}
      />

      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SettingsIcon color="primary" sx={{ fontSize: '2rem' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" fontWeight="600">
                Gestion des Types d&apos;intervention
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTypes.length} type{filteredTypes.length > 1 ? 's' : ''} trouvé{filteredTypes.length > 1 ? 's' : ''}
                {filteredTypes.length !== interventionTypes.length && ` sur ${interventionTypes.length} au total`}
              </Typography>
            </Box>

            {/* Boutons - Version Desktop */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadData}
                disabled={loading}
                size="small"
              >
                Actualiser
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateType}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  },
                }}
              >
                Nouveau type
              </Button>
            </Box>

            {/* Boutons - Version Mobile (icônes seulement) */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1 }}>
              <Button
                variant="outlined"
                onClick={loadData}
                disabled={loading}
                size="small"
                sx={{ minWidth: 'auto', px: 1 }}
              >
                <RefreshIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateType}
                disabled={loading}
                size="small"
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filtres */}
          <InterventionTypeFilters
            search={search}
            onSearchChange={setSearch}
            isActive={isActive}
            onIsActiveChange={setIsActive}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onReset={handleResetFilters}
          />

          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <InterventionTypeTable
              interventionTypes={filteredTypes}
              onEdit={handleEditType}
              onDelete={handleDeleteType}
              onRestore={handleRestoreType}
            />
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {filteredTypes.map((type) => (
              <InterventionTypeCard
                key={type.id}
                interventionType={type}
                onEdit={handleEditType}
                onDelete={handleDeleteType}
                onRestore={handleRestoreType}
              />
            ))}

            {filteredTypes.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SettingsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucun type d&apos;intervention trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {search || isActive !== undefined
                    ? 'Aucun type ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre premier type d\'intervention.'
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Type Dialog */}
      <InterventionTypeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingType(null);
        }}
        onSubmit={handleSubmitType}
        interventionType={editingType}
        loading={loading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setTypeToDelete(null);
        }}
      >
        <DialogTitle>Confirmer la désactivation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir désactiver le type d&apos;intervention &quot;{typeToDelete?.name}&quot; ?
            Cette action peut être annulée en restaurant le type depuis les filtres.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setTypeToDelete(null);
            }}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteType}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Désactiver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
};

export default InterventionTypesPage; 