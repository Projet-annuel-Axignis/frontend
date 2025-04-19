import React from 'react';

// Mock de useTranslation
export const mockUseTranslation = () => {
  return {
    t: (key: string) => {
      // Traductions mockées pour les tests
      const translations: { [key: string]: string } = {
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
        'footer.description': 'Spécialiste en sécurité incendie et accessibilité des bâtiments. Notre expertise au service de votre sécurité.',
        'footer.quick_links': 'Liens Rapides',
        'footer.mission': 'Notre Mission',
        'footer.services': 'Services',
        'footer.contact': 'Contact',
        'footer.legal': 'Mentions Légales',
        'footer.address': '123 Avenue de la République, 75011 Paris, France',
        'footer.copyright': 'Tous droits réservés.',
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
    ready: true
  };
};

// Mock du hook useTranslation
jest.mock('@/i18n/useTranslation', () => ({
  useTranslation: () => mockUseTranslation()
}));

// Composant wrapper pour les tests
export const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default TestWrapper; 