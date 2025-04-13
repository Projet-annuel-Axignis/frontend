import { render, screen } from '@testing-library/react';
import TestPage from '../app/test-page/page';

describe('TestPage', () => {
  it('devrait afficher le titre correct', () => {
    render(<TestPage />);

    const titleElement = screen.getByTestId('test-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe('Page de test');
  });

  it('devrait afficher la description correcte', () => {
    render(<TestPage />);

    const descriptionElement = screen.getByTestId('test-description');
    expect(descriptionElement).toBeInTheDocument();
    expect(descriptionElement.textContent).toBe('Ceci est une page simple pour les tests');
  });
}); 