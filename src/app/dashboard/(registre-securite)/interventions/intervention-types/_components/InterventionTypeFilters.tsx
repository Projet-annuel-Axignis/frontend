'use client';

import {
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material';

interface InterventionTypeFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  onReset: () => void;
}

export default function InterventionTypeFilters({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset
}: InterventionTypeFiltersProps) {
  const hasActiveFilters = search || sortBy !== 'name' || sortOrder !== 'asc';

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (sortBy !== 'name') count++;
    if (sortOrder !== 'asc') count++;
    return count;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Filtres principaux */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Rechercher"
          variant="outlined"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Code ou nom du type d'intervention..."
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortBy}
            label="Trier par"
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <MenuItem value="name">Nom</MenuItem>
            <MenuItem value="code">Code</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Ordre</InputLabel>
          <Select
            value={sortOrder}
            label="Ordre"
            onChange={(e) => onSortOrderChange(e.target.value)}
          >
            <MenuItem value="asc">Croissant</MenuItem>
            <MenuItem value="desc">Décroissant</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onReset}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Réinitialiser
          </Button>
        )}
      </Stack>

      {/* Chips des filtres actifs */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <Chip
            icon={<FilterIcon />}
            label={`${getActiveFiltersCount()} filtre(s) actif(s)`}
            variant="outlined"
            size="small"
          />

          {search && (
            <Chip
              label={`Recherche: "${search}"`}
              onDelete={() => onSearchChange('')}
              size="small"
              color="primary"
            />
          )}

          {sortBy !== 'name' && (
            <Chip
              label={`Tri: ${sortBy === 'code' ? 'Code' : 'Nom'}`}
              onDelete={() => onSortByChange('name')}
              size="small"
              color="secondary"
            />
          )}

          {sortOrder !== 'asc' && (
            <Chip
              label="Ordre: Décroissant"
              onDelete={() => onSortOrderChange('asc')}
              size="small"
              color="secondary"
            />
          )}
        </Stack>
      )}
    </Box>
  );
} 