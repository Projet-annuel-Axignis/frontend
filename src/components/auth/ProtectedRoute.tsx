'use client';

import { useUser } from '@/app/_providers/Providers';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

/**
 * Interface pour les propriétés du composant ProtectedRoute
 * 
 * @property {ReactNode} children - Les composants enfants à rendre si l'utilisateur est autorisé
 * @property {string[]} [allowedRoles] - Liste optionnelle des rôles autorisés à accéder à ce contenu
 */
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

/**
 * Composant de route protégée
 * 
 * Ce composant agit comme un gardien d'accès pour les pages ou sections qui nécessitent une authentification.
 * Il peut également restreindre l'accès en fonction des rôles utilisateur.
 * 
 * Fonctionnalités :
 * - Redirige les utilisateurs non authentifiés vers la page de connexion
 * - Vérifie les autorisations basées sur les rôles (si spécifiées)
 * - Affiche un indicateur de chargement pendant la vérification des informations d'authentification
 * - Redirige vers une page d'accès non autorisé si l'utilisateur n'a pas les rôles requis
 * 
 * @example
 * // Route accessible uniquement aux utilisateurs authentifiés
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * 
 * @example
 * // Route accessible uniquement aux administrateurs
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * @param {ProtectedRouteProps} props - Les propriétés du composant
 * @returns {ReactNode | null} Le contenu protégé ou null si non autorisé
 */
export default function ProtectedRoute({
  children,
  allowedRoles
}: ProtectedRouteProps) {
  // Récupération des informations d'authentification depuis le contexte utilisateur
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  /**
   * Effet pour gérer les redirections en fonction de l'état d'authentification
   * 
   * Redirige l'utilisateur vers la page de connexion s'il n'est pas authentifié
   * ou vers une page d'accès refusé s'il est authentifié mais n'a pas les rôles requis.
   * 
   * Les dépendances incluent tous les états qui pourraient déclencher un changement
   * dans la logique de redirection.
   */
  useEffect(() => {
    // Si l'utilisateur n'est pas en cours de chargement et n'est pas authentifié, rediriger vers la connexion
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion');
    }

    // Si des rôles sont spécifiés et que l'utilisateur n'a pas le rôle requis, rediriger vers une page interdite
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role.name)) {
        router.push('/acces-non-autorise');
      }
    }
  }, [isLoading, isAuthenticated, router, user, allowedRoles]);

  /**
   * Affichage conditionnel basé sur l'état d'authentification
   * 
   * Les vérifications sont effectuées dans l'ordre suivant:
   * 1. État de chargement → Afficher l'indicateur de chargement
   * 2. Non authentifié → Ne rien afficher (gestion par l'effet)
   * 3. Authentifié mais rôle non autorisé → Ne rien afficher (gestion par l'effet)
   * 4. Authentifié et autorisé → Afficher le contenu protégé
   */

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <Box className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        <CircularProgress size="40" />
      </Box>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le contenu (la redirection sera gérée par l'effet)
  if (!isAuthenticated) {
    return null;
  }

  // Si des rôles sont requis et que l'utilisateur n'a pas le bon rôle, ne pas afficher le contenu
  if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
    return null;
  }

  // Si tout est validé, afficher le contenu protégé
  return <>{children}</>;
} 