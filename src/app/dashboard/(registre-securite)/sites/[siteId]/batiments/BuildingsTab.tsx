'use client';

import { useLoading } from '@/hooks/useLoading';
import { buildingService } from '@/services/siteService';
import { Building, CreateBuildingDto, UpdateBuildingDto } from '@/types/site';
import {
  Add as AddIcon,
  Apartment as ApartmentIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BuildingDialog from './BuildingDialog';

interface BuildingsTabProps {
  siteId: number;
  onNotification: (message: string, severity: 'success' | 'error') => void;
  disabled?: boolean;
}

const BuildingsTab: React.FC<BuildingsTabProps> = ({
  siteId,
  onNotification,
  disabled = false,
}) => {
  const { isLoading: actionLoading, withLoading } = useLoading();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data states
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(null);

  // Load buildings
  useEffect(() => {
    loadBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteId, search, includeDeleted]);

  // Check for edit parameter in URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && buildings.length > 0) {
      const buildingToEdit = buildings.find(b => b.id === parseInt(editId));
      if (buildingToEdit) {
        handleEditBuilding(buildingToEdit);
        // Remove the edit parameter from URL
        const url = new URL(window.location.href);
        url.searchParams.delete('edit');
        router.replace(url.pathname + url.search);
      }
    }
  }, [buildings, searchParams, router]);

  const loadBuildings = async () => {
    try {
      setDataLoading(true);
      const result = await buildingService.getBuildings({
        siteId,
        search,
        includeDeleted,
      });

      setBuildings(result.buildings);
    } catch (error) {
      console.error('Error loading buildings:', error);
      onNotification('Erreur lors du chargement des bâtiments', 'error');
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateBuilding = () => {
    setEditingBuilding(null);
    setDialogOpen(true);
  };

  const handleEditBuilding = (building: Building) => {
    setEditingBuilding(building);
    setDialogOpen(true);
  };

  const handleDeleteBuilding = (building: Building) => {
    setBuildingToDelete(building);
    setDeleteDialogOpen(true);
  };

  const handleRestoreBuilding = async (building: Building) => {
    await withLoading(async () => {
      try {
        await buildingService.updateBuilding(building.id, { deletedAt: undefined });
        await loadBuildings();
        onNotification('Bâtiment restauré avec succès', 'success');
      } catch (error) {
        console.error('Error restoring building:', error);
        onNotification('Erreur lors de la restauration du bâtiment', 'error');
      }
    });
  };

  const confirmDeleteBuilding = async () => {
    if (!buildingToDelete) return;

    await withLoading(async () => {
      try {
        await buildingService.deleteBuilding(buildingToDelete.id);
        await loadBuildings();
        onNotification('Bâtiment supprimé avec succès', 'success');
        setDeleteDialogOpen(false);
        setBuildingToDelete(null);
      } catch (error) {
        console.error('Error deleting building:', error);
        onNotification('Erreur lors de la suppression du bâtiment', 'error');
      }
    });
  };

  const handleSubmitBuilding = async (data: CreateBuildingDto | UpdateBuildingDto) => {
    await withLoading(async () => {
      try {
        if (editingBuilding) {
          await buildingService.updateBuilding(editingBuilding.id, data as UpdateBuildingDto);
          onNotification('Bâtiment modifié avec succès', 'success');
        } else {
          await buildingService.createBuilding({ ...data, siteId } as CreateBuildingDto);
          onNotification('Bâtiment créé avec succès', 'success');
        }

        await loadBuildings();
        setDialogOpen(false);
        setEditingBuilding(null);
      } catch (error) {
        console.error('Error submitting building:', error);
        throw error;
      }
    });
  };

  const handleResetFilters = () => {
    setSearch('');
    setIncludeDeleted(false);
  };

  // Filter buildings
  const filteredBuildings = buildings.filter(building => {
    if (!includeDeleted && building.deletedAt) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return building.name.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <Box>
      {/* Filters */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <TextField
          label="Rechercher"
          placeholder="Nom du bâtiment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 250 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={includeDeleted}
              onChange={(e) => setIncludeDeleted(e.target.checked)}
              size="small"
            />
          }
          label="Inclure supprimés"
        />

        <IconButton
          onClick={handleResetFilters}
          size="small"
          sx={{
            bgcolor: 'grey.100',
            '&:hover': { bgcolor: 'grey.200' }
          }}
          title="Réinitialiser les filtres"
        >
          <ClearIcon />
        </IconButton>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateBuilding}
          disabled={disabled || actionLoading || dataLoading}
          sx={{
            ml: 'auto',
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          Nouveau bâtiment
        </Button>
      </Box>

      {/* Results Summary */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {dataLoading ? 'Chargement...' : `${filteredBuildings.length} bâtiment${filteredBuildings.length !== 1 ? 's' : ''} trouvé${filteredBuildings.length !== 1 ? 's' : ''}`}
        </Typography>
      </Box>

      {/* Content */}
      {dataLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress size={32} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Chargement des bâtiments...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Buildings Grid */}
          {filteredBuildings.length > 0 ? (
            <Grid container spacing={3}>
              {filteredBuildings.map((building) => (
                <Grid key={building.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <BuildingCard
                    building={building}
                    onEdit={handleEditBuilding}
                    onDelete={handleDeleteBuilding}
                    onRestore={handleRestoreBuilding}
                    disabled={disabled || actionLoading}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            /* Empty State */
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <ApartmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucun bâtiment trouvé
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {search || includeDeleted
                  ? 'Aucun bâtiment ne correspond à vos critères.'
                  : 'Commencez par créer votre premier bâtiment.'
                }
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* Building Dialog */}
      <BuildingDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingBuilding(null);
        }}
        onSubmit={handleSubmitBuilding}
        building={editingBuilding}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setBuildingToDelete(null);
        }}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le bâtiment &quot;{buildingToDelete?.name}&quot; ?
            Cette action supprimera également tous les étages et parties associés.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setBuildingToDelete(null);
            }}
            disabled={actionLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={confirmDeleteBuilding}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Building Card Component
interface BuildingCardProps {
  building: Building;
  onEdit: (building: Building) => void;
  onDelete: (building: Building) => void;
  onRestore: (building: Building) => void;
  disabled?: boolean;
}

const BuildingCard = ({
  building,
  onEdit,
  onDelete,
  onRestore,
  disabled = false,
}: BuildingCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  console.log(building);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isDeleted = !!building.deletedAt;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isDeleted ? 0.6 : 1,
        border: isDeleted ? '1px solid' : 'none',
        borderColor: isDeleted ? 'error.main' : 'transparent',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: isDeleted ? 'error.main' : 'primary.main',
              mr: 2,
              width: 40,
              height: 40,
            }}
          >
            {getInitials(building.name)}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                mb: 1,
                textDecoration: isDeleted ? 'line-through' : 'none',
              }}
            >
              {building.name}
            </Typography>

            {/* ERP Category */}
            {building.erpCategory && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ERP :
                </Typography>
                <Chip
                  label={`Catégorie ${building.erpCategory?.category} / Groupe ${building.erpCategory?.group}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Codes */}
            <Box sx={{ mb: 1 }}>
              {/* Typologies */}
              {building.typologies.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Typologies :
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {building.typologies.map((typology, index) => (
                      <Chip
                        key={index}
                        label={typology.code}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* IGH Classes */}
              {building.ighClasses.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    IGH :
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {building.ighClasses.map((ighClass, index) => (
                      <Chip
                        key={`igh-${index}`}
                        label={ighClass.code}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Status */}
            {isDeleted && (
              <Chip
                label="Supprimé"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Box>

          <IconButton
            onClick={handleClick}
            size="small"
            disabled={disabled}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </CardContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {!isDeleted && (
          <MenuItem onClick={() => { onEdit(building); handleClose(); }}>
            <EditIcon sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
        )}

        {isDeleted ? (
          <MenuItem onClick={() => { onRestore(building); handleClose(); }}>
            <RestoreIcon sx={{ mr: 1 }} />
            Restaurer
          </MenuItem>
        ) : (
          <MenuItem onClick={() => { onDelete(building); handleClose(); }} sx={{ color: 'error.main' }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Supprimer
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default BuildingsTab; 