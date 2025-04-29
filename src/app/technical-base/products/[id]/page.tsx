import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import ProductsDetails from '@/components/technical-base/ProductDetails';
import React from 'react';

interface Props {
  params: { id: string };
}

export async function generateStaticParams() {
  return [
    { id: 'INV-1234' },
    { id: 'INV-5678' },
  ];
}

export default async function TechnicalBaseDetail({ params }: Props) {
  const { id } = params;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header />
      <ProductsDetails id={id} />
    </CssVarsProvider>
  );
}
