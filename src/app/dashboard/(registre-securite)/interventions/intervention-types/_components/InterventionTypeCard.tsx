import { InterventionType } from '@/services/interventionTypeService';
import { Code as CodeIcon, Delete as DeleteIcon, Edit as EditIcon, Restore as RestoreIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';

interface InterventionTypeCardProps {
  interventionType: InterventionType;
  onEdit: (type: InterventionType) => void;
  onDelete: (type: InterventionType) => void;
  onRestore?: (type: InterventionType) => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  const date = parseISO(dateString);
  if (!isValid(date)) return '-';

  return format(date, 'dd/MM/yyyy', { locale: fr });
};

const InterventionTypeCard: React.FC<InterventionTypeCardProps> = ({
  interventionType,
  onEdit,
  onDelete,
  onRestore,
}) => {
  return (
    <Card
      sx={{
        mb: 2,
        opacity: !interventionType.isActive ? 0.7 : 1,
        border: !interventionType.isActive ? '1px dashed' : '1px solid',
        borderColor: !interventionType.isActive ? 'grey.400' : 'divider',
      }}
    >
      <CardContent>
        {/* En-tête avec code et actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CodeIcon color="primary" fontSize="small" />
            <Typography variant="h6" component="h3" fontWeight="600">
              {interventionType.code}
            </Typography>
            <Chip
              label={interventionType.isActive ? 'Actif' : 'Inactif'}
              color={interventionType.isActive ? 'success' : 'default'}
              size="small"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => onEdit(interventionType)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {interventionType.isActive ? (
              <Tooltip title="Désactiver">
                <IconButton
                  size="small"
                  onClick={() => onDelete(interventionType)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : onRestore ? (
              <Tooltip title="Restaurer">
                <IconButton
                  size="small"
                  onClick={() => onRestore(interventionType)}
                  color="success"
                >
                  <RestoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        </Box>

        {/* Nom */}
        <Typography variant="body1" fontWeight="500" gutterBottom>
          {interventionType.name}
        </Typography>

        {/* Description */}
        {interventionType.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {interventionType.description}
          </Typography>
        )}

        {/* Informations de dates */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Créé le : {formatDate(interventionType.createdAt)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Modifié le : {formatDate(interventionType.updatedAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InterventionTypeCard; 