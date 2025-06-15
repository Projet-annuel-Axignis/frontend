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
});

export default theme;

