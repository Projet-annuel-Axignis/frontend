'use client';
import { useLoadingContext } from '@/app/_providers/LoadingProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BreadCrumb from '@/components/dashboard/BreadCrumb';
import Sidebar from '@/components/dashboard/Sidebar';
import ProgressBar from '@/components/ui/ProgressBar';
import { Box } from '@mui/material';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isNavigating } = useLoadingContext();

  return (
    <>
      <ProtectedRoute
        allowedRoles={['ADMINISTRATOR', 'COMPANY_ADMINISTRATOR', 'COMPANY_MANAGER', 'COMPANY_MEMBER']}
      >
        <ProgressBar
          isVisible={isNavigating}
        />

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
              position: 'relative',
              ml: { xs: 0, md: 'var(--Sidebar-width)' },
            }}
          >
            <Box sx={{ p: 3 }}>
              <BreadCrumb />
              {children}
            </Box>
          </Box>
        </Box>
      </ProtectedRoute>
    </>
  );
}