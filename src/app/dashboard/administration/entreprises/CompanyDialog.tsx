'use client';

import { Company } from '@/types/company';
import {
  Business as BusinessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface CompanyDialogProps {
  open: boolean;
  onClose: () => void;
  company?: Company | null;
  onSave: (companyData: any) => Promise<void>;
}

// Plans disponibles (à terme, ça pourrait venir d'un service)
const availablePlans = [
  { id: 1, name: 'Plan Basic' },
  { id: 2, name: 'Plan Premium' },
  { id: 3, name: 'Plan Enterprise' }
];

export default function CompanyDialog({ open, onClose, company, onSave }: CompanyDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    siretNumber: '',
    planId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const isEdit = !!company;

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        siretNumber: company.siretNumber || '',
        planId: company.planId ? company.planId.toString() : '',
      });
    } else {
      setFormData({
        name: '',
        siretNumber: '',
        planId: '',
      });
    }
    setErrors({});
  }, [company, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.siretNumber.trim()) {
      newErrors.siretNumber = 'Le numéro SIRET est requis';
    } else if (!/^\d{14}$/.test(formData.siretNumber.replace(/\s/g, ''))) {
      newErrors.siretNumber = 'Le SIRET doit contenir exactement 14 chiffres';
    }

    if (!formData.planId) {
      newErrors.planId = 'Le plan est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData: any = {
        name: formData.name.trim(),
        siretNumber: formData.siretNumber.replace(/\s/g, ''), // Supprimer les espaces
        planId: parseInt(formData.planId), // Toujours inclure le planId
      };

      await onSave(submitData);
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ submit: error.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const formatSiret = (value: string) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    // Limiter à 14 chiffres
    const truncated = numbers.slice(0, 14);
    // Formater avec des espaces (XXX XXX XXX XXXXX)
    return truncated.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4').trim();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon color="primary" />
          <Typography variant="h6" component="span">
            {isEdit ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Nom de l'entreprise */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Nom de l'entreprise"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          {/* Numéro SIRET */}
          <Grid size={12}>
            <TextField
              fullWidth
              label="Numéro SIRET"
              value={formData.siretNumber}
              onChange={(e) => handleChange('siretNumber', formatSiret(e.target.value))}
              error={!!errors.siretNumber}
              helperText={errors.siretNumber || 'Format: XXX XXX XXX XXXXX (14 chiffres)'}
              required
              placeholder="123 456 789 01234"
            />
          </Grid>

          {/* Plan */}
          <Grid size={12}>
            <FormControl fullWidth error={!!errors.planId} required>
              <InputLabel>Plan</InputLabel>
              <Select
                value={formData.planId}
                label="Plan"
                onChange={(e) => handleChange('planId', e.target.value)}
              >
                {availablePlans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id.toString()}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.planId && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.planId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Erreur générale */}
          {errors.submit && (
            <Grid size={12}>
              <Typography color="error" variant="body2">
                {errors.submit}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            '&:hover': {
              background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
            },
          }}
        >
          {loading ? 'Sauvegarde...' : (isEdit ? 'Modifier' : 'Créer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 