'use client';

import { useUser } from '@/app/_providers/UserProvider';
import { useLoading } from '@/hooks/useLoading';
import interventionService from '@/services/interventionService';
import interventionTypeService from '@/services/interventionTypeService';
import { Intervention, InterventionStatus, InterventionType, UpdateInterventionDto } from '@/types/intervention';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Schedule as ScheduleIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator
} from '@mui/lab';
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
import InterventionDialog from '../_components/InterventionDialog';

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
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (interventionId) {
      loadIntervention();
      loadInterventionTypes();
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

  const loadInterventionTypes = async () => {
    try {
      const response = await interventionTypeService.getInterventionTypes({
        sortBy: 'name',
        sortOrder: 'asc',
        search: '',
      });
      setInterventionTypes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des types d&apos;interventions:', error);
    }
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

  const handleUpdateIntervention = async (data: UpdateInterventionDto) => {
    if (!intervention) return;

    try {
      await interventionService.updateIntervention(intervention.id, data);
      await loadIntervention(); // Recharger les données après modification
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error; // Relancer l'erreur pour que la modal puisse l'afficher
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
            onClick={() => setIsDialogOpen(true)}
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

        {/* Timeline des dates */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Timeline de l&apos;intervention
            </Typography>

            <Timeline position="alternate" sx={{ mt: 2 }}>
              {/* Étape 1: Planification */}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <ScheduleIcon />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography variant="h6" component="span">
                    Planification
                  </Typography>
                  <Typography color="text.secondary" display="block">
                    {intervention.plannedAt ?
                      format(new Date(intervention.plannedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }) :
                      'Date non définie'
                    }
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              {/* Étape 2: Début d'intervention */}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={intervention.startedAt ? "warning" : "grey"}>
                    <PlayArrowIcon />
                  </TimelineDot>
                  {intervention.endedAt && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography
                    variant="h6"
                    component="span"
                    color={intervention.startedAt ? 'inherit' : 'text.secondary'}
                  >
                    Début d&apos;intervention
                  </Typography>
                  <Typography color="text.secondary" display="block">
                    {intervention.startedAt ?
                      format(new Date(intervention.startedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }) :
                      'En attente de démarrage'
                    }
                  </Typography>
                </TimelineContent>
              </TimelineItem>

              {/* Étape 3: Fin d'intervention */}
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color={intervention.endedAt ? "success" : "grey"}>
                    <CheckCircleIcon />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ py: '12px', px: 2 }}>
                  <Typography
                    variant="h6"
                    component="span"
                    color={intervention.endedAt ? 'inherit' : 'text.secondary'}
                  >
                    Intervention terminée
                  </Typography>
                  <Typography color="text.secondary" display="block">
                    {intervention.endedAt ?
                      format(new Date(intervention.endedAt), 'dd/MM/yyyy à HH:mm', { locale: fr }) :
                      'En cours...'
                    }
                  </Typography>
                  {intervention.terminatedBy && intervention.endedAt && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Terminée par: {intervention.terminatedBy.firstName} {intervention.terminatedBy.lastName}
                    </Typography>
                  )}
                </TimelineContent>
              </TimelineItem>
            </Timeline>

            {/* Informations complémentaires */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">
                Dernière modification: {format(new Date(intervention.updatedAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <InterventionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleUpdateIntervention}
        intervention={intervention}
        interventionTypes={interventionTypes}
      />
    </Box>
  );
}
