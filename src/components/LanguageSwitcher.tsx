'use client';

import { useTranslation } from '@/i18n/useTranslation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  return (
    <div className="flex flex-col items-start gap-2 p-4 border rounded-md">
      <h2 className="text-lg font-medium">{t('language')}</h2>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded ${currentLang === 'fr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => changeLanguage('fr')}
        >
          Français
        </button>
        {/* Pour l'instant, seul le français est disponible, mais vous pourrez ajouter d'autres langues ici */}
      </div>
    </div>
  );
} 