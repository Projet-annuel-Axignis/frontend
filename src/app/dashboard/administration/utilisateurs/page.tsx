'use client';

import { useToast } from '@/app/_providers/ToastProvider';
import Loading from '@/components/ui/Loading';
import { useLoading } from '@/hooks/useLoading';
import userService, { UserFilters } from '@/services/userService';
import { User } from '@/types/auth';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Pagination,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import UserDialog from './UserDialog';
import UserFiltersComponent from './UserFilters';
import UserTable from './UserTable';

export default function UtilisateursPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const { isLoading, withLoading } = useLoading();
  const { showToast } = useToast();

  // Chargement des utilisateurs
  const loadUsers = useCallback(async () => {
    try {
      setError('');
      const response = await withLoading(() => userService.getUsers(filters));

      // Protection supplémentaire pour s'assurer que response.users est un tableau
      setUsers(Array.isArray(response.users) ? response.users : []);
      setTotal(response.total || 0);
      setCurrentPage(response.page || 1);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      // En cas d'erreur, s'assurer que users reste un tableau vide
      setUsers([]);
      setTotal(0);
    }
  }, [filters, withLoading, showToast]);

  // Chargement initial
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Gestion des filtres
  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters({
      ...newFilters,
      page: 1, // Reset à la première page lors du changement de filtres
      limit: filters.limit,
    });
  };

  const handleFiltersReset = () => {
    setFilters({
      page: 1,
      limit: 10,
    });
  };

  // Gestion de la pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Gestion de l'édition
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleSave = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        // Mise à jour
        await userService.updateUser(selectedUser.id, userData);
        showToast('Utilisateur mis à jour avec succès', 'success');
      } else {
        // Création
        await userService.createUser(userData);
        showToast('Utilisateur créé avec succès', 'success');
      }

      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde';
      throw new Error(errorMessage);
    }
  };

  // Gestion de la suppression/restauration
  const handleDelete = async (user: User) => {
    try {
      if (user.deletedAt) {
        // Restaurer
        await userService.restoreUser(user.id);
        showToast('Utilisateur restauré avec succès', 'success');
      } else {
        // Supprimer
        await userService.deleteUser(user.id);
        showToast('Utilisateur supprimé avec succès', 'success');
      }

      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'opération';
      showToast(errorMessage, 'error');
    }
  };

  const totalPages = Math.ceil(total / (filters.limit || 10));

  if (isLoading && (!users || users.length === 0)) {
    return (
      <Loading
        message="Chargement des utilisateurs..."
        variant="page"
        size="medium"
      />
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PeopleIcon color="primary" sx={{ fontSize: '2rem' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" component="h2" fontWeight="600">
                Gestion des Utilisateurs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {total} utilisateur{total > 1 ? 's' : ''} au total
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadUsers}
              disabled={isLoading}
              size="small"
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
              sx={{
                background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
                },
              }}
            >
              Nouvel utilisateur
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Filtres */}
          <UserFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />

          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Table des utilisateurs */}
          <UserTable
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isLoading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {/* Loading overlay pour les actions */}
          {isLoading && users && users.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Loading
                message="Chargement..."
                variant="component"
                size="small"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition/création */}
      <UserDialog
        open={dialogOpen}
        user={selectedUser}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        loading={isLoading}
      />
    </Box>
  );
} 