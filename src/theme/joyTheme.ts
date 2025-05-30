import { extendTheme } from '@mui/joy/styles';

const axignisTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: 'var(--axignis-primary)',
          solidHoverBg: 'var(--axignis-secondary)',
          solidActiveBg: 'var(--axignis-dark)',
        },
        neutral: {
          solidBg: 'var(--axignis-gray-medium)',
          solidHoverBg: 'var(--axignis-gray-dark)',
          solidActiveBg: 'var(--axignis-black)',
        },
        background: {
          body: 'var(--background)',
        },
        text: {
          primary: 'var(--foreground)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: 'var(--axignis-secondary)',
          solidHoverBg: 'var(--axignis-primary)',
          solidActiveBg: 'var(--axignis-dark)',
        },
        neutral: {
          solidBg: 'var(--axignis-gray-dark)',
          solidHoverBg: 'var(--axignis-gray-medium)',
          solidActiveBg: 'var(--axignis-black)',
        },
        background: {
          body: 'var(--axignis-dark)',
        },
        text: {
          primary: 'var(--background)',
        },
      },
    },
  },
  typography: {
    h1: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h2: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h3: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h4: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    "body-lg": { fontFamily: 'Montserrat, sans-serif' },
    "body-md": { fontFamily: 'Montserrat, sans-serif' },
    "body-sm": { fontFamily: 'Montserrat, sans-serif' },
    "body-xs": { fontFamily: 'Montserrat, sans-serif' },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 'bold',
          textTransform: 'none',
        },
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
          backgroundColor: 'var(--background)',
        },
      },
    },
  },
});

export default axignisTheme;
