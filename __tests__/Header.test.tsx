import Header from '@/components/Header';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock pour i18next
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'footer.mission': 'Notre Mission',
        'footer.services': 'Services',
        'footer.contact': 'Contact',
        'language_selector.french': 'Français',
        'language_selector.english': 'Anglais'
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
  default: ({ src, alt, fill, className }: { src: string, alt: string, fill?: boolean, className?: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      data-fill={fill ? 'true' : 'false'}
      className={className}
      data-testid={`image-${alt.toLowerCase().replace(/\s+/g, '-')}`}
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock du composant LanguageSelector
jest.mock('@/components/LanguageSelector', () => ({
  __esModule: true,
  default: () => <div data-testid="language-selector">Sélecteur de langue</div>,
}));

describe('Composant Header', () => {
  beforeEach(() => {
    // Mock l'API du navigateur pour window.scrollY
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    render(<Header />);
  });

  test('affiche le logo Axignis', () => {
    const logoElements = screen.getAllByAltText(/axignis logo/i);
    expect(logoElements.length).toBeGreaterThan(0);
  });

  test('affiche les liens de navigation pour desktop', () => {
    // Liens de navigation
    expect(screen.getByText('Notre Mission')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('affiche le sélecteur de langue', () => {
    // Il y a deux sélecteurs de langue (desktop et mobile)
    const languageSelectors = screen.getAllByTestId('language-selector');
    expect(languageSelectors.length).toBe(2);
  });

  test('affiche le bouton du menu mobile', () => {
    // Bouton du menu hamburger (mobile)
    const menuButtons = screen.getAllByRole('button');
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  test('ouvre le menu mobile lorsqu\'on clique sur le bouton hamburger', () => {
    // Trouver le bouton du menu hamburger (mobile)
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons[menuButtons.length - 1]; // Généralement le dernier bouton

    // Cliquer sur le bouton pour ouvrir le menu
    fireEvent.click(menuButton);

    // Vérifier que le menu mobile est maintenant ouvert
    // La div du menu mobile devrait être présente après le clic
    const mobileMenuLinks = screen.getAllByText('Notre Mission');
    expect(mobileMenuLinks.length).toBeGreaterThan(1); // Il y a au moins deux "Notre Mission" (desktop + mobile)
  });
}); 