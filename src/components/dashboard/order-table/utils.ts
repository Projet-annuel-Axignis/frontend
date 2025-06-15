import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlockIcon from '@mui/icons-material/Block';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { Order, Product } from './types';

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
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

export const getStatusColor = (status: string) => {
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

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'En stock':
      return CheckRoundedIcon;
    case 'Stock faible':
      return AutorenewRoundedIcon;
    case 'Rupture':
      return BlockIcon;
    default:
      return undefined;
  }
};

export function handleRowClick(id: string) {
  location.href = `/dashboard/produits/${id}`;
}

export function filterProducts(products: Product[], filters: { search: string; status: string; marque: string; type: string }) {
  return products.filter(product => {
    const matchesSearch = !filters.search ||
      product.id.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.marque.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.type.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.associativity.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || filters.status === 'tout' || product.status === filters.status;
    const matchesMarque = !filters.marque || filters.marque === 'tout' || product.marque === filters.marque;
    const matchesType = !filters.type || filters.type === 'tout' || product.type === filters.type;

    return matchesSearch && matchesStatus && matchesMarque && matchesType;
  });
} 