import { Box, Typography } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

const DashBoardHeader = ({ title, icon, children }: { title: string, icon: React.ReactElement<SvgIconProps>, children?: React.ReactNode }) => {
  // Clone l'icône et applique les styles automatiquement
  const styledIcon = React.cloneElement(icon, {
    ...icon.props,
    sx: {
      color: 'var(--color-axignis-primary)',
      fontSize: '2rem',
      ...(icon.props.sx || {}), // Permet de surcharger les styles si nécessaire
    }
  } as SvgIconProps);

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          mb: 4,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          justifyContent: 'space-between',
        }
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {styledIcon}
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </Box>

    </>
  )
}

export default DashBoardHeader