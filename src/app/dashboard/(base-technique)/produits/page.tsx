import DashBoardHeader from '@/components/dashboard/DashBoardHeader';
import DownloadButton from '@/components/dashboard/DownloadButton';
import OrderTable from '@/components/dashboard/OrderTable';
import InventoryIcon from '@mui/icons-material/Inventory';
import Box from '@mui/material/Box';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Axignis - Tableau des produits",
};

export default function JoyOrderDashboardTemplate() {

  return (
    <>
      {/* Header */}
      <DashBoardHeader
        title="Produits"
        icon={<InventoryIcon />}
      >
        <DownloadButton />
      </DashBoardHeader>

      {/* Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <OrderTable />
      </Box>
    </>
  );
}
