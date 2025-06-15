import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import theme from '@/theme/theme';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { CssBaseline, ThemeProvider } from '@mui/material';

const listItems = [
  {
    id: 'INV-1234',
    marque: 'Marque',
    status: 'Refunded',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1233',
    marque: 'Marque',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1232',
    marque: 'Marque',
    status: 'Refunded',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1231',
    marque: 'Marque',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1230',
    marque: 'Marque',
    status: 'Cancelled',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1229',
    marque: 'Marque',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IconButton
          size="small"
          onClick={handleClick}
          aria-controls={open ? 'row-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
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
        >
          <MenuItem onClick={handleClose}>Edit</MenuItem>
          <MenuItem onClick={handleClose}>Rename</MenuItem>
          <MenuItem onClick={handleClose}>Move</MenuItem>
          <Divider />
          <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
            Delete
          </MenuItem>
        </Menu>
      </ThemeProvider>
    </>
  );
}

export default function OrderList() {
  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {listItems.map((listItem) => (
        <List key={listItem.id} dense sx={{ px: 0 }}>
          <ListItem
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {listItem.customer.initial}
                </Avatar>
              </ListItemAvatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {listItem.customer.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {listItem.customer.email}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {listItem.marque}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    &bull;
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {listItem.id}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Link variant="body2" component="button">
                    Download
                  </Link>
                  <RowMenu />
                </Box>
              </Box>
            </Box>
            <Chip
              variant="filled"
              size="small"
              icon={
                {
                  Paid: <CheckRoundedIcon />,
                  Refunded: <AutorenewRoundedIcon />,
                  Cancelled: <BlockIcon />,
                }[listItem.status]
              }
              color={
                {
                  Paid: 'success',
                  Refunded: 'default',
                  Cancelled: 'error',
                }[listItem.status] as 'success' | 'default' | 'error'
              }
              label={listItem.status}
            />
          </ListItem>
          <Divider />
        </List>
      ))}
      <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
      >
        <IconButton
          aria-label="previous page"
          size="small"
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography variant="body2" sx={{ mx: 'auto' }}>
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          size="small"
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}