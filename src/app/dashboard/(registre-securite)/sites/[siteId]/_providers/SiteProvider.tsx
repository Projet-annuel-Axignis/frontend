'use client';

import { Company } from '@/types/company';
import { Site } from '@/types/site';
import { createContext, ReactNode, useContext } from 'react';

interface SiteContextType {
  site: Site | null;
  company: Company | null;
  isDeleted: boolean;
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

interface SiteProviderProps {
  children: ReactNode;
  site: Site | null;
  company: Company | null;
  showNotification: (message: string, severity: 'success' | 'error') => void;
}

export const SiteProvider = ({ children, site, company, showNotification }: SiteProviderProps) => {
  const isDeleted = !!site?.deletedAt;

  return (
    <SiteContext.Provider value={{ site, company, isDeleted, showNotification }}>
      {children}
    </SiteContext.Provider>
  );
}; 