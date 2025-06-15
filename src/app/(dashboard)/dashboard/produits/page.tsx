import DownloadButton from '@/components/dashboard/DownloadButton';
import OrderTable from '@/components/dashboard/OrderTable';
import InventoryIcon from '@mui/icons-material/Inventory';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Axignis - Tableau des produits",
};

export default function JoyOrderDashboardTemplate() {

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
        <DownloadButton />
      </Box>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <OrderTable />
      </Box>
    </>
  );
}
