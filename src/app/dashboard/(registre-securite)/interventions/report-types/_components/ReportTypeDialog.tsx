'use client';

import {
  CreateReportTypeDto,
  Periodicity,
  ReportType,
  UpdateReportTypeDto
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

interface ReportTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportTypeDto | UpdateReportTypeDto) => Promise<void>;
  reportType?: ReportType;
  isLoading?: boolean;
}

const periodicityOptions: { value: Periodicity; label: string }[] = [
  { value: 'MONTHLY', label: 'Mensuel' },
  { value: 'QUARTER', label: 'Trimestriel' },
  { value: 'SEMESTER', label: 'Semestriel' },
  { value: 'ANNUAL', label: 'Annuel' }
];

export default function ReportTypeDialog({
  open,
  onClose,
  onSubmit,
  reportType,
  isLoading = false
}: ReportTypeDialogProps) {
  const [formData, setFormData] = useState<CreateReportTypeDto>({
    code: '',
    name: '',
    periodicity: 'MONTHLY'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!reportType;

  useEffect(() => {
    if (open) {
      if (reportType) {
        setFormData({
          code: reportType.code,
          name: reportType.name,
          periodicity: reportType.periodicity
        });
      } else {
        setFormData({
          code: '',
          name: '',
          periodicity: 'MONTHLY'
        });
      }
      setErrors({});
    }
  }, [open, reportType]);

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

    if (!formData.periodicity) {
      newErrors.periodicity = 'La périodicité est requise';
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
          code: formData.code,
          periodicity: formData.periodicity
        } as UpdateReportTypeDto
        : formData as CreateReportTypeDto;

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleChange = (field: keyof CreateReportTypeDto) => (
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
        {isEditing ? 'Modifier le type de rapport' : 'Créer un type de rapport'}
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
              helperText={errors.code || (isEditing ? 'Le code ne peut pas être modifié' : 'Code unique du type de rapport')}
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
              helperText={errors.name || 'Nom descriptif du type de rapport'}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControl
              fullWidth
              variant="outlined"
              error={!!errors.periodicity}
              required
            >
              <InputLabel>Périodicité</InputLabel>
              <Select
                value={formData.periodicity}
                onChange={handleChange('periodicity')}
                label="Périodicité"
              >
                {periodicityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.periodicity && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                  {errors.periodicity}
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