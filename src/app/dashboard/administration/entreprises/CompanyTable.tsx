'use client';

import { Company } from '@/types/company';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import {
  Box,
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
  Typography
} from '@mui/material';
import { useState } from 'react';

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
  loading?: boolean;
}

interface CompanyMenuProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

function CompanyMenu({ company, onEdit, onDelete }: CompanyMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    onEdit(company);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(company);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? 'company-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="company-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'company-menu-button',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Éditer
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: company.deletedAt ? 'success.main' : 'error.main',
          }}
        >
          {company.deletedAt ? (
            <>
              <RestoreIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Restaurer
            </>
          ) : (
            <>
              <DeleteIcon sx={{ mr: 1, fontSize: '1rem' }} />
              Supprimer
            </>
          )}
        </MenuItem>
      </Menu>
    </>
  );
}

export default function CompanyTable({ companies, onEdit, onDelete, loading }: CompanyTableProps) {
  if (loading && companies.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Chargement des entreprises...</Typography>
      </Paper>
    );
  }

  if (!loading && companies.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Aucune entreprise trouvée.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>SIRET</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date de création</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 100 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                opacity: company.deletedAt ? 0.6 : 1,
              }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {company.name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontFamily="monospace">
                  {company.siretNumber}
                </Typography>
              </TableCell>
              <TableCell>
                {company.deletedAt ? (
                  <Chip
                    label="Supprimée"
                    color="error"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    label="Active"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(company.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => onEdit(company)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <CompanyMenu
                    company={company}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 