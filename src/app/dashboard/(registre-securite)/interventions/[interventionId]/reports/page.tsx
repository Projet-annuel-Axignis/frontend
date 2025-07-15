'use client';

import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import organizationService from '@/services/organizationService';
import reportService from '@/services/reportService';
import reportTypeService from '@/services/reportTypeService';
import { CreateReportDto, Organization, OrganizationType, Report, ReportType, UpdateReportDto } from '@/types/intervention';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Alert,
  Autocomplete,
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
  Grid,
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
import FileManager from '../_components/FileManager';
import ReportDialog from '../_components/ReportDialog';

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

  useBreadcrumbTitle('reports', 'Rapports d\'intervention');

  const interventionId = parseInt(params.interventionId as string);

  // Data states
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  // Filter states
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Menu states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Expandable rows state
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editForm, setEditForm] = useState<UpdateReportDto>({
    label: '',
    typeCode: '',
    organizationId: 0,
    typologyCode: ''
  });

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      loadReferenceData();
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

  const loadReferenceData = async () => {
    try {
      // Charger les types de rapport
      const reportTypesResponse = await reportTypeService.getReportTypes(
        {
          limit: 1000,
          page: 1,
          sortOrder: 'asc',
          sortBy: 'name'
        }
      );
      setReportTypes(reportTypesResponse.data);

      // Charger les organisations
      const organizationsResponse = await organizationService.getOrganizations(
        {
          limit: 1000,
          page: 1,
          sortOrder: 'asc',
          sortBy: 'name'
        }
      );
      setOrganizations(organizationsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
      showNotification('Erreur lors du chargement des données de référence', 'error');
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Gestion des lignes expandables
  const handleRowClick = (report: Report) => {
    if (expandedRow === report.id) {
      // Fermer la ligne si elle est déjà ouverte
      setExpandedRow(null);
      setEditingReport(null);
    } else {
      // Ouvrir la ligne et initialiser le formulaire d'édition
      setExpandedRow(report.id);
      setEditingReport(report);
      setEditForm({
        label: report.label,
        typeCode: report.type.code,
        organizationId: report.organization.id,
        typologyCode: report.typology.code
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingReport) return;

    try {
      await reportService.updateReport(editingReport.id, editForm);
      showNotification('Rapport modifié avec succès', 'success');
      await loadReports();
      setExpandedRow(null);
      setEditingReport(null);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      showNotification('Erreur lors de la modification du rapport', 'error');
    }
  };

  const handleCancelEdit = () => {
    setExpandedRow(null);
    setEditingReport(null);
  };

  const handleFormChange = (field: keyof UpdateReportDto, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateReportDto) => {
    await reportService.createReport(data);
    showNotification('Rapport créé avec succès', 'success');
    await loadReports();
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
                <React.Fragment key={report.id}>
                  {/* Ligne principale du rapport */}
                  <TableRow
                    hover
                    sx={{
                      cursor: 'pointer',
                      opacity: report.deletedAt ? 0.6 : 1,
                      backgroundColor: report.deletedAt ? 'error.light' : expandedRow === report.id ? 'action.selected' : 'inherit',
                      '&:hover': {
                        backgroundColor: report.deletedAt ? 'error.light' : 'action.hover',
                      },
                    }}
                    onClick={() => handleRowClick(report)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {expandedRow === report.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        <Typography variant="body2" fontWeight={600}>
                          {report.label}
                        </Typography>
                      </Box>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, report);
                          }}
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

                  {/* Ligne expandable avec formulaire d'édition et FileManager */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0, border: 'none' }}>
                      <Collapse in={expandedRow === report.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
                          <Grid container spacing={3}>
                            {/* Colonne gauche : Formulaire d'édition */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Typography variant="h6" gutterBottom color="primary">
                                Éditer le rapport
                              </Typography>

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                  label="Libellé"
                                  value={editForm.label}
                                  onChange={(e) => handleFormChange('label', e.target.value)}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                />

                                <Autocomplete<ReportType>
                                  options={reportTypes || []}
                                  getOptionLabel={(option: ReportType) => `${option.name} (${option.code})`}
                                  value={reportTypes?.find(type => type.code === editForm.typeCode) || null}
                                  onChange={(_, newValue: ReportType | null) => handleFormChange('typeCode', newValue?.code || '')}
                                  renderInput={(params: any) => (
                                    <TextField
                                      {...params}
                                      label="Type de rapport"
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  renderOption={(props: any, option: ReportType) => (
                                    <Box component="li" {...props}>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {option.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Code: {option.code}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                />

                                <Autocomplete<Organization>
                                  options={organizations || []}
                                  getOptionLabel={(option: Organization) => `${option.name} (${organizationTypeLabels[option.type]})`}
                                  value={organizations?.find(org => org.id === editForm.organizationId) || null}
                                  onChange={(_, newValue: Organization | null) => handleFormChange('organizationId', newValue?.id || 0)}
                                  renderInput={(params: any) => (
                                    <TextField
                                      {...params}
                                      label="Organisation"
                                      size="small"
                                      variant="outlined"
                                    />
                                  )}
                                  renderOption={(props: any, option: Organization) => (
                                    <Box component="li" {...props}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                        <Box sx={{ flexGrow: 1 }}>
                                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {option.name}
                                          </Typography>
                                        </Box>
                                        <Chip
                                          size="small"
                                          label={organizationTypeLabels[option.type]}
                                          color={organizationTypeColors[option.type]}
                                          variant="outlined"
                                        />
                                      </Box>
                                    </Box>
                                  )}
                                />

                                <TextField
                                  label="Typologie"
                                  value={editForm.typologyCode}
                                  onChange={(e) => handleFormChange('typologyCode', e.target.value)}
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  placeholder="ERP, IGH, BUP, HAB..."
                                />

                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveEdit}
                                    size="small"
                                    sx={{
                                      background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                                      '&:hover': {
                                        background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                                      },
                                    }}
                                  >
                                    Sauvegarder
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancelEdit}
                                    size="small"
                                  >
                                    Annuler
                                  </Button>
                                </Box>
                              </Box>
                            </Grid>

                            {/* Colonne droite : Gestionnaire de fichiers */}
                            <Grid size={{ xs: 12, md: 6 }}>
                              <FileManager
                                entityType="report"
                                entityId={report.id}
                                title={`Fichiers du rapport`}
                                onFilesChange={loadReports}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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
        {selectedReport && (
          <>
            {!selectedReport.deletedAt && (
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
                Archiver
              </MenuItem>
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

      {/* Modal de création de rapport */}
      <ReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        reportTypes={reportTypes}
        organizations={organizations}
        interventionId={interventionId}
      />

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