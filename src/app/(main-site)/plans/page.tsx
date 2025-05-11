import HeroHeader from '@/components/commons/HeroHeader';
import CtaDevis from '@/components/CtaDevis';
import { Plans } from '@/types/plans';
import { CheckCircle } from '@mui/icons-material';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Axignis - Plans",
};

export default function PlansPage() {
  const t = useTranslations('plans');

  // Fonctionnalités communes aux deux plans
  const commonFeatures = t.raw('main_features.items');

  // Fonctionnalités spécifiques au plan Autonomie
  const autonomyFeatures = t.raw('plans_section.autonomy.features');

  // Fonctionnalités spécifiques au plan Sérénité
  const serenityFeatures = t.raw('plans_section.serenity.features');

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      {/* Hero Section */}
      <HeroHeader
        title={t('hero.title')}
        description={t('hero.description')}
        image="/images/backgrounds/building-facade.jpg"
        imageAlt="Façade de bâtiment moderne"
      />

      {/* Section Fonctionnalités communes */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-8 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-[var(--color-axignis-primary)] after:mx-auto after:mt-4">
            {t('main_features.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {commonFeatures.map((feature: string, index: number) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-start">
                <div className="w-16 h-16 rounded-full bg-[var(--color-axignis-primary)]/10 flex items-center justify-center mb-4">
                  <CheckCircle className="text-[var(--color-axignis-primary)] w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Plans */}
      <section className="py-16 md:py-24 px-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 text-center">
            {t('plans_section.title')}
          </h2>

          <p className="text-center text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-16">
            {t('plans_section.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Plan Autonomie */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <div className="bg-gray-50 dark:bg-gray-800 p-8 relative">
                <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-2xl mb-4">
                  🥈
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('plans_section.autonomy.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('plans_section.autonomy.description')}
                </p>
              </div>

              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  {autonomyFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-[var(--color-axignis-primary)] mr-3 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <Link
                  href={`/demande-devis-souscription?p=${Plans.SELF_MANAGED}`}
                  className="block w-full py-4 text-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-md transition-colors"
                >
                  {t('plans_section.autonomy.cta')}
                </Link>
              </div>
            </div>

            {/* Plan Sérénité */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col relative">
              <div className="absolute top-0 right-0 bg-[var(--color-axignis-primary)] text-white py-1 px-4 rounded-bl-lg font-medium z-10">
                {t('recommended')}
              </div>

              <div className="bg-[var(--color-axignis-secondary)]/10 dark:bg-[var(--color-axignis-secondary)]/20 p-8 relative">
                <div className="w-12 h-12 rounded-full bg-[var(--color-axignis-primary)] flex items-center justify-center text-white font-bold text-2xl mb-4">
                  🥇
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('plans_section.serenity.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('plans_section.serenity.description')}
                </p>
              </div>

              <div className="p-8 flex-grow">
                <ul className="space-y-4">
                  {serenityFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="text-[var(--color-axignis-primary)] mr-3 mt-0.5 shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-8 pb-8">
                <Link
                  href={`/demande-devis-souscription?p=${Plans.ADMIN_MANAGED}`}
                  className="block w-full py-4 text-center bg-[var(--color-axignis-primary)] hover:bg-[var(--color-axignis-primary)]/90 text-white font-semibold rounded-md transition-colors"
                >
                  {t('plans_section.serenity.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Tableau comparatif */}
      <section className="py-16 md:py-24 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-16 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-[var(--color-axignis-primary)] after:mx-auto after:mt-4">
            {t('comparison.title')}
          </h2>

          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
            <table className="w-full min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="py-4 px-6 text-left text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-600">
                    {t('comparison.title')}
                  </th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-600">
                    {t('self_managed')}
                  </th>
                  <th className="py-4 px-6 text-center text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-600">
                    {t('admin_managed')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.full_access')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.autonomous_management')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center text-gray-700 dark:text-gray-300 font-medium">
                    Axignis
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.automated_alerts')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.proactive_management')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center text-red-500">
                    ✖
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.customer_support')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center text-gray-700 dark:text-gray-300">
                    {t('comparison.support_types.email')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center text-gray-700 dark:text-gray-300">
                    {t('comparison.support_types.phone_email')}
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {t('comparison.features.dedicated_contact')}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center text-red-500">
                    ✖
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200 dark:border-gray-600 text-center">
                    <CheckCircle className="text-green-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Valeurs ajoutées */}
      <section className="py-16 md:py-24 px-6 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-16 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-[var(--color-axignis-primary)] after:mx-auto after:mt-4">
            {t('added_value.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Fiabilité et conformité */}
            <div className="flex bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mr-5 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-axignis-primary)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('added_value.items.reliability.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('added_value.items.reliability.description')}
                </p>
              </div>
            </div>

            {/* Gain de temps et productivité */}
            <div className="flex bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mr-5 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-axignis-primary)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('added_value.items.productivity.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('added_value.items.productivity.description')}
                </p>
              </div>
            </div>

            {/* Sécurité des données */}
            <div className="flex bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mr-5 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-axignis-primary)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('added_value.items.security.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('added_value.items.security.description')}
                </p>
              </div>
            </div>

            {/* Expérience utilisateur optimisée */}
            <div className="flex bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="mr-5 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--color-axignis-primary)]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--color-axignis-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t('added_value.items.user_experience.title')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('added_value.items.user_experience.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <CtaDevis />
    </main>
  );
} 