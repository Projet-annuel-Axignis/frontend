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
  FormControl,
  FormControlLabel,
  Grid,
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

const statusLabels = {
  PLANNED: 'Planifiée',
  IN_PROGRESS: 'En cours',
  TERMINATED: 'Terminée'
};

const periodicityLabels = {
  MONTHLY: 'Mensuel',
  QUARTER: 'Trimestriel',
  SEMESTER: 'Semestriel',
  ANNUAL: 'Annuel'
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
    // Fermer les filtres avancés après réinitialisation
    setShowAdvanced(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search.trim()) count++;
    if (status) count++;
    if (periodicity) count++;
    if (includeDeleted === true) count++;
    return count;
  };

  const hasActiveFilters = () => {
    return search.trim() !== '' || status !== '' || periodicity !== '' || includeDeleted !== false;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Recherche */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par libellé, entreprise, employé..."
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
            {/* Filtre par statut */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
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
            </Grid>

            {/* Filtre par périodicité */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
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

export default InterventionFilters; 