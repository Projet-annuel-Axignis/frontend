'use client';

import {
  CreateOrganizationDto,
  Organization,
  OrganizationType,
  UpdateOrganizationDto
} from '@/types/intervention';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface OrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationDto | UpdateOrganizationDto) => Promise<void>;
  organization?: Organization;
  isLoading?: boolean;
}

const typeOptions: { value: OrganizationType; label: string }[] = [
  { value: 'OA', label: 'Organisme Agréé' },
  { value: 'TC', label: 'Tiers de Contrôle' }
];

export default function OrganizationDialog({
  open,
  onClose,
  onSubmit,
  organization,
  isLoading = false
}: OrganizationDialogProps) {
  const [formData, setFormData] = useState<CreateOrganizationDto>({
    name: '',
    type: 'OA'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!organization;

  useEffect(() => {
    if (open) {
      if (organization) {
        setFormData({
          name: organization.name,
          type: organization.type
        });
      } else {
        setFormData({
          name: '',
          type: 'OA'
        });
      }
      setErrors({});
    }
  }, [open, organization]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.type) {
      newErrors.type = 'Le type est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = isEditing
        ? {
          name: formData.name,
          type: formData.type
        } as UpdateOrganizationDto
        : formData as CreateOrganizationDto;

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleChange = (field: keyof CreateOrganizationDto) => (
    event: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    const value = event.target.value as string;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Nettoyer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        {isEditing ? 'Modifier l\'organisme' : 'Créer un organisme'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nom"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name || 'Nom de l\'organisme'}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl
              fullWidth
              variant="outlined"
              error={!!errors.type}
              required
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={handleChange('type')}
                label="Type"
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.type && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                  {errors.type}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #667eea 60%, #764ba2 100%)',
            }
          }}
        >
          {isLoading ? 'En cours...' : (isEditing ? 'Modifier' : 'Créer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 