/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { buildingService, partFloorService, partService } from '@/services/siteService';
import { Building, CreatePartDto, Part, PartFloor, UpdatePartDto } from '@/types/site';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
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
  showAdvanced: boolean;
}

const PartsTab: React.FC<PartsTabProps> = ({ siteId, onNotification, disabled = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data states
  const [parts, setParts] = useState<Part[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [partFloors, setPartFloors] = useState<PartFloor[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    search: '',
    buildingId: '',
    includeDeleted: false,
    showAdvanced: false,
  });

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreatePartDto>({
    name: '',
    buildingId: 0,
    partFloorId: 0,
    type: 'PRIVATE',
    isIcpe: false,
    erpTypeCodes: 'J',
  });

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
      // Load buildings for the site
      const buildingsData = await buildingService.getBuildings({
        siteId,
        includeDeleted: filters.includeDeleted,
      });
      setBuildings(buildingsData.buildings);

      // Load part floors
      const partFloorsData = await partFloorService.getPartFloors({
        includeDeleted: filters.includeDeleted,
      });
      setPartFloors(partFloorsData.partFloors);

      // Load parts
      const partsData = await partService.getParts({
        includeDeleted: filters.includeDeleted,
      });
      // Filter parts to only show those belonging to buildings in this site
      const sitePartFloorIds = partFloorsData.partFloors
        .filter(pf => buildingsData.buildings.some(b => b.id === pf.buildingFloorId))
        .map(pf => pf.id);

      const siteParts = partsData.parts.filter(part =>
        part.partFloorId && sitePartFloorIds.includes(part.partFloorId)
      );
      setParts(siteParts);
    } catch (error) {
      console.error('Error loading data:', error);
      onNotification('Erreur lors du chargement des données', 'error');
    }
    setLoading(false);
  };

  const filterParts = () => {
    let filtered = [...parts];

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
      const buildingPartFloorIds = partFloors
        .filter(pf => pf.buildingFloorId === filters.buildingId)
        .map(pf => pf.id);
      filtered = filtered.filter(part =>
        part.partFloorId && buildingPartFloorIds.includes(part.partFloorId)
      );
    }

    setFilteredParts(filtered);
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({
      search: '',
      buildingId: '',
      includeDeleted: false,
      showAdvanced: false,
    });
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedPart(null);
    setFormData({
      name: '',
      buildingId: buildings.length > 0 ? buildings[0].id : 0,
      partFloorId: 0,
      type: 'PRIVATE',
      isIcpe: false,
      erpTypeCodes: 'J',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (part: Part) => {
    setDialogMode('edit');
    setSelectedPart(part);
    setFormData({
      name: part.name,
      buildingId: part.buildingId || 0,
      partFloorId: part.partFloorId || 0,
      type: part.type,
      isIcpe: part.isIcpe,
      erpTypeCodes: part.erpTypeCodes || 'J',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedPart(null);
  };

  const handleFormChange = (field: keyof CreatePartDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getAvailablePartFloors = (buildingId: number) => {
    return partFloors.filter(pf => {
      const building = buildings.find(b => b.id === buildingId);
      if (!building) return false;
      // Check if partFloor belongs to this building
      return pf.buildingFloorId === buildingId; // Cette relation doit être clarifiée dans l'API
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await partService.createPart(formData);
        onNotification('Partie créée avec succès', 'success');
      } else if (selectedPart) {
        const updateData: UpdatePartDto = {
          name: formData.name,
          type: formData.type,
          isIcpe: formData.isIcpe,
          erpTypeCodes: formData.erpTypeCodes,
        };
        await partService.updatePart(selectedPart.id, updateData);
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

  const getBuildingName = (buildingId?: number) => {
    if (!buildingId) return 'Non défini';
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : `ID: ${buildingId}`;
  };

  const getPartFloorName = (partFloorId?: number) => {
    if (!partFloorId) return 'Non défini';
    const partFloor = partFloors.find(pf => pf.id === partFloorId);
    return partFloor ? partFloor.name : `ID: ${partFloorId}`;
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
              <strong>Bâtiment :</strong> {getBuildingName(part.buildingId)}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Étage de partie :</strong> {getPartFloorName(part.partFloorId)}
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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ViewModuleIcon />
          Parties de Bâtiment
        </Typography>

        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ ml: { sm: 'auto' } }}
          >
            {isMobile ? '' : 'Nouvelle partie'}
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
          <TextField
            placeholder="Rechercher une partie..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1 }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => handleFilterChange('showAdvanced', !filters.showAdvanced)}
          >
            Filtres avancés
          </Button>
        </Box>

        {/* Advanced Filters */}
        <Accordion expanded={filters.showAdvanced} onChange={() => handleFilterChange('showAdvanced', !filters.showAdvanced)}>
          <AccordionSummary />
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Bâtiment</InputLabel>
                <Select
                  value={filters.buildingId}
                  onChange={(e) => handleFilterChange('buildingId', e.target.value)}
                  label="Bâtiment"
                >
                  <MenuItem value="">Tous</MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityOffIcon />}
                  onClick={() => handleFilterChange('includeDeleted', !filters.includeDeleted)}
                  color={filters.includeDeleted ? 'primary' : 'inherit'}
                >
                  Inclure supprimés
                </Button>

                <Button
                  variant="outlined"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>

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
                    <TableCell>Étage de partie</TableCell>
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
                      <TableCell>{getBuildingName(part.buildingId)}</TableCell>
                      <TableCell>{getPartFloorName(part.partFloorId)}</TableCell>
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
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer une partie' : 'Modifier la partie'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
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
                {buildings.map((building) => (
                  <MenuItem key={building.id} value={building.id}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required fullWidth>
              <InputLabel>Étage de partie</InputLabel>
              <Select
                value={formData.partFloorId}
                onChange={(e) => handleFormChange('partFloorId', Number(e.target.value))}
                label="Étage de partie"
              >
                {partFloors.map((partFloor) => (
                  <MenuItem key={partFloor.id} value={partFloor.id}>
                    {partFloor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isIcpe}
                  onChange={(e) => handleFormChange('isIcpe', e.target.checked)}
                />
              }
              label="Installation Classée pour la Protection de l'Environnement (ICPE)"
            />
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