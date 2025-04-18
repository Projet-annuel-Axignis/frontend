'use client';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n/useTranslation';

export default function TestI18nPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">{t('welcome')}</h1>

      <nav className="mb-8">
        <ul className="flex gap-4">
          <li className="hover:underline">{t('home')}</li>
          <li className="hover:underline">{t('about')}</li>
          <li className="hover:underline">{t('contact')}</li>
          <li className="hover:underline">{t('settings')}</li>
        </ul>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('profile')}</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">
              {t('login')}
            </button>
            <button className="px-4 py-2 ml-2 bg-gray-200 rounded">
              {t('logout')}
            </button>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{t('settings')}</h2>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="mt-8">
        <p>{t('error.404')}: 404</p>
        <p>{t('error.500')}: 500</p>
      </div>
    </div>
  );
} 