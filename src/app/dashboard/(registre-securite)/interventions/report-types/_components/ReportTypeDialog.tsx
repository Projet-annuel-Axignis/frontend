'use client';

import { CreateReportTypeDto, ReportType, UpdateReportTypeDto } from '@/services/reportTypeService';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface ReportTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReportTypeDto | UpdateReportTypeDto) => Promise<void>;
  reportType?: ReportType;
  isLoading?: boolean;
}



const ReportTypeDialog: React.FC<ReportTypeDialogProps> = ({
  open,
  onClose,
  onSubmit,
  reportType,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const isEditing = !!reportType;

  useEffect(() => {
    if (open) {
      if (isEditing && reportType) {
        setFormData({
          name: reportType.name,
          code: reportType.code,
          description: reportType.description || ''
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: ''
        });
      }
      setErrors({});
      setSubmitError('');
    }
  }, [open, isEditing, reportType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Le code est obligatoire';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitError('');
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <DialogTitle sx={{ color: 'white', fontWeight: 'bold' }}>
        {isEditing ? 'Modifier le type de rapport' : 'Créer un type de rapport'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

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

export default ReportTypeDialog; 