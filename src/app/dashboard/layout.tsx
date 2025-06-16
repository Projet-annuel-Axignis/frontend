'use client';
import { useLoadingContext } from '@/app/_providers/LoadingProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import BreadCrumb from '@/components/dashboard/BreadCrumb';
import Sidebar from '@/components/dashboard/Sidebar';
import Loading from '@/components/ui/Loading';
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
            }}
          >
            <Box sx={{ p: 3 }}>
              <BreadCrumb />
              {children}
            </Box>

            {isNavigating && (
              <Loading
                variant="content"
                message="Navigation en cours..."
                size="medium"
              />
            )}
          </Box>
        </Box>
      </ProtectedRoute>
    </>
  );
}