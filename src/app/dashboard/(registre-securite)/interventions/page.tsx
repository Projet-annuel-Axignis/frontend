'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useLoading } from '@/hooks/useLoading';
import { interventionService } from '@/services/interventionService';
import { Intervention } from '@/types/intervention';
import {
  Add as AddIcon,
  Build as BuildIcon,
  Refresh as RefreshIcon
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
  Snackbar,
  Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import InterventionFilters from './_components/InterventionFilters';
import InterventionTable from './_components/InterventionTable';

const InterventionsPage = () => {
  const router = useRouter();
  const { isLoading: loading, withLoading } = useLoading();

  // Data states
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [periodicity, setPeriodicity] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interventionToDelete, setInterventionToDelete] = useState<Intervention | null>(null);

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        await loadInterventions();
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  };

  const loadInterventions = async () => {
    try {
      const result = await interventionService.getInterventions({
        status: status || undefined,
        search,
        includeDeleted,
      });
      setInterventions(result.interventions);
    } catch (error) {
      console.error('Error loading interventions:', error);
      showNotification('Erreur lors du chargement des interventions', 'error');
    }
  };

  // Reload interventions when filters change
  useEffect(() => {
    loadInterventions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, search, includeDeleted]);

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateIntervention = () => {
    // TODO: Ouvrir un dialogue de création
    showNotification('Création - Fonctionnalité en cours de développement', 'info');
  };

  const handleEditIntervention = () => {
    // TODO: Ouvrir un dialogue d'édition
    showNotification('Édition - Fonctionnalité en cours de développement', 'info');
  };

  const handleViewIntervention = (intervention: Intervention) => {
    router.push(`/dashboard/interventions/${intervention.id}`);
  };

  const handleDeleteIntervention = (intervention: Intervention) => {
    setInterventionToDelete(intervention);
    setDeleteDialogOpen(true);
  };

  const handleRestoreIntervention = async (intervention: Intervention) => {
    await withLoading(async () => {
      try {
        await interventionService.restoreIntervention(intervention.id);
        await loadInterventions();
        showNotification('Intervention restaurée avec succès', 'success');
      } catch (error) {
        console.error('Error restoring intervention:', error);
        showNotification('Erreur lors de la restauration de l\'intervention', 'error');
      }
    });
  };

  const handleStartIntervention = async (intervention: Intervention) => {
    await withLoading(async () => {
      try {
        await interventionService.startIntervention(intervention.id);
        await loadInterventions();
        showNotification('Intervention démarrée avec succès', 'success');
      } catch (error) {
        console.error('Error starting intervention:', error);
        showNotification('Erreur lors du démarrage de l\'intervention', 'error');
      }
    });
  };

  const handleTerminateIntervention = async (intervention: Intervention) => {
    await withLoading(async () => {
      try {
        await interventionService.terminateIntervention(intervention.id);
        await loadInterventions();
        showNotification('Intervention terminée avec succès', 'success');
      } catch (error) {
        console.error('Error terminating intervention:', error);
        showNotification('Erreur lors de la finalisation de l\'intervention', 'error');
      }
    });
  };

  const confirmDeleteIntervention = async () => {
    if (!interventionToDelete) return;

    await withLoading(async () => {
      try {
        await interventionService.deleteIntervention(interventionToDelete.id);
        await loadInterventions();
        showNotification('Intervention archivée avec succès', 'success');
        setDeleteDialogOpen(false);
        setInterventionToDelete(null);
      } catch (error) {
        console.error('Error deleting intervention:', error);
        showNotification('Erreur lors de l\'archivage de l\'intervention', 'error');
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPeriodicity('');
    setIncludeDeleted(false);
  };

  // Filter interventions based on current filters
  const filteredInterventions = interventions.filter(intervention => {
    if (!includeDeleted && intervention.deletedAt) return false;
    if (status && intervention.status !== status) return false;
    if (periodicity && intervention.periodicity !== periodicity) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        intervention.label.toLowerCase().includes(searchLower) ||
        intervention.companyName.toLowerCase().includes(searchLower) ||
        intervention.employeeName.toLowerCase().includes(searchLower) ||
        intervention.type.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <Box>
      {/* Header */}
      <DashBoardHeader
        title="Interventions"
        icon={<BuildIcon />}
      />

      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <BuildIcon color="primary" sx={{ fontSize: '2rem' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" fontWeight="600">
                Gestion des Interventions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredInterventions.length} intervention{filteredInterventions.length > 1 ? 's' : ''} trouvée{filteredInterventions.length > 1 ? 's' : ''}
                {filteredInterventions.length !== interventions.length && ` sur ${interventions.length} au total`}
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
                onClick={handleCreateIntervention}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                  },
                }}
              >
                Nouvelle intervention
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
                onClick={handleCreateIntervention}
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
          <InterventionFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            periodicity={periodicity}
            onPeriodicityChange={setPeriodicity}
            includeDeleted={includeDeleted}
            onIncludeDeletedChange={setIncludeDeleted}
            onReset={handleResetFilters}
          />

          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <InterventionTable
              interventions={filteredInterventions}
              onView={handleViewIntervention}
              onEdit={handleEditIntervention}
              onStart={handleStartIntervention}
              onTerminate={handleTerminateIntervention}
              onDelete={handleDeleteIntervention}
              onRestore={handleRestoreIntervention}
            />
          </Box>

          {/* Mobile Card View - TODO: Créer InterventionCard */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {filteredInterventions.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <BuildIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Aucune intervention trouvée
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {search || status || periodicity
                    ? 'Aucune intervention ne correspond à vos critères de recherche.'
                    : 'Commencez par créer votre première intervention.'
                  }
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setInterventionToDelete(null);
        }}
      >
        <DialogTitle>Confirmer l&apos;archivage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir archiver l&apos;intervention &quot;{interventionToDelete?.label}&quot; ?
            Cette action peut être annulée en restaurant l&apos;intervention depuis les filtres.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setInterventionToDelete(null);
            }}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteIntervention}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Archiver
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

export default InterventionsPage; 