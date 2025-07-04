import {
  Clear as ClearIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import {
  Box,
  Card,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React from 'react';

interface FilterOption {
  value: string | number;
  label: string;
}

interface SearchFiltersProps {
  // Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Select filter
  selectValue: string | number;
  onSelectChange: (value: string | number) => void;
  selectLabel: string;
  selectOptions: FilterOption[];
  selectAllLabel?: string;

  // Include deleted toggle
  includeDeleted: boolean;
  onIncludeDeletedChange: (value: boolean) => void;
  includeDeletedLabel?: string;

  // Results count
  resultsCount: number;
  resultsLabel: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  selectValue,
  onSelectChange,
  selectLabel,
  selectOptions,
  selectAllLabel = "Tous",
  includeDeleted,
  onIncludeDeletedChange,
  includeDeletedLabel = "Inclure supprimés",
  resultsCount,
  resultsLabel
}) => {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <Card sx={{ p: 2, mb: 3 }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
        '& > *': { minWidth: { xs: '100%', sm: 'auto' } }
      }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: { xs: '1 1 100%', sm: '1 1 300px' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 200 } }}>
          <InputLabel>{selectLabel}</InputLabel>
          <Select
            value={selectValue}
            onChange={(e) => onSelectChange(e.target.value)}
            label={selectLabel}
          >
            <MenuItem value="">{selectAllLabel}</MenuItem>
            {selectOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={includeDeleted}
              onChange={(e) => onIncludeDeletedChange(e.target.checked)}
              size="small"
            />
          }
          label={includeDeletedLabel}
        />

        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {resultsCount} {resultsLabel}
        </Typography>
      </Box>
    </Card>
  );
};

export default SearchFilters; 