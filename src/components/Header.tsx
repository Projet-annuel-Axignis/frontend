'use client';

import { useUser } from '@/app/_providers/Providers';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const t = useTranslations();
  const { user, isAuthenticated, logout } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Déterminer si nous sommes sur la page d'accueil
  const isHomePage = pathname === '/';

  // Détecter le défilement pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // N'ajouter l'écouteur d'événement que sur la page d'accueil
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Déterminer le style du header en fonction de la page et du défilement
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <header
      className={`
        fixed 
        top-0 
        left-0 
        right-0 
        z-50
        transition-all
        duration-300
        ${isScrolled ? 'py-2' : 'py-4'}
        ${shouldBeTransparent
          ? 'bg-transparent'
          : 'bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-md'
        }
      `}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-32">
          <Image
            src={shouldBeTransparent ? "/images/logo/logo-axignis-nb.png" : "/images/logo/logo-axignis.png"}
            alt="Axignis Logo"
            fill
            sizes="100%"
            className={`
              object-contain
              transition-opacity
              ${shouldBeTransparent ? 'brightness-0 invert' : ''}
            `}
          />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {/* <Link
            href="/mission"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
              ${isActive('/mission') ? 'active' : ''}
            `}
          >
            {t('common.mission')}
          </Link>
          <Link
            href="/services"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
              ${isActive('/services') ? 'active' : ''}
            `}
          >
            {t('common.services')}
          </Link> */}
          <Link
            href="/plans"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
              ${isActive('/plans/') ? 'active' : ''}
            `}
          >
            {t('common.plans')}
          </Link>
          <Link
            href="/contact"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
              ${isActive('/contact/') ? 'active' : ''}
            `}
          >
            {t('common.contact')}
          </Link>

          {/* Bouton Login/Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`
                  font-medium 
                  hover:text-[var(--color-axignis-primary)] 
                  transition-colors
                  ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
                  ${isActive('/dashboard') ? 'active' : ''}
                `}
              >
                {user?.firstName || t('common.profile')}
              </Link>
              <button
                onClick={handleLogout}
                className={`
                  ml-3
                  px-4
                  py-2
                  rounded-md
                  bg-amber-500
                  hover:bg-amber-400
                  text-gray-900
                  font-medium
                  transition-colors
                  text-sm
                `}
              >
                {t('common.logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/connexion"
              className={`
                px-4
                py-2
                rounded-md
                bg-amber-500
                hover:bg-amber-400
                text-gray-900
                font-medium
                transition-colors
                text-sm
              `}
            >
              {t('common.login')}
            </Link>
          )}

          {/* Sélecteur de langue */}
          {/* <div className={shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}>
            <LanguageSelector />
          </div> */}
        </nav>

        {/* Menu burger et langue - Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {/* <div className={shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}>
            <LanguageSelector />
          </div> */}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              p-2
              ${shouldBeTransparent ? 'text-white' : 'text-gray-800 dark:text-white'}
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="
            absolute 
            top-full 
            left-0 
            right-0 
            bg-white 
            dark:bg-gray-900 
            shadow-lg 
            p-4 
            md:hidden
            flex
            flex-col
            gap-4
          ">
            {/* <Link
              href="/mission"
              className={`
                text-gray-800 
                dark:text-white 
                font-medium 
                p-2 
                hover:bg-gray-100 
                dark:hover:bg-gray-800 
                rounded
                ${isActive('/mission') ? 'text-[var(--color-axignis-primary)] font-semibold bg-gray-100 dark:bg-gray-800' : ''}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.mission')}
            </Link>
            <Link
              href="/services"
              className={`
                text-gray-800 
                dark:text-white 
                font-medium 
                p-2 
                hover:bg-gray-100 
                dark:hover:bg-gray-800 
                rounded
                ${isActive('/services') ? 'text-[var(--color-axignis-primary)] font-semibold bg-gray-100 dark:bg-gray-800' : ''}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.services')}
            </Link> */}
            <Link
              href="/plans"
              className={`
                text-gray-800 
                dark:text-white 
                font-medium 
                p-2 
                hover:bg-gray-100 
                dark:hover:bg-gray-800 
                rounded
                ${isActive('/plans') ? 'text-[var(--color-axignis-primary)] font-semibold bg-gray-100 dark:bg-gray-800' : ''}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.plans')}
            </Link>
            <Link
              href="/contact"
              className={`
                text-gray-800 
                dark:text-white 
                font-medium 
                p-2 
                hover:bg-gray-100 
                dark:hover:bg-gray-800 
                rounded
                ${isActive('/contact') ? 'text-[var(--color-axignis-primary)] font-semibold bg-gray-100 dark:bg-gray-800' : ''}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common.contact')}
            </Link>

            {/* Bouton Login/Logout Mobile */}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`
                    text-gray-800 
                    dark:text-white 
                    font-medium 
                    p-2 
                    hover:bg-gray-100 
                    dark:hover:bg-gray-800 
                    rounded
                    ${isActive('/dashboard') ? 'text-[var(--color-axignis-primary)] font-semibold bg-gray-100 dark:bg-gray-800' : ''}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {user?.firstName || t('common.profile')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className=" 
                    dark:text-white 
                    font-medium 
                    p-2 
                    bg-amber-500
                    hover:bg-amber-400
                    text-gray-900
                    rounded
                  "
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <Link
                href="/connexion"
                className="
                  font-medium 
                  p-2 
                  bg-amber-500
                  hover:bg-amber-400
                  text-gray-900
                  rounded
                  text-center
                "
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 