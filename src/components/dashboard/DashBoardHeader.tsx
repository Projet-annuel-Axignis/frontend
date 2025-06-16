import { Box, ChipProps, Typography } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon";
import React from "react";

const DashBoardHeader = (
  {
    title,
    icon = null,
    chip = null,
    orientation = 'row',
    titleVariant = 'h3',
    children
  }: {
    title: string,
    icon?: React.ReactElement<SvgIconProps> | null,
    chip?: React.ReactElement<ChipProps> | null,
    titleVariant?: 'h3' | 'h4' | 'h5' | 'h6',
    orientation?: 'row' | 'column',
    children?: React.ReactNode
  }) => {

  // Clone l'icône et applique les styles automatiquement
  const styledIcon = icon ? React.cloneElement(icon, {
    ...icon.props,
    sx: {
      color: 'var(--color-axignis-primary)',
      fontSize: '2rem',
      ...(icon.props.sx || {}), // Permet de surcharger les styles si nécessaire
    }
  } as SvgIconProps) : null;

  return (
    <>
      {/* Header */}
      <Box
        sx={
          orientation === 'row' ? {
            display: 'flex',
            mb: 4,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'start', sm: 'center' },
            justifyContent: 'space-between',
          } : {
            mb: 4,
          }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: orientation === 'row' ? 0 : 2,
        }}>
          {styledIcon}
          <Typography
            variant={titleVariant}
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
          {chip}
        </Box>
        {children}
      </Box>

    </>
  )
}

export default DashBoardHeader