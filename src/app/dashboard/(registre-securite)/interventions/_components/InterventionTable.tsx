'use client';

import { Intervention, InterventionStatus, Periodicity } from '@/types/intervention';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Stop as StopIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
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
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React from 'react';

interface InterventionTableProps {
  interventions: Intervention[];
  onView: (intervention: Intervention) => void;
  onEdit: (intervention: Intervention) => void;
  onStart: (intervention: Intervention) => void;
  onTerminate: (intervention: Intervention) => void;
  onDelete: (intervention: Intervention) => void;
  onRestore?: (intervention: Intervention) => void;
}

const statusColors: Record<InterventionStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PLANNED: 'info',
  IN_PROGRESS: 'warning',
  TERMINATED: 'success'
};

const statusLabels: Record<InterventionStatus, string> = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

const periodicityLabels: Record<Periodicity, string> = {
  DAILY: 'Quotidienne',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuelle',
  QUARTERLY: 'Trimestrielle',
  YEARLY: 'Annuelle'
};

const InterventionTable: React.FC<InterventionTableProps> = ({
  interventions,
  onView,
  onEdit,
  onStart,
  onTerminate,
  onDelete,
  onRestore,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIntervention, setSelectedIntervention] = React.useState<Intervention | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, intervention: Intervention) => {
    event.stopPropagation();
    setSelectedIntervention(intervention);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIntervention(null);
  };

  const handleView = () => {
    if (selectedIntervention) {
      onView(selectedIntervention);
    }
    handleClose();
  };

  const handleEdit = () => {
    if (selectedIntervention) {
      onEdit(selectedIntervention);
    }
    handleClose();
  };

  const handleStart = () => {
    if (selectedIntervention) {
      onStart(selectedIntervention);
    }
    handleClose();
  };

  const handleTerminate = () => {
    if (selectedIntervention) {
      onTerminate(selectedIntervention);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedIntervention) {
      onDelete(selectedIntervention);
    }
    handleClose();
  };

  const handleRestore = () => {
    if (selectedIntervention && onRestore) {
      onRestore(selectedIntervention);
    }
    handleClose();
  };

  return (
    <Paper elevation={1} sx={{ borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-head': {
                color: 'white',
                fontWeight: 600
              }
            }}>
              <TableCell>Libellé</TableCell>
              <TableCell>Entreprise</TableCell>
              <TableCell>Employé</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Périodicité</TableCell>
              <TableCell>Date prévue</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow
                key={intervention.id}
                hover
                onClick={() => onView(intervention)}
                sx={{
                  cursor: 'pointer',
                  opacity: intervention.deletedAt ? 0.6 : 1,
                  backgroundColor: intervention.deletedAt ? 'error.light' : 'inherit',
                  '&:hover': {
                    backgroundColor: intervention.deletedAt ? 'error.light' : 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {intervention.label}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {intervention.companyName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {intervention.employeeName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {intervention.type.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={statusLabels[intervention.status]}
                    color={statusColors[intervention.status]}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {periodicityLabels[intervention.periodicity]}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(new Date(intervention.plannedAt), 'dd/MM/yyyy', { locale: fr })}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(e) => handleClick(e, intervention)}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                        },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {interventions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune intervention trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          Voir
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Éditer
        </MenuItem>
        {selectedIntervention && (
          <>
            {selectedIntervention.status === 'PLANNED' && (
              <MenuItem onClick={handleStart}>
                <PlayArrowIcon sx={{ mr: 1 }} fontSize="small" />
                Démarrer
              </MenuItem>
            )}
            {selectedIntervention.status === 'IN_PROGRESS' && (
              <MenuItem onClick={handleTerminate}>
                <StopIcon sx={{ mr: 1 }} fontSize="small" />
                Terminer
              </MenuItem>
            )}
            {selectedIntervention.deletedAt && onRestore && (
              <MenuItem onClick={handleRestore}>
                <RestoreIcon sx={{ mr: 1 }} fontSize="small" />
                Restaurer
              </MenuItem>
            )}
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
              {selectedIntervention.deletedAt ? 'Supprimer définitivement' : 'Archiver'}
            </MenuItem>
          </>
        )}
      </Menu>
    </Paper>
  );
};

export default InterventionTable; 