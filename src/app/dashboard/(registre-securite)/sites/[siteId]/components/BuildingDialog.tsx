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
  erpCategory: number;
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
  { code: 'ERP', label: 'ERP', description: 'Établissement Recevant du Public' },
  { code: 'IGH', label: 'IGH', description: 'Immeuble de Grande Hauteur' },
  { code: 'BUP', label: 'BUP', description: 'Bâtiment à Utilisation Professionnelle' },
  { code: 'HAB', label: 'HAB', description: 'Bâtiment d\'Habitation' },
];

const IGH_CLASS_CODES = [
  { code: 'GHA', label: 'GHA', description: 'Immeubles à usage d\'habitation' },
  { code: 'GHO', label: 'GHO', description: 'Immeubles à usage d\'hôtel' },
  { code: 'GHR', label: 'GHR', description: 'Immeubles à usage d\'enseignement' },
  {
    code: 'GHS', label: 'GHS', description: 'Immeubles à usage de dépôt d\'archives'
  },
  { code: 'GHTC', label: 'GHTC', description: 'Immeubles à usage de tour de contrôle' },
  { code: 'GHU', label: 'GHU', description: 'immeubles à usage sanitaire' },
  {
    code: 'GHW1', label: 'GHW1', description: 'Immeubles à usage de bureaux répondant aux conditions fixées par le règlement prévu à l\'article R. 122-4 et dont la hauteur du plancher bas tel qu\'il est défini à l\'article R. 146-3 est supérieure à 28 mètres et inférieure ou égale à 50 mètres'
  },
  { code: 'GHW2', label: 'GHW2', description: 'Immeubles à usage de bureaux dont la hauteur du plancher bas tel qu\'il est défini ci-dessus est supérieure à 50 mètres' },
  {
    code: 'GHZ', label: 'GHZ', description: "Immeubles à usage principal d'habitation dont la hauteur du plancher bas est supérieure à 28 mètres et inférieure ou égale à 50 mètres et comportant des locaux autres que ceux à usage d'habitation ne répondant pas aux conditions d'indépendance fixées par les arrêtés prévus aux articles R. 142-1 et R. 146-5 ; Page à 2 11"
  },
  {
    code: 'ITGH', label: 'ITGH', description: "Immeuble de très grande hauteur. Constitue un immeuble de très grande hauteur tout corps de bâtiment dont le plancher bas du dernier niveau est situé à plus de 200 mètres par rapport au niveau du sol le plus haut utilisable pour les engins des services publics de secours et de lutte contre l'incendie."
  },
];

const ERP_CATEGORIES = [
  { value: 1, label: 'Catégorie 1', description: 'plus de 1500 personnes' },
  { value: 2, label: 'Catégorie 2', description: '701 à 1500 personnes' },
  { value: 3, label: 'Catégorie 3', description: '301 à 700 personnes' },
  {
    value: 4, label: 'Catégorie 4', description: '300 personnes et au-dessous, à l\'exception des établissements compris dans la 5ème catégorie'
  },
  {
    value: 5, label: 'Catégorie 5', description: 'Etablissements faisant l\'objet de l\'article R. 143-14 dans lesquels l\'effectif du public n\'atteint pas le chiffre minimum fixé par le règlement de sécurité pour chaque type d\'exploitation'
  },
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
    erpCategory: 0,
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
          typologyCodes: building.typologies.map(typology => typology.code),
          ighClassCodes: building.ighClasses.map(ighClass => ighClass.code),
          erpCategory: building.erpCategory?.category || 0,
          authorizedUserIds: building.authorizedUserIds || [],
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          typologyCodes: [],
          ighClassCodes: [],
          erpCategory: 0,
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

    if (formData.typologyCodes.length === 0) {
      newErrors.typologyCodes = 'Au moins une typologie est requise';
    }

    // ERP category is required only if ERP is selected in typologies
    if (formData.typologyCodes.includes('ERP')) {
      if (formData.erpCategory === 0 || formData.erpCategory < 1 || formData.erpCategory > 5) {
        newErrors.erpCategory = 'La catégorie ERP est requise (1-5)';
      }
    }

    // IGH class codes are required only if IGH is selected in typologies
    if (formData.typologyCodes.includes('IGH')) {
      if (formData.ighClassCodes.length === 0) {
        newErrors.ighClassCodes = 'Au moins un code de classe IGH est requis';
      }
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
    let newFormData = { ...formData, [field]: value };

    // Clean up dependent fields when topology changes
    if (field === 'typologyCodes') {
      const newTypologies = value as string[];

      // Clear ERP category if ERP is not selected
      if (!newTypologies.includes('ERP') && formData.erpCategory !== 0) {
        newFormData = { ...newFormData, erpCategory: 0 };
        setErrors(prev => ({ ...prev, erpCategory: undefined }));
      }

      // Clear IGH class codes if IGH is not selected
      if (!newTypologies.includes('IGH') && formData.ighClassCodes.length > 0) {
        newFormData = { ...newFormData, ighClassCodes: [] };
        setErrors(prev => ({ ...prev, ighClassCodes: undefined }));
      }
    }

    setFormData(newFormData);

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

          {/* Topology Codes */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              options={TOPOLOGY_CODES}
              getOptionLabel={(option) => `${option.code} - ${option.description}`}
              value={formData.typologyCodes.map(code =>
                TOPOLOGY_CODES.find(option => option.code === code)
              ).filter((option): option is typeof TOPOLOGY_CODES[0] => option !== undefined)}
              onChange={(_, newValue) => handleFieldChange('typologyCodes', newValue.map(item => item.code))}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option.code}
                    {...getItemProps({ index })}
                    key={option.code}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Typologie du bâtiment *"
                  error={!!errors.typologyCodes}
                  helperText={errors.typologyCodes}
                  placeholder="Sélectionnez les typologies..."
                />
              )}
            />
          </Grid>

          {/* ERP Category - Conditional display */}
          {formData.typologyCodes.includes('ERP') && (
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.erpCategory}>
                <InputLabel>Catégorie ERP *</InputLabel>
                <Select
                  value={formData.erpCategory}
                  onChange={handleErpCategoryChange}
                  input={<OutlinedInput label="Catégorie ERP *" />}
                  renderValue={(selected) => {
                    const category = ERP_CATEGORIES.find(cat => cat.value === selected);
                    return category ? category.label : '';
                  }}
                >
                  {ERP_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label} - {category.description}
                    </MenuItem>
                  ))}
                </Select>
                {errors.erpCategory ? (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.erpCategory}
                  </Typography>
                ) : (
                  formData.erpCategory && (
                    <Box sx={{ mt: 0.5, ml: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        variant="outlined"
                        color={formData.erpCategory <= 4 ? "primary" : "secondary"}
                        label={formData.erpCategory <= 4 ? "1er groupe" : "2ème groupe"}
                        sx={{ fontSize: '0.7rem', height: '20px' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {ERP_CATEGORIES.find(cat => cat.value === formData.erpCategory)?.description}
                      </Typography>
                    </Box>
                  )
                )}
              </FormControl>
            </Grid>
          )}

          {/* IGH Class Codes - Conditional display */}
          {formData.typologyCodes.includes('IGH') && (
            <Grid size={{ xs: 12 }}>
              <Autocomplete
                multiple
                options={IGH_CLASS_CODES}
                getOptionLabel={(option) => `${option.code} - ${option.description}`}
                value={formData.ighClassCodes.map(code =>
                  IGH_CLASS_CODES.find(option => option.code === code)
                ).filter((option): option is typeof IGH_CLASS_CODES[0] => option !== undefined)}
                onChange={(_, newValue) => handleFieldChange('ighClassCodes', newValue.map(item => item.code))}
                renderValue={(value, getItemProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      color="secondary"
                      label={option.code}
                      {...getItemProps({ index })}
                      key={option.code}
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
          )}

          {/* Authorized User IDs */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              freeSolo
              options={[]} // TODO: Load from user service
              value={formData.authorizedUserIds}
              onChange={(_, newValue) => handleFieldChange('authorizedUserIds', newValue)}
              renderValue={(value, getItemProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getItemProps({ index })}
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
                • <strong>Typologie</strong> : Définit le type de bâtiment (ERP, IGH, BUP, HAB)
                <br />
                • <strong>ERP</strong> : Établissement Recevant du Public (catégories 1-5)
                <br />
                • <strong>IGH</strong> : Immeuble de Grande Hauteur (classes GHA, GHO, GHR, etc.)
                <br />
                <em>Les champs ERP et IGH s&apos;affichent selon la typologie sélectionnée</em>
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