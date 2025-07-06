/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import SearchFilters from '@/components/dashboard/SearchFilters';
import { buildingService, lotService, partFloorService, partService } from '@/services/siteService';
import { Building, CreateLotDto, Lot, Part, PartFloor, UpdateLotDto } from '@/types/site';
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
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import LotDialog from './LotDialog';

interface LotsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
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
  const [parts, setParts] = useState<Part[]>([]);
  const [partFloorsMap, setPartFloorsMap] = useState<Map<number, PartFloor[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filteredLots, setFilteredLots] = useState<Lot[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLot, setEditingLot] = useState<Lot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [lotToDelete, setLotToDelete] = useState<Lot | null>(null);

  // Filters state
  const [filters, setFilters] = useState<LotFilters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Load data
  useEffect(() => {
    loadData();
  }, [siteId]);

  // Filter lots when search, building filter, or includeDeleted changes
  useEffect(() => {
    filterLots();
  }, [lots, filters.search, filters.buildingId, filters.includeDeleted]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load buildings for this site (including deleted ones to have complete data)
      const buildingsResponse = await buildingService.getBuildings({
        siteId,
        includeDeleted: true,
      });
      setBuildings(buildingsResponse.buildings);

      // Load all parts and part floors for buildings in this site
      if (buildingsResponse.buildings.length > 0) {
        // First load parts for all buildings
        const partsPromises = buildingsResponse.buildings.map(building =>
          partService.getParts({
            buildingId: building.id,
            includeDeleted: true,
          })
        );
        const partsResponses = await Promise.all(partsPromises);
        const allParts = partsResponses.flatMap(response => response.parts);
        setParts(allParts);

        // Then load part floors for all parts
        const partFloorsPromises = allParts.map(part =>
          partFloorService.getPartFloors({
            partId: part.id,
            includeDeleted: true,
          })
        );
        const partFloorsResponses = await Promise.all(partFloorsPromises);

        // Create a map of partId -> partFloors for efficient lookup
        const newPartFloorsMap = new Map<number, PartFloor[]>();
        allParts.forEach((part, index) => {
          newPartFloorsMap.set(part.id, partFloorsResponses[index].partFloors);
        });

        setPartFloorsMap(newPartFloorsMap);

        // Finally load lots
        const lotsResponse = await lotService.getLots({
          siteId,
          includeDeleted: true,
        });
        setLots(lotsResponse.lots);
      } else {
        setParts([]);
        setPartFloorsMap(new Map());
        setLots([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des lots:', error);
      onNotification('Erreur lors du chargement des lots', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterLots = () => {
    let filtered = lots;

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(lot =>
        lot.name.toLowerCase().includes(searchLower) ||
        lot.building?.name.toLowerCase().includes(searchLower) ||
        lot.partFloor?.name.toLowerCase().includes(searchLower) ||
        lot.buildingFloor?.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId) {
      filtered = filtered.filter(lot => lot.building?.id === filters.buildingId);
    }

    // Filter deleted items
    if (!filters.includeDeleted) {
      filtered = filtered.filter(lot => !lot.deletedAt);
    }

    setFilteredLots(filtered);
  };

  const openCreateDialog = () => {
    setEditingLot(null);
    setDialogOpen(true);
  };

  const openEditDialog = (lot: Lot) => {
    setEditingLot(lot);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingLot(null);
  };

  const handleSave = async (data: CreateLotDto | UpdateLotDto) => {
    try {
      if (editingLot) {
        // Update existing lot
        await lotService.updateLot(editingLot.id, data as UpdateLotDto);
        onNotification('Lot modifié avec succès', 'success');
      } else {
        // Create new lot
        await lotService.createLot(data as CreateLotDto);
        onNotification('Lot créé avec succès', 'success');
      }
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      onNotification('Erreur lors de la sauvegarde du lot', 'error');
      throw error; // Re-throw to let dialog handle it
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
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      onNotification('Erreur lors de la suppression du lot', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setLotToDelete(null);
    }
  };

  const findPartForPartFloor = (partFloorId: number): Part | undefined => {
    for (const [partId, partFloors] of partFloorsMap.entries()) {
      if (partFloors.some(pf => pf.id === partFloorId)) {
        return parts.find(p => p.id === partId);
      }
    }
    return undefined;
  };

  const renderCard = (lot: Lot) => (
    <Card key={lot.id} sx={{ mb: 2, opacity: lot.deletedAt ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {lot.name}
          </Typography>
          <Chip
            size="small"
            label={lot.deletedAt ? 'Supprimé' : 'Actif'}
            color={lot.deletedAt ? 'error' : 'success'}
            variant="outlined"
          />
        </Box>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BuildingIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Bâtiment:</strong> {lot.building?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewModuleIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Partie:</strong> {findPartForPartFloor(lot.partFloor?.id || 0)?.name || 'Inconnue'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewModuleIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Étage de partie:</strong> {lot.partFloor?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LayersIcon fontSize="small" color="action" />
            <Typography variant="body2">
              <strong>Étage de bâtiment:</strong> {lot.buildingFloor?.name}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Créé le {new Date(lot.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => openEditDialog(lot)}
          disabled={disabled || !!lot.deletedAt}
        >
          Modifier
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(lot)}
          disabled={disabled || !!lot.deletedAt}
          color="error"
        >
          Supprimer
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InventoryIcon />
          Lots
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            disabled={disabled || buildings.filter(b => !b.deletedAt).length === 0 || parts.filter(p => !p.deletedAt).length === 0}
            sx={{
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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography>Chargement des lots...</Typography>
        </Box>
      ) : (
        <>
          {buildings.filter(b => !b.deletedAt).length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              Aucun bâtiment actif trouvé sur ce site. Vous devez d&apos;abord créer des bâtiments et des parties pour pouvoir ajouter des lots.
            </Alert>
          ) : parts.filter(p => !p.deletedAt).length === 0 ? (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Aucune partie active trouvée dans les bâtiments de ce site. Vous devez d&apos;abord créer des parties dans vos bâtiments pour pouvoir ajouter des lots.
            </Alert>
          ) : (
            <>
              <SearchFilters
                searchValue={filters.search}
                onSearchChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                searchPlaceholder="Rechercher un lot..."
                selectValue={filters.buildingId}
                onSelectChange={(value) => setFilters(prev => ({ ...prev, buildingId: value as number | '' }))}
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

              {filteredLots.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Aucun lot trouvé
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filters.search || filters.buildingId
                      ? 'Aucun lot ne correspond aux critères de recherche'
                      : 'Aucun lot créé pour ce site'}
                  </Typography>
                </Box>
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
                            <TableCell>Partie</TableCell>
                            <TableCell>Étage de partie</TableCell>
                            <TableCell>Étage de bâtiment</TableCell>
                            <TableCell>Date de création</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="right">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredLots.map((lot) => (
                            <TableRow key={lot.id} sx={{ opacity: lot.deletedAt ? 0.6 : 1 }}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <InventoryIcon fontSize="small" color="action" />
                                  <Typography variant="body2" fontWeight="medium">
                                    {lot.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <BuildingIcon fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {lot.building?.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                {lot.partFloor ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ViewModuleIcon fontSize="small" color="action" />
                                    <Typography variant="body2">
                                      {findPartForPartFloor(lot.partFloor.id)?.name || 'Inconnue'}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Typography variant="body2" color="text.secondary">
                                    Aucune
                                  </Typography>
                                )}
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
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LayersIcon fontSize="small" color="action" />
                                  <Typography variant="body2">
                                    {lot.buildingFloor.name}
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
        </>
      )}

      {/* Lot Dialog */}
      <LotDialog
        open={dialogOpen}
        onClose={closeDialog}
        onSave={handleSave}
        editingLot={editingLot}
        buildings={buildings}
        parts={parts}
        partFloorsMap={partFloorsMap}
        includeDeleted={filters.includeDeleted}
      />

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