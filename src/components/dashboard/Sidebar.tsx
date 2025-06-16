import { useUser } from '@/app/_providers/Providers';
import { UserRoleType } from '@/types/auth';
import { AdminPanelSettings } from '@mui/icons-material';
import AppsIcon from '@mui/icons-material/Apps';
import BusinessIcon from '@mui/icons-material/Business';
import CableIcon from '@mui/icons-material/Cable';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  GlobalStyles,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  Typography,
  useTheme
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import SidebarUserSection from './SidebarUserSection';
import { closeSidebar } from './utils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    transform: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
  },
  transition: 'var(--transition-normal)',
  zIndex: 10000,
  height: '100dvh',
  width: 'var(--Sidebar-width)',
  top: 0,
  padding: theme.spacing(2),
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
}));

const StyledLogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(1),
  '& .logo-link': {
    position: 'relative',
    height: '48px',
    width: '128px',
    display: 'block',
    transition: 'var(--transition-normal)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
  '&:hover': {
    background: `linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))`,
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  transition: 'var(--transition-normal)',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    transform: 'translateX(4px)',
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.contrastText,
    },
  },
}));

export default function Sidebar() {
  const theme = useTheme();
  const { user } = useUser();
  const isDarkMode = theme.palette.mode === 'dark';
  const [openProducts, setOpenProducts] = React.useState(false);

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  return (
    <StyledPaper className="Sidebar" elevation={0}>
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '240px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '260px',
            },
          },
        })}
      />

      {/* Overlay pour mobile */}
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          transition: 'var(--transition-normal)',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />

      {/* Logo Section */}
      <StyledLogoContainer>
        <Link href="/" className="logo-link">
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              '& img': {
                filter: isDarkMode ? 'brightness(0) invert(1)' : 'none',
                transition: 'var(--transition-normal)',
              },
            }}
          >
            <Image
              src={isDarkMode ? "/images/logo/logo-axignis-nb.png" : "/images/logo/logo-axignis.png"}
              alt="Axignis Logo"
              fill
              sizes="128px"
              style={{
                objectFit: 'contain',
              }}
              priority
            />
          </Box>
        </Link>
      </StyledLogoContainer>

      {/* Base technique */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledChip
          label="Base technique"
          size="medium"
          variant="filled"
        />
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List dense sx={{ gap: 0.5, width: '100%' }}>
          <ListItem disablePadding sx={{ width: '100%' }}>
            <StyledListItemButton>
              <FolderIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Domaines d&apos;équipements
                  </Typography>
                }
              />
            </StyledListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ width: '100%' }}>
            <StyledListItemButton>
              <DashboardRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Familles d&apos;équipements
                  </Typography>
                }
              />
            </StyledListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ width: '100%' }}>
            <StyledListItemButton>
              <CableIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Types d&apos;équipements
                  </Typography>
                }
              />
            </StyledListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ width: '100%' }}>
            <StyledListItemButton>
              <AppsIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Marques
                  </Typography>
                }
              />
            </StyledListItemButton>
          </ListItem>

          {/* Menu Produits avec sous-menu */}
          <ListItem disablePadding sx={{ width: '100%' }}>
            <StyledListItemButton onClick={handleProductsClick}>
              <ShoppingCartRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Produits
                  </Typography>
                }
              />
              <KeyboardArrowDownIcon
                sx={{
                  transform: openProducts ? 'rotate(180deg)' : 'none',
                  transition: 'var(--transition-normal)',
                  color: 'var(--color-axignis-primary)',
                }}
              />
            </StyledListItemButton>
          </ListItem>

          {/* Sous-menu Produits */}
          <Collapse in={openProducts} timeout="auto" unmountOnExit>
            <Box sx={{ pl: 4 }}>
              <Link href="/dashboard/produits" style={{ textDecoration: 'none', color: 'inherit' }}>
                <StyledListItemButton sx={{ py: 0.5, mb: 0.25, width: '100%' }}>
                  <Typography variant="body2" color="textSecondary">
                    Produits
                  </Typography>
                </StyledListItemButton>
              </Link>
              <StyledListItemButton sx={{ py: 0.5, mb: 0.25, width: '100%' }}>
                <Typography variant="body2" color="textSecondary">
                  Types de documents
                </Typography>
              </StyledListItemButton>
              <StyledListItemButton sx={{ py: 0.5, mb: 0.25, width: '100%' }}>
                <Typography variant="body2" color="textSecondary">
                  Documents
                </Typography>
              </StyledListItemButton>
            </Box>
          </Collapse>
        </List>
      </Box>

      {/* Registre de sécurité */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <StyledChip
          label="Registre de sécurité"
          size="medium"
          variant="filled"
        />
      </Box>
      {/* Navigation Menu Registre de sécurité */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List dense sx={{ gap: 0.5, width: '100%' }}>
          <ListItem disablePadding sx={{ width: '100%' }}>
            <Link href="/dashboard/sites" style={{ textDecoration: 'none', color: 'inherit' }}>
              <StyledListItemButton>
                <BusinessIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Sites
                    </Typography>
                  }
                />
              </StyledListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>


      {/* Bottom Menu */}
      <List
        dense
        sx={{
          mt: 'auto',
          flexGrow: 0,
          mb: 1,
        }}
      >
        <ListItem disablePadding>
          <StyledListItemButton>
            <SupportRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Support
                </Typography>
              }
            />
          </StyledListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <StyledListItemButton>
            <SettingsRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="medium">
                  Paramètres
                </Typography>
              }
            />
          </StyledListItemButton>
        </ListItem>
        {user?.role?.type === UserRoleType.ADMINISTRATOR && (
          <ListItem disablePadding>
            <Link href="/dashboard/administration" style={{ textDecoration: 'none', color: 'inherit' }}>
              <StyledListItemButton>
                <AdminPanelSettings sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Administration
                    </Typography>
                  }
                />
              </StyledListItemButton>
            </Link>
          </ListItem>
        )}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* User Section */}
      <SidebarUserSection />
    </StyledPaper>
  );
}