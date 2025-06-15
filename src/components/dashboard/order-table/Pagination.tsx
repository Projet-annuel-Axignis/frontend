import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';

const StyledPaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

const StyledPageButton = styled(Button)(({ theme }) => ({
  minWidth: 40,
  height: 40,
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  transition: 'var(--transition-normal)',
  '&.active': {
    background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
    color: 'white',
    '&:hover': {
      background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
      transform: 'translateY(-1px)',
    },
  },
  '&:not(.active)': {
    color: 'var(--color-axignis-primary)',
    borderColor: 'var(--color-axignis-primary)',
    '&:hover': {
      backgroundColor: 'var(--color-axignis-primary)10',
      borderColor: 'var(--color-axignis-secondary)',
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: 'var(--color-axignis-primary)',
  border: `1px solid var(--color-axignis-primary)`,
  borderRadius: theme.shape.borderRadius,
  transition: 'var(--transition-normal)',
  '&:hover': {
    backgroundColor: 'var(--color-axignis-primary)',
    color: 'white',
    transform: 'translateY(-1px)',
  },
  '&:disabled': {
    color: theme.palette.text.disabled,
    borderColor: theme.palette.text.disabled,
    '&:hover': {
      backgroundColor: 'transparent',
      transform: 'none',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 80,
  height: 36,
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-axignis-primary)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--color-axignis-secondary)',
  },
  '& .MuiSelect-select': {
    padding: theme.spacing(1, 1.5),
    fontWeight: 500,
    color: 'var(--color-axignis-primary)',
  },
}));

const itemsPerPageOptions = [5, 10, 20, 50, 100];

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  return (
    <StyledPaginationContainer>
      {/* Info sur les éléments et sélecteur */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
          Affichage de {startItem} à {endItem} sur {totalItems} éléments
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Éléments par page :
          </Typography>
          <FormControl size="small">
            <StyledSelect
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              size="small"
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </Box>
      </Box>

      {/* Contrôles de pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Première page */}
          <StyledIconButton
            size="small"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Première page"
          >
            <FirstPageIcon fontSize="small" />
          </StyledIconButton>

          {/* Page précédente */}
          <StyledIconButton
            size="small"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            <ChevronLeftIcon fontSize="small" />
          </StyledIconButton>

          {/* Numéros de pages */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <Typography variant="body2" sx={{ px: 1, color: 'text.secondary' }}>
                    ...
                  </Typography>
                ) : (
                  <StyledPageButton
                    size="small"
                    variant="outlined"
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => onPageChange(page as number)}
                  >
                    {page}
                  </StyledPageButton>
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Indicateur mobile */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center', px: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--color-axignis-primary)' }}>
              {currentPage} / {totalPages}
            </Typography>
          </Box>

          {/* Page suivante */}
          <StyledIconButton
            size="small"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            <ChevronRightIcon fontSize="small" />
          </StyledIconButton>

          {/* Dernière page */}
          <StyledIconButton
            size="small"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Dernière page"
          >
            <LastPageIcon fontSize="small" />
          </StyledIconButton>
        </Box>
      )}
    </StyledPaginationContainer>
  );
} 