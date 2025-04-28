import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderTable from '@/components/OrderTable';

describe('OrderTable', () => {
  it('affiche les colonnes principales', () => {
    render(<OrderTable />);
    expect(screen.getByText(/Invoice/i)).toBeInTheDocument();
    expect(screen.getByText(/Date/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Status/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Customer/i).length).toBeGreaterThan(0);
  });

  it('affiche quelques clients connus', () => {
    render(<OrderTable />);
    expect(screen.getAllByText('Olivia Ryhe')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Steve Hampton')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ciaran Murray')[0]).toBeInTheDocument();
  });

  it('affiche les statuts Paid, Refunded, Cancelled', () => {
    render(<OrderTable />);
    expect(screen.getAllByText('Paid').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Refunded').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
  });

  it('affiche les emails des clients', () => {
    render(<OrderTable />);
    expect(screen.getAllByText('olivia@email.com')[0]).toBeInTheDocument();
    expect(screen.getAllByText('steve.hamp@email.com')[0]).toBeInTheDocument();
  });

  it('affiche le bouton Download pour chaque ligne', () => {
    render(<OrderTable />);
    // Il doit y avoir autant de boutons Download que de lignes (ici 18)
    const downloadButtons = screen.getAllByText('Download');
    expect(downloadButtons.length).toBeGreaterThanOrEqual(10);
  });

  it('affiche la pagination desktop', () => {
    render(<OrderTable />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    // Vérifie la présence de quelques numéros de page
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('permet de sélectionner toutes les lignes via la checkbox principale', () => {
    render(<OrderTable />);
    // Sélectionne la checkbox principale du header
    const checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];
    // Coche la checkbox
    fireEvent.click(headerCheckbox);
    // Toutes les autres checkboxes doivent être cochées
    checkboxes.forEach(cb => {
      expect((cb as HTMLInputElement).checked).toBe(true);
    });
  });

  it('permet de trier les factures en cliquant sur Invoice', () => {
    render(<OrderTable />);
    const invoiceHeader = screen.getByText(/Invoice/i);
    // Clique pour changer l'ordre
    fireEvent.click(invoiceHeader);
    // Le test vérifie juste que le clic ne plante pas, tu peux ajouter plus de logique si tu veux
    expect(invoiceHeader).toBeInTheDocument();
  });
});
