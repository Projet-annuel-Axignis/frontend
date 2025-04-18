'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Nous nous assurons que tout est initialisé uniquement côté client
    import('./i18n').then(() => {
      setMounted(true);
    });
  }, []);

  // Attendre que le composant soit monté pour éviter les erreurs d'hydratation
  // puisque i18next est uniquement côté client
  if (!mounted) return <>{children}</>;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 