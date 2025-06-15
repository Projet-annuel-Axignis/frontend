'use client';

import { useUser } from '@/app/_providers/Providers';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'shouldBeTransparent' && prop !== 'isScrolled',
})<{ shouldBeTransparent: boolean; isScrolled: boolean }>(({ theme, shouldBeTransparent, isScrolled }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
  transition: 'all 0.3s ease',
  paddingTop: isScrolled ? theme.spacing(1) : theme.spacing(2),
  paddingBottom: isScrolled ? theme.spacing(1) : theme.spacing(2),
  backgroundColor: shouldBeTransparent
    ? 'transparent'
    : theme.palette.mode === 'dark'
      ? 'rgba(18, 18, 18, 0.9)'
      : 'rgba(255, 255, 255, 0.9)',
  backdropFilter: shouldBeTransparent ? 'none' : 'blur(12px)',
  boxShadow: shouldBeTransparent ? 'none' : theme.shadows[4],
}));

const StyledLogoContainer = styled(Box)(() => ({
  position: 'relative',
  height: '48px',
  width: '128px',
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 0.8,
  },
}));

const StyledNavLink = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'shouldBeTransparent' && prop !== 'isActive',
})<{ shouldBeTransparent: boolean; isActive: boolean }>(({ theme, shouldBeTransparent, isActive }) => ({
  fontWeight: 500,
  textTransform: 'none',
  color: shouldBeTransparent
    ? theme.palette.common.white
    : theme.palette.text.primary,
  transition: 'color 0.3s ease',
  position: 'relative',
  '&:hover': {
    color: 'var(--color-axignis-primary)',
    backgroundColor: 'transparent',
  },
  ...(isActive && {
    color: 'var(--color-axignis-primary)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '2px',
      backgroundColor: 'var(--color-axignis-primary)',
    },
  }),
}));

const StyledLoginButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
    transform: 'translateY(-1px)',
  },
}));

const StyledDashboardButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  marginRight: theme.spacing(1),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #1565c0, #1976d2)',
    transform: 'translateY(-1px)',
  },
}));

const StyledLogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f57c00, #ff9800)',
  color: theme.palette.common.white,
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #ef6c00, #f57c00)',
    transform: 'translateY(-1px)',
  },
}));

const StyledMobileMenu = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[8],
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const StyledMobileMenuItem = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 500,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(1),
  color: theme.palette.text.primary,
  backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isActive && {
    color: 'var(--color-axignis-primary)',
    fontWeight: 600,
  }),
}));

export default function Header() {
  const t = useTranslations();
  const theme = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Déterminer si nous sommes sur la page d'accueil
  const isHomePage = pathname === '/';

  // Détecter le défilement pour changer le style du header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    setUserMenuAnchor(null);
    router.push('/');
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  // Déterminer le style du header en fonction de la page et du défilement
  const shouldBeTransparent = isHomePage && !isScrolled;

  return (
    <StyledAppBar
      elevation={0}
      shouldBeTransparent={shouldBeTransparent}
      isScrolled={isScrolled}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, sm: 2 } }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <StyledLogoContainer>
              <Image
                src={shouldBeTransparent ? "/images/logo/logo-axignis-nb.png" : "/images/logo/logo-axignis.png"}
                alt="Axignis Logo"
                fill
                sizes="128px"
                style={{
                  objectFit: 'contain',
                  filter: shouldBeTransparent ? 'brightness(0) invert(1)' : 'none',
                }}
                priority
              />
            </StyledLogoContainer>
          </Link>

          {/* Navigation - Desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Link href="/plans" style={{ textDecoration: 'none' }}>
              <StyledNavLink
                shouldBeTransparent={shouldBeTransparent}
                isActive={isActive('/plans')}
              >
                {t('common.plans')}
              </StyledNavLink>
            </Link>

            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <StyledNavLink
                shouldBeTransparent={shouldBeTransparent}
                isActive={isActive('/contact')}
              >
                {t('common.contact')}
              </StyledNavLink>
            </Link>

            {/* Boutons pour utilisateurs connectés */}
            {isAuthenticated ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* Bouton Tableau de bord */}
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <StyledDashboardButton
                    startIcon={<DashboardIcon />}
                    size="small"
                  >
                    {t('common.dashboard')}
                  </StyledDashboardButton>
                </Link>

                {/* Menu utilisateur */}
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    p: 0,
                    ml: 1,
                    border: '2px solid var(--color-axignis-primary)',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'var(--color-axignis-primary)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <Typography variant="body2" fontWeight="600">
                      {user?.firstName || t('common.profile')}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography variant="body2" color="error">
                      {t('common.logout')}
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Link href="/connexion" style={{ textDecoration: 'none' }}>
                <StyledLoginButton size="small">
                  {t('common.login')}
                </StyledLoginButton>
              </Link>
            )}
          </Box>

          {/* Menu burger - Mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <IconButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              sx={{
                color: shouldBeTransparent
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
              }}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </Toolbar>

        {/* Menu mobile */}
        <Collapse in={isMobileMenuOpen}>
          <StyledMobileMenu>
            <Link href="/plans" style={{ textDecoration: 'none' }}>
              <StyledMobileMenuItem
                isActive={isActive('/plans')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.plans')}
              </StyledMobileMenuItem>
            </Link>

            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <StyledMobileMenuItem
                isActive={isActive('/contact')}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.contact')}
              </StyledMobileMenuItem>
            </Link>

            {/* Menu mobile pour utilisateurs connectés */}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                  <StyledMobileMenuItem
                    isActive={isActive('/dashboard')}
                    onClick={() => setIsMobileMenuOpen(false)}
                    startIcon={<DashboardIcon />}
                  >
                    {t('common.dashboard')}
                  </StyledMobileMenuItem>
                </Link>

                <StyledMobileMenuItem
                  isActive={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {user?.firstName || t('common.profile')}
                </StyledMobileMenuItem>

                <StyledLogoutButton
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  size="small"
                  fullWidth
                >
                  {t('common.logout')}
                </StyledLogoutButton>
              </>
            ) : (
              <Link href="/connexion" style={{ textDecoration: 'none' }}>
                <StyledLoginButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  size="small"
                  fullWidth
                >
                  {t('common.login')}
                </StyledLoginButton>
              </Link>
            )}
          </StyledMobileMenu>
        </Collapse>
      </Container>
    </StyledAppBar>
  );
} 