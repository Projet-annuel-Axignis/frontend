/**
 * Configuration de l'API et des intercepteurs pour les requêtes HTTP
 * 
 * Ce module configure une instance axios avec des intercepteurs pour :
 * - Ajouter automatiquement les tokens d'authentification aux requêtes
 * - Gérer le rafraîchissement des tokens expirés
 * - Transmettre correctement les erreurs aux gestionnaires
 */
import axios from 'axios';

/**
 * URL de base de l'API
 * Récupérée depuis les variables d'environnement ou utilise une valeur par défaut
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.axignis.com';

/**
 * Instance axios préconfigurée pour les appels API
 * 
 * Cette instance est utilisée pour toutes les requêtes API de l'application
 * et bénéficie des intercepteurs pour la gestion des tokens.
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur pour ajouter automatiquement le token JWT à chaque requête
 * 
 * Vérifie la présence d'un token d'accès dans le localStorage et l'ajoute 
 * à l'en-tête Authorization des requêtes sortantes.
 */
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

/**
 * Intercepteur pour gérer automatiquement les tokens expirés
 * 
 * Si une requête échoue avec un code 401 (non autorisé), cet intercepteur :
 * 1. Tente de rafraîchir le token d'accès
 * 2. Relance la requête originale avec le nouveau token si le rafraîchissement réussit
 * 3. Propage l'erreur jusqu'au gestionnaire d'erreurs si le rafraîchissement échoue
 * 
 * L'importation dynamique du service d'authentification évite les dépendances circulaires.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et que la demande n'a pas déjà été retentée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Importation dynamique du service d'authentification pour éviter les dépendances circulaires
        const authServiceModule = await import('@/services/authService');
        const authService = authServiceModule.default;

        // Tentative de rafraîchissement du token
        const newAccessToken = await authService.refreshToken();

        // Mettre à jour le token dans la requête originale et la relancer
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // L'erreur sera gérée dans le service d'authentification
        return Promise.reject(refreshError);
      }
    }

    // Transmettre l'erreur telle quelle (avec ses données d'erreur) pour être traitée 
    // par notre utilitaire getErrorMessage
    return Promise.reject(error);
  }
); 