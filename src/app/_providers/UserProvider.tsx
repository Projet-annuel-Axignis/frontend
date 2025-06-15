'use client';

import { useToast } from '@/app/_providers/Providers';
import { getErrorMessage } from '@/lib/utils';
import authService from '@/services/authService';
import { RegisterCredentials, User } from '@/types/auth';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

/**
 * Interface définissant les propriétés et méthodes exposées par le contexte utilisateur
 */
interface UserContextType {
  /** L'utilisateur actuellement connecté ou null si non connecté */
  user: User | null;
  /** Indique si une opération d'authentification est en cours */
  isLoading: boolean;
  /** Indique si un utilisateur est actuellement authentifié */
  isAuthenticated: boolean;
  /** Fonction pour connecter un utilisateur avec email et mot de passe */
  login: (email: string, password: string) => Promise<void>;
  /** Fonction pour inscrire un nouvel utilisateur */
  register: (credentials: RegisterCredentials) => Promise<void>;
  /** Fonction pour déconnecter l'utilisateur actuel */
  logout: () => Promise<void>;
  /** Message d'erreur lié à l'authentification ou null */
  error: string | null;
}

/**
 * Contexte React pour gérer l'état d'authentification et les opérations associées
 * 
 * Ce contexte est initialement undefined et sera initialisé par le UserProvider
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Fournisseur du contexte utilisateur
 * 
 * Encapsule la logique d'authentification et expose les fonctionnalités 
 * liées à l'utilisateur à l'ensemble de l'application.
 * 
 * @param props - Les propriétés du composant
 * @param props.children - Les composants enfants qui auront accès au contexte
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const router = useRouter();
  const t = useTranslations();

  /**
   * Effet pour vérifier si l'utilisateur est déjà connecté au chargement de l'application
   * 
   * Vérifie la présence d'un token, récupère les informations utilisateur si le token est valide,
   * ou déconnecte l'utilisateur si le token est invalide ou expiré.
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Vérifier si un token existe
        if (authService.isAuthenticated()) {
          const userData = await authService.getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // Token invalide ou expiré
            await authService.logout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Connecte un utilisateur avec son email et mot de passe
   * 
   * En cas de succès, l'utilisateur est stocké dans le contexte et redirigé vers la page d'accueil.
   * En cas d'échec, un message d'erreur est affiché.
   * 
   * @param email - L'adresse email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      showToast('Vous êtes connecté', 'success');
      router.push('/'); // Rediriger vers le tableau de bord après connexion
    } catch (err: unknown) {
      // Utiliser notre fonction utilitaire pour obtenir le message d'erreur traduit
      setError(getErrorMessage(err, t));
      console.error('Login error:', err);
      showToast('Une erreur est survenue lors de la connexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inscrit un nouvel utilisateur avec les informations fournies
   * 
   * En cas de succès, l'utilisateur est stocké dans le contexte et redirigé vers la page d'accueil.
   * En cas d'échec, un message d'erreur est affiché.
   * 
   * @param credentials - Les informations d'inscription de l'utilisateur
   * @param credentials.firstName - Le prénom de l'utilisateur
   * @param credentials.lastName - Le nom de famille de l'utilisateur
   * @param credentials.companyName - Le nom de l'entreprise de l'utilisateur
   * @param credentials.email - L'adresse email de l'utilisateur
   * @param credentials.phone - Le numéro de téléphone de l'utilisateur
   * @param credentials.password - Le mot de passe de l'utilisateur
   * @param credentials.siretNumber - Le numéro SIRET de l'utilisateur
   * @param credentials.planType - Le type de plan de l'utilisateur (Plans.SELF_MANAGED ou Plans.ADMIN_MANAGED)
   * @param credentials.comment - Le commentaire de l'utilisateur
   */
  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        companyName: credentials.companyName,
        email: credentials.email,
        phoneNumber: credentials.phoneNumber,
        password: credentials.password,
        confirmPassword: credentials.password, // Ceci n'est probablement pas correct pour un cas réel
        siretNumber: credentials.siretNumber,
        planType: credentials.planType,
        comment: credentials.comment
      });
      setUser(response.user);
      showToast('Votre demande a bien été prise en compte. Vous serez contacté dans les plus brefs délais.', 'success');
      router.push('/auth/connexion'); // Rediriger vers le tableau de bord après inscription
    } catch (err) {
      // Utiliser notre fonction utilitaire pour obtenir le message d'erreur traduit
      setError(getErrorMessage(err, t));
      console.error('Register error:', err);
      showToast('Une erreur est survenue lors de l\'inscription', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur actuellement authentifié
   * 
   * Supprime l'utilisateur du contexte et redirige vers la page de connexion.
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      router.push('/connexion'); // Rediriger vers la page de connexion
      showToast('Vous êtes déconnecté', 'success');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Une erreur est survenue lors de la déconnexion', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Valeurs exposées par le contexte utilisateur
   */
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    error,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook personnalisé pour accéder facilement au contexte utilisateur
 * 
 * @returns Les valeurs et fonctions du contexte utilisateur
 * @throws Erreur si utilisé en dehors d'un UserProvider
 * 
 * @example
 * // Dans un composant
 * const { user, login, logout } = useUser();
 * 
 * // Vérifier si l'utilisateur est connecté
 * if (user) {
 *   // Afficher les informations de l'utilisateur
 * } else {
 *   // Afficher un formulaire de connexion
 * }
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un UserProvider');
  }

  return context;
}; 