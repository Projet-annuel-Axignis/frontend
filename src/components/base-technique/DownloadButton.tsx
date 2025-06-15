"use client"

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { Button, useTheme } from "@mui/material";


const DownloadButton = () => {
  const theme = useTheme();
  return (
    <Button
      color="primary"
      startIcon={<DownloadRoundedIcon />}
      size="medium"
      variant="contained"
      sx={{
        background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
        fontWeight: 600,
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        boxShadow: theme.shadows[3],
        transition: 'var(--transition-normal)',
        '&:hover': {
          background: `linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))`,
          boxShadow: theme.shadows[6],
          transform: 'translateY(-2px)',
        },
      }}
    >
      Télécharger en PDF
    </Button>

  )
}

export default DownloadButton