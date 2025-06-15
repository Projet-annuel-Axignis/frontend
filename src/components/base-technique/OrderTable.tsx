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
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableContainer = styled(Paper)(({ theme }) => ({
  display: 'none',
  width: '100%',
  borderRadius: theme.shape.borderRadius,
  flexShrink: 1,
  overflow: 'auto',
  minHeight: 0,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.grey[50],
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      cursor: 'pointer',
    },
  },
  '& .MuiTableCell-root': {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const rows = [
  {
    id: 'INV-1234',
    marque: 'Marque',
    status: 'Remboursé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1233',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1232',
    marque: 'Marque',
    status: 'Remboursé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1231',
    marque: 'Marque',
    status: 'Remboursé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1230',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1229',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1228',
    marque: 'Marque',
    status: 'Remboursé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1227',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1226',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1225',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1224',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1223',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1221',
    marque: 'Marque',
    status: 'Remboursé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1220',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1219',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1218',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1217',
    marque: 'Marque',
    status: 'Payé',
    type: 'Type',
    associativity: 'Projets'
  },
  {
    id: 'INV-1216',
    marque: 'Marque',
    status: 'Annulé',
    type: 'Type',
    associativity: 'Projets'
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
      >
        <MenuItem onClick={handleClose}>Éditer</MenuItem>
        <MenuItem onClick={handleClose}>Renommer</MenuItem>
        <MenuItem onClick={handleClose}>Déplacer</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose} sx={{ color: 'error.main' }}>
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
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Statut</InputLabel>
        <Select
          size="small"
          label="Statut"
          defaultValue=""
        >
          <MenuItem value="paid">Payé</MenuItem>
          <MenuItem value="pending">En attente</MenuItem>
          <MenuItem value="refunded">Remboursé</MenuItem>
          <MenuItem value="cancelled">Annulé</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Marque</InputLabel>
        <Select size="small" label="Marque" defaultValue="">
          <MenuItem value="tout">Tout</MenuItem>
          <MenuItem value="marque1">Marque 1</MenuItem>
          <MenuItem value="marque2">Marque 2</MenuItem>
          <MenuItem value="marque3">Marque 3</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Type</InputLabel>
        <Select size="small" label="Type" defaultValue="">
          <MenuItem value="tout">Tout</MenuItem>
          <MenuItem value="type1">Type 1</MenuItem>
          <MenuItem value="type2">Type 2</MenuItem>
          <MenuItem value="type3">Type 3</MenuItem>
          <MenuItem value="type4">Type 4</MenuItem>
          <MenuItem value="type5">Type 5</MenuItem>
          <MenuItem value="type6">Type 6</MenuItem>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Paper
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 1,
          gap: 1,
          p: 2,
          elevation: 0,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <TextField
          size="small"
          placeholder="Recherche"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <FilterAltIcon />
        </IconButton>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullScreen
        >
          <DialogTitle>
            Filters
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
              >
                Submit
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </Paper>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 1,
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <TextField
          label="Rechercher un produit"
          size="small"
          placeholder="Recherche"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        {renderFilters()}
      </Box>
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
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : 'default'
                  }
                />
              </TableCell>
              <TableCell sx={{ width: 120 }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform: order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  ID
                  <ArrowDropDownIcon />
                </Link>
              </TableCell>
              <TableCell sx={{ width: 140 }}>Marque</TableCell>
              <TableCell sx={{ width: 140 }}>Status</TableCell>
              <TableCell sx={{ width: 240 }}>Type</TableCell>
              <TableCell sx={{ width: 240 }}>Associativité</TableCell>
              <TableCell sx={{ width: 140 }}> </TableCell>
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
                    color={selected.includes(row.id) ? 'primary' : 'default'}
                    onChange={(event) => {
                      event.stopPropagation();
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.id}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{row.marque}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    variant="filled"
                    size="small"
                    icon={
                      {
                        Payé: <CheckRoundedIcon />,
                        Remboursé: <AutorenewRoundedIcon />,
                        Annulé: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Payé: 'success',
                        Remboursé: 'default',
                        Annulé: 'error',
                      }[row.status] as 'success' | 'default' | 'error'
                    }
                    label={row.status}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    variant="filled"
                    size="small"
                    color="default"
                    label={row.type}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    variant="filled"
                    size="small"
                    icon={
                      {
                        Projets: <CheckRoundedIcon />,
                      }[row.associativity]
                    }
                    color="default"
                    label={row.associativity}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link
                      variant="body2"
                      component="button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Télécharger
                    </Link>
                    <RowMenu />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<KeyboardArrowLeftIcon />}
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
              borderColor: 'divider',
              borderRadius: '50%'
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
        >
          Suivant
        </Button>
      </Box>
    </React.Fragment>
  );
}