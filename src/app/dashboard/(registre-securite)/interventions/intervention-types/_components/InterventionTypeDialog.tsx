'use client';

import {
  CreateInterventionTypeDto,
  InterventionType,
  UpdateInterventionTypeDto
} from '@/services/interventionTypeService';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

interface InterventionTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterventionTypeDto | UpdateInterventionTypeDto) => Promise<void>;
  interventionType?: InterventionType;
  isLoading?: boolean;
}

export default function InterventionTypeDialog({
  open,
  onClose,
  onSubmit,
  interventionType,
  isLoading = false
}: InterventionTypeDialogProps) {
  const [formData, setFormData] = useState<CreateInterventionTypeDto>({
    code: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!interventionType;

  useEffect(() => {
    if (open) {
      if (interventionType) {
        setFormData({
          code: interventionType.code,
          name: interventionType.name
        });
      } else {
        setFormData({
          code: '',
          name: ''
        });
      }
      setErrors({});
    }
  }, [open, interventionType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis';
    } else if (formData.code.trim().length < 2) {
      newErrors.code = 'Le code doit contenir au moins 2 caractères';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = isEditing
        ? { name: formData.name } as UpdateInterventionTypeDto
        : formData as CreateInterventionTypeDto;

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleChange = (field: keyof CreateInterventionTypeDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
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
        {isEditing ? 'Modifier le type d\'intervention' : 'Créer un type d\'intervention'}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Code"
              value={formData.code}
              onChange={handleChange('code')}
              disabled={isEditing} // Le code n'est pas modifiable en édition
              error={!!errors.code}
              helperText={errors.code || (isEditing ? 'Le code ne peut pas être modifié' : 'Code unique du type d\'intervention')}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nom"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name || 'Nom descriptif du type d\'intervention'}
              fullWidth
              variant="outlined"
              required
            />
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