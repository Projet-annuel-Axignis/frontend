import { Metadata } from 'next';
import { CssVarsProvider, CssBaseline, Box } from '@mui/joy';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: "Axignis - Base technique de références",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100dvh'}}>
      <Sidebar />
      <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: { xs: '30px', sm: '30px', md: '30px' },
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
    </CssVarsProvider>
    </>
  );
}