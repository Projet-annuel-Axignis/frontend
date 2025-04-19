#!/bin/bash

# Script pour lancer l'environnement de développement Docker

echo "🚀 Démarrage de l'environnement de développement via Docker"

# Construire l'image de développement si nécessaire
echo "🏗️ Construction de l'image Docker de développement..."
docker-compose -f docker-compose.dev.yml build

# Démarrer les conteneurs en mode interactif
echo "🚀 Démarrage de l'application en mode développement..."
echo "💻 L'application sera accessible sur http://localhost:3000"
echo "📝 Les modifications du code seront automatiquement appliquées"
echo "⛔ Utilisez Ctrl+C pour arrêter l'application"

# Démarrer le conteneur en mode interactif, les logs seront directement affichés
docker-compose -f docker-compose.dev.yml up

# Ce script peut être exécuté avec ./dev-docker.sh
# N'oubliez pas de le rendre exécutable avec chmod +x dev-docker.sh 