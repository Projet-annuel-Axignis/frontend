'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Initialisation uniquement côté client
if (typeof window !== 'undefined') {
  i18n
    // Chargement des traductions via http (tous les fichiers public/locales/{{lng}}/{{ns}}.json)
    .use(Backend)
    // Détection automatique de la langue
    .use(LanguageDetector)
    // Module react-i18next
    .use(initReactI18next)
    // Initialisation i18next
    .init({
      fallbackLng: 'fr',
      debug: process.env.NODE_ENV === 'development',

      interpolation: {
        escapeValue: false, // non nécessaire pour React
      },

      // Chemins de chargement des traductions
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      // Espaces de noms par défaut
      defaultNS: 'common',
      ns: ['common'],
    });
}

export default i18n; 