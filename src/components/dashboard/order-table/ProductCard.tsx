import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { Product } from './types';
import { getStatusColor, getStatusIcon, handleRowClick } from './utils';

interface ProductCardProps {
  product: Product;
}

function RowMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
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

export default function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const StatusIcon = getStatusIcon(product.status);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'var(--transition-normal)',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          borderColor: 'var(--color-axignis-primary)',
        },
      }}
      onClick={() => handleRowClick(product.id)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flex: 1 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {product.marque.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-axignis-dark)' }}>
                {product.marque}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                {product.associativity}
              </Typography>
            </Box>
          </Box>
          <Chip
            variant="filled"
            size="small"
            icon={StatusIcon ? <StatusIcon /> : undefined}
            color={getStatusColor(product.status) as any}
            label={product.status}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="body1" sx={{ color: 'var(--color-axignis-primary)', fontWeight: 600 }}>
            {product.id}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            &bull;
          </Typography>
          <Chip
            variant="outlined"
            size="small"
            label={product.type}
            sx={{
              fontSize: '0.75rem',
              height: 24,
              borderColor: 'var(--color-axignis-primary)',
              color: 'var(--color-axignis-primary)',
              fontWeight: 500,
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
      </CardContent>
    </Card>
  );
} 