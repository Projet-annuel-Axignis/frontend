'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import interventionTypeService, { CreateInterventionTypeDto, InterventionType, UpdateInterventionTypeDto } from '@/services/interventionTypeService';
import {
  Add as AddIcon,
  Category as CategoryIcon
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
import InterventionTypeCard from './_components/InterventionTypeCard';
import InterventionTypeDialog from './_components/InterventionTypeDialog';
import InterventionTypeFilters from './_components/InterventionTypeFilters';
import InterventionTypeTable from './_components/InterventionTypeTable';

export default function InterventionTypesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // État des données
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [allInterventionTypes, setAllInterventionTypes] = useState<InterventionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // État des filtres
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // État des dialogues
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInterventionType, setSelectedInterventionType] = useState<InterventionType | null>(null);

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
    loadInterventionTypes();
  }, []);

  // Filtrage côté client
  useEffect(() => {
    // Vérification de sécurité pour s'assurer qu'allInterventionTypes est un tableau
    if (!Array.isArray(allInterventionTypes)) {
      setInterventionTypes([]);
      return;
    }

    let filtered = [...allInterventionTypes];

    // Filtre par recherche
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (type) =>
          type.name.toLowerCase().includes(searchLower) ||
          type.code.toLowerCase().includes(searchLower)
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof InterventionType];
      let bValue: any = b[sortBy as keyof InterventionType];

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

    setInterventionTypes(filtered);
  }, [allInterventionTypes, search, sortBy, sortOrder]);

  const loadInterventionTypes = async () => {
    try {
      setIsLoading(true);
      const response = await interventionTypeService.getInterventionTypes({
        limit: 1000,
        page: 1,
        search: '',
        sortBy: 'name',
        sortOrder: 'asc'
      });
      // response est déjà de type InterventionTypeResponse avec { data, total, page, limit }
      setAllInterventionTypes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types d\'intervention:', error);
      showNotification('Erreur lors du chargement des types d\'intervention', 'error');
      setAllInterventionTypes([]); // S'assurer qu'on a toujours un tableau
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setNotification({ open: true, message, severity });
  };

  const handleCreateInterventionType = async (data: CreateInterventionTypeDto | UpdateInterventionTypeDto) => {
    try {
      await interventionTypeService.createInterventionType(data as CreateInterventionTypeDto);
      showNotification('Type d\'intervention créé avec succès', 'success');
      loadInterventionTypes();
    } catch {
      throw new Error('Erreur lors de la création du type d\'intervention');
    }
  };

  const handleEditInterventionType = async (data: CreateInterventionTypeDto | UpdateInterventionTypeDto) => {
    if (!selectedInterventionType) return;

    try {
      await interventionTypeService.updateInterventionType(selectedInterventionType.code, data as UpdateInterventionTypeDto);
      showNotification('Type d\'intervention modifié avec succès', 'success');
      loadInterventionTypes();
    } catch {
      throw new Error('Erreur lors de la modification du type d\'intervention');
    }
  };

  const handleDeleteInterventionType = async () => {
    if (!selectedInterventionType) return;

    try {
      await interventionTypeService.deleteInterventionType(selectedInterventionType.code);
      showNotification('Type d\'intervention supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      setSelectedInterventionType(null);
      loadInterventionTypes();
    } catch {
      showNotification('Erreur lors de la suppression du type d\'intervention', 'error');
    }
  };

  const handleEdit = (interventionType: InterventionType) => {
    setSelectedInterventionType(interventionType);
    setEditDialogOpen(true);
  };

  const handleDelete = (interventionType: InterventionType) => {
    setSelectedInterventionType(interventionType);
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
        title="Types d'intervention"
        icon={<CategoryIcon />}
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
                {interventionTypes.length} type{interventionTypes.length > 1 ? 's' : ''} d&apos;intervention
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gérez les types d&apos;intervention pour classifier vos interventions
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
          <InterventionTypeFilters
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
              {interventionTypes.map((interventionType) => (
                <Grid size={{ xs: 12, sm: 6 }} key={interventionType.id}>
                  <InterventionTypeCard
                    interventionType={interventionType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <InterventionTypeTable
              interventionTypes={interventionTypes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog de création */}
      <InterventionTypeDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateInterventionType}
        isLoading={isLoading}
      />

      {/* Dialog d'édition */}
      <InterventionTypeDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedInterventionType(null);
        }}
        onSubmit={handleEditInterventionType}
        interventionType={selectedInterventionType || undefined}
        isLoading={isLoading}
      />

      {/* Dialog de confirmation de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le type d&apos;intervention &quot;{selectedInterventionType?.name}&quot; ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDeleteInterventionType}
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