"use client"
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  const t = useTranslations()
  return (
    <>
      <Header />
      <main className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
        <div className='dark:hidden absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-axignis-primary to-axignis-secondary opacity-50'></div>

        <div className="text-center max-w-xl">
          <Image
            src="/images/404.png"
            alt="Page non trouvée"
            width={400}
            height={400}
            priority
            className="mx-auto mb-8"
          />

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("error_pages.error404.title")}
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            {t("error_pages.error404.subtitle")}
          </p>

          <Link href="/">
            <button className="bg-axignis-primary hover:bg-axignis-secondary text-white font-semibold px-6 py-3 rounded-lg shadow-md transition">
              {t("error_pages.error404.button_back")}
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}