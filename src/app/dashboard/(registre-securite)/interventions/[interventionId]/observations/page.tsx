'use client';

import { useLoading } from '@/hooks/useLoading';
import observationService from '@/services/observationService';
import reportService from '@/services/reportService';
import { Observations, ObservationStatus } from '@/types/intervention';
import {
  Add as AddIcon,
  Attachment as AttachmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Stop as StopIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FileManager from '../_components/FileManager';

const statusColors: Record<ObservationStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  OPEN: 'error',
  IN_PROGRESS: 'warning',
  FINISHED: 'success'
};

const statusLabels: Record<ObservationStatus, string> = {
  OPEN: 'Ouverte',
  IN_PROGRESS: 'En cours',
  FINISHED: 'Terminée'
};

export default function InterventionObservationsPage() {
  const params = useParams();
  const { withLoading } = useLoading();

  const interventionId = parseInt(params.interventionId as string);

  // Data states
  const [observations, setObservations] = useState<Observations[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedObservation, setSelectedObservation] = useState<Observations | null>(null);

  // File management state
  const [fileManagerObservation, setFileManagerObservation] = useState<Observations | null>(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [observationToDelete, setObservationToDelete] = useState<Observations | null>(null);

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

  useEffect(() => {
    if (interventionId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId, search, statusFilter, priorityFilter, includeDeleted]);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        // 1. Charger d'abord les rapports de l'intervention
        const reportsResult = await reportService.getReports({
          interventionId,
          includeDeleted: true, // On veut tous les rapports pour avoir toutes les observations
        });
        setReports(reportsResult.reports);

        // 2. Charger les observations de tous ces rapports
        let allObservations: Observations[] = [];
        for (const report of reportsResult.reports) {
          try {
            const obsResult = await observationService.getObservations({
              reportId: report.id,
              search: search || undefined,
              status: statusFilter || undefined,
              priority: priorityFilter ? parseInt(priorityFilter) : undefined,
              includeDeleted,
            });
            allObservations = [...allObservations, ...obsResult.observations];
          } catch (error) {
            console.error(`Erreur lors du chargement des observations du rapport ${report.id}:`, error);
          }
        }

        // Trier par date de création (plus récent en premier)
        allObservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setObservations(allObservations);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        showNotification('Erreur lors du chargement des observations', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, observation: Observations) => {
    event.stopPropagation();
    setSelectedObservation(observation);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedObservation(null);
  };

  const handleView = () => {
    if (selectedObservation) {
      // TODO: Naviguer vers le détail de l'observation
      showNotification('Affichage du détail - Fonctionnalité en cours de développement', 'info');
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedObservation) {
      // TODO: Ouvrir dialogue d'édition
      showNotification('Édition - Fonctionnalité en cours de développement', 'info');
    }
    handleMenuClose();
  };

  const handleStart = async () => {
    if (!selectedObservation) return;

    await withLoading(async () => {
      try {
        await observationService.startObservation(selectedObservation.id);
        await loadData();
        showNotification('Observation démarrée avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors du démarrage:', error);
        showNotification('Erreur lors du démarrage de l&apos;observation', 'error');
      }
    });
    handleMenuClose();
  };

  const handleFinish = async () => {
    if (!selectedObservation) return;

    await withLoading(async () => {
      try {
        await observationService.finishObservation(selectedObservation.id);
        await loadData();
        showNotification('Observation terminée avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors de la finalisation:', error);
        showNotification('Erreur lors de la finalisation de l&apos;observation', 'error');
      }
    });
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedObservation) {
      setObservationToDelete(selectedObservation);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleRestore = async () => {
    if (!selectedObservation) return;

    await withLoading(async () => {
      try {
        await observationService.restoreObservation(selectedObservation.id);
        await loadData();
        showNotification('Observation restaurée avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors de la restauration:', error);
        showNotification('Erreur lors de la restauration de l&apos;observation', 'error');
      }
    });
    handleMenuClose();
  };

  const confirmDeleteObservation = async () => {
    if (!observationToDelete) return;

    await withLoading(async () => {
      try {
        await observationService.deleteObservation(observationToDelete.id);
        await loadData();
        showNotification('Observation archivée avec succès', 'success');
        setDeleteDialogOpen(false);
        setObservationToDelete(null);
      } catch (error) {
        console.error('Erreur lors de l&apos;archivage:', error);
        showNotification('Erreur lors de l&apos;archivage de l&apos;observation', 'error');
      }
    });
  };

  const handleCreateObservation = () => {
    // TODO: Ouvrir dialogue de création
    showNotification('Création d&apos;observation - Fonctionnalité en cours de développement', 'info');
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setIncludeDeleted(false);
  };

  const activeFiltersCount = [search, statusFilter, priorityFilter, includeDeleted].filter(Boolean).length;

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'error';
    if (priority >= 3) return 'warning';
    if (priority >= 2) return 'info';
    return 'success';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 4) return 'Critique';
    if (priority >= 3) return 'Haute';
    if (priority >= 2) return 'Moyenne';
    return 'Faible';
  };

  return (
    <Box>
      {/* Header avec actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <VisibilityIcon color="primary" sx={{ fontSize: '2rem' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" fontWeight="600">
            Observations de l&apos;intervention
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {observations.length} observation{observations.length > 1 ? 's' : ''} trouvée{observations.length > 1 ? 's' : ''}
            {reports.length > 0 && ` (depuis ${reports.length} rapport${reports.length > 1 ? 's' : ''})`}
          </Typography>
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            size="small"
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateObservation}
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
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: filtersOpen ? 2 : 0 }}>
            <TextField
              placeholder="Rechercher une observation..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, maxWidth: 400 }}
            />

            <Button
              variant={activeFiltersCount > 0 ? "contained" : "outlined"}
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              color={activeFiltersCount > 0 ? "primary" : "inherit"}
            >
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="text"
                onClick={handleResetFilters}
                size="small"
              >
                Réinitialiser
              </Button>
            )}
          </Box>

          <Collapse in={filtersOpen}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* TODO: Ajouter des sélecteurs pour statut et priorité */}
              <Typography variant="body2" color="text.secondary">
                Filtres avancés disponibles prochainement
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Tableau des observations */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: 'primary.main',
                '& .MuiTableCell-head': {
                  color: 'white',
                  fontWeight: 600
                }
              }}>
                <TableCell>Titre</TableCell>
                <TableCell>Référence</TableCell>
                <TableCell>Localisation</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Rapport</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {observations.map((observation) => (
                <TableRow
                  key={observation.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    opacity: observation.deletedAt ? 0.6 : 1,
                    backgroundColor: observation.deletedAt ? 'error.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: observation.deletedAt ? 'error.light' : 'action.hover',
                    },
                  }}
                  onClick={() => handleView()}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {observation.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {observation.reference}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {observation.location}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={observation.priority}
                        max={5}
                        size="small"
                        readOnly
                      />
                      <Chip
                        size="small"
                        label={getPriorityLabel(observation.priority)}
                        color={getPriorityColor(observation.priority)}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={statusLabels[observation.status]}
                      color={statusColors[observation.status]}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {observation.report.label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(observation.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, observation)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {observations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      {reports.length === 0 ?
                        'Aucun rapport trouvé pour cette intervention' :
                        'Aucune observation trouvée dans les rapports de cette intervention'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <VisibilityIcon sx={{ mr: 1 }} fontSize="small" />
          Voir le détail
        </MenuItem>
        {selectedObservation && (
          <>
            {!selectedObservation.deletedAt && (
              <>
                <MenuItem onClick={handleEdit}>
                  <EditIcon sx={{ mr: 1 }} fontSize="small" />
                  Éditer
                </MenuItem>
                {selectedObservation.status === 'OPEN' && (
                  <MenuItem onClick={handleStart}>
                    <PlayArrowIcon sx={{ mr: 1 }} fontSize="small" />
                    Démarrer
                  </MenuItem>
                )}
                {selectedObservation.status === 'IN_PROGRESS' && (
                  <MenuItem onClick={handleFinish}>
                    <StopIcon sx={{ mr: 1 }} fontSize="small" />
                    Terminer
                  </MenuItem>
                )}
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                  Archiver
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    if (selectedObservation) {
                      setFileManagerObservation(selectedObservation);
                    }
                    handleMenuClose();
                  }}
                >
                  <AttachmentIcon sx={{ mr: 1 }} fontSize="small" />
                  Gérer les fichiers
                </MenuItem>
              </>
            )}
            {selectedObservation.deletedAt && (
              <MenuItem onClick={handleRestore}>
                <RestoreIcon sx={{ mr: 1 }} fontSize="small" />
                Restaurer
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Gestion des fichiers pour l'observation sélectionnée */}
      {fileManagerObservation && (
        <FileManager
          entityType="observation"
          entityId={fileManagerObservation.id}
          title={`Fichiers de l'observation: ${fileManagerObservation.title}`}
          onFilesChange={() => {
            // Optionnel: recharger les données si nécessaire
            loadData();
          }}
        />
      )}

      {/* Bouton pour fermer le gestionnaire de fichiers */}
      {fileManagerObservation && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setFileManagerObservation(null)}
          >
            Fermer la gestion des fichiers
          </Button>
        </Box>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setObservationToDelete(null);
        }}
      >
        <DialogTitle>Confirmer l&apos;archivage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir archiver l&apos;observation &quot;{observationToDelete?.title}&quot; ?
            Cette action peut être annulée en restaurant l&apos;observation.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setObservationToDelete(null);
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteObservation}
            color="error"
            variant="contained"
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
} 