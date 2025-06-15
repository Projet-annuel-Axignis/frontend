import Footer from '@/components/Footer';
import FooterIndicator from '@/components/FooterIndicator';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <FooterIndicator />
      <Footer />
    </>
  );
}