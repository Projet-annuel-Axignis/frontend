'use client';
import Sidebar from '@/components/base-technique/Sidebar';
import { Box } from '@mui/joy';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            px: { xs: 2, md: 6 },
            pt: '30px',
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
}