'use client';

import { useEffect, useState } from 'react';
import { useTranslation as useTranslationOrg } from 'react-i18next';

// Fonction d'aide pour retourner une traduction factice côté serveur
const createEmptyTranslationHelper = () => {
  return {
    t: (key: string) => key,
    i18n: {
      language: 'fr',
      changeLanguage: () => Promise.resolve(),
    },
    ready: false,
  };
};

// Wrapper autour du hook useTranslation de react-i18next
// pour une utilisation plus simple dans les composants client
export function useTranslation(namespace = 'common') {
  const [clientLoaded, setClientLoaded] = useState(false);

  // Toujours appeler le hook, même si on n'utilise pas son résultat tout de suite
  // Cela évite l'erreur de linter sur les hooks conditionnels
  const translation = useTranslationOrg(namespace);

  // Côté serveur ou pendant le rendu initial côté client
  useEffect(() => {
    setClientLoaded(true);
  }, []);

  // Retourner soit les traductions réelles, soit les factices
  return clientLoaded ? translation : createEmptyTranslationHelper();
} 