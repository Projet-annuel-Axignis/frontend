'use client';

import { useLoading } from '@/hooks/useLoading';
import reportService from '@/services/reportService';
import { OrganizationType, Report } from '@/types/intervention';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
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

const organizationTypeLabels: Record<OrganizationType, string> = {
  OA: 'Organisme Agréé',
  TC: 'Tiers Compétent'
};

const organizationTypeColors: Record<OrganizationType, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  OA: 'primary',
  TC: 'secondary'
};

export default function InterventionReportsPage() {
  const params = useParams();
  const { withLoading } = useLoading();

  const interventionId = parseInt(params.interventionId as string);

  // Data states
  const [reports, setReports] = useState<Report[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

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
      loadReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId, search, typeFilter, organizationFilter, includeDeleted]);

  const loadReports = async () => {
    await withLoading(async () => {
      try {
        const result = await reportService.getReports({
          interventionId,
          search: search || undefined,
          includeDeleted,
        });
        setReports(result.reports);
      } catch (error) {
        console.error('Erreur lors du chargement des rapports:', error);
        showNotification('Erreur lors du chargement des rapports', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, report: Report) => {
    event.stopPropagation();
    setSelectedReport(report);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const handleView = () => {
    if (selectedReport) {
      // TODO: Naviguer vers le détail du rapport
      showNotification('Affichage du détail - Fonctionnalité en cours de développement', 'info');
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedReport) {
      // TODO: Ouvrir dialogue d'édition
      showNotification('Édition - Fonctionnalité en cours de développement', 'info');
    }
    handleMenuClose();
  };

  const handleDownload = async () => {
    if (!selectedReport) return;

    await withLoading(async () => {
      try {
        const blob = await reportService.downloadReport(selectedReport.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-${selectedReport.label}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showNotification('Rapport téléchargé avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showNotification('Erreur lors du téléchargement du rapport', 'error');
      }
    });
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedReport) {
      setReportToDelete(selectedReport);
      setDeleteDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleRestore = async () => {
    if (!selectedReport) return;

    await withLoading(async () => {
      try {
        await reportService.restoreReport(selectedReport.id);
        await loadReports();
        showNotification('Rapport restauré avec succès', 'success');
      } catch (error) {
        console.error('Erreur lors de la restauration:', error);
        showNotification('Erreur lors de la restauration du rapport', 'error');
      }
    });
    handleMenuClose();
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;

    await withLoading(async () => {
      try {
        await reportService.deleteReport(reportToDelete.id);
        await loadReports();
        showNotification('Rapport archivé avec succès', 'success');
        setDeleteDialogOpen(false);
        setReportToDelete(null);
      } catch (error) {
        console.error('Erreur lors de l&apos;archivage:', error);
        showNotification('Erreur lors de l&apos;archivage du rapport', 'error');
      }
    });
  };

  const handleCreateReport = () => {
    // TODO: Ouvrir dialogue de création
    showNotification('Création de rapport - Fonctionnalité en cours de développement', 'info');
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('');
    setOrganizationFilter('');
    setIncludeDeleted(false);
  };

  const activeFiltersCount = [search, typeFilter, organizationFilter, includeDeleted].filter(Boolean).length;

  // Filtrage côté client pour les filtres spécifiques
  const filteredReports = reports.filter(report => {
    if (!includeDeleted && report.deletedAt) return false;
    if (typeFilter && report.type.code !== typeFilter) return false;
    if (organizationFilter && report.organization.id.toString() !== organizationFilter) return false;
    return true;
  });

  return (
    <Box>
      {/* Header avec actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssignmentIcon color="primary" sx={{ fontSize: '2rem' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" fontWeight="600">
            Rapports de l&apos;intervention
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredReports.length} rapport{filteredReports.length > 1 ? 's' : ''} trouvé{filteredReports.length > 1 ? 's' : ''}
            {filteredReports.length !== reports.length && ` sur ${reports.length} au total`}
          </Typography>
        </Box>

        {/* Boutons d'action */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadReports}
            size="small"
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateReport}
            sx={{
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            Nouveau rapport
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: filtersOpen ? 2 : 0 }}>
            <TextField
              placeholder="Rechercher un rapport..."
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
              {/* TODO: Ajouter des sélecteurs pour type et organisation */}
              <Typography variant="body2" color="text.secondary">
                Filtres avancés disponibles prochainement
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Tableau des rapports */}
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
                <TableCell>Libellé</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Organisation</TableCell>
                <TableCell>Typologie</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow
                  key={report.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    opacity: report.deletedAt ? 0.6 : 1,
                    backgroundColor: report.deletedAt ? 'error.light' : 'inherit',
                    '&:hover': {
                      backgroundColor: report.deletedAt ? 'error.light' : 'action.hover',
                    },
                  }}
                  onClick={() => handleView()}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {report.label}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.type.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">
                        {report.organization.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={organizationTypeLabels[report.organization.type]}
                        color={organizationTypeColors[report.organization.type]}
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {report.typology.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(report.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Actions">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, report)}
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
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">
                      Aucun rapport trouvé pour cette intervention
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
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          Voir le détail
        </MenuItem>
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
          Télécharger
        </MenuItem>
        {selectedReport && (
          <>
            {!selectedReport.deletedAt && (
              <>
                <MenuItem onClick={handleEdit}>
                  <EditIcon sx={{ mr: 1 }} fontSize="small" />
                  Éditer
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                  Archiver
                </MenuItem>
              </>
            )}
            {selectedReport.deletedAt && (
              <MenuItem onClick={handleRestore}>
                <RestoreIcon sx={{ mr: 1 }} fontSize="small" />
                Restaurer
              </MenuItem>
            )}
          </>
        )}
      </Menu>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setReportToDelete(null);
        }}
      >
        <DialogTitle>Confirmer l&apos;archivage</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir archiver le rapport &quot;{reportToDelete?.label}&quot; ?
            Cette action peut être annulée en restaurant le rapport.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setReportToDelete(null);
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteReport}
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