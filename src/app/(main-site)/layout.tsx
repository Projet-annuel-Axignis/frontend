import Footer from '@/components/Footer';
import FooterIndicator from '@/components/FooterIndicator';
import Header from '@/components/Header';
import ThemeRegistry from './ThemeRegistry';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeRegistry options={{ key: 'joy' }}>
        <Header />
        {children}
        <FooterIndicator />
        <Footer />
      </ThemeRegistry>
    </>
  );
}