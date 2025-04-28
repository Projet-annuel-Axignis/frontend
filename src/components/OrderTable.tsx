/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

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
  location.href = `/technical-base/products/${id}`;
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
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Éditer</MenuItem>
        <MenuItem>Renommer</MenuItem>
        <MenuItem>Déplacer</MenuItem>
        <Divider />
        <MenuItem color="danger">Supprimer</MenuItem>
      </Menu>
    </Dropdown>
  );
}
export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Statut</FormLabel>
        <Select
          size="sm"
          placeholder="Filtré par statut"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="paid">Payé</Option>
          <Option value="pending">En attente</Option>
          <Option value="refunded">Remboursé</Option>
          <Option value="cancelled">Annulé</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Marque</FormLabel>
        <Select size="sm" placeholder="Tout">
          <Option value="tout">Tout</Option>
          <Option value="marque1">Marque 1</Option>
          <Option value="marque2">Marque 2</Option>
          <Option value="marque3">Marque 3</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Type</FormLabel>
        <Select size="sm" placeholder="Tout">
          <Option value="tout">Tout</Option>
          <Option value="type1">Type 1</Option>
          <Option value="type2">Type 2</Option>
          <Option value="type3">Type 3</Option>
          <Option value="type4">Type 4</Option>
          <Option value="type5">Type 5</Option>
          <Option value="type6">Type 6</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Recherche"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Rechercher un produit</FormLabel>
          <Input size="sm" placeholder="Recherche" startDecorator={<SearchIcon />} />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
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
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: 'lg',
                      '& svg': {
                        transition: '0.2s',
                        transform:
                          order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                      },
                    },
                    order === 'desc'
                      ? { '& svg': { transform: 'rotate(0deg)' } }
                      : { '& svg': { transform: 'rotate(180deg)' } },
                  ]}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Marque</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Type</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Associativité</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          <tbody>
            {[...rows].sort(getComparator(order, 'id')).map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row.id)} style={{ cursor: 'pointer' }}>
                <td style={{ textAlign: 'center', width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? 'primary' : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.marque}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Payé: <CheckRoundedIcon />,
                        Remboursé: <AutorenewRoundedIcon />,
                        Annulé: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Payé: 'success',
                        Remboursé: 'neutral',
                        Annulé: 'danger',
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    color={
                      'neutral' as ColorPaletteProp
                    }
                  >
                    {row.type}
                  </Chip>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Projets: <CheckRoundedIcon />,
                      }[row.associativity]
                    }
                    color={
                      'neutral' as ColorPaletteProp
                    }
                  >
                    {row.associativity}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button">
                      Télécharger
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
        >
          Précédent
        </Button>

        <Box sx={{ flex: 1 }} />
        {['1', '2', '3', '…', '8', '9', '10'].map((page) => (
          <IconButton
            key={page}
            size="sm"
            variant={Number(page) ? 'outlined' : 'plain'}
            color="neutral"
          >
            {page}
          </IconButton>
        ))}
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
        >
          Suivant
        </Button>
      </Box>
    </React.Fragment>
  );
}