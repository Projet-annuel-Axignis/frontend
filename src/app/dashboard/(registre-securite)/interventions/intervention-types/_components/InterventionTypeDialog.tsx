import { CreateInterventionTypeDto, InterventionType, UpdateInterventionTypeDto } from '@/services/interventionTypeService';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface InterventionTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterventionTypeDto | UpdateInterventionTypeDto) => Promise<void>;
  interventionType?: InterventionType | null;
  loading?: boolean;
}

const InterventionTypeDialog: React.FC<InterventionTypeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  interventionType,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateInterventionTypeDto>({
    code: '',
    name: '',
    description: '',
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEditing = !!interventionType;

  // Reset form when dialog opens/closes or when editing different type
  useEffect(() => {
    if (open) {
      if (interventionType) {
        setFormData({
          code: interventionType.code,
          name: interventionType.name,
          description: interventionType.description || '',
          isActive: interventionType.isActive,
        });
      } else {
        setFormData({
          code: '',
          name: '',
          description: '',
          isActive: true,
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, interventionType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est obligatoire';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitError('');
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error submitting intervention type:', error);
      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        'Une erreur est survenue lors de la sauvegarde'
      );
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="h2">
          {isEditing ? 'Modifier le type d\'intervention' : 'Nouveau type d\'intervention'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
          {/* Code */}
          <TextField
            label="Code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            error={!!errors.code}
            helperText={errors.code || (isEditing ? 'Le code ne peut pas être modifié' : 'Identifiant unique du type')}
            disabled={isEditing || loading}
            required
            fullWidth
          />

          {/* Nom */}
          <TextField
            label="Nom"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={!!errors.name}
            helperText={errors.name || 'Nom descriptif du type d\'intervention'}
            disabled={loading}
            required
            fullWidth
          />

          {/* Description */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            disabled={loading}
            multiline
            rows={3}
            fullWidth
            helperText="Description détaillée du type d'intervention (optionnel)"
          />

          {/* Statut actif */}
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                disabled={loading}
              />
            }
            label="Type actif"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.code.trim() || !formData.name.trim()}
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          {isEditing ? 'Modifier' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InterventionTypeDialog; 