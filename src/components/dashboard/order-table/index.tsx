"use client"

import Pagination from '@/components/ui/Pagination';
import Box from '@mui/material/Box';
import * as React from 'react';
import { products } from './data';
import ProductCard from './ProductCard';
import ProductTable from './ProductTable';
import SearchFilters from './SearchFilters';
import { FilterValues, Order, Product } from './types';
import { filterProducts, getComparator } from './utils';

const DEFAULT_ITEMS_PER_PAGE = 5;

export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Product>('id');
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE);
  const [filters, setFilters] = React.useState<FilterValues>({
    search: '',
    status: '',
    marque: '',
    type: '',
  });

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Product,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(1); // Reset to first page when sorting
  };

  const handleFiltersChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  // Filter and sort products
  const filteredProducts = filterProducts(products, filters);
  const sortedProducts = React.useMemo(
    () => filteredProducts.slice().sort(getComparator(order, orderBy)),
    [filteredProducts, order, orderBy],
  );

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Box>
      {/* Search and Filters */}
      <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Desktop Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <ProductTable
          products={paginatedProducts}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
      </Box>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={sortedProducts.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </Box>
  );
} 