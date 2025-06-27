'use client';

import { useToast } from '@/app/_providers/ToastProvider';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/ui/Pagination';
import { useLoading } from '@/hooks/useLoading';
import userService from '@/services/userService';
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
  Typography
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import UserDialog from './UserDialog';
import UserFiltersComponent from './UserFilters';
import UserTable from './UserTable';

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
}

interface UserFilters {
  search: string;
  role: string;
  includeDeleted: boolean;
}

export default function UtilisateursPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: '',
    includeDeleted: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const { isLoading, withLoading } = useLoading();
  const { showToast } = useToast();

  // Fonction de filtrage côté client (comme pour les produits)
  const filterUsers = (users: User[], filters: UserFilters): User[] => {
    return users.filter(user => {
      // Filtre par recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        if (!fullName.includes(searchLower) &&
          !user.email.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtre par rôle
      if (filters.role && user.role?.type !== filters.role) {
        return false;
      }

      // Filtre par état (supprimé ou non)
      if (!filters.includeDeleted && user.deletedAt) {
        return false;
      }

      return true;
    });
  };

  // Chargement des utilisateurs (une seule fois, sans filtres dans l'URL)
  const loadUsers = useCallback(async () => {
    try {
      setError('');
      // Charger TOUS les utilisateurs (y compris supprimés) une seule fois
      const response = await withLoading(() => userService.getUsers({
        includeDeleted: true,
        limit: 1000 // Récupérer tous les utilisateurs
      }));

      setAllUsers(response.users || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setAllUsers([]);
    }
  }, [withLoading, showToast]);

  // Chargement initial
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Gestion des filtres (comme pour les produits)
  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset à la première page lors du changement de filtres
  };

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Appliquer les filtres et la pagination (comme pour les produits)
  const filteredUsers = filterUsers(allUsers, filters);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion de l'édition
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleSave = async (userData: UserUpdateData) => {
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
      const result = await userService.toggleUserState(user.id);

      // Afficher le message retourné par l'API
      if (result.message === 'User archived') {
        showToast('Utilisateur supprimé avec succès', 'success');
      } else if (result.message === 'User restored') {
        showToast('Utilisateur restauré avec succès', 'success');
      } else {
        showToast(result.message, 'success');
      }

      await loadUsers(); // Recharger la liste
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'opération';
      showToast(errorMessage, 'error');
    }
  };

  if (isLoading && allUsers.length === 0) {
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
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} trouvé{filteredUsers.length > 1 ? 's' : ''}
                {filteredUsers.length !== allUsers.length && ` sur ${allUsers.length} au total`}
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
          />

          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Table des utilisateurs */}
          <UserTable
            users={paginatedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={isLoading}
          />

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}

          {/* Loading overlay pour les actions */}
          {isLoading && allUsers.length > 0 && (
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

      {/* Dialog pour création/édition */}
      <UserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </Box>
  );
} 