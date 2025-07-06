'use client';

import { useBreadcrumb } from '@/app/_providers/BreadcrumbProvider';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

// Mapping des segments vers des titres en français
const SEGMENT_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  sites: 'Sites',
  administration: 'Administration',
  utilisateurs: 'Utilisateurs',
  entreprises: 'Entreprises',
  donnees: 'Données',
  batiments: 'Bâtiments',
  etages: 'Étages',
  parties: 'Parties',
  lots: 'Lots',
  produits: 'Produits',
};

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const BreadCrumb = () => {
  const pathname = usePathname();
  const { customTitles } = useBreadcrumb();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [{ label: 'Accueil', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Utiliser le titre personnalisé si disponible, sinon utiliser le mapping par défaut
      const customTitle = customTitles[segment];
      const defaultTitle = SEGMENT_TITLES[segment];
      const title = customTitle || defaultTitle || segment;

      // Ne pas créer de lien pour le dernier élément
      const isLast = index === pathSegments.length - 1;

      items.push({
        label: title,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [pathname, customTitles]);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        mb: 2,
        '& .MuiBreadcrumbs-separator': {
          color: 'text.secondary',
        },
      }}
    >
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        if (isLast || !item.href) {
          return (
            <Typography
              key={index}
              color="text.primary"
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={index}
            underline="hover"
            color="inherit"
            href={item.href}
            sx={{
              fontSize: '0.875rem',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadCrumb;