'use client';

import { InterventionType } from '@/services/interventionTypeService';
import {
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Box,
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

interface InterventionTypeTableProps {
  interventionTypes: InterventionType[];
  onEdit: (interventionType: InterventionType) => void;
  onDelete: (interventionType: InterventionType) => void;
}

export default function InterventionTypeTable({
  interventionTypes,
  onEdit,
  onDelete
}: InterventionTypeTableProps) {
  if (interventionTypes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucun type d&apos;intervention trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajoutez un nouveau type d&apos;intervention pour commencer
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
            <TableCell>Code</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interventionTypes.map((interventionType) => (
            <TableRow
              key={interventionType.id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {interventionType.id}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {interventionType.code}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1">
                  {interventionType.name}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(interventionType)}
                      color="primary"
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
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 