'use client';

import { ReportType } from '@/types/intervention';
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

interface ReportTypeCardProps {
  reportType: ReportType;
  onEdit: (reportType: ReportType) => void;
  onDelete: (reportType: ReportType) => void;
}

const getPeriodicityLabel = (periodicity: string) => {
  switch (periodicity) {
    case 'MONTHLY': return 'Mensuel';
    case 'QUARTER': return 'Trimestriel';
    case 'SEMESTER': return 'Semestriel';
    case 'ANNUAL': return 'Annuel';
    default: return periodicity;
  }
};

const getPeriodicityColor = (periodicity: string) => {
  switch (periodicity) {
    case 'MONTHLY': return 'primary';
    case 'QUARTER': return 'secondary';
    case 'SEMESTER': return 'warning';
    case 'ANNUAL': return 'success';
    default: return 'default';
  }
};

export default function ReportTypeCard({
  reportType,
  onEdit,
  onDelete
}: ReportTypeCardProps) {
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
            ID: {reportType.id}
          </Typography>
          <Chip
            label={getPeriodicityLabel(reportType.periodicity)}
            color={getPeriodicityColor(reportType.periodicity) as any}
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Code */}
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
          {reportType.code}
        </Typography>

        {/* Nom */}
        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          {reportType.name}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'flex-end' }}>
        <Tooltip title="Modifier">
          <IconButton
            size="small"
            onClick={() => onEdit(reportType)}
            color="primary"
            sx={{ mr: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Supprimer">
          <IconButton
            size="small"
            onClick={() => onDelete(reportType)}
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
} 