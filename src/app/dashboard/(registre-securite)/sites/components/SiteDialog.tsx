'use client';

import { Company } from '@/types/company';
import { CreateSiteDto, Site, UpdateSiteDto } from '@/types/site';
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
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface SiteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSiteDto | UpdateSiteDto) => Promise<void>;
  site?: Site | null;
  companies: Company[];
  loading?: boolean;
}

interface FormData {
  name: string;
  streetNumber: string;
  street: string;
  postalCode: string;
  city: string;
  reference: string;
  companyId: number | null;
}

interface FormErrors {
  name?: string;
  streetNumber?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  companyId?: string;
}

const SiteDialog: React.FC<SiteDialogProps> = ({
  open,
  onClose,
  onSubmit,
  site,
  companies,
  loading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    streetNumber: '',
    street: '',
    postalCode: '',
    city: '',
    reference: '',
    companyId: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEdit = !!site;

  // Initialize form data when dialog opens or site changes
  useEffect(() => {
    if (open) {
      if (site) {
        // Edit mode
        setFormData({
          name: site.name,
          streetNumber: site.streetNumber,
          street: site.street,
          postalCode: site.postalCode.toString(),
          city: site.city,
          reference: site.reference || '',
          companyId: site.companyId,
        });
      } else {
        // Create mode
        setFormData({
          name: '',
          streetNumber: '',
          street: '',
          postalCode: '',
          city: '',
          reference: '',
          companyId: null,
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, site]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du site est requis';
    }

    if (!formData.streetNumber.trim()) {
      newErrors.streetNumber = 'Le numéro de rue est requis';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'La rue est requise';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Le code postal est requis';
    } else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Le code postal doit contenir 5 chiffres';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!isEdit && !formData.companyId) {
      newErrors.companyId = 'L\'entreprise est requise';
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
        streetNumber: formData.streetNumber.trim(),
        street: formData.street.trim(),
        postalCode: parseInt(formData.postalCode),
        city: formData.city.trim(),
        reference: formData.reference.trim() || undefined,
        ...(formData.companyId && { companyId: formData.companyId }),
      };

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting site:', error);
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

  const selectedCompany = companies.find(c => c.id === formData.companyId) || null;

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
        {isEdit ? 'Modifier le site' : 'Nouveau site'}
      </DialogTitle>

      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Company Selection (only for create) */}
          {!isEdit && (
            <Autocomplete
              options={companies}
              getOptionLabel={(option) => option.name}
              value={selectedCompany}
              onChange={(_, newValue) => handleFieldChange('companyId', newValue?.id || null)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Entreprise *"
                  error={!!errors.companyId}
                  helperText={errors.companyId}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {option.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      SIRET: {option.siretNumber}
                    </Typography>
                  </Box>
                </Box>
              )}
            />
          )}

          {/* Site Name */}
          <TextField
            fullWidth
            label="Nom du site *"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            placeholder="ex: Centre commercial la Part Dieu"
          />

          {/* Address */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Numéro *"
              value={formData.streetNumber}
              onChange={(e) => handleFieldChange('streetNumber', e.target.value)}
              error={!!errors.streetNumber}
              helperText={errors.streetNumber}
              placeholder="17"
              sx={{ width: '120px' }}
            />
            <TextField
              fullWidth
              label="Rue *"
              value={formData.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              error={!!errors.street}
              helperText={errors.street}
              placeholder="Rue Dr Bouchut"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Code postal *"
              value={formData.postalCode}
              onChange={(e) => handleFieldChange('postalCode', e.target.value)}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
              placeholder="69003"
              inputProps={{ maxLength: 5 }}
              sx={{ width: '150px' }}
            />
            <TextField
              fullWidth
              label="Ville *"
              value={formData.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
              placeholder="Lyon"
            />
          </Box>

          {/* Reference */}
          <TextField
            fullWidth
            label="Référence interne"
            value={formData.reference}
            onChange={(e) => handleFieldChange('reference', e.target.value)}
            placeholder="Numéro d'identification interne (optionnel)"
          />
        </Box>
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

export default SiteDialog; 