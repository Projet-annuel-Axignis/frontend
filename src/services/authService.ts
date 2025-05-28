import { api } from '@/lib/api';
import { AuthResponse, LoginCredentials, RefreshTokenResponse, RegisterCredentials } from '@/types/auth';
import axios from 'axios';

// L'URL de l'API, récupérée depuis les variables d'environnement ou valeur par défaut
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.axignis.com';

/**
 * Service d'authentification
 * 
 * Ensemble de fonctions pour gérer l'authentification des utilisateurs
 * et les opérations associées (connexion, inscription, déconnexion, etc.)
 */
const authService = {
  /**
   * Authentifie un utilisateur avec ses identifiants
   * 
   * Envoie une requête POST à l'endpoint /auth/login et stocke 
   * les tokens d'authentification dans le localStorage si la connexion réussit.
   * 
   * @param credentials - Objet contenant l'email et le mot de passe de l'utilisateur
   * @returns Promesse contenant les données de l'utilisateur et le token d'accès
   * @throws Erreur en cas d'échec de connexion (identifiants incorrects, serveur indisponible, etc.)
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);

      // Sauvegarder les tokens
      localStorage.setItem('accessToken', response.data.accessToken);
      //localStorage.setItem('refreshToken', response.data.refreshToken || response.data.accessToken);

      return response.data;
    } catch (error) {
      // Laisser l'erreur se propager pour être traitée par notre gestionnaire d'erreurs
      throw error;
    }
  },

  /**
   * Inscrit un nouvel utilisateur
   * 
   * Envoie une requête POST à l'endpoint /users avec les informations du nouvel utilisateur.
   * Si l'inscription réussit et que des tokens sont fournis, ils sont stockés dans le localStorage.
   * 
   * @param credentials - Objet contenant les informations du nouvel utilisateur (nom, prénom, email, mot de passe, etc.)
   * @returns Promesse contenant les données de l'utilisateur créé et le token d'accès (si fourni)
   * @throws Erreur en cas d'échec d'inscription (email déjà utilisé, validation échouée, etc.)
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    console.log('credentials', credentials);
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);

      return response.data;
    } catch (error) {
      // Laisser l'erreur se propager pour être traitée par notre gestionnaire d'erreurs
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur actuellement authentifié
   * 
   * Envoie une requête POST à l'endpoint /auth/logout avec le refresh token,
   * puis supprime les tokens du localStorage.
   * 
   * @returns Promesse vide qui se résout lorsque la déconnexion est terminée
   */
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

  /**
   * Récupère les informations de l'utilisateur actuellement authentifié
   * 
   * Envoie une requête GET à l'endpoint /auth/profile en utilisant le token d'accès
   * stocké dans le localStorage.
   * 
   * @returns Promesse contenant les données de l'utilisateur ou null si non authentifié
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Vérifie si un utilisateur est actuellement authentifié
   * 
   * Cette fonction vérifie simplement la présence d'un token d'accès dans le localStorage.
   * Elle ne garantit pas que le token est valide ou non expiré.
   * 
   * @returns true si un token d'accès est présent dans le localStorage, false sinon
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Rafraîchit le token d'accès à l'aide du refresh token
   * 
   * Envoie une requête POST à l'endpoint /auth/refresh-token avec le refresh token
   * stocké dans le localStorage pour obtenir un nouveau token d'accès.
   * 
   * @returns Promesse contenant le nouveau token d'accès
   * @throws Erreur si le refresh token est invalide ou expiré, avec redirection vers la page de connexion
   */
  refreshToken: async (): Promise<string> => {
    return 'test';
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