import { AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterCredentials } from '@/types/auth';
import axios from 'axios';

// Créer une instance axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.axignis.com';

// Créer l'instance axios pour les appels API
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour rafraîchir le token si nécessaire
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et que la demande n'a pas déjà été retentée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
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

        // Mettre à jour le token dans la requête originale et la relancer
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/connexion';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  // Connexion
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Sauvegarder les tokens
    localStorage.setItem('accessToken', response.data.tokens.access.token);
    localStorage.setItem('refreshToken', response.data.tokens.refresh.token);

    return response.data;
  },

  // Inscription
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);

    // Sauvegarder les tokens si l'inscription connecte aussi l'utilisateur
    localStorage.setItem('accessToken', response.data.tokens.access.token);
    localStorage.setItem('refreshToken', response.data.tokens.refresh.token);

    return response.data;
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
      const response = await api.get('/auth/me');
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
}; 