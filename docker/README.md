# Guide Docker pour le Frontend

Ce guide explique comment utiliser Docker avec ce projet frontend.

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le projet

## Organisation des fichiers

Tous les fichiers liés à Docker sont organisés dans le dossier `docker/` :

- `docker/Dockerfile` - Pour la construction de l'image de production
- `docker/Dockerfile.dev` - Pour l'environnement de développement
- `docker/docker-compose.yml` - Pour le déploiement en production
- `docker/docker-compose.dev.yml` - Pour l'environnement de développement
- `docker/.dockerignore` - Liste des fichiers à ignorer lors de la construction

Des scripts pour faciliter l'utilisation sont disponibles à la racine du projet :

- `docker-dev.sh` - Pour démarrer l'environnement de développement
- `docker-prod.sh` - Pour déployer en production
- `docker-cleanup.sh` - Pour nettoyer les ressources Docker

## Utilisation

### Développement

Pour démarrer l'environnement de développement :

```bash
./docker-dev.sh
```

Cela va :
1. Construire une image Docker spécifique au développement
2. Monter votre code source en tant que volume pour le hot-reloading
3. Démarrer l'application en mode développement
4. Afficher les logs en temps réel

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

Les changements de code seront automatiquement détectés et l'application se rechargera automatiquement.

### Production

Pour déployer l'application en production :

```bash
./docker-prod.sh
```

Cela va :
1. Arrêter les conteneurs existants
2. Construire une image Docker optimisée pour la production
3. Démarrer l'application en arrière-plan
4. Afficher les logs

### Nettoyage

Pour nettoyer toutes les ressources Docker associées au projet :

```bash
./docker-cleanup.sh
```

## Volumes et persistance

- Le volume `../public/locales:/app/public/locales` dans la configuration de production permet de mettre à jour les fichiers de traduction sans reconstruire l'image.

## Structure des images Docker

### Image de développement

- Basée sur Node.js 20 Alpine
- Inclut toutes les dépendances de développement
- Monte le code source comme volume pour le hot-reloading
- Utilise la commande `npm run dev`

### Image de production

- Construction en deux étapes pour minimiser la taille
- Première étape pour compiler l'application
- Seconde étape uniquement avec les dépendances de production
- Ne contient que les fichiers nécessaires pour exécuter l'application
- Utilise la commande `npm run start`

## Intégration Continue (CI/CD)

Le projet est configuré avec GitHub Actions pour les tests et le déploiement Docker automatique :

- **Workflow CI** (`.github/workflows/ci.yml`) :
  - Exécute les tests pour chaque pull request et push
  - Vérifie que le projet peut être compilé correctement
  - Effectue les vérifications de linting et les tests unitaires

- **Workflow CD** (`.github/workflows/docker.yml`) :
  - Construit et publie l'image Docker sur GitHub Container Registry
  - Publie également l'image sur Docker Hub pour les branches principales
  - Déclenché automatiquement pour les branches `main` (production) et `dev` (développement)
  - Peut être lancé manuellement via le déclencheur `workflow_dispatch`
  - Applique des tags appropriés selon l'environnement et la branche
  - Envoie une notification après un déploiement réussi

### Images disponibles

Les images Docker sont publiées aux emplacements suivants :

- **GitHub Container Registry** : `ghcr.io/projet-annuel-axignis/frontend:{tag}`
- **Docker Hub** : `operdrix/axignis-frontend:{tag}`

Tags disponibles :
- `dev` - Version de développement
- `production` - Version de production
- `{branch-name}` - Nom de la branche
- `{sha}` - SHA court du commit

## Personnalisation

Vous pouvez personnaliser les configurations Docker en modifiant les fichiers suivants :

- `docker/Dockerfile` et `docker/Dockerfile.dev` pour les images
- `docker/docker-compose.yml` et `docker/docker-compose.dev.yml` pour les services
- Les scripts shell à la racine du projet pour les processus de déploiement

## Dépannage

### L'application ne se recharge pas automatiquement

Assurez-vous que `CHOKIDAR_USEPOLLING=true` est défini dans les variables d'environnement du service de développement.

### Problèmes de permission sur les fichiers

Si vous rencontrez des problèmes de permission, vérifiez les utilisateurs dans les conteneurs et ajustez les propriétaires des fichiers si nécessaire.

### Nettoyage complet

Si vous rencontrez des problèmes, essayez de nettoyer complètement avec `./docker-cleanup.sh`. 