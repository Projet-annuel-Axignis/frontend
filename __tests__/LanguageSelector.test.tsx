import LanguageSelector from '@/components/LanguageSelector';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock pour i18next
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'language_selector.french': 'Français',
        'language_selector.english': 'Anglais',
        'language_selector.select_language': 'Sélectionner la langue'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('Composant LanguageSelector', () => {
  beforeEach(() => {
    render(<LanguageSelector />);
  });

  test('affiche le bouton de sélection de langue avec le drapeau', () => {
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Vérification que le texte "Français" est présent
    const frenchText = screen.getAllByText('Français')[0]; // On prend le premier élément
    expect(frenchText).toBeInTheDocument();

    // Vérification que le drapeau est affiché (contenu dans un span)
    const flagSpan = button.querySelector('.text-xl');
    expect(flagSpan).toHaveTextContent('🇫🇷');
  });

  test('ouvre le menu déroulant lorsqu\'on clique sur le bouton', () => {
    // Au départ, il n'y a pas de menu déroulant visible ou il est caché
    const menuInitial = screen.queryByRole('button', { name: /anglais/i });
    expect(menuInitial).not.toBeInTheDocument();

    // Cliquer sur le bouton
    fireEvent.click(screen.getByRole('button'));

    // Vérifier que le menu est maintenant ouvert
    const englishOption = screen.getAllByText('Anglais')[0];
    expect(englishOption).toBeInTheDocument();
  });

  test('contient les options de langue française et anglaise', () => {
    // Ouvrir le menu
    fireEvent.click(screen.getByRole('button'));

    // Vérifier les options
    const options = screen.getAllByRole('button');

    // Le premier est le bouton principal, les autres sont les options
    expect(options.length).toBe(3); // Bouton principal + 2 langues

    // Vérifier les textes des options
    const frenchTexts = screen.getAllByText('Français');
    const englishTexts = screen.getAllByText('Anglais');

    expect(frenchTexts.length).toBeGreaterThan(0);
    expect(englishTexts.length).toBeGreaterThan(0);
  });
}); 