'use client';

import { useUser } from '@/app/_providers/UserProvider';
import { useLoading } from '@/hooks/useLoading';
import interventionService from '@/services/interventionService';
import { Intervention, InterventionStatus } from '@/types/intervention';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const statusColors: Record<InterventionStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  TERMINATED: 'success'
};

const statusLabels: Record<InterventionStatus, string> = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

export default function InterventionDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const { withLoading } = useLoading();

  const interventionId = parseInt(params.interventionId as string);
  const [intervention, setIntervention] = useState<Intervention | null>(null);

  useEffect(() => {
    if (interventionId) {
      loadIntervention();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interventionId]);

  const loadIntervention = async () => {
    await withLoading(async () => {
      try {
        const data = await interventionService.getIntervention(interventionId);
        setIntervention(data);
      } catch (error) {
        console.error('Erreur lors du chargement de l&apos;intervention:', error);
      }
    });
  };

  const handleStart = async () => {
    if (!intervention) return;
    try {
      await interventionService.startIntervention(intervention.id);
      await loadIntervention();
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  };

  const handleTerminate = async () => {
    if (!intervention) return;
    try {
      await interventionService.terminateIntervention(intervention.id, user?.id ?? 0);
      await loadIntervention();
    } catch (error) {
      console.error('Erreur lors de la terminaison:', error);
    }
  };

  if (!intervention) {
    return (
      <Typography variant="body1" color="text.secondary">
        Chargement des informations...
      </Typography>
    );
  }

  const isDeleted = Boolean(intervention.deletedAt);

  return (
    <Box>
      {/* Actions rapides */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {intervention.status === 'PLANNED' && !isDeleted && (
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayArrowIcon />}
            onClick={handleStart}
          >
            Démarrer l&apos;intervention
          </Button>
        )}

        {intervention.status === 'IN_PROGRESS' && !isDeleted && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<StopIcon />}
            onClick={handleTerminate}
          >
            Terminer l&apos;intervention
          </Button>
        )}

        {!isDeleted && (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
          >
            Modifier
          </Button>
        )}

        <Button
          variant="outlined"
          color={isDeleted ? "success" : "error"}
          startIcon={isDeleted ? <RestoreIcon /> : <DeleteIcon />}
        >
          {isDeleted ? "Restaurer" : "Archiver"}
        </Button>
      </Box>

      {/* Informations détaillées */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Première ligne : Informations générales et Intervenants */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3
        }}>
          {/* Informations générales */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Informations générales
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Libellé
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {intervention.label}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Type d&apos;intervention
                  </Typography>
                  <Typography variant="body1">
                    {intervention.type.name}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Statut
                  </Typography>
                  <Chip
                    label={statusLabels[intervention.status]}
                    color={statusColors[intervention.status]}
                    variant="filled"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Périodicité
                  </Typography>
                  <Typography variant="body1">
                    {intervention.periodicity}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Intervenants */}
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Intervenants
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Entreprise
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {intervention.companyName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Employé responsable
                  </Typography>
                  <Typography variant="body1">
                    {intervention.employeeName}
                  </Typography>
                </Box>

                {intervention.terminatedBy && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Terminée par
                    </Typography>
                    <Typography variant="body1">
                      {intervention.terminatedBy.firstName} {intervention.terminatedBy.lastName}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Dates et planning */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Planning et dates
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3
            }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date prévue
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {format(new Date(intervention.plannedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date de début
                </Typography>
                <Typography variant="body1">
                  {intervention.startedAt ?
                    format(new Date(intervention.startedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }) :
                    'Non démarrée'
                  }
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Date de fin
                </Typography>
                <Typography variant="body1">
                  {intervention.endedAt ?
                    format(new Date(intervention.endedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }) :
                    'Non terminée'
                  }
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dernière modification
                </Typography>
                <Typography variant="body1">
                  {format(new Date(intervention.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
