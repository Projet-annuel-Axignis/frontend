'use client';

import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import { useBreadcrumbTitle } from '@/hooks/useBreadcrumbTitle';
import { useLoading } from '@/hooks/useLoading';
import { interventionService } from '@/services/interventionService';
import interventionTypeService from '@/services/interventionTypeService';
import { CreateInterventionDto, InterventionType } from '@/types/intervention';
import { Part } from '@/types/site';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const CreateInterventionPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: loading, withLoading } = useLoading();

  useBreadcrumbTitle('interventions', 'Interventions');
  useBreadcrumbTitle('create', 'Nouvelle intervention');

  const partId = searchParams.get('partId');

  // Data states
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [selectedPart] = useState<Part | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateInterventionDto>({
    label: '',
    companyName: '',
    employeeName: '',
    status: 'PLANNED',
    plannedAt: undefined,
    startedAt: undefined,
    endedAt: undefined,
    typeId: 0,
    terminatedById: 0,
    partIds: partId ? [parseInt(partId)] : [],
  });

  // Notification states
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Load initial data
  useEffect(() => {
    if (!partId) {
      showNotification('Partie non spécifiée', 'error');
      router.push('/dashboard/interventions');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partId]);

  const loadData = async () => {
    await withLoading(async () => {
      try {
        // Charger les types d'intervention
        const result = await interventionTypeService.getInterventionTypes({
          limit: 1000,
          page: 1,
          sortBy: 'name',
          sortOrder: 'asc',
          search: '',
        });
        setInterventionTypes(result.data);

        // TODO: Charger les informations de la partie
        // setSelectedPart(part);
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Erreur lors du chargement des données', 'error');
      }
    });
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleInputChange = (field: keyof CreateInterventionDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.label || !formData.companyName || !formData.employeeName || !formData.typeId) {
      showNotification('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    await withLoading(async () => {
      try {
        await interventionService.createIntervention(formData);
        showNotification('Intervention créée avec succès', 'success');

        // Rediriger vers la page des interventions avec les paramètres de navigation
        const params = new URLSearchParams();
        if (partId) {
          params.set('partId', partId);
          // TODO: Ajouter les autres paramètres de navigation si nécessaire
        }
        const newUrl = params.toString() ? `?${params.toString()}` : '';
        router.push(`/dashboard/interventions${newUrl}`);
      } catch (error) {
        console.error('Error creating intervention:', error);
        showNotification('Erreur lors de la création de l\'intervention', 'error');
      }
    });
  };

  const handleBack = () => {
    router.back();
  };

  if (!partId) {
    return (
      <Box>
        <DashBoardHeader title="Nouvelle intervention" />
        <Alert severity="error">
          Partie non spécifiée. Redirection...
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <DashBoardHeader title="Nouvelle intervention">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Retour
        </Button>
      </DashBoardHeader>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Créer une nouvelle intervention
          </Typography>

          {selectedPart && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Intervention pour la partie : {selectedPart.name}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Libellé de l'intervention"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nom de l'entreprise"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nom de l'employé"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Type d&apos;intervention</InputLabel>
                  <Select
                    value={formData.typeId}
                    onChange={(e) => handleInputChange('typeId', e.target.value)}
                    label="Type d'intervention"
                  >
                    {interventionTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date de planification"
                  type="datetime-local"
                  value={formData.plannedAt}
                  onChange={(e) => handleInputChange('plannedAt', e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Date de début"
                  type="datetime-local"
                  value={formData.startedAt}
                  onChange={(e) => handleInputChange('startedAt', e.target.value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Créer l\'intervention'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateInterventionPage; 