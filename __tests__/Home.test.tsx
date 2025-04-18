import Home from '@/app/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ImageProps } from 'next/image';

// Mock des composants externes
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, fill, sizes, priority }: Partial<ImageProps>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src as string}
      alt={alt as string}
      className={className as string}
      data-testid={`image-${(alt as string)?.toLowerCase().replace(/\s+/g, '-')}`}
      data-fill={fill ? 'true' : 'false'}
      data-sizes={sizes}
      data-priority={priority ? 'true' : 'false'}
    />
  ),
}));

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-component">Footer mockée</footer>,
}));

interface ServiceCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  link?: string;
}

jest.mock('@/components/ServiceCard', () => ({
  __esModule: true,
  default: ({ title, description }: ServiceCardProps) => (
    <div data-testid={`service-card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  ),
}));

describe('Page d\'accueil', () => {
  beforeEach(() => {
    render(<Home />);
  });

  test('affiche l\'en-tête avec le logo et les boutons d\'action', () => {
    // Vérification du logo
    const logo = screen.getByTestId('image-logo-axignis');
    expect(logo).toBeInTheDocument();

    // Vérification des boutons CTA
    const servicesButton = screen.getByRole('link', { name: 'Nos Services' });
    expect(servicesButton).toBeInTheDocument();

    const contactButton = screen.getByText('Contactez-nous');
    expect(contactButton).toBeInTheDocument();

    // Vérification de la tagline
    expect(screen.getByText('Spécialiste en')).toBeInTheDocument();
    expect(screen.getByText('sécurité incendie')).toBeInTheDocument();
    expect(screen.getByText('accessibilité des bâtiments')).toBeInTheDocument();
  });

  test('affiche la section Notre Mission avec le titre et l\'image', () => {
    // Titre de section
    const missionTitle = screen.getByText('Notre Mission');
    expect(missionTitle).toBeInTheDocument();

    // Image de la mission
    const missionImage = screen.getByTestId('image-notre-mission---réunion-d\'équipe');
    expect(missionImage).toBeInTheDocument();

    // Contenu de la section
    const missionText = screen.getByText(/Axignis accompagne les entreprises et établissements/i);
    expect(missionText).toBeInTheDocument();
  });

  test('affiche la section Services avec les 3 cartes', () => {
    // Titre de section
    const servicesTitle = screen.getByText('Nos Services', { selector: 'h2' });
    expect(servicesTitle).toBeInTheDocument();

    // Cartes de services
    const registreCard = screen.getByTestId('service-card-registre-de-sécurité');
    expect(registreCard).toBeInTheDocument();

    const ssiCard = screen.getByTestId('service-card-coordination-ssi');
    expect(ssiCard).toBeInTheDocument();

    const baseTechniqueCard = screen.getByTestId('service-card-base-technique');
    expect(baseTechniqueCard).toBeInTheDocument();
  });

  test('affiche la section À propos du fondateur', () => {
    // Titre de section
    const founderTitle = screen.getByText('À propos du fondateur');
    expect(founderTitle).toBeInTheDocument();

    // Nom du fondateur
    const founderName = screen.getByText('Loïc Rome');
    expect(founderName).toBeInTheDocument();

    // Image du fondateur
    const founderImage = screen.getByTestId('image-loïc-rome');
    expect(founderImage).toBeInTheDocument();

    // Lien LinkedIn
    const linkedinLink = screen.getByText('Voir le profil LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
  });

  test('affiche la section Contact/CTA', () => {
    // Titre de section
    const contactTitle = screen.getByText('Prêt à sécuriser votre établissement?');
    expect(contactTitle).toBeInTheDocument();

    // Boutons de contact
    const emailButton = screen.getByText('Nous contacter');
    expect(emailButton).toBeInTheDocument();

    const phoneButton = screen.getByText('+33 6 12 34 56 78');
    expect(phoneButton).toBeInTheDocument();
  });

  test('inclut le composant Footer', () => {
    const footer = screen.getByTestId('footer-component');
    expect(footer).toBeInTheDocument();
  });
}); 