'use client';

import { Organization } from '@/services/organizationService';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';

interface OrganizationTableProps {
  organizations: Organization[];
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

export default function OrganizationTable({
  organizations,
  onEdit,
  onDelete
}: OrganizationTableProps) {
  if (organizations.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucun organisme trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajoutez un nouvel organisme pour commencer
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow
              key={organization.id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {organization.id}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1">
                  {organization.name}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={getTypeLabel(organization.type)}
                  color={getTypeColor(organization.type) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(organization)}
                      color="primary"
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
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 