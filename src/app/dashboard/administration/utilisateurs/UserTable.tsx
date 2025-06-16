'use client';

import { User, UserRoleType } from '@/types/auth';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import {
  Avatar,
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
  Typography,
  useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  loading?: boolean;
}

const getRoleColor = (roleType: UserRoleType) => {
  switch (roleType) {
    case UserRoleType.ADMINISTRATOR:
      return 'error';
    case UserRoleType.COMPANY_ADMINISTRATOR:
      return 'warning';
    case UserRoleType.COMPANY_MANAGER:
      return 'info';
    case UserRoleType.COMPANY_MEMBER:
      return 'success';
    case UserRoleType.VISITOR:
      return 'default';
    default:
      return 'default';
  }
};

const getRoleLabel = (roleType: UserRoleType) => {
  switch (roleType) {
    case UserRoleType.ADMINISTRATOR:
      return 'Administrateur';
    case UserRoleType.COMPANY_ADMINISTRATOR:
      return 'Admin Entreprise';
    case UserRoleType.COMPANY_MANAGER:
      return 'Manager';
    case UserRoleType.COMPANY_MEMBER:
      return 'Membre';
    case UserRoleType.VISITOR:
      return 'Visiteur';
    default:
      return roleType;
  }
};

export default function UserTable({ users = [], onEdit, onDelete, loading = false }: UserTableProps) {
  const theme = useTheme();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy à HH:mm', { locale: fr });
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Chargement des utilisateurs...</Typography>
        </Box>
      </Paper>
    );
  }

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rôle</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Créé le</TableCell>
            <TableCell>Dernière MAJ</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {safeUsers.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                ...(user.deletedAt && {
                  opacity: 0.6,
                  backgroundColor: theme.palette.action.disabledBackground,
                }),
              }}
            >
              {/* Utilisateur */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'var(--color-axignis-primary)',
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {user.id}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              {/* Email */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">{user.email}</Typography>
                </Box>
              </TableCell>

              {/* Rôle */}
              <TableCell>
                <Chip
                  label={getRoleLabel(user.role.type)}
                  color={getRoleColor(user.role.type) as any}
                  size="small"
                  variant="outlined"
                />
              </TableCell>

              {/* Statut */}
              <TableCell>
                <Chip
                  label={user.deletedAt ? 'Supprimé' : 'Actif'}
                  color={user.deletedAt ? 'error' : 'success'}
                  size="small"
                  variant={user.deletedAt ? 'filled' : 'outlined'}
                />
              </TableCell>

              {/* Date de création */}
              <TableCell>
                <Typography variant="body2">
                  {formatDate(user.createdAt)}
                </Typography>
              </TableCell>

              {/* Dernière mise à jour */}
              <TableCell>
                <Typography variant="body2">
                  {formatDate(user.updatedAt)}
                </Typography>
              </TableCell>

              {/* Actions */}
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(user)}
                      sx={{
                        color: 'var(--color-axignis-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-axignis-primary)20',
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={user.deletedAt ? 'Restaurer' : 'Supprimer'}>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(user)}
                      sx={{
                        color: user.deletedAt ? 'success.main' : 'error.main',
                        '&:hover': {
                          backgroundColor: user.deletedAt ? 'success.light' : 'error.light',
                          opacity: 0.1,
                        },
                      }}
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

      {safeUsers.length === 0 && !loading && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Aucun utilisateur trouvé
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
} 