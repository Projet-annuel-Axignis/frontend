'use client';

import observationService from '@/services/observationService';
import { CreateObservationsDto, Observations, UpdateObservationsDto } from '@/types/intervention';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import FileList from './FileList';
import FileUpload from './FileUpload';

interface ObservationsManagerProps {
  reportId: number;
  onObservationsChange?: () => void;
}

const observationStatusLabels: Record<string, string> = {
  OPEN: 'Ouverte',
  IN_PROGRESS: 'En cours',
  FINISHED: 'Terminée'
};

const observationStatusColors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  FINISHED: 'success'
};

const ObservationsManager: React.FC<ObservationsManagerProps> = ({
  reportId,
  onObservationsChange
}) => {
  const [observations, setObservations] = useState<Observations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<Observations | null>(null);
  const [observationToDelete, setObservationToDelete] = useState<Observations | null>(null);
  const [expandedObservation, setExpandedObservation] = useState<number | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateObservationsDto>({
    title: '',
    reference: '',
    location: '',
    priority: 1,
    status: 'OPEN',
    startedAt: '',
    endedAt: '',
    reportId: reportId,
    partIds: [],
    fileIds: []
  });

  const [editForm, setEditForm] = useState<UpdateObservationsDto>({
    title: '',
    reference: '',
    location: '',
    priority: 1,
    status: 'OPEN',
    startedAt: '',
    endedAt: ''
  });

  useEffect(() => {
    loadObservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  const loadObservations = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await observationService.getObservations({
        reportId,
        includeDeleted: true
      });
      setObservations(result.observations);
    } catch (error) {
      console.error('Erreur lors du chargement des observations:', error);
      setError('Erreur lors du chargement des observations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async () => {
    try {
      await observationService.createObservation(createForm);
      setCreateDialogOpen(false);
      setCreateForm({
        title: '',
        reference: '',
        location: '',
        priority: 1,
        status: 'OPEN',
        startedAt: '',
        endedAt: '',
        reportId: reportId,
        partIds: [],
        fileIds: []
      });
      await loadObservations();
      onObservationsChange?.();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('Erreur lors de la création de l&apos;observation');
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedObservation) return;
    try {
      await observationService.updateObservation(selectedObservation.id, editForm);
      setEditDialogOpen(false);
      setSelectedObservation(null);
      await loadObservations();
      onObservationsChange?.();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Erreur lors de la modification de l&apos;observation');
    }
  };

  const handleDelete = async () => {
    if (!observationToDelete) return;
    try {
      await observationService.deleteObservation(observationToDelete.id);
      setDeleteDialogOpen(false);
      setObservationToDelete(null);
      await loadObservations();
      onObservationsChange?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l&apos;observation');
    }
  };

  const handleStartObservation = async (observation: Observations) => {
    try {
      await observationService.startObservation(observation.id);
      await loadObservations();
      onObservationsChange?.();
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
      setError('Erreur lors du démarrage de l\'observation');
    }
  };

  const handleFinishObservation = async (observation: Observations) => {
    try {
      await observationService.finishObservation(observation.id);
      await loadObservations();
      onObservationsChange?.();
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      setError('Erreur lors de la finalisation de l\'observation');
    }
  };

  const openEditDialog = (observation: Observations) => {
    setSelectedObservation(observation);
    setEditForm({
      title: observation.title,
      reference: observation.reference,
      location: observation.location,
      priority: observation.priority,
      status: observation.status,
      startedAt: observation.startedAt,
      endedAt: observation.endedAt
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (observation: Observations) => {
    setObservationToDelete(observation);
    setDeleteDialogOpen(true);
  };

  const toggleExpanded = (observationId: number) => {
    setExpandedObservation(expandedObservation === observationId ? null : observationId);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          Gestion des observations
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          size="small"
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          Nouvelle observation
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Liste des observations */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : observations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            Aucune observation créée
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {observations.map((observation) => (
            <React.Fragment key={observation.id}>
              <ListItem
                divider
                sx={{
                  opacity: observation.deletedAt ? 0.6 : 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'grey.50' },
                  px: 0
                }}
                onClick={() => toggleExpanded(observation.id)}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <ViewIcon color="primary" fontSize="small" />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {observation.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={observationStatusLabels[observation.status]}
                        color={observationStatusColors[observation.status]}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Référence: {observation.reference} | Localisation: {observation.location}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Priorité: {observation.priority} | Créée le: {format(new Date(observation.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </Typography>
                    </Box>
                  }
                />

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {observation.status === 'OPEN' && (
                    <Tooltip title="Démarrer">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleStartObservation(observation); }}
                        color="success"
                      >
                        <StartIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {observation.status === 'IN_PROGRESS' && (
                    <Tooltip title="Terminer">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleFinishObservation(observation); }}
                        color="success"
                      >
                        <StopIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); openEditDialog(observation); }}
                      disabled={!!observation.deletedAt}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); openDeleteDialog(observation); }}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </ListItem>

              {/* Section extensible pour les fichiers */}
              {expandedObservation === observation.id && (
                <Box sx={{ pl: 4, pr: 2, pb: 2, backgroundColor: 'grey.50', mt: 1 }}>
                  <Typography variant="caption" color="primary" sx={{ mb: 2, display: 'block' }}>
                    Fichiers de l&apos;observation
                  </Typography>
                  <FileUpload
                    entityType="observation"
                    entityId={observation.id}
                    onUploadComplete={loadObservations}
                  />
                  <FileList
                    entityType="observation"
                    entityId={observation.id}
                    title="Fichiers attachés"
                    onFilesChange={loadObservations}
                  />
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Dialog de création */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouvelle observation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Titre"
                value={createForm.title}
                onChange={(e) => setCreateForm(f => ({ ...f, title: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Référence"
                value={createForm.reference}
                onChange={(e) => setCreateForm(f => ({ ...f, reference: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Localisation"
                value={createForm.location}
                onChange={(e) => setCreateForm(f => ({ ...f, location: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Priorité"
                type="number"
                value={createForm.priority}
                onChange={(e) => setCreateForm(f => ({ ...f, priority: Number(e.target.value) }))}
                fullWidth
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Statut"
                select
                value={createForm.status}
                onChange={(e) => setCreateForm(f => ({ ...f, status: e.target.value as any }))}
                fullWidth
              >
                <MenuItem value="OPEN">Ouverte</MenuItem>
                <MenuItem value="IN_PROGRESS">En cours</MenuItem>
                <MenuItem value="FINISHED">Terminée</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateSubmit} variant="contained">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l&apos;observation</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Titre"
                value={editForm.title}
                onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Référence"
                value={editForm.reference}
                onChange={(e) => setEditForm(f => ({ ...f, reference: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Localisation"
                value={editForm.location}
                onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Priorité"
                type="number"
                value={editForm.priority}
                onChange={(e) => setEditForm(f => ({ ...f, priority: Number(e.target.value) }))}
                fullWidth
                inputProps={{ min: 1, max: 5 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="Statut"
                select
                value={editForm.status}
                onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value as any }))}
                fullWidth
              >
                <MenuItem value="OPEN">Ouverte</MenuItem>
                <MenuItem value="IN_PROGRESS">En cours</MenuItem>
                <MenuItem value="FINISHED">Terminée</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l&apos;observation &ldquo;{observationToDelete?.title}&rdquo; ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ObservationsManager; 