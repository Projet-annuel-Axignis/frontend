'use client';

import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from 'next/navigation';

// Mapping des segments d'URL vers des titres lisibles
const segmentMapping: Record<string, string> = {
  'dashboard': 'Dashboard',
  'produits': 'Produits',
  'commandes': 'Commandes',
  'clients': 'Clients',
  'parametres': 'Paramètres',
  'analytics': 'Analytics',
  'inventaire': 'Inventaire',
  'rapports': 'Rapports',
  'notifications': 'Notifications',
  'profil': 'Profil',
  'aide': 'Aide',
  'support': 'Support',
};

const BreadCrumb = () => {
  const pathname = usePathname();

  // Générer les segments du chemin
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  // Fonction pour générer le chemin cumulatif
  const generatePath = (index: number) => {
    return '/' + pathSegments.slice(0, index + 1).join('/');
  };

  // Fonction pour obtenir le titre d'un segment
  const getSegmentTitle = (segment: string) => {
    return segmentMapping[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Breadcrumbs
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{
            pl: 0,
            '& .MuiBreadcrumbs-separator': {
              color: 'var(--color-axignis-primary)',
            }
          }}
        >
          {/* Home */}
          <Link
            underline="none"
            color="inherit"
            href="/"
            aria-label="Home"
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'var(--transition-normal)',
              '&:hover': {
                color: 'var(--color-axignis-primary)',
              }
            }}
          >
            <HomeRoundedIcon />
          </Link>

          {/* Segments intermédiaires */}
          {pathSegments.map((segment, index) => {
            const path = generatePath(index);
            const title = getSegmentTitle(segment);
            const isLast = index === pathSegments.length - 1;

            if (isLast) {
              // Dernier segment - pas de lien
              return (
                <Typography
                  key={path}
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: 'var(--color-axignis-primary)'
                  }}
                >
                  {title}
                </Typography>
              );
            } else {
              // Segments intermédiaires - avec lien
              return (
                <Link
                  key={path}
                  underline="none"
                  color="inherit"
                  href={path}
                  sx={{
                    transition: 'var(--transition-normal)',
                    '&:hover': {
                      color: 'var(--color-axignis-primary)',
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: 14 }}>
                    {title}
                  </Typography>
                </Link>
              );
            }
          })}
        </Breadcrumbs>
      </Box>
    </>
  )
}

export default BreadCrumb