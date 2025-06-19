'use client';

import { Box, CircularProgress, Fade, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
}));

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'page' | 'component' | 'overlay' | 'content';
}

export default function Loading({
  message = "Chargement...",
  size = 'medium',
  variant = 'component'
}: LoadingProps) {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56
  };

  const containerStyles = {
    page: {
      minHeight: '60vh',
      width: '100%',
    },
    component: {
      minHeight: '200px',
      width: '100%',
    },
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--color-background)',
      opacity: 0.9,
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      minHeight: '100vh',
      width: '100vw',
    },
    content: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'var(--color-background)',
      opacity: 0.9,
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      minHeight: '100%',
      width: '100%',
    }
  };

  return (
    <Fade in timeout={300}>
      <StyledLoadingContainer sx={containerStyles[variant]}>
        {/* Gradient SVG pour le CircularProgress */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-axignis-primary)" />
              <stop offset="50%" stopColor="var(--color-axignis-secondary)" />
              <stop offset="100%" stopColor="var(--color-axignis-primary)" />
            </linearGradient>
          </defs>
        </svg>

        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={sizeMap[size]}
            thickness={4}
            sx={{
              color: 'var(--color-axignis-primary)',
              '& .MuiCircularProgress-circle': {
                stroke: 'url(#gradient)',
              },
            }}
          />
        </Box>

        {message && (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {message}
          </Typography>
        )}
      </StyledLoadingContainer>
    </Fade>
  );
} 