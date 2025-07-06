/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import SearchFilters from '@/components/dashboard/SearchFilters';
import { buildingFloorService, buildingService, lotService, partFloorService } from '@/services/siteService';
import { Building, BuildingFloor, CreateLotDto, Lot, PartFloor, UpdateLotDto } from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
  Layers as LayersIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon
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
import { useEffect, useState } from 'react';

interface LotsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface LotFormData {
  name: string;
  buildingId: number;
  buildingFloorId: number;
  partFloorId?: number;
}

interface LotFilters {
  search: string;
  buildingId: number | '';
  includeDeleted: boolean;
}

const LotsTab = ({ siteId, onNotification, disabled = false }: LotsTabProps) => {
  // Data states
  const [lots, setLots] = useState<Lot[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildingFloors, setBuildingFloors] = useState<BuildingFloor[]>([]);
  const [partFloors, setPartFloors] = useState<PartFloor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredLots, setFilteredLots] = useState<Lot[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);

  // Form state
  const [formData, setFormData] = useState<LotFormData>({
    name: '',
    buildingId: 0,
    buildingFloorId: 0,
    partFloorId: undefined,
  });
  const [formErrors, setFormErrors] = useState<Partial<LotFormData>>({});

  // Filters state
  const [filters, setFilters] = useState<LotFilters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Available options for form
  const [availableBuildingFloors, setAvailableBuildingFloors] = useState<BuildingFloor[]>([]);
  const [availablePartFloors, setAvailablePartFloors] = useState<PartFloor[]>([]);

  // Load data
  useEffect(() => {
    loadData();
  }, [siteId]);

  // Filter lots when search, building filter, or includeDeleted changes
  useEffect(() => {
    filterLots();
  }, [lots, filters.search, filters.buildingId, filters.includeDeleted]);

  // Update available building floors when building changes
  useEffect(() => {
    updateAvailableBuildingFloors();
  }, [formData.buildingId, buildingFloors]);

  // Update available part floors when building floor changes
  useEffect(() => {
    updateAvailablePartFloors();
  }, [formData.buildingFloorId, partFloors]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load buildings for this site (including deleted ones to have complete data)
      const buildingsResponse = await buildingService.getBuildings({
        siteId,
        includeDeleted: true,
      });
      setBuildings(buildingsResponse.buildings);

      // Load all building floors and part floors for buildings in this site
      if (buildingsResponse.buildings.length > 0) {
        const [floorsPromises, partFloorsPromises, lotsResponse] = await Promise.all([
          Promise.all(buildingsResponse.buildings.map(building =>
            buildingFloorService.getBuildingFloors({
              buildingId: building.id,
              includeDeleted: true,
            })
          )),
          Promise.all(buildingsResponse.buildings.map(building =>
            partFloorService.getPartFloors({
              buildingId: building.id,
              includeDeleted: true,
            })
          )),
          lotService.getLots({
            siteId,
            includeDeleted: true,
          })
        ]);

        const allBuildingFloors = floorsPromises.flatMap(response => response.buildingFloors);
        const allPartFloors = partFloorsPromises.flatMap(response => response.partFloors);

        setBuildingFloors(allBuildingFloors);
        setPartFloors(allPartFloors);
        setLots(lotsResponse.lots);
      } else {
        setBuildingFloors([]);
        setPartFloors([]);
        setLots([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des lots:', error);
      onNotification('Erreur lors du chargement des lots', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailableBuildingFloors = () => {
    if (formData.buildingId) {
      const floorsForBuilding = buildingFloors.filter(
        floor => floor.building.id === formData.buildingId && !floor.deletedAt
      );
      setAvailableBuildingFloors(floorsForBuilding);

      // Reset building floor selection if current selection is not available
      if (formData.buildingFloorId && !floorsForBuilding.find(f => f.id === formData.buildingFloorId)) {
        setFormData(prev => ({ ...prev, buildingFloorId: 0, partFloorId: undefined }));
      }
    } else {
      setAvailableBuildingFloors([]);
    }
  };

  const updateAvailablePartFloors = () => {
    if (formData.buildingFloorId) {
      const partFloorsForBuildingFloor = partFloors.filter(
        partFloor => partFloor.buildingFloor.id === formData.buildingFloorId && !partFloor.deletedAt
      );
      setAvailablePartFloors(partFloorsForBuildingFloor);

      // Reset part floor selection if current selection is not available
      if (formData.partFloorId && !partFloorsForBuildingFloor.find(pf => pf.id === formData.partFloorId)) {
        setFormData(prev => ({ ...prev, partFloorId: undefined }));
      }
    } else {
      setAvailablePartFloors([]);
      setFormData(prev => ({ ...prev, partFloorId: undefined }));
    }
  };

  const filterLots = () => {
    let filtered = [...lots];

    // Filter by deleted status
    if (!filters.includeDeleted) {
      filtered = filtered.filter(lot => !lot.deletedAt);
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId !== '') {
      filtered = filtered.filter(lot => lot.building.id === Number(filters.buildingId));
    }

    setFilteredLots(filtered);
  };

  const openCreateDialog = () => {
    setEditingLot(null);
    const availableBuildings = buildings.filter(building => !building.deletedAt);
    setFormData({
      name: '',
      buildingId: availableBuildings.length > 0 ? availableBuildings[0].id : 0,
      buildingFloorId: 0,
      partFloorId: undefined,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (lot: Lot) => {
    setEditingLot(lot);
    setFormData({
      name: lot.name,
      buildingId: lot.building.id,
      buildingFloorId: lot.buildingFloor.id,
      partFloorId: lot.partFloor?.id,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingLot(null);
    setFormData({ name: '', buildingId: 0, buildingFloorId: 0, partFloorId: undefined });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<LotFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom du lot est requis';
    }

    if (!formData.buildingId) {
      errors.buildingId = 'Le bâtiment est requis';
    }

    if (!formData.buildingFloorId) {
      errors.buildingFloorId = 'L&apos;étage de bâtiment est requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingLot) {
        // Update
        const updateData: UpdateLotDto = {
          name: formData.name.trim(),
          partFloorId: formData.partFloorId || null,
        };
        await lotService.updateLot(editingLot.id, updateData);
        onNotification('Lot modifié avec succès', 'success');
      } else {
        // Create
        const createData: CreateLotDto = {
          name: formData.name.trim(),
          buildingId: formData.buildingId,
          buildingFloorId: formData.buildingFloorId,
          partFloorId: formData.partFloorId || undefined,
        };
        await lotService.createLot(createData);
        onNotification('Lot créé avec succès', 'success');
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = (lot: Lot) => {
    setLotToDelete(lot);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!lotToDelete) return;

    try {
      await lotService.deleteLot(lotToDelete.id);
      onNotification('Lot supprimé avec succès', 'success');
      setDeleteDialogOpen(false);
      setLotToDelete(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      onNotification('Erreur lors de la suppression', 'error');
    }
  };

  // Render mobile card view
  const renderCard = (lot: Lot) => (
    <Card key={lot.id} sx={{ mb: 2, opacity: lot.deletedAt ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: lot.deletedAt ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {lot.name}
          </Typography>
          <Chip
            size="small"
            label={lot.deletedAt ? 'Supprimé' : 'Actif'}
            color={lot.deletedAt ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Bâtiment :</strong> {lot.building.name}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Étage de bâtiment :</strong> {lot.buildingFloor.name}
            </Typography>
          </Grid>

          {lot.partFloor && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Étage de partie :</strong> {lot.partFloor.name}
              </Typography>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Date de création :</strong> {new Date(lot.createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {!disabled && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => openEditDialog(lot)}
            disabled={!!lot.deletedAt}
          >
            Modifier
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(lot)}
            disabled={!!lot.deletedAt}
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
        <Typography>Chargement des lots...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon />
          Gestion des Lots
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
            sx={{
              minWidth: 'auto',
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            Nouveau Lot
          </Button>
        </Box>
      </Box>

      {buildings.filter(b => !b.deletedAt).length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucun bâtiment actif trouvé sur ce site. Vous devez d&apos;abord créer des bâtiments pour pouvoir ajouter des lots.
        </Alert>
      ) : (
        <>
          {/* Filters */}
          <SearchFilters
            searchValue={filters.search}
            onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            searchPlaceholder="Rechercher un lot..."
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
            resultsCount={filteredLots.length}
            resultsLabel="lot(s)"
          />

          {/* Content */}
          {filteredLots.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {filters.search || filters.buildingId ? 'Aucun lot trouvé' : 'Aucun lot créé'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filters.search || filters.buildingId
                  ? "Aucun lot ne correspond à vos critères de recherche"
                  : "Commencez par créer votre premier lot"}
              </Typography>
              {!filters.search && !filters.buildingId && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  sx={{
                    background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                    '&:hover': {
                      background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                    },
                  }}
                >
                  Créer le premier lot
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
                        <TableCell>Étage de bâtiment</TableCell>
                        <TableCell>Étage de partie</TableCell>
                        <TableCell>Date de création</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredLots.map((lot) => (
                        <TableRow key={lot.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {lot.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <BuildingIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {lot.building.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LayersIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {lot.buildingFloor.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {lot.partFloor ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ViewModuleIcon fontSize="small" color="action" />
                                <Typography variant="body2">
                                  {lot.partFloor.name}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Aucun
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(lot.createdAt).toLocaleDateString('fr-FR')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={lot.deletedAt ? 'Supprimé' : 'Actif'}
                              color={lot.deletedAt ? 'error' : 'success'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                              <Tooltip title="Modifier">
                                <IconButton
                                  size="small"
                                  onClick={() => openEditDialog(lot)}
                                  disabled={disabled || !!lot.deletedAt}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDelete(lot)}
                                  disabled={disabled || !!lot.deletedAt}
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
                {filteredLots.map(renderCard)}
              </Box>
            </>
          )}
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLot ? 'Modifier le lot' : 'Créer un nouveau lot'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom du lot *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="ex: Local commercial A, Appartement 101, Bureau 203..."
            />

            <FormControl fullWidth error={!!formErrors.buildingId}>
              <InputLabel>Bâtiment *</InputLabel>
              <Select
                value={formData.buildingId}
                onChange={(e) => setFormData(prev => ({ ...prev, buildingId: Number(e.target.value), buildingFloorId: 0, partFloorId: undefined }))}
                label="Bâtiment *"
                disabled={!!editingLot} // Can't change building when editing
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

            <FormControl fullWidth error={!!formErrors.buildingFloorId}>
              <InputLabel>Étage de bâtiment *</InputLabel>
              <Select
                value={formData.buildingFloorId}
                onChange={(e) => setFormData(prev => ({ ...prev, buildingFloorId: Number(e.target.value), partFloorId: undefined }))}
                label="Étage de bâtiment *"
                disabled={!formData.buildingId || (!!editingLot)} // Can't change building floor when editing
              >
                {availableBuildingFloors.map((floor) => (
                  <MenuItem key={floor.id} value={floor.id}>
                    {floor.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.buildingFloorId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {formErrors.buildingFloorId}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Étage de partie (optionnel)</InputLabel>
              <Select
                value={formData.partFloorId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, partFloorId: e.target.value ? Number(e.target.value) : undefined }))}
                label="Étage de partie (optionnel)"
                disabled={!formData.buildingFloorId}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                {availablePartFloors.map((partFloor) => (
                  <MenuItem key={partFloor.id} value={partFloor.id}>
                    {partFloor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              minWidth: 'auto',
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            {editingLot ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le lot &ldquo;{lotToDelete?.name}&rdquo; ?
            Cette action peut être annulée en restaurant le lot depuis les filtres.
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

export default LotsTab; 