#!/bin/bash

# Script pour nettoyer les ressources Docker

echo "🧹 Nettoyage des ressources Docker"

# Arrêter tous les conteneurs associés au projet
echo "🛑 Arrêt des conteneurs..."
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Supprimer les images
echo "🗑️ Suppression des images Docker..."
docker rmi $(docker images -q -f reference='*frontend*')

# Supprimer les volumes orphelins (optionnel)
echo "🗑️ Suppression des volumes orphelins..."
docker volume prune -f

echo "✅ Nettoyage terminé"

# Ce script peut être exécuté avec ./docker-cleanup.sh
# N'oubliez pas de le rendre exécutable avec chmod +x docker-cleanup.sh 