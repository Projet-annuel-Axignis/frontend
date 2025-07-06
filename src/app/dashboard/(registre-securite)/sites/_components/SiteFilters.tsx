'use client';

import { Company } from '@/types/company';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Autocomplete,
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
import React, { useState } from 'react';

interface SiteFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  includeDeleted: boolean;
  onIncludeDeletedChange: (value: boolean) => void;
  selectedCompany: Company | null;
  onCompanyChange: (company: Company | null) => void;
  companies: Company[];
  onReset: () => void;
}

const SiteFilters: React.FC<SiteFiltersProps> = ({
  search,
  onSearchChange,
  includeDeleted,
  onIncludeDeletedChange,
  selectedCompany,
  onCompanyChange,
  companies,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    onReset();
    // Fermer les filtres avancés après réinitialisation
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search.trim()) count++;
    if (selectedCompany) count++;
    if (includeDeleted === true) count++;
    return count;
  };

  const hasActiveFilters = () => {
    return search.trim() !== '' || selectedCompany !== null || includeDeleted !== false;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Recherche */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, adresse, référence..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
        <Grid size={{ xs: 12, md: 4 }}>
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
            {/* Filtre par entreprise */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Autocomplete
                options={companies}
                getOptionLabel={(option) => option.name}
                value={selectedCompany}
                onChange={(_, newValue) => onCompanyChange(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Entreprise"
                    variant="outlined"
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Box sx={{ fontWeight: 'medium' }}>{option.name}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        SIRET: {option.siretNumber}
                      </Box>
                    </Box>
                  </Box>
                )}
              />
            </Grid>

            {/* Inclure les supprimés */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeDeleted}
                      onChange={(e) => onIncludeDeletedChange(e.target.checked)}
                    />
                  }
                  label="Inclure les supprimés"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default SiteFilters; 