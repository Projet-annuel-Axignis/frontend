'use client';

import { Box, LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  /** Indique si la barre de progression doit être visible */
  isVisible: boolean;
  /** Message optionnel à afficher */
  message?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isVisible, message }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animation de progression
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            return 90; // S'arrête à 90% pour montrer qu'il y a encore du travail
          }
          return prevProgress + 10;
        });
      }, 200);

      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    } else {
      setProgress(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        width: '100%',
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 3,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
            borderRadius: '0 2px 2px 0',
          },
        }}
      />
      {message && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            px: 2,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            zIndex: 10000,
          }}
        >
          {message}
        </Box>
      )}
    </Box>
  );
};

export default ProgressBar; 