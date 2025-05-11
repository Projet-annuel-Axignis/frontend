import { extendTheme } from '@mui/joy/styles';

const axignisTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#E6F1F8',
          100: '#C4DDEF',
          200: '#9FC7E4',
          300: '#7BB0D9',
          400: '#5599CE',
          500: '#377FBD',
          600: '#2D68A1',
          700: '#235086',
          800: '#19396A',
          900: '#0F214F',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E0E0E0',
          300: '#C2C2C2',
          400: '#A3A3A3',
          500: '#858585',
          600: '#676767',
          700: '#484848',
          800: '#2A2A2A',
          900: '#0B0B0B',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: '#102A3A',
          100: '#14344A',
          200: '#18415B',
          300: '#1C4D6B',
          400: '#20597B',
          500: '#377FBD',
          600: '#5599CE',
          700: '#7BB0D9',
          800: '#9FC7E4',
          900: '#C4DDEF',
        },
        neutral: {
          50: '#0B0B0B',
          100: '#2A2A2A',
          200: '#484848',
          300: '#676767',
          400: '#858585',
          500: '#A3A3A3',
          600: '#C2C2C2',
          700: '#E0E0E0',
          800: '#F5F5F5',
          900: '#FAFAFA',
        },
      },
    },
  },
  typography: {
    h1: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h2: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h3: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    h4: { fontFamily: 'Century Gothic, Montserrat, sans-serif' },
    'body-xs': { fontFamily: 'Montserrat, sans-serif' },
    'body-sm': { fontFamily: 'Montserrat, sans-serif' },
    'body-md': { fontFamily: 'Montserrat, sans-serif' },
    'body-lg': { fontFamily: 'Montserrat, sans-serif' },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: '8px',
          fontWeight: 'bold',
          textTransform: 'none',
          ...(ownerState.color === 'primary' && {
            backgroundColor: '#377FBD',
            '&:hover': {
              backgroundColor: '#2D68A1',
            },
          }),
        }),
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export default axignisTheme;
