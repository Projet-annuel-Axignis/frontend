#!/bin/bash

# Script de déploiement Docker pour le frontend

echo "🚀 Déploiement du frontend via Docker"

# Arrêter les conteneurs existants si nécessaire
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -f docker/docker-compose.yml down

# Construire la nouvelle image
echo "🏗️ Construction de l'image Docker..."
docker-compose -f docker/docker-compose.yml build

# Démarrer les conteneurs
echo "🚀 Démarrage des conteneurs..."
docker-compose -f docker/docker-compose.yml up -d

# Afficher les logs
echo "📋 Affichage des logs (CTRL+C pour quitter)..."
docker-compose -f docker/docker-compose.yml logs -f 