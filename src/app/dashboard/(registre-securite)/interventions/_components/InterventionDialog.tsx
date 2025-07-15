'use client';

import { useUser } from '@/app/_providers/UserProvider';
import { CreateInterventionDto, Intervention, InterventionStatus, InterventionType, Periodicity, UpdateInterventionDto } from '@/types/intervention';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
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
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface InterventionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterventionDto | UpdateInterventionDto) => Promise<void>;
  intervention?: Intervention | null;
  interventionTypes: InterventionType[];
  loading?: boolean;
}

interface FormData {
  label: string;
  companyName: string;
  employeeName: string;
  status: InterventionStatus;
  periodicity: Periodicity;
  plannedAt: string;
  startedAt: string;
  endedAt: string;
  typeId: number | null;
  terminatedById: number;
}

interface FormErrors {
  label?: string;
  companyName?: string;
  employeeName?: string;
  status?: string;
  periodicity?: string;
  plannedAt?: string;
  startedAt?: string;
  endedAt?: string;
  typeId?: string;
  terminatedById?: string;
}

const statusLabels = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

const periodicityLabels = {
  MONTHLY: 'Mensuel',
  QUARTER: 'Trimestriel',
  SEMESTER: 'Semestriel',
  ANNUAL: 'Annuel'
};

const InterventionDialog = ({
  open,
  onClose,
  onSubmit,
  intervention,
  interventionTypes,
  loading = false,
}: InterventionDialogProps) => {

  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    label: '',
    companyName: '',
    employeeName: '',
    status: 'PLANNED',
    periodicity: 'MONTHLY',
    plannedAt: '',
    startedAt: '',
    endedAt: '',
    typeId: null,
    terminatedById: user?.id ?? 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEdit = !!intervention;

  // Initialize form data when dialog opens or intervention changes
  useEffect(() => {
    if (open) {
      if (intervention) {
        // Edit mode
        setFormData({
          label: intervention.label || '',
          companyName: intervention.companyName || '',
          employeeName: intervention.employeeName || '',
          status: intervention.status || 'PLANNED',
          periodicity: intervention.periodicity || 'MONTHLY',
          plannedAt: intervention.plannedAt ? intervention.plannedAt.split('T')[0] : '',
          startedAt: intervention.startedAt ? intervention.startedAt.split('T')[0] : '',
          endedAt: intervention.endedAt ? intervention.endedAt.split('T')[0] : '',
          typeId: intervention.type?.id || null,
          terminatedById: intervention.terminatedBy?.id || user?.id || 1,
        });
      } else {
        // Create mode
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          label: '',
          companyName: '',
          employeeName: '',
          status: 'PLANNED',
          periodicity: 'MONTHLY',
          plannedAt: today,
          startedAt: today,
          endedAt: today,
          typeId: null,
          terminatedById: user?.id || 1,
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, intervention, user?.id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Le libellé est requis';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Le nom de l\'employé est requis';
    }

    if (!formData.plannedAt) {
      newErrors.plannedAt = 'La date prévue est requise';
    }

    if (!formData.startedAt) {
      newErrors.startedAt = 'La date de début est requise';
    }

    if (!formData.endedAt) {
      newErrors.endedAt = 'La date de fin est requise';
    }

    if (!formData.typeId) {
      newErrors.typeId = 'Le type d\'intervention est requis';
    }

    // Validation des dates
    if (formData.plannedAt && formData.startedAt && formData.plannedAt > formData.startedAt) {
      newErrors.startedAt = 'La date de début ne peut pas être antérieure à la date prévue';
    }

    if (formData.startedAt && formData.endedAt && formData.startedAt > formData.endedAt) {
      newErrors.endedAt = 'La date de fin ne peut pas être antérieure à la date de début';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateInterventionDto | UpdateInterventionDto = {
        label: formData.label.trim(),
        companyName: formData.companyName.trim(),
        employeeName: formData.employeeName.trim(),
        status: formData.status,
        periodicity: formData.periodicity,
        plannedAt: formData.plannedAt,
        startedAt: formData.startedAt,
        endedAt: formData.endedAt,
        typeId: formData.typeId!,
        terminatedById: formData.terminatedById,
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting intervention:', error);
      setSubmitError('Une erreur est survenue lors de l\'enregistrement');
    }
  };

  const handleFieldChange = (field: keyof FormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedType = interventionTypes.find(t => t.id === formData.typeId) || null;

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
        {isEdit ? 'Modifier l\'intervention' : 'Nouvelle intervention'}
      </DialogTitle>

      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Libellé */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Libellé *"
              value={formData.label}
              onChange={(e) => handleFieldChange('label', e.target.value)}
              error={!!errors.label}
              helperText={errors.label}
              placeholder="ex: Contrôle annuel des ascenseurs"
            />
          </Grid>

          {/* Entreprise et Employé */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Entreprise *"
              value={formData.companyName}
              onChange={(e) => handleFieldChange('companyName', e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName}
              placeholder="Nom de l'entreprise"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Employé *"
              value={formData.employeeName}
              onChange={(e) => handleFieldChange('employeeName', e.target.value)}
              error={!!errors.employeeName}
              helperText={errors.employeeName}
              placeholder="Nom de l'employé"
            />
          </Grid>

          {/* Type d'intervention */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={interventionTypes}
              getOptionLabel={(option) => `${option.name} (${option.code})`}
              value={selectedType}
              onChange={(_, newValue) => handleFieldChange('typeId', newValue?.id || null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type d'intervention *"
                  error={!!errors.typeId}
                  helperText={errors.typeId}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Code: {option.code}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          </Grid>

          {/* Statut et Périodicité */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Statut *</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleFieldChange('status', e.target.value as InterventionStatus)}
                label="Statut *"
              >
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth error={!!errors.periodicity}>
              <InputLabel>Périodicité *</InputLabel>
              <Select
                value={formData.periodicity}
                onChange={(e) => handleFieldChange('periodicity', e.target.value as Periodicity)}
                label="Périodicité *"
              >
                {Object.entries(periodicityLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Dates */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Date prévue *"
              value={formData.plannedAt}
              onChange={(e) => handleFieldChange('plannedAt', e.target.value)}
              error={!!errors.plannedAt}
              helperText={errors.plannedAt}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Date de début *"
              value={formData.startedAt}
              onChange={(e) => handleFieldChange('startedAt', e.target.value)}
              error={!!errors.startedAt}
              helperText={errors.startedAt}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              type="date"
              label="Date de fin *"
              value={formData.endedAt}
              onChange={(e) => handleFieldChange('endedAt', e.target.value)}
              error={!!errors.endedAt}
              helperText={errors.endedAt}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
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
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          {isEdit ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterventionDialog; 