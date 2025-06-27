import { User } from '@/types/auth';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreHoriz as MoreHorizIcon,
  Person as PersonIcon,
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

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

function UserMenu({ user, onEdit, onDelete }: { user: User, onEdit: (user: User) => void, onDelete: (user: User) => void }) {
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
    onEdit(user);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
    onDelete(user);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? 'user-menu' : undefined}
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
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
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
            color: user.deletedAt ? 'success.main' : 'error.main',
            fontWeight: 500
          }}
        >
          {user.deletedAt ? (
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

export default function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const theme = useTheme();

  const getRoleLabel = (roleType: string) => {
    switch (roleType) {
      case 'ADMINISTRATOR':
        return 'Administrateur';
      case 'COMPANY_ADMINISTRATOR':
        return 'Admin Entreprise';
      case 'COMPANY_MANAGER':
        return 'Manager';
      case 'COMPANY_MEMBER':
        return 'Membre';
      case 'VISITOR':
        return 'Visiteur';
      default:
        return roleType;
    }
  };

  const getRoleColor = (roleType: string) => {
    switch (roleType) {
      case 'ADMINISTRATOR':
        return 'error';
      case 'COMPANY_ADMINISTRATOR':
        return 'warning';
      case 'COMPANY_MANAGER':
        return 'info';
      case 'COMPANY_MEMBER':
        return 'primary';
      case 'VISITOR':
        return 'default';
      default:
        return 'default';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'var(--transition-normal)',
        opacity: user.deletedAt ? 0.6 : 1,
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
                background: user.deletedAt
                  ? 'grey.400'
                  : `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-axignis-dark)' }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* Statut supprimé */}
          {user.deletedAt && (
            <Chip
              variant="filled"
              size="small"
              color="error"
              label="Supprimé"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>

        {/* Informations du rôle */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, mb: 2 }}>
          <PersonIcon sx={{ color: 'var(--color-axignis-primary)', fontSize: '1rem' }} />
          <Chip
            variant="outlined"
            size="small"
            label={getRoleLabel(user.role?.type || '')}
            color={getRoleColor(user.role?.type || '') as any}
            sx={{
              fontSize: '0.75rem',
              height: 24,
              fontWeight: 500,
            }}
          />
          {user.company && (
            <>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                &bull;
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.company.name}
              </Typography>
            </>
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
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
              <UserMenu user={user} onEdit={onEdit} onDelete={onDelete} />
            </Box>
          </Box>

          {/* Date de création */}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
} 