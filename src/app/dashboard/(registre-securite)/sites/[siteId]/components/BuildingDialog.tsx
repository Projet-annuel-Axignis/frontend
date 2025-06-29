'use client';

import { Building, CreateBuildingDto, UpdateBuildingDto } from '@/types/site';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface BuildingDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBuildingDto | UpdateBuildingDto) => Promise<void>;
  building?: Building | null;
  loading?: boolean;
}

interface FormData {
  name: string;
  typologyCodes: string[];
  ighClassCodes: string[];
  erpCategory: number | '';
  authorizedUserIds: string[];
}

interface FormErrors {
  name?: string;
  erpCategory?: string;
  typologyCodes?: string;
  ighClassCodes?: string;
}

// Predefined options for codes
const TOPOLOGY_CODES = [
  'R+0', 'R+1', 'R+2', 'R+3', 'R+4', 'R+5', 'R+6', 'R+7', 'R+8', 'R+9', 'R+10',
  'SOUS-SOL', 'ENTRESOL', 'MEZZANINE', 'TERRASSE', 'COMBLES'
];

const IGH_CLASS_CODES = [
  'GHA', 'GHO', 'GHR', 'GHS', 'GHU', 'GHW1', 'GHW2', 'GHZ'
];

const ERP_CATEGORIES = [
  { value: 1, label: 'Catégorie 1 (+ de 1500 personnes)' },
  { value: 2, label: 'Catégorie 2 (701 à 1500 personnes)' },
  { value: 3, label: 'Catégorie 3 (301 à 700 personnes)' },
  { value: 4, label: 'Catégorie 4 (Moins de 300 personnes)' },
  { value: 5, label: 'Catégorie 5 (Seuils spécifiques)' },
];

const BuildingDialog: React.FC<BuildingDialogProps> = ({
  open,
  onClose,
  onSubmit,
  building,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    typologyCodes: [],
    ighClassCodes: [],
    erpCategory: '',
    authorizedUserIds: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEdit = !!building;

  // Initialize form data when dialog opens or building changes
  useEffect(() => {
    if (open) {
      if (building) {
        // Edit mode
        setFormData({
          name: building.name,
          typologyCodes: building.typologyCodes || [],
          ighClassCodes: building.ighClassCodes || [],
          erpCategory: building.erpCategory,
          authorizedUserIds: building.authorizedUserIds || [],
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          typologyCodes: [],
          ighClassCodes: [],
          erpCategory: '',
          authorizedUserIds: [],
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, building]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du bâtiment est requis';
    }

    if (formData.erpCategory === '' || formData.erpCategory < 1 || formData.erpCategory > 5) {
      newErrors.erpCategory = 'La catégorie ERP est requise (1-5)';
    }

    if (formData.typologyCodes.length === 0) {
      newErrors.typologyCodes = 'Au moins un code de typologie est requis';
    }

    if (formData.ighClassCodes.length === 0) {
      newErrors.ighClassCodes = 'Au moins un code de classe IGH est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');

      const submitData = {
        name: formData.name.trim(),
        typologyCodes: formData.typologyCodes,
        ighClassCodes: formData.ighClassCodes,
        erpCategory: formData.erpCategory as number,
        authorizedUserIds: formData.authorizedUserIds,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting building:', error);
      setSubmitError('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleErpCategoryChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    handleFieldChange('erpCategory', value);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {isEdit ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
      </DialogTitle>

      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Building Name */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Nom du bâtiment *"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="ex: Bâtiment A, Tour Nord..."
            />
          </Grid>

          {/* ERP Category */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.erpCategory}>
              <InputLabel>Catégorie ERP *</InputLabel>
              <Select
                value={formData.erpCategory}
                onChange={handleErpCategoryChange}
                input={<OutlinedInput label="Catégorie ERP *" />}
              >
                {ERP_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.erpCategory && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.erpCategory}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Topology Codes */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              multiple
              options={TOPOLOGY_CODES}
              value={formData.typologyCodes}
              onChange={(_, newValue) => handleFieldChange('typologyCodes', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Codes de typologie *"
                  error={!!errors.typologyCodes}
                  helperText={errors.typologyCodes}
                  placeholder="Sélectionnez les étages..."
                />
              )}
            />
          </Grid>

          {/* IGH Class Codes */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              options={IGH_CLASS_CODES}
              value={formData.ighClassCodes}
              onChange={(_, newValue) => handleFieldChange('ighClassCodes', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    color="secondary"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Codes de classe IGH *"
                  error={!!errors.ighClassCodes}
                  helperText={errors.ighClassCodes || 'IGH = Immeuble de Grande Hauteur'}
                  placeholder="Sélectionnez les classes IGH..."
                />
              )}
            />
          </Grid>

          {/* Authorized User IDs */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]} // TODO: Load from user service
              value={formData.authorizedUserIds}
              onChange={(_, newValue) => handleFieldChange('authorizedUserIds', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Utilisateurs autorisés"
                  helperText="IDs des utilisateurs autorisés à accéder à ce bâtiment (optionnel)"
                  placeholder="Tapez les IDs utilisateurs..."
                />
              )}
            />
          </Grid>

          {/* Help Text */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="body2" color="info.contrastText">
                <strong>Aide :</strong>
                <br />
                • <strong>ERP</strong> : Établissement Recevant du Public (catégories 1-5)
                <br />
                • <strong>IGH</strong> : Immeuble de Grande Hauteur (classes GHA, GHO, GHR, etc.)
                <br />
                • <strong>Typologie</strong> : Niveaux et types d&apos;étages du bâtiment
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {isEdit ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuildingDialog; 