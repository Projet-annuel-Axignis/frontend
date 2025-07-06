/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { partFloorService } from '@/services/siteService';
import { Building, BuildingFloor, CreatePartDto, LevelAssignment, Part, PartFloor, UpdatePartDto } from '@/types/site';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
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
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface PartDialogProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  part?: Part | null;
  buildings: Building[];
  buildingFloors: BuildingFloor[];
  includeDeleted: boolean;
  onSubmit: (formData: CreatePartDto | UpdatePartDto, levelAssignments: LevelAssignment[], partId?: number) => Promise<void>;
}

const PartDialog: React.FC<PartDialogProps> = ({
  open,
  onClose,
  mode,
  part,
  buildings,
  buildingFloors,
  includeDeleted,
  onSubmit,
}) => {
  // Form states
  const [formData, setFormData] = useState<CreatePartDto>({
    name: '',
    buildingId: 0,
    type: 'PRIVATE',
    isIcpe: false,
    erpTypeCodes: ['J'],
    habFamilyName: undefined,
  });

  // Level assignment states
  const [levelAssignments, setLevelAssignments] = useState<LevelAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPartFloors, setLoadingPartFloors] = useState(false);

  // Helper function to get selected building
  const getSelectedBuilding = () => {
    return buildings.find(b => b.id === formData.buildingId);
  };

  // Helper function to check if building has specific typology
  const hasTypology = (typologyCode: string) => {
    const building = getSelectedBuilding();
    return building?.typologies?.some(t => t.code === typologyCode) || false;
  };

  // Load complete part floors data for editing
  const loadCompletePartFloors = async (partId: number): Promise<PartFloor[]> => {
    try {
      setLoadingPartFloors(true);
      const response = await partFloorService.getPartFloors({
        partId: partId,
        includeDeleted: true, // Include deleted to get complete data
      });
      return response.partFloors;
    } catch (error) {
      console.error('Error loading part floors:', error);
      return [];
    } finally {
      setLoadingPartFloors(false);
    }
  };

  // Initialize form data when dialog opens or part changes
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        const availableBuildings = buildings.filter(b => !b.deletedAt);
        setFormData({
          name: '',
          buildingId: availableBuildings.length > 0 ? availableBuildings[0].id : 0,
          type: 'PRIVATE',
          isIcpe: false,
          erpTypeCodes: ['J'],
          habFamilyName: undefined,
        });
        // Start with one level by default
        initializeLevelAssignments(1);
      } else if (part) {
        console.log('Part data:', part);
        setFormData({
          name: part.name,
          buildingId: part.building?.id || 0,
          type: part.type || 'PRIVATE',
          isIcpe: part.isIcpe,
          erpTypeCodes: part.erpTypes?.length > 0 ? part.erpTypes.map(erpType => erpType.code) : ['J'],
          habFamilyName: part.habFamily?.name,
        });

        // Load complete part floors data for editing
        if (part.id) {
          loadCompletePartFloors(part.id).then((completePartFloors) => {
            console.log('Complete part floors:', completePartFloors);
            initializeLevelAssignments(completePartFloors.length || 1, part, completePartFloors);
          });
        } else {
          initializeLevelAssignments(part.partFloors?.length || 1, part);
        }
      }
    }
  }, [open, mode, part, buildings]);

  // Initialize level assignments
  const initializeLevelAssignments = (levelCount: number, existingPart?: Part, completePartFloors?: PartFloor[]) => {
    const assignments: LevelAssignment[] = [];

    // Use complete part floors data if available, otherwise fallback to part.partFloors
    const partFloorsToUse = completePartFloors || existingPart?.partFloors || [];

    console.log('initializeLevelAssignments called with:', {
      levelCount,
      partFloorsToUse: partFloorsToUse.length,
      partFloors: partFloorsToUse
    });

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
          levelNumber: i,
        }
      });
    }

    // If editing, populate with existing data
    if (partFloorsToUse.length > 0) {
      console.log('Populating with existing part floors:', partFloorsToUse);

      partFloorsToUse.forEach((partFloor, index) => {
        console.log(`Processing partFloor ${index}:`, partFloor);

        // Find the assignment that corresponds to this partFloor's levelNumber
        const assignmentIndex = assignments.findIndex(a => a.levelNumber === partFloor.levelNumber);

        if (assignmentIndex !== -1) {
          // Use buildingFloor.id from complete data if available
          const buildingFloorId = partFloor.buildingFloor?.id || null;

          assignments[assignmentIndex].buildingFloorId = buildingFloorId;
          assignments[assignmentIndex].partFloorData = {
            name: partFloor.name,
            publicCount: partFloor.publicCount,
            staffCount: partFloor.staffCount,
            exploitationSurface: partFloor.exploitationSurface,
            glaSurface: partFloor.glaSurface,
            publicAccessSurface: partFloor.publicAccessSurface,
            levelNumber: partFloor.levelNumber,
          };

          console.log(`Level ${partFloor.levelNumber}: buildingFloorId = ${buildingFloorId}, updated assignment:`, assignments[assignmentIndex]);
        } else {
          console.warn(`No assignment found for levelNumber ${partFloor.levelNumber}`);
        }
      });
    }

    console.log('Final level assignments:', assignments);
    setLevelAssignments(assignments);
  };

  const handleFormChange = (field: keyof CreatePartDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLevel = () => {
    const newLevelNumber = levelAssignments.length + 1;
    const newAssignment: LevelAssignment = {
      levelNumber: newLevelNumber,
      buildingFloorId: null,
      partFloorData: {
        name: `Niveau ${newLevelNumber}`,
        publicCount: 0,
        staffCount: 0,
        exploitationSurface: 0,
        glaSurface: 0,
        publicAccessSurface: 0,
        levelNumber: newLevelNumber,
      }
    };
    setLevelAssignments(prev => [...prev, newAssignment]);
  };

  const removeSpecificLevel = (levelNumberToRemove: number) => {
    if (levelAssignments.length > 1) {
      // Remove the specific level
      const updatedAssignments = levelAssignments.filter(assignment => assignment.levelNumber !== levelNumberToRemove);

      // Renumber the remaining levels to maintain sequential order
      const renumberedAssignments = updatedAssignments.map((assignment, index) => ({
        ...assignment,
        levelNumber: index + 1,
        partFloorData: assignment.partFloorData ? {
          ...assignment.partFloorData,
          levelNumber: index + 1,
          name: assignment.partFloorData.name.replace(/Niveau \d+/, `Niveau ${index + 1}`)
        } : assignment.partFloorData
      }));

      setLevelAssignments(renumberedAssignments);
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
      .filter(floor => includeDeleted || !floor.deletedAt);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(formData, levelAssignments, part?.id);
      onClose();
    } catch (error) {
      console.error('Error in dialog submit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Show loading state while loading part floors data
  if (loadingPartFloors && mode === 'edit') {
    return (
      <Dialog open={open} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <Typography>Chargement des données de la partie...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}
      maxWidth="lg"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>
        {mode === 'create' ? 'Créer une partie' : 'Modifier la partie'}
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
              disabled={loading}
            />

            <FormControl required fullWidth disabled={loading}>
              <InputLabel>Bâtiment</InputLabel>
              <Select
                value={formData.buildingId}
                onChange={(e) => handleFormChange('buildingId', Number(e.target.value))}
                label="Bâtiment"
              >
                {buildings
                  .filter(building => includeDeleted || !building.deletedAt)
                  .map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl required fullWidth disabled={loading}>
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

            {hasTypology('ERP') && (
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Codes ERP</InputLabel>
                <Select
                  multiple
                  value={formData.erpTypeCodes || []}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleFormChange('erpTypeCodes', typeof value === 'string' ? value.split(',') : value);
                  }}
                  label="Codes ERP"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
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
            )}

            {hasTypology('HAB') && (
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Famille d&apos;habitation</InputLabel>
                <Select
                  value={formData.habFamilyName || ''}
                  onChange={(e) => handleFormChange('habFamilyName', e.target.value || undefined)}
                  label="Famille d'habitation"
                  displayEmpty
                >
                  <MenuItem value=""></MenuItem>
                  <MenuItem value="FIRST_FAMILY_SINGLE">1ère famille - Individuelle</MenuItem>
                  <MenuItem value="SECOND_FAMILY_SINGLE">2ème famille - Individuelle</MenuItem>
                  <MenuItem value="SECOND_FAMILY_COMMUNITY">2ème famille - Collective</MenuItem>
                  <MenuItem value="THIRD_FAMILY_COMMUNITY">3ème famille - Collective</MenuItem>
                  <MenuItem value="FOURTH_FAMILY_COMMUNITY">4ème famille - Collective</MenuItem>
                  <MenuItem value="RESIDENTIAL_ACCOMMODATION">Logement-foyer</MenuItem>
                  <MenuItem value="ELDERLY_ACCOMMODATION">Logement-foyer personnes âgées</MenuItem>
                  <MenuItem value="RESIDENTIAL_COVERED_CAR_PARK">Parc de stationnement couvert Habitation (PSH)</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isIcpe}
                onChange={(e) => handleFormChange('isIcpe', e.target.checked)}
                disabled={loading}
              />
            }
            label="Installation Classée pour la Protection de l'Environnement (ICPE)"
          />

          {/* Level Management */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Niveaux de la partie ({levelAssignments.length})
              </Typography>
              <IconButton
                onClick={addLevel}
                disabled={loading || levelAssignments.length >= 20}
                title="Ajouter un niveau"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabled',
                    color: 'action.disabled',
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {/* Desktop View */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {levelAssignments.map((assignment) => (
                  <Paper key={assignment.levelNumber} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Niveau {assignment.levelNumber}
                      </Typography>
                      {levelAssignments.length > 1 && (
                        <IconButton
                          onClick={() => removeSpecificLevel(assignment.levelNumber)}
                          color="error"
                          size="small"
                          disabled={loading}
                          title={`Supprimer le niveau ${assignment.levelNumber}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                      <FormControl size="small" fullWidth disabled={loading}>
                        <InputLabel>Étage de bâtiment</InputLabel>
                        <Select
                          label="Étage de bâtiment"
                          value={assignment.buildingFloorId || ''}
                          onChange={(e) => updateLevelAssignment(
                            assignment.levelNumber,
                            'buildingFloorId',
                            e.target.value === '' ? null : Number(e.target.value)
                          )}
                          displayEmpty
                        >
                          <MenuItem value=""></MenuItem>
                          {getAvailableBuildingFloors(formData.buildingId).map((floor) => (
                            <MenuItem key={floor.id} value={floor.id}>
                              {floor.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        label="Nom de l'étage de partie"
                        size="small"
                        value={assignment.partFloorData?.name || ''}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'name',
                          e.target.value
                        )}
                        placeholder={`Niveau ${assignment.levelNumber}`}
                        fullWidth
                        disabled={loading}
                      />

                      <TextField
                        label="Niveau de partie"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.levelNumber || assignment.levelNumber}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'levelNumber',
                          parseInt(e.target.value) || assignment.levelNumber
                        )}
                        inputProps={{ min: 0 }}
                        fullWidth
                        disabled={loading}
                      />

                      <TextField
                        label="Public"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.publicCount || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'publicCount',
                          parseInt(e.target.value) || 0
                        )}
                        inputProps={{ min: 0 }}
                        fullWidth
                        disabled={loading}
                      />

                      <TextField
                        label="Personnel"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.staffCount || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'staffCount',
                          parseInt(e.target.value) || 0
                        )}
                        inputProps={{ min: 0 }}
                        fullWidth
                        disabled={loading}
                      />

                      <TextField
                        label="Surface exploitation"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.exploitationSurface || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'exploitationSurface',
                          parseFloat(e.target.value) || 0
                        )}
                        inputProps={{ min: 0, step: 0.1 }}
                        fullWidth
                        disabled={loading}
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>
                          }
                        }}
                      />

                      <TextField
                        label="Surface GLA"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.glaSurface || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'glaSurface',
                          parseFloat(e.target.value) || 0
                        )}
                        inputProps={{ min: 0, step: 0.1 }}
                        fullWidth
                        disabled={loading}
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>
                          }
                        }}
                      />

                      <TextField
                        label="Surface accès public"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.publicAccessSurface || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'publicAccessSurface',
                          parseFloat(e.target.value) || 0
                        )}
                        inputProps={{ min: 0, step: 0.1 }}
                        fullWidth
                        disabled={loading}
                        slotProps={{
                          input: {
                            endAdornment: <InputAdornment position="end">m²</InputAdornment>
                          }
                        }}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Mobile View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {levelAssignments.map((assignment) => (
                  <Paper key={assignment.levelNumber} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        Niveau {assignment.levelNumber}
                      </Typography>
                      {levelAssignments.length > 1 && (
                        <IconButton
                          onClick={() => removeSpecificLevel(assignment.levelNumber)}
                          color="error"
                          size="small"
                          disabled={loading}
                          title={`Supprimer le niveau ${assignment.levelNumber}`}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <FormControl size="small" fullWidth disabled={loading}>
                        <InputLabel>Étage de bâtiment</InputLabel>
                        <Select
                          label="Étage de bâtiment"
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

                      <TextField
                        label="Nom de l'étage de partie"
                        size="small"
                        value={assignment.partFloorData?.name || ''}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'name',
                          e.target.value
                        )}
                        placeholder={`Niveau ${assignment.levelNumber}`}
                        fullWidth
                        disabled={loading}
                      />

                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <TextField
                          label="Niveau de partie"
                          size="small"
                          type="number"
                          value={assignment.partFloorData?.levelNumber || assignment.levelNumber}
                          onChange={(e) => updatePartFloorData(
                            assignment.levelNumber,
                            'levelNumber',
                            parseInt(e.target.value) || assignment.levelNumber
                          )}
                          inputProps={{ min: 0 }}
                          fullWidth
                          disabled={loading}
                        />

                        <TextField
                          label="Public"
                          size="small"
                          type="number"
                          value={assignment.partFloorData?.publicCount || 0}
                          onChange={(e) => updatePartFloorData(
                            assignment.levelNumber,
                            'publicCount',
                            parseInt(e.target.value) || 0
                          )}
                          inputProps={{ min: 0 }}
                          fullWidth
                          disabled={loading}
                        />
                      </Box>

                      <TextField
                        label="Personnel"
                        size="small"
                        type="number"
                        value={assignment.partFloorData?.staffCount || 0}
                        onChange={(e) => updatePartFloorData(
                          assignment.levelNumber,
                          'staffCount',
                          parseInt(e.target.value) || 0
                        )}
                        inputProps={{ min: 0 }}
                        fullWidth
                        disabled={loading}
                      />

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Surface exploitation"
                          size="small"
                          type="number"
                          value={assignment.partFloorData?.exploitationSurface || 0}
                          onChange={(e) => updatePartFloorData(
                            assignment.levelNumber,
                            'exploitationSurface',
                            parseFloat(e.target.value) || 0
                          )}
                          inputProps={{ min: 0, step: 0.1 }}
                          fullWidth
                          disabled={loading}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">m²</InputAdornment>
                            }
                          }}
                        />

                        <TextField
                          label="Surface GLA"
                          size="small"
                          type="number"
                          value={assignment.partFloorData?.glaSurface || 0}
                          onChange={(e) => updatePartFloorData(
                            assignment.levelNumber,
                            'glaSurface',
                            parseFloat(e.target.value) || 0
                          )}
                          inputProps={{ min: 0, step: 0.1 }}
                          fullWidth
                          disabled={loading}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">m²</InputAdornment>
                            }
                          }}
                        />

                        <TextField
                          label="Surface accès public"
                          size="small"
                          type="number"
                          value={assignment.partFloorData?.publicAccessSurface || 0}
                          onChange={(e) => updatePartFloorData(
                            assignment.levelNumber,
                            'publicAccessSurface',
                            parseFloat(e.target.value) || 0
                          )}
                          inputProps={{ min: 0, step: 0.1 }}
                          fullWidth
                          disabled={loading}
                          slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">m²</InputAdornment>
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            minWidth: 'auto',
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
          }}
        >
          {loading ? 'Enregistrement...' : (mode === 'create' ? 'Créer' : 'Modifier')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PartDialog; 