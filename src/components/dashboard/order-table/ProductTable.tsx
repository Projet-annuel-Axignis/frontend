import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { styled } from '@mui/material/styles';
import * as React from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { Order, Product } from './types';
import { getStatusColor, getStatusIcon, handleRowClick } from './utils';



const StyledTableHead = styled(TableHead)(() => ({
  background: `linear-gradient(135deg, var(--color-axignis-primary), var(--color-axignis-secondary))`,
  '& .MuiTableCell-head': {
    color: 'white',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderBottom: 'none',
    '& .MuiTableSortLabel-root': {
      color: 'white',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.8)',
      },
      '&.Mui-active': {
        color: 'white',
        '& .MuiTableSortLabel-icon': {
          color: 'white',
        },
      },
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'var(--transition-normal)',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: 'var(--color-axignis-primary)10',
    transform: 'translateY(-1px)',
    boxShadow: theme.shadows[2],
  },
}));

interface HeadCell {
  disablePadding: boolean;
  id: keyof Product;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'Référence',
  },
  {
    id: 'marque',
    numeric: false,
    disablePadding: false,
    label: 'Marque',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Statut',
  },
  {
    id: 'type',
    numeric: false,
    disablePadding: false,
    label: 'Type',
  },
  {
    id: 'associativity',
    numeric: false,
    disablePadding: false,
    label: 'Associativité',
  },
];

interface EnhancedTableHeadProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Product) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Product) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <StyledTableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ pl: headCell.disablePadding ? 3 : undefined }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{
                  border: 0,
                  clip: 'rect(0 0 0 0)',
                  height: 1,
                  margin: -1,
                  overflow: 'hidden',
                  padding: 0,
                  position: 'absolute',
                  top: 20,
                  width: 1,
                }}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell align="right" sx={{ pr: 3 }}>
          Actions
        </TableCell>
      </TableRow>
    </StyledTableHead>
  );
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

interface ProductTableProps {
  products: Product[];
  order: Order;
  orderBy: keyof Product;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Product) => void;
}

export default function ProductTable({ products, order, orderBy, onRequestSort }: ProductTableProps) {
  return (
    <Paper sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden', boxShadow: 1 }}>
      <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={onRequestSort}
        />
        <TableBody>
          {products.map((product) => {
            const StatusIcon = getStatusIcon(product.status);

            return (
              <StyledTableRow
                hover
                onClick={() => handleRowClick(product.id)}
                tabIndex={-1}
                key={product.id}
              >
                <TableCell
                  component="th"
                  scope="row"
                  padding="none"
                  sx={{
                    pl: 3,
                    fontWeight: 600,
                    color: 'var(--color-axignis-primary)',
                  }}
                >
                  {product.id}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {product.marque}
                </TableCell>
                <TableCell>
                  <Chip
                    variant="filled"
                    size="small"
                    icon={StatusIcon ? <StatusIcon /> : undefined}
                    color={getStatusColor(product.status) as any}
                    label={product.status}
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {product.type}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {product.associativity}
                </TableCell>
                <TableCell align="right" sx={{ pr: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
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
                    <Box onClick={(e) => e.stopPropagation()}>
                      <RowMenu />
                    </Box>
                  </Box>
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
} 