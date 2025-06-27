'use client';

import { UserRoleType } from '@/types/auth';
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
import { useState } from 'react';

interface UserFilters {
  search: string;
  role: string;
  includeDeleted: boolean;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export default function UserFiltersComponent({ filters, onFiltersChange }: UserFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (field: keyof UserFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleReset = () => {
    const newFilters = {
      search: '',
      role: '',
      includeDeleted: false,
    };

    onFiltersChange(newFilters);

    // Fermer les filtres avancés après réinitialisation
    setShowAdvanced(false);
  };

  const getRoleLabel = (roleType: UserRoleType) => {
    switch (roleType) {
      case UserRoleType.ADMINISTRATOR:
        return 'Administrateur';
      case UserRoleType.COMPANY_ADMINISTRATOR:
        return 'Admin Entreprise';
      case UserRoleType.COMPANY_MANAGER:
        return 'Manager';
      case UserRoleType.COMPANY_MEMBER:
        return 'Membre';
      case UserRoleType.VISITOR:
        return 'Visiteur';
      default:
        return roleType;
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search.trim()) count++;
    if (filters.role) count++;
    if (filters.includeDeleted === true) count++;
    return count;
  };

  const hasActiveFilters = () => {
    return filters.search.trim() !== '' || filters.role !== '' || filters.includeDeleted !== false;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Recherche */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par nom, prénom ou email..."
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
            {/* Filtre par rôle */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={filters.role}
                  label="Rôle"
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <MenuItem value="">Tous les rôles</MenuItem>
                  {Object.values(UserRoleType).map((roleType) => (
                    <MenuItem key={roleType} value={roleType}>
                      {getRoleLabel(roleType)}
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
                      checked={filters.includeDeleted}
                      onChange={(e) => handleFilterChange('includeDeleted', e.target.checked)}
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
} 