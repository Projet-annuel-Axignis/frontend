'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import reportTypeService, { CreateReportTypeDto, ReportType, UpdateReportTypeDto } from '@/services/reportTypeService';
import {
  Add as AddIcon,
  Description as DescriptionIcon
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
import ReportTypeCard from './_components/ReportTypeCard';
import ReportTypeDialog from './_components/ReportTypeDialog';
import ReportTypeFilters from './_components/ReportTypeFilters';
import ReportTypeTable from './_components/ReportTypeTable';

export default function ReportTypesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // État des données
  const [reportTypes, setReportTypes] = useState<ReportType[]>([]);
  const [allReportTypes, setAllReportTypes] = useState<ReportType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // État des filtres
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // État des dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);

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
    loadReportTypes();
  }, []);

  // Filtrage côté client
  useEffect(() => {
    let filtered = [...allReportTypes];

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (reportType) =>
          reportType.name.toLowerCase().includes(searchLower) ||
          reportType.code.toLowerCase().includes(searchLower) ||
          (reportType.description && reportType.description.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par statut
    if (isActive !== undefined) {
      filtered = filtered.filter((reportType) => reportType.isActive === isActive);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof ReportType];
      let bValue: any = b[sortBy as keyof ReportType];

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

    setReportTypes(filtered);
  }, [allReportTypes, search, isActive, sortBy, sortOrder]);

  const loadReportTypes = async () => {
    try {
      setIsLoading(true);
      const response = await reportTypeService.getReportTypes({
        limit: 1000,
        page: 1,
        search: '',
        isActive: undefined,
        sortBy: 'name',
        sortOrder: 'asc'
      });
      setAllReportTypes(response.data);
    } catch {
      showNotification('Erreur lors du chargement des types de rapport', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateReportType = async (data: CreateReportTypeDto | UpdateReportTypeDto) => {
    try {
      await reportTypeService.createReportType(data as CreateReportTypeDto);
      showNotification('Type de rapport créé avec succès', 'success');
      loadReportTypes();
    } catch {
      throw new Error('Erreur lors de la création du type de rapport');
    }
  };

  const handleEditReportType = async (data: CreateReportTypeDto | UpdateReportTypeDto) => {
    if (!selectedReportType) return;

    try {
      await reportTypeService.updateReportType(selectedReportType.code, data as UpdateReportTypeDto);
      showNotification('Type de rapport modifié avec succès', 'success');
      loadReportTypes();
    } catch {
      throw new Error('Erreur lors de la modification du type de rapport');
    }
  };

  const handleDeleteReportType = async () => {
    if (!selectedReportType) return;

    try {
      await reportTypeService.deleteReportType(selectedReportType.code);
      showNotification('Type de rapport supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      setSelectedReportType(null);
      loadReportTypes();
    } catch {
      showNotification('Erreur lors de la suppression du type de rapport', 'error');
    }
  };

  const handleEdit = (reportType: ReportType) => {
    setSelectedReportType(reportType);
    setEditDialogOpen(true);
  };

  const handleToggleStatus = (reportType: ReportType) => {
    setSelectedReportType(reportType);
    setDeleteDialogOpen(true);
  };

  const resetFilters = () => {
    setSearch('');
    setIsActive(undefined);
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <Box sx={{ p: 3 }}>
      <DashBoardHeader
        title="Types de rapport"
        icon={<DescriptionIcon />}
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
                {reportTypes.length} type{reportTypes.length > 1 ? 's' : ''} de rapport
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez les types de rapport de votre organisation
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #667eea 60%, #764ba2 100%)',
                }
              }}
            >
              {isMobile ? 'Ajouter' : 'Ajouter un type'}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filtres */}
          <ReportTypeFilters
            search={search}
            onSearchChange={setSearch}
            isActive={isActive}
            onIsActiveChange={setIsActive}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onReset={resetFilters}
          />

          {/* Vue conditionnelle desktop/mobile */}
          {isMobile ? (
            <Grid container spacing={2}>
              {reportTypes.map((reportType) => (
                <Grid size={{ xs: 12, sm: 6 }} key={reportType.id}>
                  <ReportTypeCard
                    reportType={reportType}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <ReportTypeTable
              reportTypes={reportTypes}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <ReportTypeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateReportType}
        isLoading={isLoading}
      />

      {/* Dialog d'édition */}
      <ReportTypeDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedReportType(null);
        }}
        onSubmit={handleEditReportType}
        reportType={selectedReportType || undefined}
        isLoading={isLoading}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le type de rapport &quot;{selectedReportType?.name}&quot; ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteReportType}
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