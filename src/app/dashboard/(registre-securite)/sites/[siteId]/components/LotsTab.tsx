/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import {
  buildingFloorService,
  buildingService,
  lotService,
  partFloorService,
  partService
} from '@/services/siteService';
import {
  Building,
  BuildingFloor,
  BuildingPart,
  CreateLotDto,
  Lot,
  PartFloor,
  UpdateLotDto
} from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Inventory as InventoryIcon,
  Layers as LayersIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
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

interface LotsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface LotFormData {
  name: string;
  buildingId: number;
  buildingFloorId: number;
  partFloorId: number;
}

interface LotFilters {
  search: string;
  buildingId: number | '';
  includeDeleted: boolean;
}

// Type temporaire pour la cohérence avec notre structure simplifiée
interface BuildingPart {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  buildingId: number;
}

interface HierarchyData {
  buildings: Building[];
  buildingFloors: BuildingFloor[];
  buildingParts: BuildingPart[];
  partFloors: PartFloor[];
}

const LotsTab: React.FC<LotsTabProps> = ({ siteId, onNotification, disabled = false }) => {
  // Data states
  const [lots, setLots] = useState<Lot[]>([]);
  const [hierarchy, setHierarchy] = useState<HierarchyData>({
    buildings: [],
    buildingFloors: [],
    buildingParts: [],
    partFloors: [],
  });
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
    partFloorId: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<LotFormData>>({});

  // Filters state
  const [filters, setFilters] = useState<LotFilters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Filtered form options based on selections
  const [availableBuildingFloors, setAvailableBuildingFloors] = useState<BuildingFloor[]>([]);
  const [availablePartFloors, setAvailablePartFloors] = useState<PartFloor[]>([]);

  // Load data
  useEffect(() => {
    loadData();
  }, [siteId, filters.includeDeleted]);

  // Filter lots when search or building filter changes
  useEffect(() => {
    filterLots();
  }, [lots, filters.search, filters.buildingId]);

  // Update available floors when building changes
  useEffect(() => {
    updateAvailableBuildingFloors();
  }, [formData.buildingId, hierarchy.buildingFloors]);

  // Update available part floors when building floor changes
  useEffect(() => {
    updateAvailablePartFloors();
  }, [formData.buildingFloorId, hierarchy.partFloors, hierarchy.buildingParts]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load all hierarchy data
      const [buildingsRes, lotsRes] = await Promise.all([
        buildingService.getBuildings({ siteId, includeDeleted: filters.includeDeleted }),
        lotService.getLots({ siteId, includeDeleted: filters.includeDeleted }),
      ]);

      const buildings = buildingsRes.buildings;
      setLots(lotsRes.lots);

      if (buildings.length > 0) {
        // Load all related data in parallel
        const [buildingFloorsRes, buildingPartsRes] = await Promise.all([
          Promise.all(buildings.map(b =>
            buildingFloorService.getBuildingFloors({
              buildingId: b.id,
              includeDeleted: filters.includeDeleted
            })
          )),
          Promise.all(buildings.map(b =>
            partService.getParts({
              buildingId: b.id,
              includeDeleted: filters.includeDeleted
            })
          )),
        ]);

        const allBuildingFloors = buildingFloorsRes.flatMap(res => res.buildingFloors);
        const allBuildingParts = buildingPartsRes.flatMap(res => res.parts);

        // Load part floors for all parts
        let allPartFloors = [];
        if (allBuildingFloors.length > 0) {
          const partFloorsRes = await Promise.all(
            allBuildingFloors.map(floor =>
              partFloorService.getPartFloors({
                buildingFloorId: floor.id,
                includeDeleted: filters.includeDeleted,
              })
            )
          );
          allPartFloors = partFloorsRes.flatMap(res => res.partFloors);
        }

        setHierarchy({
          buildings,
          buildingFloors: allBuildingFloors,
          buildingParts: allBuildingParts,
          partFloors: allPartFloors,
        });
      } else {
        setHierarchy({
          buildings: [],
          buildingFloors: [],
          buildingParts: [],
          partFloors: [],
        });
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
      const floors = hierarchy.buildingFloors.filter(
        floor => floor.buildingId === formData.buildingId && !floor.deletedAt
      );
      setAvailableBuildingFloors(floors);
    } else {
      setAvailableBuildingFloors([]);
    }

    // Reset building floor selection if not valid anymore
    if (formData.buildingFloorId && !availableBuildingFloors.find(f => f.id === formData.buildingFloorId)) {
      setFormData(prev => ({ ...prev, buildingFloorId: 0, partFloorId: 0 }));
    }
  };

  const updateAvailablePartFloors = () => {
    if (formData.buildingFloorId) {
      // Get part floors for this building floor
      const partFloors = hierarchy.partFloors.filter(
        partFloor => partFloor.buildingFloorId === formData.buildingFloorId && !partFloor.deletedAt
      );

      setAvailablePartFloors(partFloors);
    } else {
      setAvailablePartFloors([]);
    }

    // Reset part floor selection if not valid anymore
    if (formData.partFloorId && !availablePartFloors.find(f => f.id === formData.partFloorId)) {
      setFormData(prev => ({ ...prev, partFloorId: 0 }));
    }
  };

  const filterLots = () => {
    let filtered = [...lots];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId !== '') {
      filtered = filtered.filter(lot => lot.buildingId === Number(filters.buildingId));
    }

    setFilteredLots(filtered);
  };

  const openCreateDialog = () => {
    setEditingLot(null);
    setFormData({
      name: '',
      buildingId: hierarchy.buildings.length > 0 ? hierarchy.buildings[0].id : 0,
      buildingFloorId: 0,
      partFloorId: 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (lot: Lot) => {
    setEditingLot(lot);
    setFormData({
      name: lot.name,
      buildingId: lot.buildingId,
      buildingFloorId: lot.buildingFloorId,
      partFloorId: lot.partFloorId,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingLot(null);
    setFormData({ name: '', buildingId: 0, buildingFloorId: 0, partFloorId: 0 });
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
      errors.buildingFloorId = 'L\'étage de bâtiment est requis';
    }

    if (!formData.partFloorId) {
      errors.partFloorId = 'L\'étage de partie est requis';
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
        };
        await lotService.updateLot(editingLot.id, updateData);
        onNotification('Lot modifié avec succès', 'success');
      } else {
        // Create
        const createData: CreateLotDto = {
          name: formData.name.trim(),
          buildingId: formData.buildingId,
          buildingFloorId: formData.buildingFloorId,
          partFloorId: formData.partFloorId,
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

  const getBuildingName = (buildingId: number): string => {
    const building = hierarchy.buildings.find(b => b.id === buildingId);
    return building ? building.name : `Bâtiment ${buildingId}`;
  };

  const getBuildingFloorName = (buildingFloorId: number): string => {
    const floor = hierarchy.buildingFloors.find(f => f.id === buildingFloorId);
    return floor ? floor.name : `Étage ${buildingFloorId}`;
  };

  const getPartFloorName = (partFloorId: number): string => {
    const partFloor = hierarchy.partFloors.find(pf => pf.id === partFloorId);
    return partFloor ? partFloor.name : `Étage partie ${partFloorId}`;
  };

  const getPartName = (partId: number): string => {
    const part = hierarchy.buildingParts.find(p => p.id === partId);
    return part ? part.name : `Partie ${partId}`;
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography>Chargement des lots...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
            disabled={disabled || hierarchy.buildings.length === 0}
          >
            Nouveau Lot
          </Button>
        </Box>
      </Box>

      {hierarchy.buildings.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucun bâtiment trouvé sur ce site. Vous devez d&apos;abord créer des bâtiments, des étages et des parties pour pouvoir créer des lots.
        </Alert>
      ) : hierarchy.buildingFloors.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Aucun étage de bâtiment trouvé. Vous devez créer des étages de bâtiment pour pouvoir créer des lots.
        </Alert>
      ) : hierarchy.partFloors.length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Aucun étage de partie trouvé. Vous devez créer des parties et leurs étages pour pouvoir créer des lots.
        </Alert>
      ) : (
        <>
          {/* Filters */}
          <Card sx={{ p: 2, mb: 3 }}>
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'center',
              '& > *': { minWidth: { xs: '100%', sm: 'auto' } }
            }}>
              <TextField
                size="small"
                placeholder="Rechercher un lot..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                sx={{ flex: { xs: '1 1 100%', sm: '1 1 300px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: filters.search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Bâtiment</InputLabel>
                <Select
                  value={filters.buildingId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilters(prev => ({
                      ...prev,
                      buildingId: value === '' ? '' : Number(value)
                    }));
                  }}
                  label="Bâtiment"
                >
                  <MenuItem value="">Tous les bâtiments</MenuItem>
                  {hierarchy.buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={filters.includeDeleted}
                    onChange={(e) => setFilters(prev => ({ ...prev, includeDeleted: e.target.checked }))}
                    size="small"
                  />
                }
                label="Inclure supprimés"
              />

              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                {filteredLots.length} lot(s)
              </Typography>
            </Box>
          </Card>

          {/* Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Bâtiment</TableCell>
                  <TableCell>Étage de Bâtiment</TableCell>
                  <TableCell>Étage de Partie</TableCell>
                  <TableCell>Date de création</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="body1" color="text.secondary">
                          {filters.search || filters.buildingId ? 'Aucun lot trouvé' : 'Aucun lot créé'}
                        </Typography>
                        {!filters.search && !filters.buildingId && (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={openCreateDialog}
                            disabled={disabled}
                          >
                            Créer le premier lot
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLots.map((lot) => (
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
                            {getBuildingName(lot.buildingId)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LayersIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {getBuildingFloorName(lot.buildingFloorId)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ViewModuleIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {getPartFloorName(lot.partFloorId)}
                          </Typography>
                        </Box>
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
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingLot ? 'Modifier le lot' : 'Créer un nouveau lot'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom du lot *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="ex: Lot A1, Local technique, Bureau 201..."
            />

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Configuration hiérarchique</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <FormControl fullWidth error={!!formErrors.buildingId}>
                    <InputLabel>Bâtiment *</InputLabel>
                    <Select
                      value={formData.buildingId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        buildingId: Number(e.target.value),
                        buildingFloorId: 0,
                        partFloorId: 0,
                      }))}
                      label="Bâtiment *"
                      disabled={!!editingLot} // Can't change hierarchy when editing
                    >
                      {hierarchy.buildings.map((building) => (
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

                  <FormControl fullWidth error={!!formErrors.buildingFloorId} disabled={!formData.buildingId}>
                    <InputLabel>Étage de Bâtiment *</InputLabel>
                    <Select
                      value={formData.buildingFloorId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        buildingFloorId: Number(e.target.value),
                        partFloorId: 0,
                      }))}
                      label="Étage de Bâtiment *"
                      disabled={!!editingLot || !formData.buildingId}
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

                  <FormControl fullWidth error={!!formErrors.partFloorId} disabled={!formData.buildingFloorId}>
                    <InputLabel>Étage de Partie *</InputLabel>
                    <Select
                      value={formData.partFloorId}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        partFloorId: Number(e.target.value),
                      }))}
                      label="Étage de Partie *"
                      disabled={!!editingLot || !formData.buildingFloorId}
                    >
                      {availablePartFloors.map((partFloor) => (
                        <MenuItem key={partFloor.id} value={partFloor.id}>
                          {getPartFloorName(partFloor.id)}
                        </MenuItem>
                      ))}
                    </Select>
                    {formErrors.partFloorId && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                        {formErrors.partFloorId}
                      </Typography>
                    )}
                  </FormControl>

                  {formData.buildingId && formData.buildingFloorId && formData.partFloorId && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Aperçu de la hiérarchie :
                      </Typography>
                      <Typography variant="body2">
                        <strong>{getBuildingName(formData.buildingId)}</strong>
                        {' → '}
                        <strong>{getBuildingFloorName(formData.buildingFloorId)}</strong>
                        {' → '}
                        <strong>{getPartFloorName(formData.partFloorId)}</strong>
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button onClick={handleSave} variant="contained">
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