'use client';

import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import OrderTable from '@/components/OrderTable';
import OrderList from '@/components/OrderList';

export default function JoyOrderDashboardTemplate() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon />}
          sx={{ pl: 0 }}
          >
          <Link
            underline="none"
            color="neutral"
            href="/"
            aria-label="Home"
            >
            <HomeRoundedIcon />
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
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
        <Typography level="h2" component="h1">
          Produits
        </Typography>
        <Button
          color="primary"
          startDecorator={<DownloadRoundedIcon />}
          size="sm"
          >
          Télécharger en PDF
        </Button>
      </Box>
      <OrderTable />
      <OrderList />
    </>
  );
}
