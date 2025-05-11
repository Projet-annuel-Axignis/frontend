import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Axignis - Base technique de références",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}