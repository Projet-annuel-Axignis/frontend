'use client';

import { Intervention } from '@/types/intervention';
import {
  Build as BuildIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Stop as StopIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PLANNED':
      return 'info';
    case 'IN_PROGRESS':
      return 'warning';
    case 'TERMINATED':
      return 'success';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PLANNED':
      return 'Planifiée';
    case 'IN_PROGRESS':
      return 'En cours';
    case 'TERMINATED':
      return 'Terminée';
    default:
      return status;
  }
};

const getPeriodicityLabel = (periodicity: string) => {
  switch (periodicity) {
    case 'MONTHLY':
      return 'Mensuel';
    case 'QUARTER':
      return 'Trimestriel';
    case 'SEMESTER':
      return 'Semestriel';
    case 'ANNUAL':
      return 'Annuel';
    default:
      return periodicity;
  }
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
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, intervention: Intervention) => {
    setAnchorEl(event.currentTarget);
    setSelectedIntervention(intervention);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedIntervention(null);
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

  if (interventions.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <BuildIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucune intervention trouvée
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucune intervention ne correspond à vos critères de recherche.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Libellé</strong></TableCell>
            <TableCell><strong>Entreprise</strong></TableCell>
            <TableCell><strong>Employé</strong></TableCell>
            <TableCell><strong>Type</strong></TableCell>
            <TableCell><strong>Statut</strong></TableCell>
            <TableCell><strong>Périodicité</strong></TableCell>
            <TableCell><strong>Date prévue</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {interventions.map((intervention) => {
            const isDeleted = !!intervention.deletedAt;

            return (
              <TableRow
                key={intervention.id}
                sx={{
                  opacity: isDeleted ? 0.6 : 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    onClick={() => onView(intervention)}
                    sx={{
                      fontWeight: 'bold',
                      textDecoration: isDeleted ? 'line-through' : 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
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
                    {intervention.type.name} ({intervention.type.code})
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isDeleted ? (
                      <Chip
                        label="Archivée"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label={getStatusLabel(intervention.status)}
                        size="small"
                        color={getStatusColor(intervention.status) as any}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {getPeriodicityLabel(intervention.periodicity)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {new Date(intervention.plannedAt).toLocaleDateString('fr-FR')}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {/* Bouton Voir détails principal */}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => onView(intervention)}
                      sx={{
                        minWidth: 'auto',
                        background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                        },
                      }}
                    >
                      Voir détails
                    </Button>

                    {/* Menu secondaire pour les autres actions */}
                    <Tooltip title="Plus d'actions">
                      <IconButton
                        onClick={(e) => handleClick(e, intervention)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Menu secondaire (Modifier/Démarrer/Terminer/Supprimer/Restaurer) */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedIntervention && !selectedIntervention.deletedAt && (
          <>
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1 }} />
              Modifier
            </MenuItem>

            {selectedIntervention.status === 'PLANNED' && (
              <MenuItem onClick={handleStart}>
                <PlayArrowIcon sx={{ mr: 1 }} />
                Démarrer
              </MenuItem>
            )}

            {selectedIntervention.status === 'IN_PROGRESS' && (
              <MenuItem onClick={handleTerminate}>
                <StopIcon sx={{ mr: 1 }} />
                Terminer
              </MenuItem>
            )}

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} />
              Archiver
            </MenuItem>
          </>
        )}

        {selectedIntervention?.deletedAt && onRestore && (
          <MenuItem onClick={handleRestore}>
            <RestoreIcon sx={{ mr: 1 }} />
            Restaurer
          </MenuItem>
        )}
      </Menu>
    </TableContainer>
  );
};

export default InterventionTable; 