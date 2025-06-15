"use client"
import Footer from '@/components/commons/Footer';
import Header from '@/components/commons/Header';
import { Box, Button, Container, Typography, styled } from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const FloatingImageContainer = styled(Box)(({ theme }) => ({
  width: '200px',
  height: '200px',
  position: 'relative',
  margin: '0 auto 32px auto',
  animation: 'float 3s ease-in-out infinite',
  filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))',
  [theme.breakpoints.up('md')]: {
    width: '400px',
    height: '400px',
  },
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
  color: theme.palette.common.white,
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[4],
  transition: 'var(--transition-normal)',
  '&:hover': {
    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

export default function NotFound() {
  const t = useTranslations()
  return (
    <>
      <Header />
      <Box
        component="main"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          px: 2,
          pt: 10,
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <FloatingImageContainer>
              <Image
                src="/images/404.png"
                alt="Page non trouvée"
                fill
                style={{
                  objectFit: 'contain',
                }}
              />
            </FloatingImageContainer>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2,
              }}
            >
              {t("error_pages.error404.title")}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                mb: 4,
                fontSize: '1.125rem',
              }}
            >
              {t("error_pages.error404.subtitle")}
            </Typography>

            <Link href="/" style={{ textDecoration: 'none' }}>
              <StyledButton
                size="large"
                variant="contained"
                fullWidth={false}
              >
                {t("error_pages.error404.button_back")}
              </StyledButton>
            </Link>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}