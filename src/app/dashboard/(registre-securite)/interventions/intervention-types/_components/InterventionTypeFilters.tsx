import { Clear as ClearIcon, FilterList as FilterListIcon, Search as SearchIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

interface InterventionTypeFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  isActive: boolean | undefined;
  onIsActiveChange: (isActive: boolean | undefined) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: string;
  onSortOrderChange: (sortOrder: string) => void;
  onReset: () => void;
}

const InterventionTypeFilters: React.FC<InterventionTypeFiltersProps> = ({
  search,
  onSearchChange,
  isActive,
  onIsActiveChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
}) => {
  const hasActiveFilters = search || isActive !== undefined;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Titre des filtres */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <FilterListIcon color="primary" />
        <Typography variant="h6" component="h3">
          Filtres
        </Typography>
        {hasActiveFilters && (
          <Chip
            label="Filtres actifs"
            color="primary"
            size="small"
            variant="outlined"
          />
        )}
      </Box>

      {/* Ligne de filtres */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {/* Recherche */}
        <TextField
          placeholder="Rechercher par code, nom ou description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{ minWidth: 300, flex: 1 }}
          size="small"
        />

        {/* Statut */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Statut</InputLabel>
          <Select
            value={isActive === undefined ? '' : isActive.toString()}
            onChange={(e) => onIsActiveChange(e.target.value === '' ? undefined : e.target.value === 'true')}
            label="Statut"
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="true">Actif</MenuItem>
            <MenuItem value="false">Inactif</MenuItem>
          </Select>
        </FormControl>

        {/* Tri par */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            label="Trier par"
          >
            <MenuItem value="name">Nom</MenuItem>
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="createdAt">Date de création</MenuItem>
            <MenuItem value="updatedAt">Dernière mise à jour</MenuItem>
          </Select>
        </FormControl>

        {/* Ordre de tri */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Ordre</InputLabel>
          <Select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value)}
            label="Ordre"
          >
            <MenuItem value="asc">Croissant</MenuItem>
            <MenuItem value="desc">Décroissant</MenuItem>
          </Select>
        </FormControl>

        {/* Bouton de reset */}
        {hasActiveFilters && (
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onReset}
            size="small"
          >
            Effacer
          </Button>
        )}
      </Box>

      {/* Résumé des filtres actifs */}
      {hasActiveFilters && (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {search && (
            <Chip
              label={`Recherche: "${search}"`}
              size="small"
              onDelete={() => onSearchChange('')}
              color="primary"
              variant="outlined"
            />
          )}
          {isActive !== undefined && (
            <Chip
              label={`Statut: ${isActive ? 'Actif' : 'Inactif'}`}
              size="small"
              onDelete={() => onIsActiveChange(undefined)}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default InterventionTypeFilters; 