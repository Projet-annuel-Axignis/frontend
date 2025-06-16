'use client';

import Loading from '@/components/ui/Loading';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

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

  // Détecte les changements de route pour afficher le loading
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Délai minimum pour éviter les flashs

    return () => clearTimeout(timer);
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

      {/* Overlay de navigation */}
      {isNavigating && (
        <Loading
          variant="overlay"
          message="Navigation en cours..."
          size="medium"
        />
      )}

      {/* Overlay personnalisé */}
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