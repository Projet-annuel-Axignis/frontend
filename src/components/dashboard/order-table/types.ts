export interface Product {
  id: string;
  marque: string;
  status: 'En stock' | 'Stock faible' | 'Rupture';
  type: string;
  associativity: string;
}

export type Order = 'asc' | 'desc';

export interface FilterValues {
  status: string;
  marque: string;
  type: string;
  search: string;
} 