'use client';

import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

// Types pour les données de breadcrumb
export interface BreadcrumbItem {
  segment: string;
  title: string;
  href?: string;
}

interface BreadcrumbContextType {
  customTitles: Record<string, string>;
  setCustomTitle: (segment: string, title: string) => void;
  removeCustomTitle: (segment: string) => void;
  clearCustomTitles: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});

  const setCustomTitle = useCallback((segment: string, title: string) => {
    setCustomTitles(prev => ({
      ...prev,
      [segment]: title
    }));
  }, []);

  const removeCustomTitle = useCallback((segment: string) => {
    setCustomTitles(prev => {
      const newTitles = { ...prev };
      delete newTitles[segment];
      return newTitles;
    });
  }, []);

  const clearCustomTitles = useCallback(() => {
    setCustomTitles({});
  }, []);

  return (
    <BreadcrumbContext.Provider value={{
      customTitles,
      setCustomTitle,
      removeCustomTitle,
      clearCustomTitles
    }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
} 