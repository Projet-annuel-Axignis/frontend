'use client';

import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Switch,
  TextField
} from '@mui/material';
import { useState } from 'react';

interface CompanyFilters {
  search: string;
  includeDeleted: boolean;
}

interface CompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
}

export default function CompanyFiltersComponent({ filters, onFiltersChange }: CompanyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: keyof CompanyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      search: '',
      includeDeleted: false,
    });
    // Fermer les filtres avancés après réinitialisation
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.includeDeleted === true) count++;
    return count;
  };

  const hasActiveFilters = () => {
    return filters.search.trim() !== '' || filters.includeDeleted !== false;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Recherche */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom d'entreprise ou SIRET..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            name="search"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        {/* Bouton filtres avancés */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ mr: 1 }}
          >
            Filtres avancés
            {getActiveFiltersCount() > 0 && (
              <Chip
                label={getActiveFiltersCount()}
                size="small"
                color="primary"
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
              />
            )}
          </Button>

          {hasActiveFilters() && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReset();
              }}
              size="small"
            >
              Réinitialiser
            </Button>
          )}
        </Grid>
      </Grid>

      {/* Filtres avancés */}
      {showAdvanced && (
        <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            {/* Inclure les supprimées */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={filters.includeDeleted}
                      onChange={(e) => handleFilterChange('includeDeleted', e.target.checked)}
                    />
                  }
                  label="Inclure les supprimées"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
} 