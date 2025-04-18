'use client';

import { useTranslation } from '@/i18n/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Détecter le défilement pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-md py-2' : 'bg-transparent py-4'}
      `}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-32">
          <Image
            src={isScrolled ? "/images/logo/logo-axignis.png" : "/images/logo/logo-axignis-nb.png"}
            alt="Axignis Logo"
            fill
            className={`
              object-contain
              transition-opacity
              ${isScrolled ? '' : 'brightness-0 invert'}
            `}
          />
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#mission"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}
            `}
          >
            {t('footer.mission')}
          </a>
          <a
            href="#services"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}
            `}
          >
            {t('footer.services')}
          </a>
          <a
            href="#contact"
            className={`
              font-medium 
              hover:text-[var(--color-axignis-primary)] 
              transition-colors
              ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}
            `}
          >
            {t('footer.contact')}
          </a>

          {/* Sélecteur de langue */}
          <div className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}>
            <LanguageSelector />
          </div>
        </nav>

        {/* Menu burger et langue - Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <div className={isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}>
            <LanguageSelector />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`
              p-2
              ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}
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
            <a
              href="#mission"
              className="text-gray-800 dark:text-white font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('footer.mission')}
            </a>
            <a
              href="#services"
              className="text-gray-800 dark:text-white font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('footer.services')}
            </a>
            <a
              href="#contact"
              className="text-gray-800 dark:text-white font-medium p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('footer.contact')}
            </a>
          </div>
        )}
      </div>
    </header>
  );
} 