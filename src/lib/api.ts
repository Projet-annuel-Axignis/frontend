import axios from 'axios';

// Créer une instance axios
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.axignis.com';

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