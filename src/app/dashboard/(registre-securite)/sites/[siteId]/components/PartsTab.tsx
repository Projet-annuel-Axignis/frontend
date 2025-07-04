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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

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

interface PartFormData extends CreatePartDto {
  levelCount: number;
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

  // Form states
  const [formData, setFormData] = useState<PartFormData>({
    name: '',
    buildingId: 0,
    levelCount: 1,
    type: 'PRIVATE',
    isIcpe: false,
    erpTypeCodes: ['J'],
  });

  // Level assignment states
  const [levelAssignments, setLevelAssignments] = useState<LevelAssignment[]>([]);

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

  // Initialize level assignments based on levelCount
  const initializeLevelAssignments = (levelCount: number, existingPart?: Part) => {
    const assignments: LevelAssignment[] = [];
    for (let i = 1; i <= levelCount; i++) {
      assignments.push({
        levelNumber: i,
        buildingFloorId: null,
        partFloorData: {
          name: `Niveau ${i}`,
          publicCount: 0,
          staffCount: 0,
          exploitationSurface: 0,
          glaSurface: 0,
          publicAccessSurface: 0,
        }
      });
    }

    // If editing, try to populate with existing data
    if (existingPart?.partFloors) {
      existingPart.partFloors.forEach((partFloor, index) => {
        if (assignments[index]) {
          assignments[index].buildingFloorId = partFloor.buildingFloor?.id || null;
          assignments[index].partFloorData = {
            name: partFloor.name,
            publicCount: partFloor.publicCount,
            staffCount: partFloor.staffCount,
            exploitationSurface: partFloor.exploitationSurface,
            glaSurface: partFloor.glaSurface,
            publicAccessSurface: partFloor.publicAccessSurface,
          };
        }
      });
    }

    setLevelAssignments(assignments);
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedPart(null);
    const availableBuildings = buildings.filter(b => !b.deletedAt);
    setFormData({
      name: '',
      buildingId: availableBuildings.length > 0 ? availableBuildings[0].id : 0,
      levelCount: 1,
      type: 'PRIVATE',
      isIcpe: false,
      erpTypeCodes: ['J'],
    });
    initializeLevelAssignments(1);
    setDialogOpen(true);
  };

  const openEditDialog = (part: Part) => {
    setDialogMode('edit');
    setSelectedPart(part);
    setFormData({
      name: part.name,
      buildingId: part.building?.id || 0,
      levelCount: part.partFloors?.length || 1,
      type: part.type || 'PRIVATE',
      isIcpe: part.isIcpe,
      erpTypeCodes: part.erpTypes || ['J'],
    });
    initializeLevelAssignments(part.partFloors?.length || 1, part);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedPart(null);
    setLevelAssignments([]);
  };

  const handleFormChange = (field: keyof PartFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // If levelCount changes, reinitialize level assignments
    if (field === 'levelCount') {
      initializeLevelAssignments(value, selectedPart || undefined);
    }
  };

  const updateLevelAssignment = (levelNumber: number, field: keyof LevelAssignment, value: any) => {
    setLevelAssignments(prev =>
      prev.map(assignment =>
        assignment.levelNumber === levelNumber
          ? { ...assignment, [field]: value }
          : assignment
      )
    );
  };

  const updatePartFloorData = (levelNumber: number, field: string, value: any) => {
    setLevelAssignments(prev =>
      prev.map(assignment =>
        assignment.levelNumber === levelNumber
          ? {
            ...assignment,
            partFloorData: {
              ...assignment.partFloorData!,
              [field]: value
            }
          }
          : assignment
      )
    );
  };

  const getAvailableBuildingFloors = (selectedBuildingId: number) => {
    return buildingFloors
      .filter(floor => floor.building.id === selectedBuildingId)
      .filter(floor => filters.includeDeleted || !floor.deletedAt);
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Create the part first
        await partService.createPart(formData);

        // Create part floors for each level assignment
        for (const assignment of levelAssignments) {
          if (assignment.buildingFloorId && assignment.partFloorData) {
            await partFloorService.createPartFloor({
              ...assignment.partFloorData,
              buildingFloorId: assignment.buildingFloorId,
            });
          }
        }

        onNotification('Partie créée avec succès', 'success');
      } else if (selectedPart) {
        // Update the part
        const updateData: UpdatePartDto = {
          name: formData.name,
          type: formData.type,
          levelCount: formData.levelCount,
          isIcpe: formData.isIcpe,
          erpTypeCodes: formData.erpTypeCodes,
        };
        await partService.updatePart(selectedPart.id, updateData);

        // TODO: Handle updating part floors - this requires more complex logic
        // to determine which ones to create, update, or delete

        onNotification('Partie modifiée avec succès', 'success');
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Error saving part:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
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
          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Type :</strong> {part.type === 'PRIVATE' ? 'Privée' : 'Commune'}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Bâtiment :</strong> {getBuildingName(part.building)}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Niveaux :</strong> {part.partFloors?.length || 0} niveau(s)
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>ICPE :</strong> {part.isIcpe ? 'Oui' : 'Non'}
            </Typography>
          </Grid>

          {part.erpTypeCodes && (
            <Grid xs={12}>
              <Typography variant="body2" color="text.secondary">
                <strong>Code ERP :</strong> {part.erpTypeCodes}
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
                      <TableCell>{part.erpTypeCodes || '-'}</TableCell>
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer une partie' : 'Modifier la partie'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            {/* Basic Information */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nom de la partie"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
                fullWidth
              />

              <FormControl required fullWidth>
                <InputLabel>Bâtiment</InputLabel>
                <Select
                  value={formData.buildingId}
                  onChange={(e) => handleFormChange('buildingId', Number(e.target.value))}
                  label="Bâtiment"
                >
                  {buildings
                    .filter(building => filters.includeDeleted || !building.deletedAt)
                    .map((building) => (
                      <MenuItem key={building.id} value={building.id}>
                        {building.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nombre de niveaux"
                type="number"
                value={formData.levelCount}
                onChange={(e) => handleFormChange('levelCount', Math.max(1, parseInt(e.target.value) || 1))}
                inputProps={{ min: 1, max: 20 }}
                required
                fullWidth
              />

              <FormControl required fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  label="Type"
                >
                  <MenuItem value="PRIVATE">Privée</MenuItem>
                  <MenuItem value="COMMUNAL">Commune</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Code ERP</InputLabel>
                <Select
                  value={formData.erpTypeCodes}
                  onChange={(e) => handleFormChange('erpTypeCodes', e.target.value)}
                  label="Code ERP"
                >
                  <MenuItem value="J">J - Structures d&apos;accueil pour personnes âgées</MenuItem>
                  <MenuItem value="L">L - Salles de spectacles</MenuItem>
                  <MenuItem value="M">M - Magasins de vente</MenuItem>
                  <MenuItem value="N">N - Restaurants et débits de boissons</MenuItem>
                  <MenuItem value="O">O - Hôtels et pensions de famille</MenuItem>
                  <MenuItem value="P">P - Salles de danse et salles de jeux</MenuItem>
                  <MenuItem value="R">R - Établissements de soins</MenuItem>
                  <MenuItem value="S">S - Bibliothèques, centres de documentation</MenuItem>
                  <MenuItem value="T">T - Salles d&apos;exposition</MenuItem>
                  <MenuItem value="U">U - Établissements de soins avec hébergement</MenuItem>
                  <MenuItem value="V">V - Établissements de culte</MenuItem>
                  <MenuItem value="W">W - Administrations, banques, bureaux</MenuItem>
                  <MenuItem value="X">X - Établissements sportifs couverts</MenuItem>
                  <MenuItem value="Y">Y - Musées</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isIcpe}
                  onChange={(e) => handleFormChange('isIcpe', e.target.checked)}
                />
              }
              label="Installation Classée pour la Protection de l'Environnement (ICPE)"
            />

            {/* Level Assignments */}
            {levelAssignments.length > 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Affectation des niveaux aux étages de bâtiment
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Niveau</TableCell>
                        <TableCell>Étage de bâtiment</TableCell>
                        <TableCell>Nom de l&apos;étage de partie</TableCell>
                        <TableCell>Public</TableCell>
                        <TableCell>Personnel</TableCell>
                        <TableCell>Surface exploitation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {levelAssignments.map((assignment) => (
                        <TableRow key={assignment.levelNumber}>
                          <TableCell>
                            <Typography fontWeight="medium">
                              Niveau {assignment.levelNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <FormControl size="small" fullWidth>
                              <Select
                                value={assignment.buildingFloorId || ''}
                                onChange={(e) => updateLevelAssignment(
                                  assignment.levelNumber,
                                  'buildingFloorId',
                                  e.target.value === '' ? null : Number(e.target.value)
                                )}
                                displayEmpty
                              >
                                <MenuItem value="">Non affecté</MenuItem>
                                {getAvailableBuildingFloors(formData.buildingId).map((floor) => (
                                  <MenuItem key={floor.id} value={floor.id}>
                                    {floor.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              value={assignment.partFloorData?.name || ''}
                              onChange={(e) => updatePartFloorData(
                                assignment.levelNumber,
                                'name',
                                e.target.value
                              )}
                              placeholder={`Niveau ${assignment.levelNumber}`}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.partFloorData?.publicCount || 0}
                              onChange={(e) => updatePartFloorData(
                                assignment.levelNumber,
                                'publicCount',
                                parseInt(e.target.value) || 0
                              )}
                              inputProps={{ min: 0 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.partFloorData?.staffCount || 0}
                              onChange={(e) => updatePartFloorData(
                                assignment.levelNumber,
                                'staffCount',
                                parseInt(e.target.value) || 0
                              )}
                              inputProps={{ min: 0 }}
                              sx={{ width: 80 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              size="small"
                              type="number"
                              value={assignment.partFloorData?.exploitationSurface || 0}
                              onChange={(e) => updatePartFloorData(
                                assignment.levelNumber,
                                'exploitationSurface',
                                parseFloat(e.target.value) || 0
                              )}
                              inputProps={{ min: 0, step: 0.1 }}
                              sx={{ width: 100 }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'create' ? 'Créer' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartsTab; 