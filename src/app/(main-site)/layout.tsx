import Footer from '@/components/commons/Footer';
import FooterIndicator from '@/components/commons/FooterIndicator';
import Header from '@/components/commons/Header';

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