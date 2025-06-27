import { Company } from '@/types/company';
import {
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreHoriz as MoreHorizIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { useState } from 'react';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

function CompanyMenu({ company, onEdit, onDelete }: { company: Company, onEdit: (company: Company) => void, onDelete: (company: Company) => void }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    onEdit(company);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        sx={{
          transition: 'var(--transition-normal)',
          '&:hover': {
            backgroundColor: 'var(--color-axignis-primary)',
            color: 'white',
          },
        }}
      >
        <MoreHorizIcon />
      </IconButton>
      <Menu
        id="company-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'company-menu-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontWeight: 500 }}>
          <EditIcon sx={{ mr: 1, fontSize: '1rem' }} />
          Éditer
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: company.deletedAt ? 'success.main' : 'error.main',
            fontWeight: 500
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

export default function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  const theme = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'var(--transition-normal)',
        opacity: company.deletedAt ? 0.6 : 1,
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          borderColor: 'var(--color-axignis-primary)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header avec avatar et statut */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: company.deletedAt
                  ? 'grey.400'
                  : `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {getInitials(company.name)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-axignis-dark)' }}>
                {company.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontFamily: 'monospace' }}>
                SIRET: {company.siretNumber}
              </Typography>
            </Box>
          </Box>

          {/* Statut supprimé */}
          {company.deletedAt && (
            <Chip
              variant="filled"
              size="small"
              color="error"
              label="Supprimée"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Informations de l'entreprise */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, mb: 2 }}>
          <BusinessIcon sx={{ color: 'var(--color-axignis-primary)', fontSize: '1rem' }} />
          {!company.deletedAt ? (
            <Chip
              variant="outlined"
              size="small"
              label="Active"
              color="success"
              sx={{
                fontSize: '0.75rem',
                height: 24,
                fontWeight: 500,
              }}
            />
          ) : (
            <Chip
              variant="outlined"
              size="small"
              label="Supprimée"
              color="error"
              sx={{
                fontSize: '0.75rem',
                height: 24,
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(company);
              }}
              sx={{
                color: 'var(--color-axignis-primary)',
                transition: 'var(--transition-normal)',
                '&:hover': {
                  backgroundColor: 'var(--color-axignis-primary)',
                  color: 'white',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <Box onClick={(e) => e.stopPropagation()}>
              <CompanyMenu company={company} onEdit={onEdit} onDelete={onDelete} />
            </Box>
          </Box>

          {/* Date de création */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Créée le {new Date(company.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 