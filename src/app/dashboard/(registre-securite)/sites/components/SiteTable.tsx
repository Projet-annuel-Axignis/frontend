'use client';

import { getFullAddress } from '@/services/siteService';
import { Site } from '@/types/site';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon,
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
  Typography,
} from '@mui/material';
import React from 'react';

interface SiteTableProps {
  sites: Site[];
  companyNames: Record<number, string>;
  onView: (site: Site) => void;
  onEdit: (site: Site) => void;
  onDelete: (site: Site) => void;
  onRestore?: (site: Site) => void;
}

const SiteTable: React.FC<SiteTableProps> = ({
  sites,
  companyNames,
  onView,
  onEdit,
  onDelete,
  onRestore,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSite, setSelectedSite] = React.useState<Site | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, site: Site) => {
    setAnchorEl(event.currentTarget);
    setSelectedSite(site);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedSite(null);
  };

  const handleEdit = () => {
    if (selectedSite) {
      onEdit(selectedSite);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedSite) {
      onDelete(selectedSite);
    }
    handleClose();
  };

  const handleRestore = () => {
    if (selectedSite && onRestore) {
      onRestore(selectedSite);
    }
    handleClose();
  };

  if (sites.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <LocationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Aucun site trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucun site ne correspond à vos critères de recherche.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nom du site</strong></TableCell>
            <TableCell><strong>Entreprise</strong></TableCell>
            <TableCell><strong>Adresse</strong></TableCell>
            <TableCell><strong>Référence</strong></TableCell>
            <TableCell><strong>Statut</strong></TableCell>
            <TableCell align="right"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map((site) => {
            const isDeleted = !!site.deletedAt;
            const companyName = companyNames[site.companyId] || 'N/A';

            return (
              <TableRow
                key={site.id}
                sx={{
                  opacity: isDeleted ? 0.6 : 1,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'medium',
                      textDecoration: isDeleted ? 'line-through' : 'none',
                    }}
                  >
                    {site.name}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {companyName}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ maxWidth: 200 }}>
                    {getFullAddress(site)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {site.reference || '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isDeleted ? (
                      <Chip
                        label="Supprimé"
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Actif"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {/* Bouton Voir détails principal */}
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ViewIcon />}
                      onClick={() => onView(site)}
                      sx={{ minWidth: 'auto' }}
                    >
                      Voir détails
                    </Button>

                    {/* Menu secondaire pour les autres actions */}
                    <Tooltip title="Plus d'actions">
                      <IconButton
                        onClick={(e) => handleClick(e, site)}
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

      {/* Menu secondaire (Modifier/Supprimer/Restaurer) */}
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
        {selectedSite && !selectedSite.deletedAt && (
          <MenuItem onClick={handleEdit}>
            <EditIcon sx={{ mr: 1 }} />
            Modifier
          </MenuItem>
        )}

        {selectedSite?.deletedAt && onRestore ? (
          <MenuItem onClick={handleRestore}>
            <RestoreIcon sx={{ mr: 1 }} />
            Restaurer
          </MenuItem>
        ) : (
          selectedSite && !selectedSite.deletedAt && (
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1 }} />
              Supprimer
            </MenuItem>
          )
        )}
      </Menu>
    </TableContainer>
  );
};

export default SiteTable; 