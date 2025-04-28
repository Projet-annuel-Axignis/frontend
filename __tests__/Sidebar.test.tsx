import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '@/components/Sidebar';

describe('Sidebar', () => {
  it('affiche le logo', () => {
    render(<Sidebar />);
    expect(screen.getByAltText('Axignis Logo')).toBeInTheDocument();
  });

  it('affiche le champ de recherche', () => {
    render(<Sidebar />);
    expect(screen.getByPlaceholderText(/Recherche/i)).toBeInTheDocument();
  });

  it('affiche les liens principaux', () => {
    render(<Sidebar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Orders')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('affiche le badge des messages', () => {
    render(<Sidebar />);
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('affiche le menu déroulant Tasks et ses sous-éléments', () => {
    render(<Sidebar />);
    const tasksToggle = screen.getByText('Tasks');
    fireEvent.click(tasksToggle);
    expect(screen.getByText('All tasks')).toBeInTheDocument();
    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('affiche le menu déroulant Users et ses sous-éléments', () => {
    render(<Sidebar />);
    const usersToggle = screen.getByText('Users');
    fireEvent.click(usersToggle);
    expect(screen.getByText('My profile')).toBeInTheDocument();
    expect(screen.getByText('Create a new user')).toBeInTheDocument();
    expect(screen.getByText('Roles & permission')).toBeInTheDocument();
  });

  it('affiche le profil utilisateur', () => {
    render(<Sidebar />);
    expect(screen.getByText('Siriwat K.')).toBeInTheDocument();
    expect(screen.getByText('siriwatk@test.com')).toBeInTheDocument();
  
    // Récupère toutes les images
    const images = screen.getAllByRole('img');
    // L’avatar est probablement la deuxième image (après le logo)
    expect(images.length).toBeGreaterThanOrEqual(2);
    // On peut vérifier que l’une des images correspond à l’avatar (par exemple en src partielle)
    const avatarImage = images.find(img =>
      (img as HTMLImageElement).src.includes('images.unsplash.com/photo-1535713875002-d1d0cf377fde')
    );
    expect(avatarImage).toBeInTheDocument();
  });  

  it('affiche le bouton de déconnexion', () => {
    render(<Sidebar />);
    // On cible le bouton avec l'icône Logout
    const logoutButton = screen.getAllByRole('button').find(btn =>
      btn.querySelector('svg')
    );
    expect(logoutButton).toBeInTheDocument();
  });
});
