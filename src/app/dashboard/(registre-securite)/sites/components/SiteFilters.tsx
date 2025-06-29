'use client';

import { Company } from '@/types/company';
import { Clear as ClearIcon } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Chip,
  FormControlLabel,
  IconButton,
  Switch,
  TextField
} from '@mui/material';
import React from 'react';

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
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReset();
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 2,
      mb: 3,
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      {/* Company Selector */}
      <Autocomplete
        options={companies}
        getOptionLabel={(option) => option.name}
        value={selectedCompany}
        onChange={(_, newValue) => onCompanyChange(newValue)}
        sx={{ minWidth: 250 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Entreprise"
            variant="outlined"
            size="small"
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

      {/* Search */}
      <TextField
        label="Rechercher"
        placeholder="Nom, adresse, référence..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ minWidth: 300 }}
      />

      {/* Include Deleted */}
      <FormControlLabel
        control={
          <Switch
            checked={includeDeleted}
            onChange={(e) => onIncludeDeletedChange(e.target.checked)}
            size="small"
          />
        }
        label="Inclure supprimés"
      />

      {/* Reset Button */}
      <IconButton
        onClick={handleReset}
        size="small"
        sx={{
          bgcolor: 'grey.100',
          '&:hover': { bgcolor: 'grey.200' }
        }}
        title="Réinitialiser les filtres"
      >
        <ClearIcon />
      </IconButton>

      {/* Active Filters Display */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {selectedCompany && (
          <Chip
            label={`Entreprise: ${selectedCompany.name}`}
            onDelete={() => onCompanyChange(null)}
            size="small"
            variant="outlined"
          />
        )}
        {search && (
          <Chip
            label={`Recherche: "${search}"`}
            onDelete={() => onSearchChange('')}
            size="small"
            variant="outlined"
          />
        )}
        {includeDeleted && (
          <Chip
            label="Inclure supprimés"
            onDelete={() => onIncludeDeletedChange(false)}
            size="small"
            variant="outlined"
          />
        )}
      </Box>
    </Box>
  );
};

export default SiteFilters; 