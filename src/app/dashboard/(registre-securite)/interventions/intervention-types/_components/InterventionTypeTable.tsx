import { InterventionType } from '@/services/interventionTypeService';
import { Delete as DeleteIcon, Edit as EditIcon, Restore as RestoreIcon } from '@mui/icons-material';
import {
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

interface InterventionTypeTableProps {
  interventionTypes: InterventionType[];
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

const InterventionTypeTable: React.FC<InterventionTypeTableProps> = ({
  interventionTypes,
  onEdit,
  onDelete,
  onRestore,
}) => {
  if (interventionTypes.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucun type d&apos;intervention trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Commencez par créer votre premier type d&apos;intervention.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="center">Statut</TableCell>
            <TableCell align="center">Créé le</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interventionTypes.map((type) => (
            <TableRow
              key={type.id}
              sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                opacity: !type.isActive ? 0.7 : 1,
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {type.code}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {type.name}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {type.description || '-'}
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Chip
                  label={type.isActive ? 'Actif' : 'Inactif'}
                  color={type.isActive ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>

              <TableCell align="center">
                <Typography variant="body2" color="text.secondary">
                  {formatDate(type.createdAt)}
                </Typography>
              </TableCell>

              <TableCell align="center">
                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(type)}
                    color="primary"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {type.isActive ? (
                  <Tooltip title="Désactiver">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(type)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : onRestore ? (
                  <Tooltip title="Restaurer">
                    <IconButton
                      size="small"
                      onClick={() => onRestore(type)}
                      color="success"
                    >
                      <RestoreIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InterventionTypeTable; 