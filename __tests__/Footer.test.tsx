import Footer from '@/components/Footer';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock des composants externes
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string, alt: string }) => (
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
    const linksTitle = screen.getByText('Liens Rapides');
    expect(linksTitle).toBeInTheDocument();

    // Liens
    expect(screen.getByText('Notre Mission')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Mentions Légales')).toBeInTheDocument();
  });

  test('affiche la section Contact avec les informations de contact', () => {
    // Titre de la section
    const contactTitle = screen.getByText('Contact');
    expect(contactTitle).toBeInTheDocument();

    // Informations de contact
    expect(screen.getByText(/123 Avenue de la République/)).toBeInTheDocument();
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