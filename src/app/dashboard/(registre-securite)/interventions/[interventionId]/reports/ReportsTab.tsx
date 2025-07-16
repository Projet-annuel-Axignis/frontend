'use client';

import SearchFilters from '@/components/dashboard/SearchFilters';
import { equipmentService } from '@/services/equipmentService';
import organizationService from '@/services/organizationService';
import reportService from '@/services/reportService';
import reportTypeService from '@/services/reportTypeService';
import { EquipmentType } from '@/types/equipment';
import { CreateReportDto, Organization, OrganizationType, Report, ReportType, UpdateReportDto } from '@/types/intervention';
import { Typologies } from '@/types/site';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
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
import React, { useEffect, useState } from 'react';
import FileList from '../_components/FileList';
import FileUpload from '../_components/FileUpload';
import ObservationsManager from '../_components/ObservationsManager';
import ReportDialog from '../_components/ReportDialog';

const organizationTypeLabels: Record<OrganizationType, string> = {
  OA: 'Organisme Agréé',
  TC: 'Tiers Compétent'
};

const organizationTypeColors: Record<OrganizationType, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  OA: 'primary',
  TC: 'secondary'
};

const TIPOLOGY_CODES: Typologies[] = [
  { code: 'ERP', description: 'Établissement Recevant du Public' },
  { code: 'IGH', description: 'Immeuble de Grande Hauteur' },
  { code: 'BUP', description: 'Bâtiment à Utilisation Professionnelle' },
  { code: 'HAB', description: 'Bâtiment d\'Habitation' },
];


interface ReportsTabProps {
  interventionId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface ReportFilters {
  search: string;
  typeCode: string;
  organizationId: string;
  includeDeleted: boolean;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ interventionId, onNotification, disabled = false }) => {
  // Data states
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  // Expandable rows state
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'files' | 'observations'>('edit');
  const [editForm, setEditForm] = useState<UpdateReportDto>({
    label: '',
    typeCode: '',
    organizationId: 0,
    typologyCode: '',
    equipmentIds: []
  });

  // Filters state
  const [filters, setFilters] = useState<ReportFilters>({
    search: '',
    typeCode: '',
    organizationId: '',
    includeDeleted: false,
  });

  // Load data
  useEffect(() => {
    if (interventionId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  // Filter reports when filters change
  useEffect(() => {
    filterReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports, filters.search, filters.typeCode, filters.organizationId, filters.includeDeleted]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadReports(), loadReferenceData(), loadEquipmentTypes()]);
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    try {
      const result = await reportService.getReports({
        interventionId,
        includeDeleted: true,
      });
      setReports(result.reports);
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
      onNotification('Erreur lors du chargement des rapports', 'error');
    }
  };

  const loadEquipmentTypes = async () => {
    try {
      const result = await equipmentService.getTypes();
      setEquipmentTypes(result.results);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'équipements:', error);
      onNotification('Erreur lors du chargement des types d\'équipements', 'error');
    }
  };

  const loadReferenceData = async () => {
    try {
      // Charger les types de rapport
      const reportTypesResponse = await reportTypeService.getReportTypes({
        limit: 1000,
        page: 1,
        sortOrder: 'asc',
        sortBy: 'name'
      });
      setReportTypes(reportTypesResponse.data);

      // Charger les organisations
      const organizationsResponse = await organizationService.getOrganizations({
        limit: 1000,
        page: 1,
        sortOrder: 'asc',
        sortBy: 'name'
      });
      setOrganizations(organizationsResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données de référence:', error);
      onNotification('Erreur lors du chargement des données de référence', 'error');
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Filter by deleted status
    if (!filters.includeDeleted) {
      filtered = filtered.filter(report => !report.deletedAt);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report =>
        report.label.toLowerCase().includes(searchLower) ||
        report.type.name.toLowerCase().includes(searchLower) ||
        report.organization.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (filters.typeCode !== '') {
      filtered = filtered.filter(report => report.type.code === filters.typeCode);
    }

    // Filter by organization
    if (filters.organizationId !== '') {
      filtered = filtered.filter(report => report.organization.id === Number(filters.organizationId));
    }

    setFilteredReports(filtered);
  };

  const openCreateDialog = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateSubmit = async (data: CreateReportDto) => {
    try {
      await reportService.createReport(data);
      onNotification('Rapport créé avec succès', 'success');
      await loadReports();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      onNotification('Erreur lors de la création du rapport', 'error');
    }
  };

  // Gestion des lignes expandables
  const handleRowClick = (report: Report) => {
    if (expandedRow === report.id) {
      // Fermer la ligne si elle est déjà ouverte
      setExpandedRow(null);
    } else {
      // Ouvrir la ligne et initialiser le formulaire d'édition
      setExpandedRow(report.id);
      setEditForm({
        label: report.label,
        typeCode: report.type.code,
        organizationId: report.organization.id,
        typologyCode: report.typology.code,
        equipmentIds: report.equipments?.map(equipment => equipment.equipmentId) || []
      });
    }
  };

  const handleDelete = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const handleRestore = async (report: Report) => {
    try {
      await reportService.restoreReport(report.id);
      await loadReports();
      onNotification('Rapport restauré avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      onNotification('Erreur lors de la restauration du rapport', 'error');
    }
  };

  const confirmDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      await reportService.deleteReport(reportToDelete.id);
      await loadReports();
      onNotification('Rapport archivé avec succès', 'success');
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Erreur lors de l\'archivage:', error);
      onNotification('Erreur lors de l\'archivage du rapport', 'error');
    }
  };

  // Render mobile card view
  const renderCard = (report: Report) => (
    <Card key={report.id} sx={{ mb: 2, opacity: report.deletedAt ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: report.deletedAt ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {report.label}
          </Typography>
          <Chip
            size="small"
            label={report.deletedAt ? 'Archivé' : 'Actif'}
            color={report.deletedAt ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Type :</strong> {report.type.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Organisation :</strong> {report.organization.name}
              </Typography>
              <Chip
                size="small"
                label={organizationTypeLabels[report.organization.type]}
                color={organizationTypeColors[report.organization.type]}
                variant="outlined"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Typologie :</strong> {report.typology.description}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Date de création :</strong> {format(new Date(report.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {!disabled && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleRowClick(report)}
            disabled={!!report.deletedAt}
          >
            Modifier
          </Button>
          {!report.deletedAt ? (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(report)}
            >
              Archiver
            </Button>
          ) : (
            <Button
              size="small"
              startIcon={<RestoreIcon />}
              onClick={() => handleRestore(report)}
            >
              Restaurer
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentIcon />
          Gestion des Rapports
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={disabled || loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={disabled}
            sx={{
              minWidth: 'auto',
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

      {/* Filters */}
      <SearchFilters
        searchValue={filters.search}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
        searchPlaceholder="Rechercher un rapport..."
        selectValue={filters.typeCode}
        onSelectChange={(value) => setFilters(prev => ({ ...prev, typeCode: String(value) }))}
        selectLabel="Type de rapport"
        selectOptions={reportTypes.map(type => ({
          value: type.code,
          label: type.name
        }))}
        selectAllLabel="Tous les types"
        includeDeleted={filters.includeDeleted}
        onIncludeDeletedChange={(value) => setFilters(prev => ({ ...prev, includeDeleted: value }))}
        resultsCount={filteredReports.length}
        resultsLabel="rapport(s)"
        secondSelectValue={filters.organizationId}
        onSecondSelectChange={(value) => setFilters(prev => ({
          ...prev,
          organizationId: String(value)
        }))}
        secondSelectLabel="Organisation"
        secondSelectOptions={organizations.map(org => ({
          value: org.id,
          label: `${org.name} (${organizationTypeLabels[org.type]})`
        }))}
        secondSelectAllLabel="Toutes les organisations"
      />

      {/* Content */}
      {!loading && filteredReports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {filters.search || filters.typeCode || filters.organizationId ? 'Aucun rapport trouvé' : 'Aucun rapport créé'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filters.search || filters.typeCode || filters.organizationId
              ? "Aucun rapport ne correspond à vos critères de recherche"
              : "Commencez par créer votre premier rapport"}
          </Typography>
          {!filters.search && !filters.typeCode && !filters.organizationId && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateDialog}
              disabled={disabled}
            >
              Créer le premier rapport
            </Button>
          )}
        </Paper>
      ) : (
        <>
          {/* Desktop Table View */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Libellé</TableCell>
                    <TableCell>Type d&apos;équipements</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Organisation</TableCell>
                    <TableCell>Typologie</TableCell>
                    <TableCell>Date de création</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={32} />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          Chargement des rapports...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredReports.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          Aucun rapport trouvé
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.typeCode || filters.organizationId
                            ? "Aucun rapport ne correspond à vos critères de recherche"
                            : "Commencez par créer votre premier rapport"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReports.map((report) => (
                      <React.Fragment key={report.id}>
                        <TableRow hover sx={{ opacity: report.deletedAt ? 0.6 : 1, cursor: 'pointer' }} onClick={() => handleRowClick(report)}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {expandedRow === report.id ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                              <Typography variant="body2" fontWeight="medium">
                                {report.label}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {report.equipments?.map(equipment => equipment.equipmentType.title).join(', ')}
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
                          <TableCell>
                            <Chip
                              size="small"
                              label={report.deletedAt ? 'Archivé' : 'Actif'}
                              color={report.deletedAt ? 'error' : 'success'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  onClick={e => { e.stopPropagation(); handleRowClick(report); }}
                                  disabled={disabled || !!report.deletedAt}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              {!report.deletedAt ? (
                                <Tooltip title="Archiver">
                                  <IconButton
                                    size="small"
                                    onClick={e => { e.stopPropagation(); handleDelete(report); }}
                                    disabled={disabled}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Restaurer">
                                  <IconButton
                                    size="small"
                                    onClick={e => { e.stopPropagation(); handleRestore(report); }}
                                    disabled={disabled}
                                  >
                                    <RestoreIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                        {/* Ligne extensible */}
                        <TableRow>
                          <TableCell colSpan={7} sx={{ p: 0, border: 'none', background: 'grey.50' }}>
                            <Collapse in={expandedRow === report.id} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Typography variant="h6" gutterBottom color="primary" sx={{ mb: 3 }}>
                                  Détails du rapport
                                </Typography>

                                {/* Onglets pour organiser le contenu */}
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                      variant="text"
                                      size="small"
                                      onClick={() => setActiveTab('edit')}
                                      sx={{
                                        color: activeTab === 'edit' ? 'primary.main' : 'text.secondary',
                                        borderBottom: activeTab === 'edit' ? '2px solid' : 'none',
                                        borderColor: 'primary.main',
                                        borderRadius: 0,
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                          color: 'primary.main',
                                          backgroundColor: 'transparent'
                                        }
                                      }}
                                    >
                                      Édition
                                    </Button>
                                    <Button
                                      variant="text"
                                      size="small"
                                      onClick={() => setActiveTab('files')}
                                      sx={{
                                        color: activeTab === 'files' ? 'primary.main' : 'text.secondary',
                                        borderBottom: activeTab === 'files' ? '2px solid' : 'none',
                                        borderColor: 'primary.main',
                                        borderRadius: 0,
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                          color: 'primary.main',
                                          backgroundColor: 'transparent'
                                        }
                                      }}
                                    >
                                      Fichiers
                                    </Button>
                                    <Button
                                      variant="text"
                                      size="small"
                                      onClick={() => setActiveTab('observations')}
                                      sx={{
                                        color: activeTab === 'observations' ? 'primary.main' : 'text.secondary',
                                        borderBottom: activeTab === 'observations' ? '2px solid' : 'none',
                                        borderColor: 'primary.main',
                                        borderRadius: 0,
                                        px: 2,
                                        py: 1,
                                        '&:hover': {
                                          color: 'primary.main',
                                          backgroundColor: 'transparent'
                                        }
                                      }}
                                    >
                                      Observations
                                    </Button>
                                  </Box>
                                </Box>

                                {/* Contenu des onglets */}
                                {activeTab === 'edit' && (
                                  <Grid container spacing={3}>
                                    {/* Onglet Édition */}
                                    <Grid size={{ xs: 12 }}>
                                      <Typography variant="subtitle1" gutterBottom color="primary">
                                        Éditer le rapport
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
                                        <TextField
                                          label="Libellé"
                                          value={editForm.label}
                                          onChange={(e) => setEditForm(f => ({ ...f, label: e.target.value }))}
                                          fullWidth
                                          variant="outlined"
                                          size="small"
                                        />

                                        <Autocomplete
                                          multiple
                                          options={equipmentTypes || []}
                                          getOptionLabel={(option: EquipmentType) => `${option.title} (${option.serialNumber})`}
                                          value={equipmentTypes?.filter(type => editForm.equipmentIds?.includes(Number(type.id))) || []}
                                          onChange={(_, newValue) => {
                                            const equipmentIds = newValue.map((type: EquipmentType) => Number(type.id));
                                            setEditForm(f => ({ ...f, equipmentIds }));
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Types d'équipements"
                                              size="small"
                                              variant="outlined"
                                              placeholder="Sélectionner les types d'équipements..."
                                            />
                                          )}
                                          renderValue={(value, getTagProps) =>
                                            value.map((option, index) => (
                                              <Chip
                                                {...getTagProps({ index })}
                                                key={option.id}
                                                label={`${option.title} (${option.serialNumber})`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                              />
                                            ))
                                          }
                                        />

                                        <Autocomplete<ReportType>
                                          options={reportTypes || []}
                                          getOptionLabel={(option: ReportType) => `${option.name} (${option.code})`}
                                          value={reportTypes?.find(type => type.code === editForm.typeCode) || null}
                                          onChange={(_, newValue: ReportType | null) => setEditForm(f => ({ ...f, typeCode: newValue?.code || '' }))}
                                          renderInput={(params: any) => (
                                            <TextField
                                              {...params}
                                              label="Type de rapport"
                                              size="small"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                        <Autocomplete<Organization>
                                          options={organizations || []}
                                          getOptionLabel={(option: Organization) => `${option.name} (${organizationTypeLabels[option.type]})`}
                                          value={organizations?.find(org => org.id === editForm.organizationId) || null}
                                          onChange={(_, newValue: Organization | null) => setEditForm(f => ({ ...f, organizationId: newValue?.id || 0 }))}
                                          renderInput={(params: any) => (
                                            <TextField
                                              {...params}
                                              label="Organisation"
                                              size="small"
                                              variant="outlined"
                                            />
                                          )}
                                        />
                                        <Autocomplete
                                          freeSolo
                                          options={TIPOLOGY_CODES}
                                          value={TIPOLOGY_CODES.find(typology => typology.code === editForm.typologyCode) || editForm.typologyCode}
                                          onChange={(_, newValue: Typologies | string | null) => {
                                            const code = typeof newValue === 'string' ? newValue : newValue?.code || '';
                                            setEditForm(f => ({ ...f, typologyCode: code }));
                                          }}
                                          onInputChange={(_, newInputValue) => setEditForm(f => ({ ...f, typologyCode: newInputValue }))}
                                          getOptionLabel={(option) => {
                                            if (typeof option === 'string') return option;
                                            return `${option.code} - ${option.description}`;
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Typologie"
                                              size="small"
                                              variant="outlined"
                                              placeholder="ERP, IGH, BUP, HAB..."
                                            />
                                          )}
                                        />
                                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={async () => {
                                              await reportService.updateReport(report.id, editForm);
                                              onNotification('Rapport modifié avec succès', 'success');
                                              await loadReports();
                                              setExpandedRow(null);
                                            }}
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
                                            onClick={() => {
                                              setExpandedRow(null);
                                            }}
                                            size="small"
                                          >
                                            Annuler
                                          </Button>
                                        </Box>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                )}

                                {activeTab === 'files' && (
                                  <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                      <Typography variant="subtitle1" gutterBottom color="primary">
                                        Gestion des fichiers
                                      </Typography>
                                      <FileUpload
                                        entityType="report"
                                        entityId={report.id}
                                        onUploadComplete={loadReports}
                                      />
                                      <FileList
                                        entityType="report"
                                        entityId={report.id}
                                        title="Fichiers du rapport"
                                        onFilesChange={loadReports}
                                      />
                                    </Grid>
                                  </Grid>
                                )}

                                {activeTab === 'observations' && (
                                  <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                      <ObservationsManager
                                        reportId={report.id}
                                        onObservationsChange={loadReports}
                                      />
                                    </Grid>
                                  </Grid>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={32} />
                <Typography variant="body1" sx={{ ml: 2 }}>
                  Chargement des rapports...
                </Typography>
              </Box>
            ) : (
              filteredReports.map(renderCard)
            )}
          </Box>
        </>
      )}

      {/* Create Dialog */}
      <ReportDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        reportTypes={reportTypes}
        organizations={organizations}
        interventionId={interventionId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer l&apos;archivage</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir archiver le rapport &ldquo;{reportToDelete?.label}&rdquo; ?
            Cette action peut être annulée en restaurant le rapport depuis les filtres.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={confirmDeleteReport} color="error" variant="contained">
            Archiver
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsTab; 