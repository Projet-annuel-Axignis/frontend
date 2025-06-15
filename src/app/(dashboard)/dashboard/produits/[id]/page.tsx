import ProductsDetails from '@/components/dashboard/ProductDetails';

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
    <>
      <ProductsDetails id={id} />
    </>
  );
}
