import Header from '@/components/Header';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import ProductsDetails from '@/components/base-technique/ProductDetails';
import React from 'react';

export async function generateStaticParams() {
  return [
    { id: 'INV-1234' },
    { id: 'INV-5678' },
  ];
}

export default async function TechnicalBaseDetail({ params }: { params: Promise<{ id: string }> }) {
  // Await the params promise to get the actual id value
  // This is necessary because params is a Promise in this context

  const { id } = await params;

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Header />
      <ProductsDetails id={id} />
    </CssVarsProvider>
  );
}
