import { api } from '@/lib/api';
import { User } from '@/types/auth';

export interface UsersResponse {
  results: User[];
  totalResults: number;
  currentResults: number;
  sortField: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  includeDeleted?: boolean;
  page?: number;
  limit?: number;
}

class UserService {
  /**
   * Récupère la liste des utilisateurs avec filtres optionnels
   */
  async getUsers(filters: UserFilters = {}): Promise<{ users: User[], total: number, page: number, limit: number }> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.includeDeleted) params.append('includeDeleted', 'true');
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/users?${params.toString()}`);
    const data: UsersResponse = response.data;

    // Adapter la réponse API au format attendu par l'interface
    return {
      users: data.results || [],
      total: data.totalResults || 0,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUserById(id: string | number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id: string | number, userData: any): Promise<User> {
    try {
      const response = await api.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Bascule l'état d'un utilisateur (suppression/restauration)
   */
  async toggleUserState(id: string | number): Promise<{ message: string; id: number }> {
    const response = await api.patch(`/users/${id}/update-state`);
    return response.data;
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: any): Promise<User> {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }



  /**
   * Change le rôle d'un utilisateur
   */
  async changeUserRole(id: string | number, roleType: string): Promise<User> {
    const response = await api.patch(`/users/${id}/role`, { roleType });
    return response.data;
  }
}

export default new UserService(); 