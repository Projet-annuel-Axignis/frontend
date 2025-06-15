import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import DownloadIcon from '@mui/icons-material/Download';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

const listItems = [
  {
    id: 'JOD-1234',
    marque: 'Legrand',
    status: 'En stock',
    type: 'Déclencheur',
    category: 'Sécurité incendie',
    customer: {
      initial: 'L',
      name: 'Legrand',
      description: 'Déclencheur Manuel Incendie',
    },
  },
  {
    id: 'CAB-1233',
    marque: 'Schneider',
    status: 'En stock',
    type: 'Câble',
    category: 'Électricité',
    customer: {
      initial: 'S',
      name: 'Schneider Electric',
      description: 'Câble résistant au feu',
    },
  },
  {
    id: 'DET-1232',
    marque: 'Siemens',
    status: 'Stock faible',
    type: 'Détecteur',
    category: 'Sécurité incendie',
    customer: {
      initial: 'S',
      name: 'Siemens',
      description: 'Détecteur de fumée optique',
    },
  },
  {
    id: 'CEN-1231',
    marque: 'Honeywell',
    status: 'En stock',
    type: 'Centrale',
    category: 'Sécurité incendie',
    customer: {
      initial: 'H',
      name: 'Honeywell',
      description: 'Centrale incendie 4 zones',
    },
  },
  {
    id: 'VOL-1230',
    marque: 'Legrand',
    status: 'Rupture',
    type: 'Volet',
    category: 'Protection',
    customer: {
      initial: 'L',
      name: 'Legrand',
      description: 'Volet de protection DMI',
    },
  },
  {
    id: 'SIR-1229',
    marque: 'Bosch',
    status: 'Rupture',
    type: 'Sirène',
    category: 'Alarme',
    customer: {
      initial: 'B',
      name: 'Bosch Security',
      description: 'Sirène d\'alarme extérieure',
    },
  },
];

function RowMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? 'row-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          transition: 'var(--transition-normal)',
          '&:hover': {
            backgroundColor: 'var(--color-axignis-primary)',
            color: 'white',
          },
        }}
      >
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        id="row-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Éditer</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Renommer</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Déplacer</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ color: 'error.main', fontWeight: 500 }}>
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'En stock':
      return 'success';
    case 'Stock faible':
      return 'warning';
    case 'Rupture':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'En stock':
      return <CheckRoundedIcon />;
    case 'Stock faible':
      return <AutorenewRoundedIcon />;
    case 'Rupture':
      return <BlockIcon />;
    default:
      return undefined;
  }
};

export default function OrderList() {
  const theme = useTheme();

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.shadows[2],
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {listItems.map((listItem, index) => (
          <React.Fragment key={listItem.id}>
            <ListItem
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                p: 3,
                transition: 'var(--transition-normal)',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  cursor: 'pointer',
                },
              }}
              onClick={() => {
                location.href = `/base-technique/produits/${listItem.id}`;
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                      fontWeight: 600,
                    }}
                  >
                    {listItem.customer.initial}
                  </Avatar>
                </ListItemAvatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-axignis-dark)' }}>
                    {listItem.customer.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    {listItem.customer.description}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'var(--color-axignis-primary)', fontWeight: 600 }}>
                      {listItem.id}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      &bull;
                    </Typography>
                    <Chip
                      variant="outlined"
                      size="small"
                      label={listItem.type}
                      sx={{
                        fontSize: '0.75rem',
                        height: 20,
                        borderColor: 'var(--color-axignis-primary)',
                        color: 'var(--color-axignis-primary)',
                        fontWeight: 500,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      &bull;
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {listItem.category}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: 'var(--color-axignis-primary)',
                        transition: 'var(--transition-normal)',
                        '&:hover': {
                          backgroundColor: 'var(--color-axignis-primary)',
                          color: 'white',
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <Box onClick={(e) => e.stopPropagation()}>
                      <RowMenu />
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip
                  variant="filled"
                  size="small"
                  icon={getStatusIcon(listItem.status)}
                  color={getStatusColor(listItem.status) as any}
                  label={listItem.status}
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            </ListItem>
            {index < listItems.length - 1 && (
              <Divider sx={{ borderColor: theme.palette.divider }} />
            )}
          </React.Fragment>
        ))}
      </Paper>

      {/* Pagination Mobile */}
      <Box
        className="Pagination-mobile"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          gap: 2,
        }}
      >
        <IconButton
          aria-label="previous page"
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'var(--color-axignis-primary)',
            borderRadius: 2,
            color: 'var(--color-axignis-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: 'var(--color-axignis-dark)',
            px: 2,
          }}
        >
          Page 1 sur 10
        </Typography>
        <IconButton
          aria-label="next page"
          size="small"
          sx={{
            border: '1px solid',
            borderColor: 'var(--color-axignis-primary)',
            borderRadius: 2,
            color: 'var(--color-axignis-primary)',
            '&:hover': {
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}