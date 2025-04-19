#!/bin/bash

# Script de déploiement Docker pour le frontend

echo "🚀 Déploiement du frontend via Docker"

# Arrêter les conteneurs existants si nécessaire
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down

# Construire la nouvelle image
echo "🏗️ Construction de l'image Docker..."
docker-compose build

# Démarrer les conteneurs
echo "🚀 Démarrage des conteneurs..."
docker-compose up -d

# Afficher les logs
echo "📋 Affichage des logs (CTRL+C pour quitter)..."
docker-compose logs -f

# Ce script peut être exécuté avec ./deploy-docker.sh
# N'oubliez pas de le rendre exécutable avec chmod +x deploy-docker.sh 