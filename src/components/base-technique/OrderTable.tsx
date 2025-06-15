import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  display: 'none',
  width: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  flexShrink: 1,
  overflow: 'hidden',
  minHeight: 0,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    background: `linear-gradient(135deg, var(--color-axignis-primary)10, var(--color-axignis-secondary)10)`,
    '& .MuiTableCell-root': {
      fontWeight: 600,
      color: 'var(--color-axignis-dark)',
      borderBottom: `2px solid var(--color-axignis-primary)`,
    },
  },
  '& .MuiTableRow-root': {
    transition: 'var(--transition-normal)',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      cursor: 'pointer',
      transform: 'translateX(4px)',
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  '& .MuiTableCell-root': {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const StyledSearchFilters = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, var(--color-axignis-primary)05, var(--color-axignis-secondary)05)`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
}));

const rows = [
  {
    id: 'JOD-1234',
    marque: 'Legrand',
    status: 'En stock',
    type: 'Déclencheur',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'CAB-1233',
    marque: 'Schneider',
    status: 'En stock',
    type: 'Câble',
    associativity: 'Électricité'
  },
  {
    id: 'DET-1232',
    marque: 'Siemens',
    status: 'Stock faible',
    type: 'Détecteur',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'CEN-1231',
    marque: 'Honeywell',
    status: 'En stock',
    type: 'Centrale',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'VOL-1230',
    marque: 'Legrand',
    status: 'Rupture',
    type: 'Volet',
    associativity: 'Protection'
  },
  {
    id: 'SIR-1229',
    marque: 'Bosch',
    status: 'Rupture',
    type: 'Sirène',
    associativity: 'Alarme'
  },
  {
    id: 'BAL-1228',
    marque: 'Philips',
    status: 'En stock',
    type: 'Balise',
    associativity: 'Éclairage'
  },
  {
    id: 'MOD-1227',
    marque: 'ABB',
    status: 'En stock',
    type: 'Module',
    associativity: 'Interface'
  },
  {
    id: 'CAP-1226',
    marque: 'Schneider',
    status: 'Rupture',
    type: 'Capteur',
    associativity: 'Détection'
  },
  {
    id: 'REL-1225',
    marque: 'Omron',
    status: 'En stock',
    type: 'Relais',
    associativity: 'Commande'
  },
];

function handleRowClick(id: string) {
  location.href = `/base-technique/produits/${id}`;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-controls={open ? 'row-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{
          transition: 'var(--transition-normal)',
          '&:hover': {
            backgroundColor: 'var(--color-axignis-primary)',
            color: 'white',
          },
        }}
      >
        <MoreHorizRoundedIcon />
      </IconButton>
      <Menu
        id="row-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Éditer</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Renommer</MenuItem>
        <MenuItem onClick={handleClose} sx={{ fontWeight: 500 }}>Déplacer</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ color: 'error.main', fontWeight: 500 }}>
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
}

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);

  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Statut</InputLabel>
        <Select
          size="small"
          label="Statut"
          defaultValue=""
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="en-stock">En stock</MenuItem>
          <MenuItem value="stock-faible">Stock faible</MenuItem>
          <MenuItem value="rupture">Rupture</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Marque</InputLabel>
        <Select
          size="small"
          label="Marque"
          defaultValue=""
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="tout">Toutes</MenuItem>
          <MenuItem value="legrand">Legrand</MenuItem>
          <MenuItem value="schneider">Schneider</MenuItem>
          <MenuItem value="siemens">Siemens</MenuItem>
          <MenuItem value="honeywell">Honeywell</MenuItem>
          <MenuItem value="bosch">Bosch</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ fontWeight: 500 }}>Type</InputLabel>
        <Select
          size="small"
          label="Type"
          defaultValue=""
          sx={{
            borderRadius: 2,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-primary)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--color-axignis-secondary)',
            },
          }}
        >
          <MenuItem value="tout">Tous</MenuItem>
          <MenuItem value="declencheur">Déclencheur</MenuItem>
          <MenuItem value="detecteur">Détecteur</MenuItem>
          <MenuItem value="centrale">Centrale</MenuItem>
          <MenuItem value="cable">Câble</MenuItem>
          <MenuItem value="sirene">Sirène</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En stock':
        return 'success';
      case 'Stock faible':
        return 'warning';
      case 'Rupture':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'En stock':
        return <CheckRoundedIcon />;
      case 'Stock faible':
        return <AutorenewRoundedIcon />;
      case 'Rupture':
        return <BlockIcon />;
      default:
        return undefined;
    }
  };

  return (
    <React.Fragment>
      {/* Mobile Search and Filters */}
      <Paper
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
          p: 2,
          elevation: 0,
          border: '1px solid',
          borderColor: 'var(--color-axignis-primary)',
          borderRadius: 2,
          background: `linear-gradient(135deg, var(--color-axignis-primary)05, var(--color-axignis-secondary)05)`,
        }}
      >
        <TextField
          size="small"
          placeholder="Rechercher un produit..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--color-axignis-primary)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{
            border: '1px solid',
            borderColor: 'var(--color-axignis-primary)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          <FilterAltIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullScreen
        >
          <DialogTitle sx={{ fontWeight: 600, color: 'var(--color-axignis-dark)' }}>
            Filtres
            <IconButton
              aria-label="close"
              onClick={() => setOpen(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              {renderFilters()}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(false)}
                sx={{
                  background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Appliquer les filtres
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>

      {/* Desktop Search and Filters */}
      <StyledSearchFilters
        className="SearchAndFilters-tabletUp"
        sx={{
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <TextField
          label="Rechercher un produit"
          size="small"
          placeholder="Nom, référence, marque..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'var(--color-axignis-primary)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
            },
            '& .MuiInputLabel-root': {
              fontWeight: 500,
            },
          }}
        />
        {renderFilters()}
      </StyledSearchFilters>

      {/* Table */}
      <StyledTableContainer>
        <StyledTable aria-labelledby="tableTitle" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ width: 48 }}>
                <Checkbox
                  size="small"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  sx={{
                    color: 'var(--color-axignis-primary)',
                    '&.Mui-checked': {
                      color: 'var(--color-axignis-primary)',
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: 140 }}>
                <Link
                  underline="none"
                  color="inherit"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  sx={{
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--color-axignis-dark)',
                    transition: 'var(--transition-normal)',
                    '&:hover': {
                      color: 'var(--color-axignis-primary)',
                    },
                    '& svg': {
                      transition: 'var(--transition-normal)',
                      transform: order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  Référence
                  <ArrowDropDownIcon />
                </Link>
              </TableCell>
              <TableCell sx={{ width: 140 }}>Marque</TableCell>
              <TableCell sx={{ width: 140 }}>Statut</TableCell>
              <TableCell sx={{ width: 160 }}>Type</TableCell>
              <TableCell sx={{ width: 200 }}>Catégorie</TableCell>
              <TableCell sx={{ width: 140 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...rows].sort(getComparator(order, 'id')).map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                sx={{ cursor: 'pointer' }}
                hover
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={selected.includes(row.id)}
                    onChange={(event) => {
                      event.stopPropagation();
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    sx={{
                      color: 'var(--color-axignis-primary)',
                      '&.Mui-checked': {
                        color: 'var(--color-axignis-primary)',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600" color="var(--color-axignis-primary)">
                    {row.id}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    {row.marque}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="filled"
                    size="small"
                    icon={getStatusIcon(row.status)}
                    color={getStatusColor(row.status) as any}
                    label={row.status}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    variant="outlined"
                    size="small"
                    color="primary"
                    label={row.type}
                    sx={{
                      fontWeight: 500,
                      borderColor: 'var(--color-axignis-primary)',
                      color: 'var(--color-axignis-primary)',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {row.associativity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: 'var(--color-axignis-primary)',
                        transition: 'var(--transition-normal)',
                        '&:hover': {
                          backgroundColor: 'var(--color-axignis-primary)',
                          color: 'white',
                        },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <RowMenu />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Pagination */}
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 3,
          gap: 1,
          display: {
            xs: 'none',
            md: 'flex',
          },
          alignItems: 'center',
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
          sx={{
            borderColor: 'var(--color-axignis-primary)',
            color: 'var(--color-axignis-primary)',
            fontWeight: 500,
            borderRadius: 2,
            '&:hover': {
              borderColor: 'var(--color-axignis-secondary)',
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          Précédent
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="small"
            sx={{
              border: Number(page) ? '1px solid' : 'none',
              borderColor: 'var(--color-axignis-primary)',
              borderRadius: 2,
              color: 'var(--color-axignis-primary)',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'var(--color-axignis-primary)',
                color: 'white',
              },
            }}
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          variant="outlined"
          endIcon={<KeyboardArrowRightIcon />}
          sx={{
            borderColor: 'var(--color-axignis-primary)',
            color: 'var(--color-axignis-primary)',
            fontWeight: 500,
            borderRadius: 2,
            '&:hover': {
              borderColor: 'var(--color-axignis-secondary)',
              backgroundColor: 'var(--color-axignis-primary)',
              color: 'white',
            },
          }}
        >
          Suivant
        </Button>
      </Box>
    </React.Fragment>
  );
}