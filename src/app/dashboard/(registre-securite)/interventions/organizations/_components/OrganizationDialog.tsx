'use client';

import { CreateOrganizationDto, Organization, UpdateOrganizationDto } from '@/services/organizationService';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface OrganizationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationDto | UpdateOrganizationDto) => Promise<void>;
  organization?: Organization;
  isLoading?: boolean;
}

const OrganizationDialog: React.FC<OrganizationDialogProps> = ({
  open,
  onClose,
  onSubmit,
  organization,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEditing = !!organization;

  useEffect(() => {
    if (open) {
      if (isEditing && organization) {
        setFormData({
          name: organization.name,
          code: organization.code,
          description: organization.description || '',
          isActive: organization.isActive,
          contactInfo: {
            email: organization.contactInfo?.email || '',
            phone: organization.contactInfo?.phone || '',
            address: organization.contactInfo?.address || ''
          }
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: '',
          isActive: true,
          contactInfo: {
            email: '',
            phone: '',
            address: ''
          }
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, isEditing, organization]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Le code est obligatoire';
    }

    // Validation email si fourni
    if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitError('');
      const submitData = {
        ...formData,
        contactInfo: Object.values(formData.contactInfo).some(v => v.trim()) ? formData.contactInfo : undefined
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (field.startsWith('contactInfo.')) {
      const contactField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [contactField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 'bold' }}>
        {isEditing ? 'Modifier l\'organisme' : 'Créer un organisme'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Informations générales */}
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Informations générales
          </Typography>

          <TextField
            label="Code"
            value={formData.code}
            onChange={(e) => handleFieldChange('code', e.target.value)}
            disabled={isEditing}
            error={!!errors.code}
            helperText={errors.code || (isEditing ? 'Le code ne peut pas être modifié' : '')}
            fullWidth
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <TextField
            label="Nom"
            value={formData.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
            rows={3}
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />

          {/* Informations de contact */}
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Informations de contact
          </Typography>

          <TextField
            label="Email"
            value={formData.contactInfo.email}
            onChange={(e) => handleFieldChange('contactInfo.email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            type="email"
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <TextField
            label="Téléphone"
            value={formData.contactInfo.phone}
            onChange={(e) => handleFieldChange('contactInfo.phone', e.target.value)}
            fullWidth
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <TextField
            label="Adresse"
            value={formData.contactInfo.address}
            onChange={(e) => handleFieldChange('contactInfo.address', e.target.value)}
            fullWidth
            multiline
            rows={2}
            InputProps={{
              sx: { backgroundColor: 'rgba(255, 255, 255, 0.9)' }
            }}
            InputLabelProps={{
              sx: { color: 'rgba(0, 0, 0, 0.6)' }
            }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: 'white'
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)'
                  }
                }}
              />
            }
            label="Organisme actif"
            sx={{ color: 'white' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.7)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
          variant="outlined"
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
            }
          }}
        >
          {isLoading ? 'Chargement...' : (isEditing ? 'Modifier' : 'Créer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrganizationDialog; 