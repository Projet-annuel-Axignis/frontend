import theme from '@/theme/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import LoadingProvider from './LoadingProvider';
import { ToastProvider } from './ToastProvider';
import { UserProvider } from './UserProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Composant qui encapsule tous les providers de l'application
 * 
 * Ce composant permet de combiner tous les providers de contexte dans un ordre spécifique,
 * en assurant que chaque provider a accès aux contextes des providers qui l'encapsulent.
 * 
 * @param props - Les propriétés du composant
 * @param props.children - Les composants enfants à encapsuler dans les providers
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <NextIntlClientProvider>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoadingProvider>
            <ToastProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </ToastProvider>
          </LoadingProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>
  );
}

// Exporter aussi les providers individuellement pour usage spécifique
export { useToast } from '@/app/_providers/ToastProvider';
export { useTheme } from '@mui/material/styles';
export { useLoadingContext } from './LoadingProvider';
export { UserProvider, useUser } from './UserProvider';

