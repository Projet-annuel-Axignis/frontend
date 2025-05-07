import { ApiError } from '@/types/auth';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Fonction utilitaire pour récupérer le message d'erreur traduit en fonction du code d'erreur API
 * @param error L'erreur API
 * @param t Fonction de traduction
 * @returns Le message d'erreur traduit
 */
export const getErrorMessage = (error: unknown, t: any): string => {
  // Journal de débogage pour faciliter le diagnostic des erreurs
  if (process.env.NODE_ENV !== 'production') {
    console.group('API Error Details');
    console.log('Error object:', error);
    if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object'
    ) {
      if ('data' in error.response) {
        console.log('Response data:', error.response.data);
      }
      if ('status' in error.response) {
        console.log('Response status:', error.response.status);
      }
    }
    console.groupEnd();
  }

  // Si c'est une erreur API avec un code spécifique
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data
  ) {
    const apiError = error.response.data as ApiError;

    // Essayer d'obtenir la traduction du code d'erreur
    if (apiError.code) {
      const translationKey = `errors.api.${apiError.code.toLowerCase()}`;
      const translation = t(translationKey, { defaultValue: apiError.message });

      // Si une traduction existe, l'utiliser, sinon utiliser le message d'erreur original
      return translation !== translationKey ? translation : apiError.message;
    }

    // Si pas de code mais un message
    if (apiError.message) {
      return apiError.message;
    }
  }

  // Erreur standard si c'est une instance d'Error
  if (error instanceof Error) {
    return error.message;
  }

  // Message par défaut
  return t('errors.generic', { defaultValue: 'Une erreur inattendue est survenue' });
}; 