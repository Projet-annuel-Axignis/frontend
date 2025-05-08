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
      <main className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4 pt-20">

        <div className="text-center max-w-xl">
          <div className="
              w-[200px]
              h-[200px]
              md:w-[400px]
              md:h-[400px]
              relative
              mx-auto
              mb-8
              animate-float
            ">
            <Image
              src="/images/404.png"
              alt="Page non trouvée"
              fill
              className="
                  object-contain 
                  drop-shadow-2xl
                "
            />
          </div>

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