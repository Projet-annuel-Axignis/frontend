/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Building, CreateLotDto, Lot, Part, PartFloor, UpdateLotDto } from '@/types/site';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface LotDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateLotDto | UpdateLotDto) => Promise<void>;
  editingLot: Lot | null;
  buildings: Building[];
  parts: Part[];
  partFloorsMap: Map<number, PartFloor[]>;
  includeDeleted?: boolean;
}

interface LotFormData {
  name: string;
  buildingId: number;
  partId: number;
  partFloorId: number;
}

interface LotFormErrors {
  name?: string;
  buildingId?: string;
  partId?: string;
  partFloorId?: string;
}

const LotDialog = ({
  open,
  onClose,
  onSave,
  editingLot,
  buildings,
  parts,
  partFloorsMap,
  includeDeleted = false
}: LotDialogProps) => {
  // Form state
  const [formData, setFormData] = useState<LotFormData>({
    name: '',
    buildingId: 0,
    partId: 0,
    partFloorId: 0,
  });
  const [formErrors, setFormErrors] = useState<LotFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available options for form based on hierarchical selections
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [availablePartFloors, setAvailablePartFloors] = useState<PartFloor[]>([]);

  // Initialize form data when dialog opens or editingLot changes
  useEffect(() => {
    if (open) {
      if (editingLot) {
        // Find the part that contains this partFloor
        const relatedPart = findPartForPartFloor(editingLot.partFloor?.id || 0);
        setFormData({
          name: editingLot.name,
          buildingId: editingLot.building?.id || 0,
          partId: relatedPart?.id || 0,
          partFloorId: editingLot.partFloor?.id || 0,
        });
      } else {
        setFormData({
          name: '',
          buildingId: 0,
          partId: 0,
          partFloorId: 0,
        });
      }
      setFormErrors({});
    }
  }, [open, editingLot]);

  // Update available parts when building changes
  useEffect(() => {
    updateAvailableParts();
  }, [formData.buildingId, parts]);

  // Update available part floors when part changes
  useEffect(() => {
    updateAvailablePartFloors();
  }, [formData.partId, partFloorsMap]);

  const findPartForPartFloor = (partFloorId: number): Part | undefined => {
    for (const [partId, partFloors] of partFloorsMap.entries()) {
      if (partFloors.some(pf => pf.id === partFloorId)) {
        return parts.find(p => p.id === partId);
      }
    }
    return undefined;
  };

  const updateAvailableParts = () => {
    if (formData.buildingId) {
      const partsForBuilding = parts.filter(
        part => part.building?.id === formData.buildingId && !part.deletedAt
      );
      setAvailableParts(partsForBuilding);

      // Reset part selection if current selection is not available
      if (formData.partId && !partsForBuilding.find(p => p.id === formData.partId)) {
        setFormData(prev => ({ ...prev, partId: 0, partFloorId: 0 }));
      }
    } else {
      setAvailableParts([]);
      setFormData(prev => ({ ...prev, partId: 0, partFloorId: 0 }));
    }
  };

  const updateAvailablePartFloors = () => {
    if (formData.partId) {
      const partFloors = partFloorsMap.get(formData.partId) || [];
      const activePartFloors = partFloors.filter(pf => !pf.deletedAt);
      setAvailablePartFloors(activePartFloors);

      // Reset part floor selection if current selection is not available
      if (formData.partFloorId && !activePartFloors.find(pf => pf.id === formData.partFloorId)) {
        setFormData(prev => ({ ...prev, partFloorId: 0 }));
      }
    } else {
      setAvailablePartFloors([]);
      setFormData(prev => ({ ...prev, partFloorId: 0 }));
    }
  };

  const validateForm = (): boolean => {
    const errors: LotFormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom du lot est obligatoire';
    }

    if (!formData.buildingId) {
      errors.buildingId = 'Le bâtiment est obligatoire';
    }

    if (!formData.partId) {
      errors.partId = 'La partie est obligatoire';
    }

    if (!formData.partFloorId) {
      errors.partFloorId = 'L\'étage de partie est obligatoire';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      if (editingLot) {
        // Update existing lot
        const updateData: UpdateLotDto = {
          name: formData.name.trim(),
          partFloorId: formData.partFloorId,
        };
        await onSave(updateData);
      } else {
        // Create new lot - we need to get buildingFloorId from the selected partFloor
        const selectedPartFloor = availablePartFloors.find(pf => pf.id === formData.partFloorId);
        if (!selectedPartFloor) {
          throw new Error('Étage de partie non trouvé');
        }

        const createData: CreateLotDto = {
          name: formData.name.trim(),
          buildingId: formData.buildingId,
          buildingFloorId: selectedPartFloor.buildingFloor.id,
          partFloorId: formData.partFloorId,
        };
        await onSave(createData);
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      {/* Create/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
              disabled={isSubmitting}
            />

            <FormControl fullWidth error={!!formErrors.buildingId}>
              <InputLabel>Bâtiment *</InputLabel>
              <Select
                value={formData.buildingId || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  buildingId: Number(e.target.value),
                  partId: 0,
                  partFloorId: 0
                }))}
                label="Bâtiment *"
                disabled={!!editingLot || isSubmitting} // Can't change building when editing
              >
                {buildings
                  .filter(building => includeDeleted || !building.deletedAt)
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

            <FormControl fullWidth error={!!formErrors.partId}>
              <InputLabel>Partie *</InputLabel>
              <Select
                value={formData.partId || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  partId: Number(e.target.value),
                  partFloorId: 0
                }))}
                label="Partie *"
                disabled={!formData.buildingId || (!!editingLot) || isSubmitting} // Can't change part when editing
              >
                {availableParts.length === 0 ? (
                  <MenuItem disabled>
                    <em>Aucune partie disponible dans ce bâtiment</em>
                  </MenuItem>
                ) : (
                  availableParts.map((part) => (
                    <MenuItem key={part.id} value={part.id}>
                      {part.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formErrors.partId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {formErrors.partId}
                </Typography>
              )}
              {formData.buildingId && availableParts.length === 0 && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, ml: 1.5 }}>
                  Aucune partie trouvée dans ce bâtiment. Créez d&apos;abord des parties pour pouvoir ajouter des lots.
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.partFloorId}>
              <InputLabel>Étage de partie *</InputLabel>
              <Select
                value={formData.partFloorId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, partFloorId: Number(e.target.value) }))}
                label="Étage de partie *"
                disabled={!formData.partId || isSubmitting}
              >
                {availablePartFloors.length === 0 ? (
                  <MenuItem disabled>
                    <em>Aucun étage disponible dans cette partie</em>
                  </MenuItem>
                ) : (
                  availablePartFloors.map((partFloor) => (
                    <MenuItem key={partFloor.id} value={partFloor.id}>
                      {partFloor.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {formErrors.partFloorId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {formErrors.partFloorId}
                </Typography>
              )}
              {formData.partId && availablePartFloors.length === 0 && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, ml: 1.5 }}>
                  Aucun étage trouvé dans cette partie. Créez d&apos;abord des étages de partie pour pouvoir ajouter des lots.
                </Typography>
              )}
            </FormControl>

            {/* Preview of hierarchy */}
            {formData.buildingId && formData.partId && formData.partFloorId && (
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Aperçu de la hiérarchie :
                  </Typography>
                  <Typography variant="body2">
                    <strong>Site</strong> ({buildings.find(b => b.id === formData.buildingId)?.site?.name})
                    {' → '}
                    <strong>{buildings.find(b => b.id === formData.buildingId)?.name}</strong>
                    {' → '}
                    <strong>{availableParts.find(p => p.id === formData.partId)?.name}</strong>
                    {' → '}
                    <strong>{availablePartFloors.find(pf => pf.id === formData.partFloorId)?.name}</strong>
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              minWidth: 'auto',
              background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
              },
            }}
          >
            {isSubmitting ? 'Sauvegarde...' : (editingLot ? 'Modifier' : 'Créer')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LotDialog; 