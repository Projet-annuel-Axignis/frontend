'use client';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import OrderList from '@/components/base-technique/OrderList';
import OrderTable from '@/components/base-technique/OrderTable';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InventoryIcon from '@mui/icons-material/Inventory';

export default function JoyOrderDashboardTemplate() {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Breadcrumbs
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{
            pl: 0,
            '& .MuiBreadcrumbs-separator': {
              color: 'var(--color-axignis-primary)',
            }
          }}
        >
          <Link
            underline="none"
            color="inherit"
            href="/"
            aria-label="Home"
            sx={{
              display: 'flex',
              alignItems: 'center',
              transition: 'var(--transition-normal)',
              '&:hover': {
                color: 'var(--color-axignis-primary)',
              }
            }}
          >
            <HomeRoundedIcon />
          </Link>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: 'var(--color-axignis-primary)'
            }}
          >
            Produits
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          mb: 4,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InventoryIcon
            sx={{
              color: 'var(--color-axignis-primary)',
              fontSize: '2rem'
            }}
          />
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
            Produits
          </Typography>
        </Box>
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
      </Box>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <OrderTable />
        <OrderList />
      </Box>
    </Box>
  );
}
