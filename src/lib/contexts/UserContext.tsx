'use client';

import { getErrorMessage } from '@/lib/utils';
import authService from '@/services/authService';
import { User } from '@/types/auth';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, company: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  // Vérifier si l'utilisateur est déjà connecté au chargement
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      router.push('/'); // Rediriger vers le tableau de bord après connexion
    } catch (err: unknown) {
      // Utiliser notre fonction utilitaire pour obtenir le message d'erreur traduit
      setError(getErrorMessage(err, t));
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, company: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword: password, // Ceci n'est probablement pas correct pour un cas réel
        role: 'client' // Rôle par défaut
      });
      setUser(response.user);
      router.push('/'); // Rediriger vers le tableau de bord après inscription
    } catch (err) {
      // Utiliser notre fonction utilitaire pour obtenir le message d'erreur traduit
      setError(getErrorMessage(err, t));
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();
      setUser(null);
      router.push('/connexion'); // Rediriger vers la page de connexion
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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

// Hook personnalisé pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un UserProvider');
  }

  return context;
}; 