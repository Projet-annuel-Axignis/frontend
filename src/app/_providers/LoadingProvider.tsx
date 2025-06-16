'use client';

import Loading from '@/components/ui/Loading';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface LoadingContextType {
  isNavigating: boolean;
  setNavigating: (loading: boolean) => void;
  showOverlay: (message?: string) => void;
  hideOverlay: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingContext must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: React.ReactNode;
}

export default function LoadingProvider({ children }: LoadingProviderProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string>('');
  const [showOverlayState, setShowOverlayState] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef<string>(pathname);

  // Fonction pour déterminer si c'est un changement de tab dans la même section
  const isSameSectionNavigation = (oldPath: string, newPath: string): boolean => {
    // Sections avec des tabs/sous-routes qui ne doivent pas déclencher le loading global
    const sectionsWithTabs = [
      '/dashboard/administration',
      '/dashboard/produits',
      // Ajouter d'autres sections avec tabs ici
    ];

    for (const section of sectionsWithTabs) {
      if (oldPath.startsWith(section) && newPath.startsWith(section)) {
        return true; // C'est un changement de tab dans la même section
      }
    }
    return false;
  };

  // Détecte les changements de route pour afficher le loading
  useEffect(() => {
    const currentPath = pathname;
    const previousPath = previousPathname.current;

    // Ne pas afficher le loading si c'est un changement de tab dans la même section
    if (!isSameSectionNavigation(previousPath, currentPath)) {
      setIsNavigating(true);
      const timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500); // Délai minimum pour éviter les flashs

      previousPathname.current = currentPath;
      return () => clearTimeout(timer);
    } else {
      // Mettre à jour la référence même si on n'affiche pas le loading
      previousPathname.current = currentPath;
    }
  }, [pathname]);

  const setNavigating = (loading: boolean) => {
    setIsNavigating(loading);
  };

  const showOverlay = (message = 'Chargement...') => {
    setOverlayMessage(message);
    setShowOverlayState(true);
  };

  const hideOverlay = () => {
    setShowOverlayState(false);
    setOverlayMessage('');
  };

  return (
    <LoadingContext.Provider
      value={{
        isNavigating,
        setNavigating,
        showOverlay,
        hideOverlay,
      }}
    >
      {children}

      {/* Overlay personnalisé uniquement (pas de navigation overlay) */}
      {showOverlayState && (
        <Loading
          variant="overlay"
          message={overlayMessage}
          size="medium"
        />
      )}
    </LoadingContext.Provider>
  );
} 