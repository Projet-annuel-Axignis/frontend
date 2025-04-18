import '@fontsource/inter';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { centuryGothic } from './fonts';
import "./globals.css";

const montserrat = Montserrat({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Axignis - Sécurité incendie et accessibilité des bâtiments",
  description: "Axignis accompagne les entreprises et établissements recevant du public dans la mise en conformité réglementaire : sécurité incendie et accessibilité.",
  keywords: "sécurité incendie, accessibilité, ERP, mise en conformité, SSI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${montserrat.variable} ${centuryGothic.variable}`}
      style={{
        scrollBehavior: 'smooth',
        colorScheme: 'light dark',
        '--font-centurygothic': 'var(--font-century-gothic)',
      } as React.CSSProperties}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
