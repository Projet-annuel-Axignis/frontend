'use client';

import { useUser } from '@/app/_providers/UserProvider';
import { useLoading } from '@/hooks/useLoading';
import interventionService from '@/services/interventionService';
import interventionTypeService from '@/services/interventionTypeService';
import { partService } from '@/services/siteService';
import { Intervention, InterventionStatus, InterventionType, UpdateInterventionDto } from '@/types/intervention';
import { Part } from '@/types/site';
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Schedule as ScheduleIcon,
  Stop as StopIcon,
  ViewModule as ViewModuleIcon
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
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { user } = useUser();
  const { withLoading } = useLoading();

  const interventionId = parseInt(params.interventionId as string);
  const [intervention, setIntervention] = useState<Intervention | null>(null);
  const [interventionTypes, setInterventionTypes] = useState<InterventionType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [partsDetails, setPartsDetails] = useState<Part[]>([]);

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

        // Charger les détails complets des parties
        if (data.parts && data.parts.length > 0) {
          await loadPartsDetails(data.parts.map(part => part.id));
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l&apos;intervention:', error);
      }
    });
  };

  const loadPartsDetails = async (partIds: number[]) => {
    try {
      const partsPromises = partIds.map(partId => partService.getPart(partId));
      const partsData = await Promise.all(partsPromises);
      setPartsDetails(partsData);
    } catch (error) {
      console.error('Erreur lors du chargement des détails des parties:', error);
    }
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

  const handleViewPart = (part: Part) => {
    if (!part.building?.site) {
      console.error('Site non trouvé pour la partie');
      return;
    }

    const siteId = part.building.site.id;
    router.push(`/dashboard/sites/${siteId}/parties`);
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

        {/* Localisation de l'intervention */}
        {partsDetails.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="primary">
                Localisation de l&apos;intervention
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {partsDetails.map((part, index) => (
                  <Box key={part.id} sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    backgroundColor: 'background.paper'
                  }}>
                    <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                      Partie {index + 1}: {part.name}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {part.building && (
                        <>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Bâtiment
                            </Typography>
                            <Typography variant="body1">
                              {part.building.name}
                            </Typography>
                          </Box>

                          {part.building.site && (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Site
                              </Typography>
                              <Typography variant="body1">
                                {part.building.site.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {part.building.site.streetNumber} {part.building.site.street}, {part.building.site.postalCode} {part.building.site.city}
                              </Typography>
                            </Box>
                          )}

                          {part.building.site?.company && (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Entreprise
                              </Typography>
                              <Typography variant="body1">
                                {part.building.site.company.name}
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Type de partie
                        </Typography>
                        <Chip
                          label={part.type === 'PRIVATE' ? 'Privée' : 'Commune'}
                          size="small"
                          variant="outlined"
                          color={part.type === 'PRIVATE' ? 'primary' : 'secondary'}
                        />
                      </Box>

                      {part.isIcpe && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            ICPE
                          </Typography>
                          <Chip
                            label="Installation Classée"
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        </Box>
                      )}

                      {part.erpTypes && part.erpTypes.length > 0 && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Codes ERP
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {part.erpTypes.map((erpType) => (
                              <Chip
                                key={erpType.code}
                                label={erpType.code}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ViewModuleIcon />}
                          onClick={() => handleViewPart(part)}
                        >
                          Consulter la partie
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

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
