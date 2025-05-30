// components/ThemeProvider.tsx
'use client';

import { CssBaseline } from '@mui/joy';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { useEffect, useState } from 'react';

// Composant qui force la synchronisation avec le thème système
function SystemThemeSynchronizer() {
  const { setMode } = useColorScheme();

  useEffect(() => {
    // Définir le mode initial en fonction des préférences système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const newMode = e.matches ? 'dark' : 'light';
      setMode(newMode);
    };

    // Appliquer le thème initial
    updateTheme(mediaQuery);

    // Écouter les changements du thème système
    mediaQuery.addEventListener('change', updateTheme);

    // Nettoyage à la destruction du composant
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [setMode]);

  return null;
}

export default function ThemeProvider({
  children
}: {
  children: React.ReactNode
}) {
  // Eviter les erreurs d'hydratation avec un rendu différé côté client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <CssVarsProvider
      defaultMode="system"
      disableTransitionOnChange
      // S'assurer que le thème est appliqué au niveau global
      colorSchemeSelector="html"
      // Attribut à utiliser pour stocker le thème (aide à l'hydratation)
      colorSchemeStorageKey="mui-mode"
    >
      <CssBaseline />
      {/* Ce composant s'occupe de synchroniser avec le thème système */}
      <SystemThemeSynchronizer />

      {/* Visibilité conditionnelle pour éviter les erreurs d'hydratation */}
      {mounted ? children : <div style={{ visibility: 'hidden' }}>{children}</div>}
    </CssVarsProvider>
  );
}