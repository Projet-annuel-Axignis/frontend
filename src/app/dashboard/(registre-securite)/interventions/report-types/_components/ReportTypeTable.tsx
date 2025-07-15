'use client';

import { ReportType } from '@/services/reportTypeService';
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
import React from 'react';

interface ReportTypeTableProps {
  reportTypes: ReportType[];
  onEdit: (reportType: ReportType) => void;
  onToggleStatus: (reportType: ReportType) => void;
}

const ReportTypeTable: React.FC<ReportTypeTableProps> = ({
  reportTypes,
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
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportTypes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Box sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucun type de rapport trouvé
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            reportTypes.map((reportType) => (
              <TableRow
                key={reportType.id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {reportType.code}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {reportType.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {reportType.description || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={reportType.isActive ? 'Actif' : 'Inactif'}
                    color={reportType.isActive ? 'success' : 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="text.secondary">
                    {reportType.id}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTypeTable; 