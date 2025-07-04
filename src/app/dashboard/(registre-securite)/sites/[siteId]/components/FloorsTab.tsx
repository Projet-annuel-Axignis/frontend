/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import SearchFilters from '@/components/dashboard/SearchFilters';
import { buildingFloorService, buildingService } from '@/services/siteService';
import { Building, BuildingFloor, CreateBuildingFloorDto, UpdateBuildingFloorDto } from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Layers as LayersIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
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
import React, { useEffect, useState } from 'react';

interface FloorsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface FloorFormData {
  name: string;
  buildingId: number;
}

interface FloorFilters {
  search: string;
  buildingId: number | '';
  includeDeleted: boolean;
}

const FloorsTab: React.FC<FloorsTabProps> = ({ siteId, onNotification, disabled = false }) => {
  // Data states
  const [floors, setFloors] = useState<BuildingFloor[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredFloors, setFilteredFloors] = useState<BuildingFloor[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState<BuildingFloor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [floorToDelete, setFloorToDelete] = useState<BuildingFloor | null>(null);

  // Form state
  const [formData, setFormData] = useState<FloorFormData>({
    name: '',
    buildingId: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<FloorFormData>>({});

  // Filters state
  const [filters, setFilters] = useState<FloorFilters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Load data
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId]);

  // Filter floors when search, building filter, or includeDeleted changes
  useEffect(() => {
    filterFloors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [floors, filters.search, filters.buildingId, filters.includeDeleted]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load buildings for this site (including deleted ones to have complete data)
      const buildingsResponse = await buildingService.getBuildings({
        siteId,
        includeDeleted: true,
      });
      setBuildings(buildingsResponse.buildings);

      // Load all building floors for buildings in this site (including deleted ones)
      if (buildingsResponse.buildings.length > 0) {
        const floorsPromises = buildingsResponse.buildings.map(building =>
          buildingFloorService.getBuildingFloors({
            buildingId: building.id,
            includeDeleted: true,
          })
        );
        const floorsResponses = await Promise.all(floorsPromises);
        const allFloors = floorsResponses.flatMap(response => response.buildingFloors);
        setFloors(allFloors);
      } else {
        setFloors([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étages:', error);
      onNotification('Erreur lors du chargement des étages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterFloors = () => {
    let filtered = [...floors];

    // Filter by deleted status
    if (!filters.includeDeleted) {
      filtered = filtered.filter(floor => !floor.deletedAt);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(floor =>
        floor.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId !== '') {
      filtered = filtered.filter(floor => floor.building.id === Number(filters.buildingId));
    }

    setFilteredFloors(filtered);
  };

  const openCreateDialog = () => {
    setEditingFloor(null);
    const availableBuildings = buildings.filter(building => !building.deletedAt);
    setFormData({
      name: '',
      buildingId: availableBuildings.length > 0 ? availableBuildings[0].id : 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (floor: BuildingFloor) => {
    setEditingFloor(floor);
    setFormData({
      name: floor.name,
      buildingId: floor.building.id,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingFloor(null);
    setFormData({ name: '', buildingId: 0 });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<FloorFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom de l&apos;étage est requis';
    }

    if (!formData.buildingId) {
      errors.buildingId = 'Le bâtiment est requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingFloor) {
        // Update
        const updateData: UpdateBuildingFloorDto = {
          name: formData.name.trim(),
        };
        await buildingFloorService.updateBuildingFloor(editingFloor.id, updateData);
        onNotification('Étage modifié avec succès', 'success');
      } else {
        // Create
        const createData: CreateBuildingFloorDto = {
          name: formData.name.trim(),
          buildingId: formData.buildingId,
        };
        await buildingFloorService.createBuildingFloor(createData);
        onNotification('Étage créé avec succès', 'success');
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = (floor: BuildingFloor) => {
    setFloorToDelete(floor);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!floorToDelete) return;

    try {
      await buildingFloorService.deleteBuildingFloor(floorToDelete.id);
      onNotification('Étage supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      setFloorToDelete(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      onNotification('Erreur lors de la suppression', 'error');
    }
  };

  // Render mobile card view
  const renderCard = (floor: BuildingFloor) => (
    <Card key={floor.id} sx={{ mb: 2, opacity: floor.deletedAt ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: floor.deletedAt ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {floor.name}
          </Typography>
          <Chip
            size="small"
            label={floor.deletedAt ? 'Supprimé' : 'Actif'}
            color={floor.deletedAt ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Bâtiment :</strong> {floor.building.name}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Date de création :</strong> {new Date(floor.createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {!disabled && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => openEditDialog(floor)}
            disabled={!!floor.deletedAt}
          >
            Modifier
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(floor)}
            disabled={!!floor.deletedAt}
          >
            Supprimer
          </Button>
        </CardActions>
      )}
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography>Chargement des étages...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon />
          Gestion des Étages de Bâtiment
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={disabled}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={disabled || buildings.filter(b => !b.deletedAt).length === 0}
          >
            Nouvel Étage
          </Button>
        </Box>
      </Box>

      {buildings.filter(b => !b.deletedAt).length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucun bâtiment actif trouvé sur ce site. Vous devez d&apos;abord créer des bâtiments pour pouvoir ajouter des étages.
        </Alert>
      ) : (
        <>
          {/* Filters */}
          <SearchFilters
            searchValue={filters.search}
            onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            searchPlaceholder="Rechercher un étage..."
            selectValue={filters.buildingId}
            onSelectChange={(value) => setFilters(prev => ({
              ...prev,
              buildingId: value === '' ? '' : Number(value)
            }))}
            selectLabel="Bâtiment"
            selectOptions={buildings
              .filter(building => filters.includeDeleted || !building.deletedAt)
              .map(building => ({
                value: building.id,
                label: building.name
              }))}
            selectAllLabel="Tous les bâtiments"
            includeDeleted={filters.includeDeleted}
            onIncludeDeletedChange={(value) => setFilters(prev => ({ ...prev, includeDeleted: value }))}
            resultsCount={filteredFloors.length}
            resultsLabel="étage(s)"
          />

          {/* Content */}
          {filteredFloors.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <LayersIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {filters.search || filters.buildingId ? 'Aucun étage trouvé' : 'Aucun étage créé'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filters.search || filters.buildingId
                  ? "Aucun étage ne correspond à vos critères de recherche"
                  : "Commencez par créer votre premier étage"}
              </Typography>
              {!filters.search && !filters.buildingId && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  disabled={disabled}
                >
                  Créer le premier étage
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
                        <TableCell>Nom</TableCell>
                        <TableCell>Bâtiment</TableCell>
                        <TableCell>Date de création</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredFloors.map((floor) => (
                        <TableRow key={floor.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {floor.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BuildingIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {floor.building.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(floor.createdAt).toLocaleDateString('fr-FR')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={floor.deletedAt ? 'Supprimé' : 'Actif'}
                              color={floor.deletedAt ? 'error' : 'success'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(floor)}
                                  disabled={disabled || !!floor.deletedAt}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(floor)}
                                  disabled={disabled || !!floor.deletedAt}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Mobile Card View */}
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {filteredFloors.map(renderCard)}
              </Box>
            </>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingFloor ? 'Modifier l&apos;étage' : 'Créer un nouvel étage'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'étage *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="ex: Rez-de-chaussée, 1er étage, Sous-sol..."
            />

            <FormControl fullWidth error={!!formErrors.buildingId}>
              <InputLabel>Bâtiment *</InputLabel>
              <Select
                value={formData.buildingId}
                onChange={(e) => setFormData(prev => ({ ...prev, buildingId: Number(e.target.value) }))}
                label="Bâtiment *"
                disabled={!!editingFloor} // Can't change building when editing
              >
                {buildings
                  .filter(building => filters.includeDeleted || !building.deletedAt)
                  .map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
              </Select>
              {formErrors.buildingId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {formErrors.buildingId}
                </Typography>
              )}
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
            {editingFloor ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l&apos;étage &ldquo;{floorToDelete?.name}&rdquo; ?
            Cette action peut être annulée en restaurant l&apos;étage depuis les filtres.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FloorsTab; 