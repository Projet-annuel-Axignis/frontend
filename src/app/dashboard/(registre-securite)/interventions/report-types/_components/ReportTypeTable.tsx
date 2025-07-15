'use client';

import { ReportType } from '@/types/intervention';
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

interface ReportTypeTableProps {
  reportTypes: ReportType[];
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

export default function ReportTypeTable({
  reportTypes,
  onEdit,
  onDelete
}: ReportTypeTableProps) {
  if (reportTypes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucun type de rapport trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ajoutez un nouveau type de rapport pour commencer
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
            <TableCell>Périodicité</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportTypes.map((reportType) => (
            <TableRow
              key={reportType.id}
              hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {reportType.id}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {reportType.code}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body1">
                  {reportType.name}
                </Typography>
              </TableCell>

              <TableCell>
                <Chip
                  label={getPeriodicityLabel(reportType.periodicity)}
                  color={getPeriodicityColor(reportType.periodicity) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(reportType)}
                      color="primary"
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
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 