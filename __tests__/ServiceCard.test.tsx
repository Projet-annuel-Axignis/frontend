import ServiceCard from '@/components/ServiceCard';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock pour i18next
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => {
      if (key === 'learn_more') {
        return 'En savoir plus';
      }
      return fallback || key;
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

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe('Composant ServiceCard', () => {
  const mockProps = {
    title: 'Service Test',
    description: 'Description du service test',
    imageSrc: '/test-image.jpg',
    link: '/service-test'
  };

  test('rend correctement le titre et la description', () => {
    render(<ServiceCard {...mockProps} />);

    // Vérification du titre
    expect(screen.getByText('Service Test')).toBeInTheDocument();

    // Vérification de la description
    expect(screen.getByText('Description du service test')).toBeInTheDocument();
  });

  test('rend correctement l\'image avec les attributs appropriés', () => {
    render(<ServiceCard {...mockProps} />);

    const image = screen.getByTestId('image-service-test');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  test('rend correctement le lien "En savoir plus"', () => {
    render(<ServiceCard {...mockProps} />);

    const link = screen.getByText('En savoir plus');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/service-test');
  });

  test('gère correctement le cas où le lien est vide', () => {
    const propsWithEmptyLink = { ...mockProps, link: '' };
    render(<ServiceCard {...propsWithEmptyLink} />);

    const link = screen.getByText('En savoir plus');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '');
  });
}); 