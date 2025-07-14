'use client';

import { InterventionStatus, Periodicity } from '@/types/intervention';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField
} from '@mui/material';
import React, { useState } from 'react';

interface InterventionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  periodicity: string;
  onPeriodicityChange: (value: string) => void;
  includeDeleted: boolean;
  onIncludeDeletedChange: (value: boolean) => void;
  onReset: () => void;
}

const statusLabels: Record<InterventionStatus, string> = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

const periodicityLabels: Record<Periodicity, string> = {
  DAILY: 'Quotidienne',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuelle',
  QUARTERLY: 'Trimestrielle',
  YEARLY: 'Annuelle'
};

const InterventionFilters: React.FC<InterventionFiltersProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  periodicity,
  onPeriodicityChange,
  includeDeleted,
  onIncludeDeletedChange,
  onReset,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (status) count++;
    if (periodicity) count++;
    if (includeDeleted) count++;
    return count;
  };

  const hasActiveFilters = () => {
    return search || status || periodicity || includeDeleted;
  };

  return (
    <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        {/* Barre de recherche */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Rechercher une intervention..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Boutons de contrôle */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Bouton Filtres avancés */}
          <Button
            size="small"
            variant={showAdvanced ? 'contained' : 'outlined'}
            startIcon={<FilterIcon />}
            onClick={() => setShowAdvanced(!showAdvanced)}
            color={showAdvanced ? 'primary' : 'inherit'}
          >
            Filtres
            {getActiveFiltersCount() > 0 && (
              <Chip
                size="small"
                label={getActiveFiltersCount()}
                sx={{
                  ml: 1,
                  minWidth: 20,
                  height: 20,
                  fontSize: '0.75rem',
                  backgroundColor: showAdvanced ? 'white' : 'primary.main',
                  color: showAdvanced ? 'primary.main' : 'white'
                }}
              />
            )}
          </Button>

          {/* Bouton Reset */}
          {hasActiveFilters() && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleReset}
              color="inherit"
            >
              Réinitialiser
            </Button>
          )}
        </Box>
      </Box>

      {/* Filtres avancés */}
      {showAdvanced && (
        <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Filtre par statut */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Statut</InputLabel>
              <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                label="Statut"
              >
                <MenuItem value="">Tous</MenuItem>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtre par périodicité */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Périodicité</InputLabel>
              <Select
                value={periodicity}
                onChange={(e) => onPeriodicityChange(e.target.value)}
                label="Périodicité"
              >
                <MenuItem value="">Toutes</MenuItem>
                {Object.entries(periodicityLabels).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Switch pour inclure supprimés */}
            <FormControlLabel
              control={
                <Switch
                  checked={includeDeleted}
                  onChange={(e) => onIncludeDeletedChange(e.target.checked)}
                  size="small"
                />
              }
              label="Inclure supprimées"
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default InterventionFilters; 