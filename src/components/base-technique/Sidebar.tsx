'use client';

import AppsIcon from '@mui/icons-material/Apps';
import CableIcon from '@mui/icons-material/Cable';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import GlobalStyles from '@mui/material/GlobalStyles';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

import { closeSidebar } from './utils';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    transform: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
  },
  transition: 'transform 0.4s, width 0.4s',
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
}));

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={{
          display: 'grid',
          transition: '0.2s ease',
          '& > *': {
            overflow: 'hidden',
          },
          ...(open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' }),
        }}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <StyledPaper
      className="Sidebar"
      elevation={0}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
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
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      <div className=" mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative h-12 w-32">
          <Image
            src={isDarkMode ? "/images/logo/logo-axignis-nb.png" : "/images/logo/logo-axignis.png"}
            alt="Axignis Logo"
            fill
            className={`
              object-contain
              transition-opacity
            `}
          />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-between w-full p-px">
        <Chip
          label="Base technique"
          size="medium"
          variant="filled"
          color="primary"
          sx={{ marginBottom: 2.5 }}
        />
      </div>
      <Box
        sx={{
          minHeight: 0,
          overflow: 'hidden auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List
          dense
          sx={{
            gap: 1,
            '& .MuiListItemButton-root': {
              gap: 1.5,
              borderRadius: 1,
            },
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <FolderIcon />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Domaines d&apos;équipements
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <DashboardRoundedIcon />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Familles d&apos;équipements
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <CableIcon />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Types d&apos;équipements
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <AppsIcon />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Marques
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <ShoppingCartRoundedIcon />
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        Produits
                      </Typography>
                    }
                  />
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: open ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5, pl: 4 }}>
                <ListItem sx={{ mt: 0.5 }} disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Produits" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Types de documents de produits" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Documents de produits" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <AppsIcon />
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight="medium">
                    Marques
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <ShoppingCartRoundedIcon />
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="medium">
                        Produits
                      </Typography>
                    }
                  />
                  <KeyboardArrowDownIcon
                    sx={{
                      transform: open ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5, pl: 4 }}>
                <ListItem sx={{ mt: 0.5 }} disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Produits" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Types de documents de produits" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="Documents de produits" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>

        </List>
        <List
          dense
          sx={{
            mt: 'auto',
            flexGrow: 0,
            mb: 2,
            '& .MuiListItemButton-root': {
              borderRadius: 1,
            },
          }}
        >
          <ListItem disablePadding>
            <ListItemButton>
              <SupportRoundedIcon />
              <ListItemText primary="Support" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <SettingsRoundedIcon />
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <Avatar
          sx={{ width: 32, height: 32 }}
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight="medium">Loïc Rome</Typography>
        </Box>
        <IconButton size="small" color="inherit">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </StyledPaper>
  );
}