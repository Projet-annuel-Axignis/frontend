/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';

import { buildingFloorService, partFloorService } from '@/services/siteService';
import { BuildingFloor, CreatePartFloorDto, PartFloor, UpdatePartFloorDto } from '@/types/site';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Stairs as StairsIcon,
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
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
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
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface PartFloorsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

interface Filters {
  search: string;
  buildingFloorId: number | '';
  includeDeleted: boolean;
  showAdvanced: boolean;
}

const PartFloorsTab: React.FC<PartFloorsTabProps> = ({
  siteId,
  onNotification,
  disabled = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data states
  const [partFloors, setPartFloors] = useState<PartFloor[]>([]);
  const [buildingFloors, setBuildingFloors] = useState<BuildingFloor[]>([]);
  const [filteredPartFloors, setFilteredPartFloors] = useState<PartFloor[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<Filters>({
    search: '',
    buildingFloorId: '',
    includeDeleted: false,
    showAdvanced: false,
  });

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedPartFloor, setSelectedPartFloor] = useState<PartFloor | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreatePartFloorDto>({
    name: '',
    publicCount: 0,
    staffCount: 0,
    exploitationSurface: 0,
    glaSurface: 0,
    publicAccessSurface: 0,
    buildingFloorId: 0,
  });

  // Load data
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, filters.includeDeleted]);

  // Filter part floors when search or building floor filter changes
  useEffect(() => {
    filterPartFloors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partFloors, filters.search, filters.buildingFloorId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load building floors for the site
      const buildingFloorsData = await buildingFloorService.getBuildingFloors({
        siteId,
        includeDeleted: filters.includeDeleted,
      });
      setBuildingFloors(buildingFloorsData.buildingFloors);

      // Load part floors
      const partFloorsData = await partFloorService.getPartFloors({
        includeDeleted: filters.includeDeleted,
      });
      setPartFloors(partFloorsData.partFloors);
    } catch (error) {
      console.error('Error loading data:', error);
      onNotification('Erreur lors du chargement des données', 'error');
    }
    setLoading(false);
  };

  const filterPartFloors = () => {
    let filtered = [...partFloors];

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(partFloor =>
        partFloor.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by building floor
    if (filters.buildingFloorId) {
      filtered = filtered.filter(partFloor =>
        partFloor.buildingFloorId === filters.buildingFloorId
      );
    }

    setFilteredPartFloors(filtered);
  };

  const handleFilterChange = (field: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFilters({
      search: '',
      buildingFloorId: '',
      includeDeleted: false,
      showAdvanced: false,
    });
  };

  const openCreateDialog = () => {
    setDialogMode('create');
    setSelectedPartFloor(null);
    setFormData({
      name: '',
      publicCount: 0,
      staffCount: 0,
      exploitationSurface: 0,
      glaSurface: 0,
      publicAccessSurface: 0,
      buildingFloorId: 0,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (partFloor: PartFloor) => {
    setDialogMode('edit');
    setSelectedPartFloor(partFloor);
    setFormData({
      name: partFloor.name,
      publicCount: partFloor.publicCount,
      staffCount: partFloor.staffCount,
      exploitationSurface: partFloor.exploitationSurface,
      glaSurface: partFloor.glaSurface,
      publicAccessSurface: partFloor.publicAccessSurface,
      buildingFloorId: partFloor.buildingFloorId || 0,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedPartFloor(null);
  };

  const handleFormChange = (field: keyof CreatePartFloorDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await partFloorService.createPartFloor(formData);
        onNotification('Étage de partie créé avec succès', 'success');
      } else if (selectedPartFloor) {
        const updateData: UpdatePartFloorDto = { ...formData };
        await partFloorService.updatePartFloor(selectedPartFloor.id, updateData);
        onNotification('Étage de partie modifié avec succès', 'success');
      }

      closeDialog();
      loadData();
    } catch (error) {
      console.error('Error saving part floor:', error);
      onNotification('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDelete = async (partFloor: PartFloor) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étage de partie "${partFloor.name}" ?`)) {
      try {
        await partFloorService.deletePartFloor(partFloor.id);
        onNotification('Étage de partie supprimé avec succès', 'success');
        loadData();
      } catch (error) {
        console.error('Error deleting part floor:', error);
        onNotification('Erreur lors de la suppression', 'error');
      }
    }
  };

  const getBuildingFloorName = (buildingFloorId?: number) => {
    if (!buildingFloorId) return 'Non défini';
    const buildingFloor = buildingFloors.find(bf => bf.id === buildingFloorId);
    return buildingFloor ? buildingFloor.name : `ID: ${buildingFloorId}`;
  };

  const isDeleted = (partFloor: PartFloor) => !!partFloor.deletedAt;

  // Render mobile card view
  const renderCard = (partFloor: PartFloor) => (
    <Card key={partFloor.id} sx={{ mb: 2, opacity: isDeleted(partFloor) ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              textDecoration: isDeleted(partFloor) ? 'line-through' : 'none',
              flex: 1,
            }}
          >
            {partFloor.name}
          </Typography>
          {isDeleted(partFloor) && (
            <Chip label="Supprimé" color="error" size="small" />
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Étage de bâtiment :</strong> {getBuildingFloorName(partFloor.buildingFloorId)}
            </Typography>
          </Grid>

          <Grid xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Public :</strong> {partFloor.publicCount}
            </Typography>
          </Grid>

          <Grid xs={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Personnel :</strong> {partFloor.staffCount}
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Surface exploitation :</strong> {partFloor.exploitationSurface} m²
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Surface GLA :</strong> {partFloor.glaSurface} m²
            </Typography>
          </Grid>

          <Grid xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>Surface accès public :</strong> {partFloor.publicAccessSurface} m²
            </Typography>
          </Grid>
        </Grid>
      </CardContent>

      {!disabled && (
        <CardActions>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => openEditDialog(partFloor)}
            disabled={isDeleted(partFloor)}
          >
            Modifier
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(partFloor)}
            disabled={isDeleted(partFloor)}
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
          <StairsIcon />
          Étages de Partie
        </Typography>

        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            sx={{ ml: { sm: 'auto' } }}
          >
            {isMobile ? '' : 'Nouvel étage'}
          </Button>
        )}
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
          <TextField
            placeholder="Rechercher un étage..."
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
                <InputLabel>Étage de bâtiment</InputLabel>
                <Select
                  value={filters.buildingFloorId}
                  onChange={(e) => handleFilterChange('buildingFloorId', e.target.value)}
                  label="Étage de bâtiment"
                >
                  <MenuItem value="">Tous</MenuItem>
                  {buildingFloors.map((buildingFloor) => (
                    <MenuItem key={buildingFloor.id} value={buildingFloor.id}>
                      {buildingFloor.name}
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
      ) : filteredPartFloors.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <StairsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun étage de partie trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {partFloors.length === 0
              ? "Commencez par créer votre premier étage de partie"
              : "Aucun étage ne correspond à vos critères de recherche"}
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
                    <TableCell>Étage de bâtiment</TableCell>
                    <TableCell align="right">Public</TableCell>
                    <TableCell align="right">Personnel</TableCell>
                    <TableCell align="right">Surf. exploitation</TableCell>
                    <TableCell align="right">Surf. GLA</TableCell>
                    <TableCell align="right">Surf. accès public</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPartFloors.map((partFloor) => (
                    <TableRow
                      key={partFloor.id}
                      sx={{ opacity: isDeleted(partFloor) ? 0.6 : 1 }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            sx={{
                              textDecoration: isDeleted(partFloor) ? 'line-through' : 'none',
                            }}
                          >
                            {partFloor.name}
                          </Typography>
                          {isDeleted(partFloor) && (
                            <Chip label="Supprimé" color="error" size="small" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{getBuildingFloorName(partFloor.buildingFloorId)}</TableCell>
                      <TableCell align="right">{partFloor.publicCount}</TableCell>
                      <TableCell align="right">{partFloor.staffCount}</TableCell>
                      <TableCell align="right">{partFloor.exploitationSurface} m²</TableCell>
                      <TableCell align="right">{partFloor.glaSurface} m²</TableCell>
                      <TableCell align="right">{partFloor.publicAccessSurface} m²</TableCell>
                      <TableCell>
                        {!disabled && (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => openEditDialog(partFloor)}
                              disabled={isDeleted(partFloor)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(partFloor)}
                              disabled={isDeleted(partFloor)}
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
            {filteredPartFloors.map(renderCard)}
          </Box>
        </>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer un étage de partie' : 'Modifier l\'étage de partie'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nom de l'étage de partie"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              fullWidth
            />

            <FormControl required fullWidth>
              <InputLabel>Étage de bâtiment</InputLabel>
              <Select
                value={formData.buildingFloorId}
                onChange={(e) => handleFormChange('buildingFloorId', Number(e.target.value))}
                label="Étage de bâtiment"
              >
                {buildingFloors.map((buildingFloor) => (
                  <MenuItem key={buildingFloor.id} value={buildingFloor.id}>
                    {buildingFloor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider />

            <Typography variant="h6">Compteurs</Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nombre de public"
                type="number"
                value={formData.publicCount}
                onChange={(e) => handleFormChange('publicCount', Number(e.target.value))}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Nombre de personnel"
                type="number"
                value={formData.staffCount}
                onChange={(e) => handleFormChange('staffCount', Number(e.target.value))}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
            </Box>

            <Divider />

            <Typography variant="h6">Surfaces (m²)</Typography>

            <TextField
              label="Surface d'exploitation"
              type="number"
              value={formData.exploitationSurface}
              onChange={(e) => handleFormChange('exploitationSurface', Number(e.target.value))}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />

            <TextField
              label="Surface GLA"
              type="number"
              value={formData.glaSurface}
              onChange={(e) => handleFormChange('glaSurface', Number(e.target.value))}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
            />

            <TextField
              label="Surface d'accès public"
              type="number"
              value={formData.publicAccessSurface}
              onChange={(e) => handleFormChange('publicAccessSurface', Number(e.target.value))}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.1 }}
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

export default PartFloorsTab; 