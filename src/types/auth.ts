/**
 * Types et interfaces liés à l'authentification et à la gestion des utilisateurs
 * 
 * Ce fichier contient toutes les définitions de types utilisées pour :
 * - Les informations utilisateur
 * - Les credentials d'authentification
 * - Les réponses d'API
 * - La gestion des erreurs
 */

import { Company } from "./company";
import { Plans } from "./plans";

/**
 * Interface représentant un utilisateur de l'application
 * 
 * Contient toutes les informations d'un utilisateur authentifié
 * y compris son rôle et les métadonnées temporelles.
 */
export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  company: Company | null;
}

/**
 * Énumération des types de rôles utilisateur
 */
export enum UserRoleType {
  ADMINISTRATOR = 'ADMINISTRATOR',
  COMPANY_ADMINISTRATOR = 'COMPANY_ADMINISTRATOR',
  COMPANY_MANAGER = 'COMPANY_MANAGER',
  COMPANY_MEMBER = 'COMPANY_MEMBER',
  VISITOR = 'VISITOR'
}

/**
 * Interface représentant un rôle utilisateur
 * 
 * Définit les permissions et le niveau d'accès d'un utilisateur
 * au sein de l'application.
 */
export interface UserRole {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  type: UserRoleType;
  description: string;
}

/**
 * Interface pour la mise à jour d'un utilisateur
 * 
 * Contient les informations nécessaires pour mettre à jour un utilisateur.
 * 
 * Tous les champs sont optionnels, sauf le mot de passe et la confirmation du mot de passe.
 * 
 * @param {string} [firstName] - Prénom de l'utilisateur
 * @param {string} [lastName] - Nom de l'utilisateur
 * @param {string} [email] - Email de l'utilisateur
 * @param {string} [role] - Rôle de l'utilisateur
 * @param {number} [companyId] - ID de l'entreprise associée à l'utilisateur
 * @param {string} [password] - Mot de passe de l'utilisateur
 * @param {string} [confirmPassword] - Confirmation du mot de passe de l'utilisateur
 */
export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  companyId?: number;
  password?: string;
  confirmPassword?: string;
}

/**
 * Interface pour les identifiants de connexion
 * 
 * Contient les informations nécessaires pour authentifier un utilisateur existant.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface pour les informations d'inscription d'un nouvel utilisateur
 * 
 * Étend les identifiants de connexion avec les informations supplémentaires
 * requises pour créer un nouveau compte utilisateur.
 */
export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  role?: string;
  siretNumber: string;
  planType: Plans;
  comment?: string;
  companyName: string;
  phoneNumber: string;
}

/**
 * Interface pour la réponse d'authentification
 * 
 * Contient les données retournées par le serveur après une authentification
 * ou une inscription réussie.
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Interface pour la réponse de rafraîchissement de token
 * 
 * Contient les données retournées par le serveur après un rafraîchissement
 * de token réussi.
 */
export interface RefreshTokenResponse {
  access: {
    token: string;
    expires: string;
  };
}

/**
 * Interface pour la structure d'erreur de validation d'un champ
 * 
 * Contient les informations détaillées sur une erreur de validation
 * spécifique à un champ particulier.
 */
export interface ValidationFieldError {
  field: string;
  messages: string[];
  value: any;
}

/**
 * Interface pour les erreurs de validation multiples
 * 
 * Contient une liste d'erreurs de validation détaillées,
 * généralement utilisée dans le champ 'details' d'une ApiError.
 */
export interface ValidationErrorDetails {
  errors: ValidationFieldError[];
}

/**
 * Interface pour les erreurs API standardisées
 * 
 * Format uniforme pour toutes les erreurs retournées par l'API backend,
 * facilitant leur traitement et leur affichage côté client.
 */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: number;
  details?: any; // Champ optionnel pour les détails supplémentaires d'erreur
} 