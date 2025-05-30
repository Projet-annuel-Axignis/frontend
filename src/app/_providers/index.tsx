'use client';

import { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { UserProvider } from './UserProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Composant qui encapsule tous les providers de l'application
 * 
 * Ce composant permet de combiner tous les providers de contexte dans un ordre spécifique,
 * en assurant que chaque provider a accès aux contextes des providers qui l'encapsulent.
 * 
 * @param props - Les propriétés du composant
 * @param props.children - Les composants enfants à encapsuler dans les providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ToastProvider>
  );
}

// Exporter aussi les providers individuellement pour usage spécifique
export { useToast } from '@/app/_providers/ToastProvider';
export { UserProvider, useUser } from './UserProvider';

