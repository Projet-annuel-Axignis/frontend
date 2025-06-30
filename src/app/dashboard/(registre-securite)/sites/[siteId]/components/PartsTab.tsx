/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { buildingService, partService } from '@/services/siteService';
import { Building } from '@/types/site';
import {
  Add as AddIcon,
  Apartment as BuildingIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
} from '@mui/icons-material';
import {
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
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface PartsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface PartFormData {
  name: string;
  buildingId: number;
}

interface PartFilters {
  search: string;
  buildingId: number | '';
  includeDeleted: boolean;
}

// Types simplifiés pour les parties de bâtiment
interface BuildingPart {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  name: string;
  buildingId: number;
}

interface CreateBuildingPartDto {
  name: string;
  buildingId: number;
  type: 'PRIVATE' | 'COMMUNAL';
  erpTypeCodes: 'J'; // Type par défaut
}

interface UpdateBuildingPartDto {
  name?: string;
}

const PartsTab: React.FC<PartsTabProps> = ({ siteId, onNotification, disabled = false }) => {
  // Data states
  const [parts, setParts] = useState<BuildingPart[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredParts, setFilteredParts] = useState<BuildingPart[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<BuildingPart | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState<BuildingPart | null>(null);

  // Form state
  const [formData, setFormData] = useState<PartFormData>({
    name: '',
    buildingId: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<PartFormData>>({});

  // Filters state
  const [filters, setFilters] = useState<PartFilters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, [siteId, filters.includeDeleted]);

  // Filter parts when search or building filter changes
  useEffect(() => {
    filterParts();
  }, [parts, filters.search, filters.buildingId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load buildings for this site
      const buildingsResponse = await buildingService.getBuildings({
        siteId,
        includeDeleted: filters.includeDeleted,
      });
      setBuildings(buildingsResponse.buildings);

      // Load all building parts for buildings in this site
      if (buildingsResponse.buildings.length > 0) {
        const partsPromises = buildingsResponse.buildings.map(building =>
          partService.getParts({
            buildingId: building.id,
            includeDeleted: filters.includeDeleted,
          })
        );
        const partsResponses = await Promise.all(partsPromises);
        const allParts = partsResponses.flatMap(response => response.parts);
        setParts(allParts);
      } else {
        setParts([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des parties:', error);
      onNotification('Erreur lors du chargement des parties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterParts = () => {
    let filtered = [...parts];

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId !== '') {
      filtered = filtered.filter(part => part.buildingId === Number(filters.buildingId));
    }

    setFilteredParts(filtered);
  };

  const openCreateDialog = () => {
    setEditingPart(null);
    setFormData({
      name: '',
      buildingId: buildings.length > 0 ? buildings[0].id : 0,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEditDialog = (part: BuildingPart) => {
    setEditingPart(part);
    setFormData({
      name: part.name,
      buildingId: part.buildingId,
    });
    setFormErrors({});
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingPart(null);
    setFormData({ name: '', buildingId: 0 });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<PartFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom de la partie est requis';
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
      if (editingPart) {
        // Update
        const updateData: UpdatePartDto = {
          name: formData.name.trim(),
        };
        await partService.updatePart(editingPart.id, updateData);
        onNotification('Partie modifiée avec succès', 'success');
      } else {
        // Create
        const createData: CreateBuildingPartDto = {
          name: formData.name.trim(),
          buildingId: formData.buildingId,
          type: 'PRIVATE', // Valeur par défaut
          erpTypeCodes: 'J', // Type par défaut
        };
        await partService.createPart(createData);
        onNotification('Partie créée avec succès', 'success');
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = (part: BuildingPart) => {
    setPartToDelete(part);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!partToDelete) return;

    try {
      await partService.deletePart(partToDelete.id);
      onNotification('Partie supprimée avec succès', 'success');
      setDeleteDialogOpen(false);
      setPartToDelete(null);
      loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      onNotification('Erreur lors de la suppression', 'error');
    }
  };

  const getBuildingName = (buildingId: number): string => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : `Bâtiment ${buildingId}`;
  };

  const clearSearch = () => {
    setFilters(prev => ({ ...prev, search: '' }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <Typography>Chargement des parties...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewModuleIcon />
          Gestion des Parties de Bâtiment
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
            disabled={disabled || buildings.length === 0}
          >
            Nouvelle Partie
          </Button>
        </Box>
      </Box>

      {buildings.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Aucun bâtiment trouvé sur ce site. Vous devez d&apos;abord créer des bâtiments pour pouvoir ajouter des parties.
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
                placeholder="Rechercher une partie..."
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
                  {buildings.map((building) => (
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
                {filteredParts.length} partie(s)
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
                  <TableCell>Date de création</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredParts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <ViewModuleIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                        <Typography variant="body1" color="text.secondary">
                          {filters.search || filters.buildingId ? 'Aucune partie trouvée' : 'Aucune partie créée'}
                        </Typography>
                        {!filters.search && !filters.buildingId && (
                          <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={openCreateDialog}
                            disabled={disabled}
                          >
                            Créer la première partie
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {part.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BuildingIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {getBuildingName(part.buildingId)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(part.createdAt).toLocaleDateString('fr-FR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={part.deletedAt ? 'Supprimée' : 'Active'}
                          color={part.deletedAt ? 'error' : 'success'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(part)}
                              disabled={disabled || !!part.deletedAt}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(part)}
                              disabled={disabled || !!part.deletedAt}
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
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPart ? 'Modifier la partie' : 'Créer une nouvelle partie'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nom de la partie *"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!formErrors.name}
              helperText={formErrors.name}
              placeholder="ex: Aile Est, Aile Ouest, Hall d'entrée..."
            />

            <FormControl fullWidth error={!!formErrors.buildingId}>
              <InputLabel>Bâtiment *</InputLabel>
              <Select
                value={formData.buildingId}
                onChange={(e) => setFormData(prev => ({ ...prev, buildingId: Number(e.target.value) }))}
                label="Bâtiment *"
                disabled={!!editingPart} // Can't change building when editing
              >
                {buildings.map((building) => (
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
            {editingPart ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la partie &ldquo;{partToDelete?.name}&rdquo; ?
            Cette action peut être annulée en restaurant la partie depuis les filtres.
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

export default PartsTab; 