'use client';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import OrderList from '@/components/base-technique/OrderList';
import OrderTable from '@/components/base-technique/OrderTable';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';


export default function JoyOrderDashboardTemplate() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="inherit"
            href="/"
            aria-label="Home"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeRoundedIcon />
          </Link>
          <Typography
            color="primary"
            sx={{
              fontWeight: 500,
              fontSize: 12
            }}>
            Produits
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h3" component="h1">
          Produits
        </Typography>
        <Button
          color="primary"
          startIcon={<DownloadRoundedIcon />}
          size="small"
          variant="contained"
        >
          Télécharger en PDF
        </Button>
      </Box>
      <OrderTable />
      <OrderList />
    </>
  );
}
