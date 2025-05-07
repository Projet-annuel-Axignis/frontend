import { api } from '@/lib/api';
import { AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterCredentials } from '@/types/auth';
import axios from 'axios';

// L'URL de l'API, récupérée depuis les variables d'environnement ou valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.axignis.com';

// Service d'authentification
const authService = {
  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      // Sauvegarder les tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken || response.data.accessToken);

      return response.data;
    } catch (error) {
      // Laisser l'erreur se propager pour être traitée par notre gestionnaire d'erreurs
      throw error;
    }
  },

  // Inscription
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users', credentials);

      // Sauvegarder les tokens si fournis
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken || response.data.accessToken);
      }

      return response.data;
    } catch (error) {
      // Laisser l'erreur se propager pour être traitée par notre gestionnaire d'erreurs
      throw error;
    }
  },

  // Déconnexion
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Nettoyer le stockage local
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // Récupérer l'utilisateur courant
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  // Rafraîchir le token
  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post<RefreshTokenResponse>(
        `${API_URL}/auth/refresh-token`,
        { refreshToken }
      );

      // Mettre à jour le token d'accès
      const { token: newAccessToken } = response.data.access;
      localStorage.setItem('accessToken', newAccessToken);

      return newAccessToken;
    } catch (error) {
      // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/connexion';
      throw error;
    }
  }
};

export default authService; 