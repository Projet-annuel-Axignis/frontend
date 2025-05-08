'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image'; // Import de Image
import { useEffect, useState } from 'react';

type Language = {
  code: string;
  name: string;
  flagUrl: string;
};

export default function LanguageSelector() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('fr');

  // Liste des langues disponibles
  const languages: Language[] = [
    { code: 'fr', name: t('language_selector.french'), flagUrl: 'https://countryflagsapi.netlify.app/flag/fr.svg' },
    { code: 'en', name: t('language_selector.english'), flagUrl: 'https://countryflagsapi.netlify.app/flag/gb.svg' }
  ];

  // Initialisation de la langue sélectionnée
  useEffect(() => {
    //setSelectedLanguage(i18n.language || 'fr');
  }, []);

  // Changement de langue
  const changeLanguage = (lng: string) => {
    //i18n.changeLanguage(lng);
    setSelectedLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block z-50">
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src={languages.find(l => l.code === selectedLanguage)?.flagUrl || ''}
          alt={selectedLanguage}
          width={24} // Largeur de l'image
          height={16} // Hauteur de l'image
          className="w-6 h-4"
        />
        <span className="hidden sm:inline-block">
          {languages.find(l => l.code === selectedLanguage)?.name || t('language_selector.select_language')}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${selectedLanguage === language.code
                  ? 'bg-gray-100 dark:bg-gray-700 text-[var(--color-axignis-primary)]'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                onClick={() => changeLanguage(language.code)}
              >
                <Image
                  src={language.flagUrl}
                  alt={language.code}
                  width={24} // Largeur de l'image
                  height={16} // Hauteur de l'image
                  className="w-6 h-4"
                />
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}