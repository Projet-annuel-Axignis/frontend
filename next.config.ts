import type { NextConfig } from "next";

// Récupère le préfixe de chemin pour GitHub Pages
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetPrefix = process.env.NEXT_ASSET_PREFIX || '';

const nextConfig: NextConfig = {
  /* config options here */
  // Configuration spécifique pour l'export vers GitHub Pages
  output: 'export',
  // Ajoute le préfixe de chemin pour GitHub Pages si nécessaire
  basePath: basePath,
  assetPrefix: assetPrefix,
  // Désactive l'image optimization qui n'est pas compatible avec l'export statique
  images: {
    unoptimized: true,
  },
  // Ajoute le trailing slash pour la compatibilité avec GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
