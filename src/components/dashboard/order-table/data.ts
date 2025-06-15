import { Product } from './types';

export const products: Product[] = [
  {
    id: 'JOD-1234',
    marque: 'Legrand',
    status: 'En stock',
    type: 'Déclencheur',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'CAB-1233',
    marque: 'Schneider',
    status: 'En stock',
    type: 'Câble',
    associativity: 'Électricité'
  },
  {
    id: 'DET-1232',
    marque: 'Siemens',
    status: 'Stock faible',
    type: 'Détecteur',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'CEN-1231',
    marque: 'Honeywell',
    status: 'En stock',
    type: 'Centrale',
    associativity: 'Sécurité incendie'
  },
  {
    id: 'VOL-1230',
    marque: 'Legrand',
    status: 'Rupture',
    type: 'Volet',
    associativity: 'Protection'
  },
  {
    id: 'SIR-1229',
    marque: 'Bosch',
    status: 'Rupture',
    type: 'Sirène',
    associativity: 'Alarme'
  },
  {
    id: 'BAL-1228',
    marque: 'Philips',
    status: 'En stock',
    type: 'Balise',
    associativity: 'Éclairage'
  },
  {
    id: 'MOD-1227',
    marque: 'ABB',
    status: 'En stock',
    type: 'Module',
    associativity: 'Interface'
  },
  {
    id: 'CAP-1226',
    marque: 'Schneider',
    status: 'Rupture',
    type: 'Capteur',
    associativity: 'Détection'
  },
  {
    id: 'REL-1225',
    marque: 'Omron',
    status: 'En stock',
    type: 'Relais',
    associativity: 'Commande'
  },
];

export const marques = ['Legrand', 'Schneider', 'Siemens', 'Honeywell', 'Bosch', 'Philips', 'ABB', 'Omron'];
export const types = ['Déclencheur', 'Détecteur', 'Centrale', 'Câble', 'Sirène', 'Balise', 'Module', 'Capteur', 'Relais', 'Volet'];
export const statuses = ['En stock', 'Stock faible', 'Rupture']; 