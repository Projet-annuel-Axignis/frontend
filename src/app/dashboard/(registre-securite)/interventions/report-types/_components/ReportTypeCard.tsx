'use client';

import { ReportType } from '@/services/reportTypeService';
import {
  Edit as EditIcon,
  VisibilityOff as InactiveIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import React from 'react';

interface ReportTypeCardProps {
  reportType: ReportType;
  onEdit: (reportType: ReportType) => void;
  onToggleStatus: (reportType: ReportType) => void;
}

const ReportTypeCard: React.FC<ReportTypeCardProps> = ({
  reportType,
  onEdit,
  onToggleStatus
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header avec code et actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {reportType.code}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={reportType.isActive ? 'Actif' : 'Inactif'}
              color={reportType.isActive ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => onEdit(reportType)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={reportType.isActive ? 'Désactiver' : 'Activer'}>
              <IconButton
                size="small"
                onClick={() => onToggleStatus(reportType)}
                color={reportType.isActive ? 'warning' : 'success'}
              >
                <InactiveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Corps */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
            {reportType.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Description: {reportType.description || 'Aucune description'}
          </Typography>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            ID: {reportType.id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReportTypeCard; 