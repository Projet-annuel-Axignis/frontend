import { useUser } from '@/app/_providers/Providers';
import { UserRoleType } from '@/types/auth';
import { AdminPanelSettings } from '@mui/icons-material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AppsIcon from '@mui/icons-material/Apps';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import CableIcon from '@mui/icons-material/Cable';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import GroupIcon from '@mui/icons-material/Group';
import InventoryIcon from '@mui/icons-material/Inventory';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import StorageIcon from '@mui/icons-material/Storage';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Fab,
  GlobalStyles,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import SidebarUserSection from './SidebarUserSection';
import { closeSidebar, toggleSidebar } from './utils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    transform: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
    zIndex: theme.zIndex.drawer + 1,
  },
  transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  zIndex: theme.zIndex.drawer,
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
  boxShadow: theme.shadows[8],
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
  },
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
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
  color: theme.palette.common.white,
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
}));

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive?: boolean }>(({ theme, isActive }) => ({
  width: '100%',
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: isActive ? '4px' : '0px',
    background: 'linear-gradient(180deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
    transition: 'width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[2],
    '&::before': {
      width: '4px',
    },
  },
  ...(isActive && {
    backgroundColor: `${theme.palette.primary.main}15`,
    color: theme.palette.primary.main,
    fontWeight: 600,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiTypography-root': {
      fontWeight: 600,
    },
  }),
}));

const MobileMenuButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(1.5),
  left: theme.spacing(1.5),
  zIndex: theme.zIndex.drawer + 2,
  background: 'linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))',
  color: theme.palette.common.white,
  boxShadow: theme.shadows[6],
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, var(--color-axignis-secondary), var(--color-axignis-primary))',
    transform: 'scale(1.1) rotate(90deg)',
    boxShadow: theme.shadows[12],
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  minHeight: 0,
  overflow: 'hidden auto',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  //paddingRight: theme.spacing(0.5),
  backgroundColor: theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.02)'
    : 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.spacing(1),
  //margin: theme.spacing(0.5),
  padding: theme.spacing(1),
  boxShadow: theme.palette.mode === 'dark'
    ? 'inset 0 0 10px rgba(255, 255, 255, 0.05)'
    : 'inset 0 0 10px rgba(0, 0, 0, 0.05)',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.divider,
    borderRadius: '3px',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
}));

export default function Sidebar() {
  const theme = useTheme();
  const { user } = useUser();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';
  const [openProducts, setOpenProducts] = React.useState(false);
  const [openAdministration, setOpenAdministration] = React.useState(false);
  const [openSites, setOpenSites] = React.useState(false);
  const [openEquipments, setOpenEquipments] = React.useState(false);
  const [openInterventions, setOpenInterventions] = React.useState(false);

  const handleProductsClick = () => {
    setOpenProducts(!openProducts);
  };

  const handleAdministrationClick = () => {
    setOpenAdministration(!openAdministration);
  };

  const handleSitesClick = () => {
    setOpenSites(!openSites);
  };

  const handleEquipmentsClick = () => {
    setOpenEquipments(!openEquipments);
  };

  const handleInterventionsClick = () => {
    setOpenInterventions(!openInterventions);
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <MobileMenuButton
          size="small"
          onClick={() => toggleSidebar()}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon />
        </MobileMenuButton>
      )}

      <StyledPaper className="Sidebar" elevation={0} sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        gap: 0,
      }}>
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            transition: 'opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backdropFilter: 'blur(4px)',
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
              className={`relative w-full h-full`}
            >
              <Image
                className={`transition-all duration-300 ${isDarkMode && 'brightness-0 invert'}`}
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

        <ScrollableContent>
          {/* Base technique */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StyledChip
              label="Base technique"
              size="medium"
              variant="filled"
            />
          </Box>

          {/* Navigation Menu */}
          <List dense sx={{ gap: 0.5, width: '100%', mb: 3 }}>
            {/* Menu Équipements avec sous-menu */}
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Tooltip title="Gérer les équipements techniques" placement="right" arrow>
                <Box sx={{ width: '100%' }}>
                  <StyledListItemButton
                    onClick={handleEquipmentsClick}
                    isActive={isActive('/dashboard/domaines') || isActive('/dashboard/familles') || isActive('/dashboard/types') || isActive('/dashboard/compatibilite')}
                  >
                    <AccountTreeIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          Équipements
                        </Typography>
                      }
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: openEquipments ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        color: 'var(--color-axignis-primary)',
                      }}
                    />
                  </StyledListItemButton>
                </Box>
              </Tooltip>
            </ListItem>

            {/* Sous-menu Équipements */}
            <Collapse in={openEquipments} timeout={400} unmountOnExit>
              <Box sx={{ pl: 2, py: 1 }}>
                <Link href="/dashboard/domaines" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/domaines')}
                  >
                    <FolderIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Domaines
                    </Typography>
                  </StyledListItemButton>
                </Link>

                <Link href="/dashboard/familles" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/familles')}
                  >
                    <DashboardRoundedIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Familles
                    </Typography>
                  </StyledListItemButton>
                </Link>

                <Link href="/dashboard/types" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/types')}
                  >
                    <CableIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Types
                    </Typography>
                  </StyledListItemButton>
                </Link>
                <Link href="/dashboard/compatibilite" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/compatibilite')}
                  >
                    <GroupIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Compatibilité
                    </Typography>
                  </StyledListItemButton>
                </Link>
              </Box>
            </Collapse>

            <ListItem disablePadding sx={{ width: '100%' }}>
              <Tooltip title="Gérer les marques" placement="right" arrow>
                <Box sx={{ width: '100%' }}>
                  <Link href="/dashboard/marques" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <StyledListItemButton isActive={isActive('/dashboard/marques')}>
                      <AppsIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            Marques
                          </Typography>
                        }
                      />
                    </StyledListItemButton>
                  </Link>
                </Box>
              </Tooltip>
            </ListItem>

            {/* Menu Produits avec sous-menu */}
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Tooltip title="Gérer les produits et documents" placement="right" arrow>
                <Box sx={{ width: '100%' }}>
                  <StyledListItemButton
                    onClick={handleProductsClick}
                    isActive={isActive('/dashboard/produits')}
                  >
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
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        color: 'var(--color-axignis-primary)',
                      }}
                    />
                  </StyledListItemButton>
                </Box>
              </Tooltip>
            </ListItem>

            {/* Sous-menu Produits */}
            <Collapse in={openProducts} timeout={400} unmountOnExit>
              <Box sx={{ pl: 2, py: 1 }}>
                <Link href="/dashboard/produits" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/produits')}
                  >
                    <InventoryIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Produits
                    </Typography>
                  </StyledListItemButton>
                </Link>
                
                <Link href="/dashboard/compatibilite" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/compatibilite')}
                  >
                    <GroupIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Compatibilité
                    </Typography>
                  </StyledListItemButton>
                </Link>
                
                <Link href="/dashboard/types-documents" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/types-documents')}
                  >
                    <DescriptionIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Types de documents
                    </Typography>
                  </StyledListItemButton>
                </Link>
                
                <Link href="/dashboard/documents" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/documents')}
                  >
                    <ArticleIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Documents
                    </Typography>
                  </StyledListItemButton>
                </Link>
              </Box>
            </Collapse>
          </List>

          {/* Registre de sécurité */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <StyledChip
              label="Registre de sécurité"
              size="medium"
              variant="filled"
            />
          </Box>

          {/* Navigation Menu Registre de sécurité */}
          <List dense sx={{ gap: 0.5, width: '100%' }}>
            <ListItem disablePadding sx={{ width: '100%' }}>
              <Tooltip title="Gérer les sites de l'entreprise" placement="right" arrow>
                <Box sx={{ width: '100%' }}>
                  <StyledListItemButton
                    onClick={handleSitesClick}
                    isActive={isActive('/dashboard/sites')}
                  >
                    <BusinessIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          Sites
                        </Typography>
                      }
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: openSites ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        color: 'var(--color-axignis-primary)',
                      }}
                    />
                  </StyledListItemButton>
                </Box>
              </Tooltip>
            </ListItem>

            {/* Sous-menu Sites */}
            <Collapse in={openSites} timeout={400} unmountOnExit>
              <Box sx={{ pl: 2, py: 1 }}>
                <Link href="/dashboard/sites" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/sites')}
                  >
                    <BusinessIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Sites
                    </Typography>
                  </StyledListItemButton>
                </Link>
                <Link href="/dashboard/sites/hierarchie" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/sites/hierarchie')}
                  >
                    <AccountTreeIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Navigation Hiérarchique
                    </Typography>
                  </StyledListItemButton>
                </Link>
              </Box>
            </Collapse>

            <ListItem disablePadding sx={{ width: '100%' }}>
              <Tooltip title="Gérer les interventions et rapports" placement="right" arrow>
                <Box sx={{ width: '100%' }}>
                  <StyledListItemButton
                    onClick={handleInterventionsClick}
                    isActive={isActive('/dashboard/interventions')}
                  >
                    <BuildIcon sx={{ mr: 1.5, color: 'var(--color-axignis-primary)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          Interventions
                        </Typography>
                      }
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: openInterventions ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        color: 'var(--color-axignis-primary)',
                      }}
                    />
                  </StyledListItemButton>
                </Box>
              </Tooltip>
            </ListItem>

            {/* Sous-menu Interventions */}
            <Collapse in={openInterventions} timeout={400} unmountOnExit>
              <Box sx={{ pl: 2, py: 1 }}>
                <Link href="/dashboard/interventions" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/interventions')}
                  >
                    <BuildIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Interventions
                    </Typography>
                  </StyledListItemButton>
                </Link>
                <Link href="/dashboard/interventions/intervention-types" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/interventions/intervention-types')}
                  >
                    <AssignmentIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Types d&apos;intervention
                    </Typography>
                  </StyledListItemButton>
                </Link>
                <Link href="/dashboard/interventions/report-types" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/interventions/report-types')}
                  >
                    <DescriptionIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Types de rapport
                    </Typography>
                  </StyledListItemButton>
                </Link>
                <Link href="/dashboard/interventions/organizations" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton
                    sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                    isActive={isActive('/dashboard/interventions/organizations')}
                  >
                    <GroupIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                    <Typography variant="body2" color="textSecondary">
                      Organismes
                    </Typography>
                  </StyledListItemButton>
                </Link>
              </Box>
            </Collapse>
          </List>
        </ScrollableContent>

        {/* Bottom Menu */}
        <List
          dense
          sx={{
            mt: 'auto',
            flexGrow: 0,
            mb: 0,
          }}
        >
          <ListItem disablePadding>
            <Tooltip title="Obtenir de l'aide" placement="right" arrow>
              <Box sx={{ width: '100%' }}>
                <Link href="/dashboard/support" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton isActive={isActive('/dashboard/support')}>
                    <SupportRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          Support
                        </Typography>
                      }
                    />
                  </StyledListItemButton>
                </Link>
              </Box>
            </Tooltip>
          </ListItem>

          <ListItem disablePadding>
            <Tooltip title="Configurer l'application" placement="right" arrow>
              <Box sx={{ width: '100%' }}>
                <Link href="/dashboard/parametres" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StyledListItemButton isActive={isActive('/dashboard/parametres')}>
                    <SettingsRoundedIcon sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          Paramètres
                        </Typography>
                      }
                    />
                  </StyledListItemButton>
                </Link>
              </Box>
            </Tooltip>
          </ListItem>

          {/* Administration - Visible uniquement pour les administrateurs */}
          {user?.role?.type === UserRoleType.ADMINISTRATOR && (
            <>
              <ListItem disablePadding>
                <Tooltip title="Panneau d'administration" placement="right" arrow>
                  <Box sx={{ width: '100%' }}>
                    <StyledListItemButton
                      onClick={handleAdministrationClick}
                      isActive={isActive('/dashboard/administration')}
                    >
                      <AdminPanelSettings sx={{ mr: 1.5, color: 'var(--color-axignis-secondary)' }} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            Administration
                          </Typography>
                        }
                      />
                      <KeyboardArrowDownIcon
                        sx={{
                          transform: openAdministration ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          color: 'var(--color-axignis-secondary)',
                        }}
                      />
                    </StyledListItemButton>
                  </Box>
                </Tooltip>
              </ListItem>

              {/* Sous-menu Administration */}
              <Collapse in={openAdministration} timeout={400} unmountOnExit>
                <Box sx={{ pl: 4, py: 1 }}>
                  <Link href="/dashboard/administration/utilisateurs" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <StyledListItemButton
                      sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                      isActive={isActive('/dashboard/administration/utilisateurs')}
                    >
                      <PeopleIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                      <Typography variant="body2" color="textSecondary">
                        Utilisateurs
                      </Typography>
                    </StyledListItemButton>
                  </Link>
                  <Link href="/dashboard/administration/entreprises" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <StyledListItemButton
                      sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                      isActive={isActive('/dashboard/administration/entreprises')}
                    >
                      <BusinessIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                      <Typography variant="body2" color="textSecondary">
                        Entreprises
                      </Typography>
                    </StyledListItemButton>
                  </Link>
                  <Link href="/dashboard/administration/donnees" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <StyledListItemButton
                      sx={{ py: 0.75, mb: 0.5, width: '100%' }}
                      isActive={isActive('/dashboard/administration/donnees')}
                    >
                      <StorageIcon sx={{ mr: 1.5, fontSize: '1rem', color: 'var(--color-axignis-primary)' }} />
                      <Typography variant="body2" color="textSecondary">
                        Données
                      </Typography>
                    </StyledListItemButton>
                  </Link>
                </Box>
              </Collapse>
            </>
          )}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* User Section */}
        <SidebarUserSection />
      </StyledPaper>
    </>
  );
}