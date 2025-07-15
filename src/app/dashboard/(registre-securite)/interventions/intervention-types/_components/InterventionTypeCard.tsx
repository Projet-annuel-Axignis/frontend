'use client';

import { InterventionType } from '@/services/interventionTypeService';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';

interface InterventionTypeCardProps {
  interventionType: InterventionType;
  onEdit: (interventionType: InterventionType) => void;
  onDelete: (interventionType: InterventionType) => void;
}

export default function InterventionTypeCard({
  interventionType,
  onEdit,
  onDelete
}: InterventionTypeCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* En-tête avec ID */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ID: {interventionType.id}
          </Typography>
        </Box>

        {/* Code */}
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {interventionType.code}
        </Typography>

        {/* Nom */}
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          {interventionType.name}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'flex-end' }}>
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            onClick={() => onEdit(interventionType)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            onClick={() => onDelete(interventionType)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
} 