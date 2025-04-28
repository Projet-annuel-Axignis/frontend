// pages/technical-base/products/[id].tsx
import React from 'react';

interface Props {
    params: { id: string };
}

export async function generateStaticParams() {
  // Ici tu peux récupérer les ids des produits pour générer les pages statiques
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function TechnicalBaseDetail({ params }: Props) {
    const { id } = params;
  
    return (
    <main style={{ padding: 20 }}>
      <h1>Détails du produit {id} </h1>
      {/* Affiche les infos du produit ici */}
      <p>Ici tu peux charger et afficher les détails du produit avec l'id {id}.</p>
    </main>
  );
}
