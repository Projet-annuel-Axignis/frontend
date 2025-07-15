'use client';

import { Organization } from '@/services/organizationService';
import {
  Edit as EditIcon,
  VisibilityOff as InactiveIcon
} from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onToggleStatus: (organization: Organization) => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = parseISO(dateString);
  if (!isValid(date)) return '-';
  return format(date, 'dd/MM/yy', { locale: fr });
};

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organizations,
  onEdit,
  onToggleStatus
}) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Statut</TableCell>
            <TableCell align="center">Date de création</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucun organisme trouvé
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((organization) => (
              <TableRow
                key={organization.id}
                sx={{
                  opacity: organization.isActive ? 1 : 0.6,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {organization.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {organization.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {organization.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={organization.isActive ? 'Actif' : 'Inactif'}
                    color={organization.isActive ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(organization.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrganizationTable; 