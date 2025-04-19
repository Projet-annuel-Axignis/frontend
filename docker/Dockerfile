# Étape 1: Base node pour les dépendances et la construction
FROM node:23-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape 2: Image de production
FROM node:23-alpine AS runner

WORKDIR /app

# Définir l'environnement de production
ENV NODE_ENV=production

# Installer uniquement les dépendances de production
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copier le build et autres fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start"] 