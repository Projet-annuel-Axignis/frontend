'use client';

import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';

export default function FooterIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  // Effet pour gérer la visibilité basée sur la position de défilement
  useEffect(() => {
    const handleScroll = () => {
      // On masque l'indicateur quand on approche du footer
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // hauteur du footer
      const footerHeight = document.querySelector('footer')?.offsetHeight;
      // Si on est près du bas de la page, on masque l'indicateur
      const nearBottom = documentHeight - (scrollTop + windowHeight) < (footerHeight ?? 200);
      setIsVisible(!nearBottom);
    };

    // Écouter l'événement de défilement
    window.addEventListener('scroll', handleScroll);

    // Vérifier si l'indicateur doit être affiché initialement
    handleScroll();

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToFooter = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Tooltip title="Voir le pied de page" placement="top">
      <Box
        onClick={scrollToFooter}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '25px',
          borderTopLeftRadius: '25px',
          borderTopRightRadius: '25px',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 10,
          '&:hover': {
            height: '30px',
            backgroundColor: '#222'
          }
        }}
      >
        <KeyboardArrowDown sx={{ color: 'white' }} />
      </Box>
    </Tooltip>
  );
} 