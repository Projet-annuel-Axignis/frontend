'use client';

import { Intervention } from '@/types/intervention';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  Restore as RestoreIcon,
  Stop as StopIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';

interface InterventionCardProps {
  intervention: Intervention;
  onView: (intervention: Intervention) => void;
  onEdit: (intervention: Intervention) => void;
  onStart: (intervention: Intervention) => void;
  onTerminate: (intervention: Intervention) => void;
  onDelete: (intervention: Intervention) => void;
  onRestore: (intervention: Intervention) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PLANNED':
      return 'info';
    case 'IN_PROGRESS':
      return 'warning';
    case 'TERMINATED':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PLANNED':
      return 'Planifiée';
    case 'IN_PROGRESS':
      return 'En cours';
    case 'TERMINATED':
      return 'Terminée';
    default:
      return status;
  }
};

const getPeriodicityLabel = (periodicity: string) => {
  switch (periodicity) {
    case 'MONTHLY':
      return 'Mensuel';
    case 'QUARTER':
      return 'Trimestriel';
    case 'SEMESTER':
      return 'Semestriel';
    case 'ANNUAL':
      return 'Annuel';
    default:
      return periodicity;
  }
};

export default function InterventionCard({
  intervention,
  onView,
  onEdit,
  onStart,
  onTerminate,
  onDelete,
  onRestore
}: InterventionCardProps) {
  const isDeleted = !!intervention.deletedAt;

  return (
    <Card
      sx={{
        mb: 2,
        opacity: isDeleted ? 0.6 : 1,
        border: isDeleted ? '1px dashed' : '1px solid',
        borderColor: isDeleted ? 'grey.400' : 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 2,
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            {intervention.label}
          </Typography>
          <Chip
            label={getStatusLabel(intervention.status)}
            color={getStatusColor(intervention.status) as any}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Entreprise:</strong> {intervention.companyName}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Employé:</strong> {intervention.employeeName}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Type:</strong> {intervention.type.name} ({intervention.type.code})
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Périodicité:</strong> {getPeriodicityLabel(intervention.periodicity)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            <strong>Planifiée:</strong> {new Date(intervention.plannedAt).toLocaleDateString('fr-FR')}
          </Typography>
          {intervention.startedAt && (
            <Typography variant="caption" color="text.secondary">
              <strong>Démarrée:</strong> {new Date(intervention.startedAt).toLocaleDateString('fr-FR')}
            </Typography>
          )}
          {intervention.endedAt && (
            <Typography variant="caption" color="text.secondary">
              <strong>Terminée:</strong> {new Date(intervention.endedAt).toLocaleDateString('fr-FR')}
            </Typography>
          )}
        </Box>

        {isDeleted && (
          <Typography variant="caption" color="error" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
            Intervention archivée
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Voir les détails">
          <IconButton size="small" onClick={() => onView(intervention)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {!isDeleted && (
          <>
            <Tooltip title="Modifier">
              <IconButton size="small" onClick={() => onEdit(intervention)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {intervention.status === 'PLANNED' && (
              <Tooltip title="Démarrer">
                <IconButton size="small" onClick={() => onStart(intervention)}>
                  <PlayIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {intervention.status === 'IN_PROGRESS' && (
              <Tooltip title="Terminer">
                <IconButton size="small" onClick={() => onTerminate(intervention)}>
                  <StopIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Archiver">
              <IconButton size="small" onClick={() => onDelete(intervention)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        {isDeleted && (
          <Tooltip title="Restaurer">
            <IconButton size="small" onClick={() => onRestore(intervention)}>
              <RestoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
} 