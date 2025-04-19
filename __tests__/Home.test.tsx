import Home from '@/app/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ImageProps } from 'next/image';

// Mock pour i18next
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'learn_more': 'En savoir plus',
        'homepage.hero.specialist': 'Spécialiste en',
        'homepage.hero.fire_safety': 'sécurité incendie',
        'homepage.hero.and': 'et',
        'homepage.hero.building_accessibility': 'accessibilité des bâtiments',
        'homepage.cta.our_services': 'Nos Services',
        'homepage.cta.contact_us': 'Contactez-nous',
        'homepage.mission.title': 'Notre Mission',
        'homepage.mission.description1': 'Axignis accompagne les entreprises et établissements recevant du public (ERP) dans la mise en conformité réglementaire concernant la sécurité incendie et l\'accessibilité aux personnes en situation de handicap.',
        'homepage.mission.description2': 'Grâce à une expertise reconnue, Axignis propose un accompagnement complet, de la conception à la réception finale des projets.',
        'homepage.mission.image_alt': 'Notre mission - Réunion d\'équipe',
        'homepage.services.title': 'Nos Services',
        'homepage.services.items.0.title': 'Registre de Sécurité',
        'homepage.services.items.0.description': 'Gestion digitale et automatisée des registres obligatoires avec alertes et suivis intégrés pour une conformité permanente.',
        'homepage.services.items.1.title': 'Coordination SSI',
        'homepage.services.items.1.description': 'Accompagnement expert dans toutes les phases : conception, réalisation et réception du Système de Sécurité Incendie.',
        'homepage.services.items.2.title': 'Base Technique',
        'homepage.services.items.2.description': 'Centralisation sécurisée des informations techniques, notices d\'utilisation et certificats des équipements de sécurité.',
        'homepage.founder.title': 'À propos du fondateur',
        'homepage.founder.name': 'Loïc Rome',
        'homepage.founder.description': 'Fondateur et expert en sécurité incendie et accessibilité, Loïc Rome accompagne depuis 2017 les entreprises dans leurs démarches réglementaires avec passion et expertise.',
        'homepage.founder.linkedin': 'Voir le profil LinkedIn',
        'homepage.contact.title': 'Prêt à sécuriser votre établissement?',
        'homepage.contact.subtitle': 'Contactez-nous dès aujourd\'hui pour une consultation gratuite et sans engagement.',
        'homepage.contact.contact_button': 'Nous contacter',
        'homepage.contact.phone': '+33 6 12 34 56 78',
        'footer.mission': 'Notre Mission',
        'footer.services': 'Services',
        'footer.contact': 'Contact'
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn(),
    },
    ready: true
  }),
}));

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

jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header-component">Header mockée</header>,
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

  test('inclut le composant Header', () => {
    const header = screen.getByTestId('header-component');
    expect(header).toBeInTheDocument();
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