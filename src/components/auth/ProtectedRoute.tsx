'use client';

import { useUser } from '@/lib/contexts/UserContext';
import { Box, CircularProgress } from '@mui/joy';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Si l'utilisateur n'est pas en cours de chargement et n'est pas authentifié, rediriger vers la connexion
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    // Si des rôles sont spécifiés et que l'utilisateur n'a pas le rôle requis, rediriger vers une page interdite
    if (!isLoading && isAuthenticated && allowedRoles && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorised');
      }
    }
  }, [isLoading, isAuthenticated, router, user, allowedRoles]);

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return (
      <Box className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        <CircularProgress size="lg" />
      </Box>
    );
  }

  // Si l'utilisateur n'est pas authentifié, ne pas afficher le contenu (la redirection sera gérée par l'effet)
  if (!isAuthenticated) {
    return null;
  }

  // Si des rôles sont requis et que l'utilisateur n'a pas le bon rôle, ne pas afficher le contenu
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // Si tout est validé, afficher le contenu protégé
  return <>{children}</>;
} 