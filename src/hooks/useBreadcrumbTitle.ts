import { useBreadcrumb } from '@/app/_providers/BreadcrumbProvider';
import { useEffect, useRef } from 'react';

/**
 * Hook pour définir un titre personnalisé pour un segment du breadcrumb
 * 
 * @param segment - Le segment de l'URL (ex: l'ID du site)
 * @param title - Le titre à afficher (ex: le nom du site)
 */
export function useBreadcrumbTitle(segment: string, title: string) {
  const { setCustomTitle, removeCustomTitle } = useBreadcrumb();
  const previousTitleRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Ne mettre à jour que si le titre a changé
    if (title && title !== previousTitleRef.current) {
      setCustomTitle(segment, title);
      previousTitleRef.current = title;
    }

    // Nettoyage au démontage du composant
    return () => {
      removeCustomTitle(segment);
      previousTitleRef.current = undefined;
    };
  }, [segment, title, setCustomTitle, removeCustomTitle]);
} 