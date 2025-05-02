import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderList from '@/components/OrderList';

describe('OrderList', () => {
  it('affiche tous les clients de la liste', () => {
    render(<OrderList />);
    // Vérifie la présence de chaque nom de client
    expect(screen.getByText('Olivia Ryhe')).toBeInTheDocument();
    expect(screen.getByText('Steve Hampton')).toBeInTheDocument();
    expect(screen.getByText('Ciaran Murray')).toBeInTheDocument();
    expect(screen.getByText('Maria Macdonald')).toBeInTheDocument();
    expect(screen.getByText('Charles Fulton')).toBeInTheDocument();
    expect(screen.getByText('Jay Hooper')).toBeInTheDocument();
  });

  it('affiche les statuts avec les bons labels', () => {
    render(<OrderList />);
    expect(screen.getAllByText('Refunded').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Paid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
  });

  it('affiche la pagination mobile', () => {
    render(<OrderList />);
    expect(screen.getByLabelText('previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('next page')).toBeInTheDocument();
    expect(screen.getByText(/Page 1 of 10/i)).toBeInTheDocument();
  });

  it('affiche le bouton Download pour chaque ligne', () => {
    render(<OrderList />);
    // Il doit y avoir autant de boutons Download que de lignes
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBe(6);
  });
});
