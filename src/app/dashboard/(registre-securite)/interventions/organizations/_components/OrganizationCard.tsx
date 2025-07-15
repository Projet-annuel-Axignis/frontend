'use client';

import { Organization } from '@/services/organizationService';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  VisibilityOff as InactiveIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon
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
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';

interface OrganizationCardProps {
  organization: Organization;
  onEdit: (organization: Organization) => void;
  onToggleStatus: (organization: Organization) => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = parseISO(dateString);
  if (!isValid(date)) return '-';
  return format(date, 'dd/MM/yy', { locale: fr });
};

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
  onEdit,
  onToggleStatus
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        opacity: organization.isActive ? 1 : 0.6,
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
            {organization.code}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label={organization.isActive ? 'Actif' : 'Inactif'}
              color={organization.isActive ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => onEdit(organization)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={organization.isActive ? 'Désactiver' : 'Activer'}>
              <IconButton
                size="small"
                onClick={() => onToggleStatus(organization)}
                color={organization.isActive ? 'warning' : 'success'}
              >
                <InactiveIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Corps */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
            {organization.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {organization.description || 'Aucune description'}
          </Typography>

          {/* Informations de contact */}
          {organization.contactInfo && (
            <Box sx={{ mb: 2 }}>
              {organization.contactInfo.email && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {organization.contactInfo.email}
                  </Typography>
                </Box>
              )}
              {organization.contactInfo.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {organization.contactInfo.phone}
                  </Typography>
                </Box>
              )}
              {organization.contactInfo.address && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {organization.contactInfo.address}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary">
            Créé le {formatDate(organization.createdAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard; 