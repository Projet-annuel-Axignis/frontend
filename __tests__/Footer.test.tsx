import Footer from '@/components/Footer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock pour i18next
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'footer.description': 'Spécialiste en sécurité incendie et accessibilité des bâtiments. Notre expertise au service de votre sécurité.',
        'footer.quick_links': 'Liens Rapides',
        'footer.mission': 'Notre Mission',
        'footer.services': 'Services',
        'footer.contact': 'Contact',
        'footer.legal': 'Mentions Légales',
        'footer.address': '123 Avenue de la République, 75011 Paris, France',
        'footer.copyright': 'Tous droits réservés.',
        'homepage.contact.phone': '+33 6 12 34 56 78'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn(),
    },
  }),
}));

// Mock des composants externes
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-testid={`image-${alt.toLowerCase().replace(/\s+/g, '-')}`}
    />
  ),
}));

describe('Composant Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('affiche le logo Axignis', () => {
    const logo = screen.getByTestId('image-logo-axignis');
    expect(logo).toBeInTheDocument();
  });

  test('affiche la section Liens Rapides avec les liens appropriés', () => {
    // Titre de la section
    const linksTitle = screen.getByRole('heading', { name: 'Liens Rapides' });
    expect(linksTitle).toBeInTheDocument();

    // Liens
    expect(screen.getByRole('link', { name: 'Notre Mission' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mentions Légales' })).toBeInTheDocument();
  });

  test('affiche la section Contact avec les informations de contact', () => {
    // Titre de la section
    const contactTitle = screen.getByRole('heading', { name: 'Contact' });
    expect(contactTitle).toBeInTheDocument();

    // Informations de contact
    expect(screen.getByText('123 Avenue de la République, 75011 Paris, France')).toBeInTheDocument();
    expect(screen.getByText('+33 6 12 34 56 78')).toBeInTheDocument();
    expect(screen.getByText('contact@axignis.fr')).toBeInTheDocument();
  });

  test('affiche les icônes des réseaux sociaux', () => {
    // Recherche des liens de réseaux sociaux (ils contiennent des SVG)
    const socialLinks = screen.getAllByRole('link', { name: '' });

    // Vérification qu'il y a au moins 3 liens de réseaux sociaux
    expect(socialLinks.length).toBeGreaterThanOrEqual(3);
  });

  test('affiche le copyright avec l\'année actuelle', () => {
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`${currentYear} Axignis. Tous droits réservés.`, 'i'));
    expect(copyrightText).toBeInTheDocument();
  });
}); 