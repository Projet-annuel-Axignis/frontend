'use client';

import { useTranslation } from '@/i18n/useTranslation';
import Image from 'next/image';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  link: string;
}

export default function ServiceCard({ title, description, imageSrc, link }: ServiceCardProps) {
  const { t } = useTranslation();

  return (
    <div className="
      group
      bg-white 
      dark:bg-gray-700
      rounded-xl 
      overflow-hidden 
      shadow-md
      hover:shadow-xl
      transition-all 
      duration-300
      hover:translate-y-[-8px]
      @container
      flex
      flex-col
    ">
      <div className="
        h-48 
        relative
        overflow-hidden
      ">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />
        <div className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/70
          to-transparent
          flex
          items-end
          p-6
        ">
          <span className="
            text-4xl
            text-white
            font-bold
            drop-shadow-md
          ">
            {title}
          </span>
        </div>
      </div>

      <div className="
        p-6
        flex
        flex-col
        flex-grow
      ">
        <p className="
          text-gray-600
          dark:text-gray-300
          mb-auto
        ">
          {description}
        </p>
        <Link
          href={link}
          className="
            inline-flex
            items-center
            gap-2
            text-[var(--color-axignis-primary)]
            font-medium
            group-hover:text-[var(--color-axignis-secondary)]
            group-hover:translate-x-2
            transition-all
            duration-300
            mt-6
            self-start
          "
        >
          {t('learn_more', 'En savoir plus')}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  );
} 