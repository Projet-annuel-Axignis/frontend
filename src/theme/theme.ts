'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    light: true,
    dark: true,
  },
  palette: {
    primary: {
      main: '#0082ca', // Couleur primaire Axignis
    },
    secondary: {
      main: '#36b8ff', // Couleur secondaire Axignis
    },
  },
  typography: {
    // Police par défaut pour le corps du texte
    fontFamily: 'var(--font-montserrat), sans-serif',
    // Police pour les titres
    h1: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2.25rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:900px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '1.1rem',
      '@media (min-width:600px)': {
        fontSize: '1.35rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.5rem',
      },
    },
    h4: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '0.9rem',
      '@media (min-width:600px)': {
        fontSize: '1.1rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.25rem',
      },
    },
    h5: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '0.8rem',
      '@media (min-width:600px)': {
        fontSize: '0.95rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontFamily: 'var(--font-centurygothic), sans-serif',
      fontSize: '0.7rem',
      '@media (min-width:600px)': {
        fontSize: '0.85rem',
      },
      '@media (min-width:900px)': {
        fontSize: '1rem',
      },
    },
  },
});

export default theme;

