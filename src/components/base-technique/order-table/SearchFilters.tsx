import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';

import { marques, statuses, types } from './data';
import { FilterValues } from './types';

const StyledSearchFilters = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, var(--color-axignis-primary)05, var(--color-axignis-secondary)05)`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

interface SearchFiltersProps {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const handleFilterChange = (field: keyof FilterValues, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const renderFilterControls = () => (
    <>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Statut</InputLabel>
        <Select
          size="small"
          label="Statut"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="">Tous</MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Marque</InputLabel>
        <Select
          size="small"
          label="Marque"
          value={filters.marque}
          onChange={(e) => handleFilterChange('marque', e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="">Toutes</MenuItem>
          {marques.map((marque) => (
            <MenuItem key={marque} value={marque}>
              {marque}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Type</InputLabel>
        <Select
          size="small"
          label="Type"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="">Tous</MenuItem>
          {types.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      {/* Mobile Search and Filters */}
      <Paper
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
          p: 2,
          elevation: 0,
          border: '1px solid',
          borderColor: 'var(--color-axignis-primary)',
          borderRadius: 2,
          background: `linear-gradient(135deg, var(--color-axignis-primary)05, var(--color-axignis-secondary)05)`,
        }}
      >
        <TextField
          size="small"
          placeholder="Rechercher un produit..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--color-axignis-primary)' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          size="small"
          onClick={() => setMobileFiltersOpen(true)}
          sx={{
            border: '1px solid',
            borderColor: 'var(--color-axignis-primary)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          <FilterAltIcon />
        </IconButton>
        <Dialog
          open={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          fullScreen
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'var(--color-axignis-dark)' }}>
            Filtres
            <IconButton
              aria-label="close"
              onClick={() => setMobileFiltersOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              {renderFilterControls()}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setMobileFiltersOpen(false)}
                sx={{
                  background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Appliquer les filtres
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>

      {/* Desktop Search and Filters */}
      <StyledSearchFilters
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Rechercher un produit"
          size="small"
          placeholder="Nom, référence, marque..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'var(--color-axignis-primary)' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            flex: 1,
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-axignis-primary)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--color-axignis-secondary)',
              },
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
            },
          }}
        />
        {renderFilterControls()}
      </StyledSearchFilters>
    </>
  );
} 