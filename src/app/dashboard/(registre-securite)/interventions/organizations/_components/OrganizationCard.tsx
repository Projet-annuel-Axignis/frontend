'use client';

import { Organization } from '@/services/organizationService';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
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

interface OrganizationCardProps {
  organization: Organization;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'OA': return 'Organisme Agréé';
    case 'TC': return 'Tiers de Contrôle';
    default: return type;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'OA': return 'primary';
    case 'TC': return 'secondary';
    default: return 'default';
  }
};

export default function OrganizationCard({
  organization,
  onEdit,
  onDelete
}: OrganizationCardProps) {
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
        {/* En-tête avec ID et Type */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            ID: {organization.id}
          </Typography>
          <Chip
            label={getTypeLabel(organization.type)}
            color={getTypeColor(organization.type) as any}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Nom */}
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {organization.name}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'flex-end' }}>
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            onClick={() => onEdit(organization)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            onClick={() => onDelete(organization)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
} 