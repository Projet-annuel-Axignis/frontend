/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import SearchFilters from '@/components/dashboard/SearchFilters';
import { buildingFloorService, buildingService, partFloorService, partService } from '@/services/siteService';
import { Building, BuildingFloor, CreatePartDto, LevelAssignment, Part, UpdatePartDto } from '@/types/site';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  ViewModule as ViewModuleIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import PartDialog from './PartDialog';

interface PartsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface Filters {
  search: string;
  buildingId: number | '';
  includeDeleted: boolean;
}

const PartsTab: React.FC<PartsTabProps> = ({ siteId, onNotification, disabled = false }) => {
  // Data states
  const [parts, setParts] = useState<Part[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildingFloors, setBuildingFloors] = useState<BuildingFloor[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
  });

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Load data
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, filters.includeDeleted]);

  // Filter parts when search or building filter changes
  useEffect(() => {
    filterParts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts, filters.search, filters.buildingId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load buildings for the site (including deleted for complete data)
      const buildingsData = await buildingService.getBuildings({
        siteId,
        includeDeleted: true,
      });
      setBuildings(buildingsData.buildings);

      // Load building floors for all buildings in this site
      if (buildingsData.buildings.length > 0) {
        const floorsPromises = buildingsData.buildings.map(building =>
          buildingFloorService.getBuildingFloors({
            buildingId: building.id,
            includeDeleted: true,
          })
        );
        const floorsResponses = await Promise.all(floorsPromises);
        const allBuildingFloors = floorsResponses.flatMap(response => response.buildingFloors);
        setBuildingFloors(allBuildingFloors);
      } else {
        setBuildingFloors([]);
      }

      // Load parts for buildings in this site
      const partsData = await partService.getParts({
        filterField: 'buildingId',
        filter: buildingsData.buildings.map(b => b.id).join(','),
        includeDeleted: filters.includeDeleted,
      });
      setParts(partsData.parts);
    } catch (error) {
      console.error('Error loading data:', error);
      onNotification('Erreur lors du chargement des données', 'error');
    }
    setLoading(false);
  };

  const filterParts = () => {
    let filtered = [...parts];

    // Filter by deleted status
    if (!filters.includeDeleted) {
      filtered = filtered.filter(part => !part.deletedAt);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(part =>
        part.name.toLowerCase().includes(searchLower) ||
        part.type.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building
    if (filters.buildingId) {
      filtered = filtered.filter(part => part.building?.id === filters.buildingId);
    }

    setFilteredParts(filtered);
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedPart(null);
    setDialogOpen(true);
  };

  const openEditDialog = (part: Part) => {
    setDialogMode('edit');
    setSelectedPart(part);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedPart(null);
  };

  const handleDialogSubmit = async (formData: CreatePartDto | UpdatePartDto, levelAssignments: LevelAssignment[], partId?: number) => {
    try {
      if (dialogMode === 'create') {
        // Create the part first and get the created part with its ID
        const createdPart = await partService.createPart(formData as CreatePartDto);

        // Create part floors for each level assignment
        for (const assignment of levelAssignments) {
          if (assignment.buildingFloorId && assignment.partFloorData) {
            await partFloorService.createPartFloor({
              ...assignment.partFloorData,
              buildingFloorId: assignment.buildingFloorId,
              partId: createdPart.id, // Use the ID from the created part
            });
          }
        }

        onNotification('Partie créée avec succès', 'success');
      } else if (partId) {
        // Update the part
        await partService.updatePart(partId, formData as UpdatePartDto);

        // TODO: Handle updating part floors - this requires more complex logic
        // to determine which ones to create, update, or delete

        onNotification('Partie modifiée avec succès', 'success');
      }

      loadData();
    } catch (error) {
      console.error('Error saving part:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
      throw error; // Re-throw to let dialog handle loading state
    }
  };

  const handleDelete = async (part: Part) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la partie "${part.name}" ?`)) {
      try {
        await partService.deletePart(part.id);
        onNotification('Partie supprimée avec succès', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting part:', error);
        onNotification('Erreur lors de la suppression', 'error');
      }
    }
  };

  const getBuildingName = (building?: Building) => {
    if (!building) return 'Non défini';
    return building.name;
  };

  const isDeleted = (part: Part) => !!part.deletedAt;

  // Render mobile card view
  const renderCard = (part: Part) => (
    <Card key={part.id} sx={{ mb: 2, opacity: isDeleted(part) ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: isDeleted(part) ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {part.name}
          </Typography>
          {isDeleted(part) && (
            <Chip label="Supprimé" color="error" size="small" />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Type :</strong> {part.type === 'PRIVATE' ? 'Privée' : 'Commune'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Bâtiment :</strong> {getBuildingName(part.building)}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Niveaux :</strong> {part.partFloors?.length || 0} niveau(s)
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>ICPE :</strong> {part.isIcpe ? 'Oui' : 'Non'}
            </Typography>
          </Grid>

          {part.erpTypes && part.erpTypes.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Code ERP :</strong> {part.erpTypes.map(erpType => erpType.code).join(', ')}
              </Typography>
            </Grid>
          )}

          {part.habFamily && (
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Famille d&apos;habitation :</strong> {part.habFamily?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>

      {!disabled && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => openEditDialog(part)}
            disabled={isDeleted(part)}
          >
            Modifier
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(part)}
            disabled={isDeleted(part)}
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
        <Typography>Chargement des parties...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewModuleIcon />
          Gestion des Parties de Bâtiment
        </Typography>

        {!disabled && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
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
              disabled={buildings.filter(b => !b.deletedAt).length === 0}
              sx={{
                minWidth: 'auto',
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                },
              }}
            >
              Nouvelle Partie
            </Button>
          </Box>
        )}
      </Box>

      {/* Filters */}
      <SearchFilters
        searchValue={filters.search}
        onSearchChange={(value) => handleFilterChange('search', value)}
        searchPlaceholder="Rechercher une partie..."
        selectValue={filters.buildingId}
        onSelectChange={(value) => handleFilterChange('buildingId', value)}
        selectLabel="Bâtiment"
        selectOptions={buildings
          .filter(building => filters.includeDeleted || !building.deletedAt)
          .map(building => ({
            value: building.id,
            label: building.name
          }))}
        selectAllLabel="Tous les bâtiments"
        includeDeleted={filters.includeDeleted}
        onIncludeDeletedChange={(value) => handleFilterChange('includeDeleted', value)}
        resultsCount={filteredParts.length}
        resultsLabel="partie(s)"
      />

      {/* Content */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Chargement...</Typography>
        </Box>
      ) : filteredParts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ViewModuleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucune partie trouvée
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {parts.length === 0
              ? "Commencez par créer votre première partie"
              : "Aucune partie ne correspond à vos critères de recherche"}
          </Typography>
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
                    <TableCell>Type</TableCell>
                    <TableCell>Bâtiment</TableCell>
                    <TableCell>Niveaux</TableCell>
                    <TableCell>ICPE</TableCell>
                    <TableCell>Code ERP</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredParts.map((part) => (
                    <TableRow
                      key={part.id}
                      sx={{ opacity: isDeleted(part) ? 0.6 : 1 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            sx={{
                              textDecoration: isDeleted(part) ? 'line-through' : 'none',
                            }}
                          >
                            {part.name}
                          </Typography>
                          {isDeleted(part) && (
                            <Chip label="Supprimé" color="error" size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{part.type === 'PRIVATE' ? 'Privée' : 'Commune'}</TableCell>
                      <TableCell>{getBuildingName(part.building)}</TableCell>
                      <TableCell>{part.partFloors?.length || 0} niveau(s)</TableCell>
                      <TableCell>{part.isIcpe ? 'Oui' : 'Non'}</TableCell>
                      <TableCell>{part.erpTypes?.map(erpType => erpType.code).join(', ') || '-'}</TableCell>
                      <TableCell>
                        {!disabled && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(part)}
                              disabled={isDeleted(part)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(part)}
                              disabled={isDeleted(part)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Mobile Card View */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            {filteredParts.map(renderCard)}
          </Box>
        </>
      )}

      {/* Part Dialog */}
      <PartDialog
        open={dialogOpen}
        onClose={closeDialog}
        mode={dialogMode}
        part={selectedPart}
        buildings={buildings}
        buildingFloors={buildingFloors}
        includeDeleted={filters.includeDeleted}
        onSubmit={handleDialogSubmit}
      />
    </Box>
  );
};

export default PartsTab; 