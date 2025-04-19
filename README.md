# Axignis Frontend

![Logo Axignis](./public/images/logo/logo-axignis-nb.png)

Frontend pour l'application Axignis - Spécialiste en sécurité incendie et accessibilité des bâtiments.

[![Next.js CI](https://github.com/Projet-annuel-Axignis/frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/Projet-annuel-Axignis/frontend/actions/workflows/ci.yml)
[![Docker Build & Deploy](https://github.com/Projet-annuel-Axignis/frontend/actions/workflows/docker.yml/badge.svg)](https://github.com/Projet-annuel-Axignis/frontend/actions/workflows/docker.yml)
[![Docker Hub](https://img.shields.io/docker/pulls/operdrix/axignis-frontend?logo=docker)](https://hub.docker.com/r/operdrix/axignis-frontend)

## 🚀 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/) avec App Router et React 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [MUI Joy](https://mui.com/joy-ui/getting-started/)
- **Testing**: [Jest](https://jestjs.io/) et [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Internationalisation**: [i18next](https://www.i18next.com/)
- **Validation**: [Formik](https://formik.org/) et [Yup](https://github.com/jquense/yup)
- **Containerisation**: Docker

## 🏗️ Installation

### Prérequis

- Node.js 20+
- npm 10+
- Git

### Installation locale

```bash
# Cloner le dépôt
git clone https://github.com/Projet-annuel-Axignis/frontend.git
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Avec Docker

```bash
# Lancer l'environnement de développement
./docker-dev.sh

# OU pour la production
./docker-prod.sh
```

### Via Docker Hub

```bash
# Télécharger et exécuter directement l'image
docker run -p 3000:3000 operdrix/axignis-frontend:latest
```

Plus d'informations sur l'utilisation de Docker dans le [Guide Docker](./docker/README.md).

## 📋 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement avec Turbopack
- `npm run build` - Construit l'application pour la production
- `npm run start` - Démarre le serveur de production
- `npm run lint` - Vérifie le code avec ESLint
- `npm test` - Lance les tests
- `npm run test:watch` - Lance les tests en mode watch

## 🌐 Internationalisation

Le projet supporte plusieurs langues grâce à i18next. Les fichiers de traduction se trouvent dans `public/locales/{langue}/common.json`.

Langues disponibles :
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais

## 🧪 Tests

Le projet utilise Jest et React Testing Library pour les tests. Pour lancer les tests :

```bash
npm test
```

## 📦 Déploiement

### CI/CD

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement :

- **Workflow CI** (`.github/workflows/ci.yml`) :
  - Lint et tests sur toutes les branches de développement
  - Vérification du build pour les pull requests

- **Workflow CD** (`.github/workflows/docker.yml`) :
  - Tests et build de l'application
  - Construction et publication d'images Docker prêtes pour le déploiement
  - Publication sur GitHub Container Registry et Docker Hub
  - Automatisation basée sur l'environnement (dev/production)

### Images Docker

Les images Docker sont publiées sur :

- **GitHub Container Registry** : `ghcr.io/projet-annuel-axignis/frontend:{tag}`
- **Docker Hub** : `operdrix/axignis-frontend:{tag}`

Tags disponibles :
- `dev` - Version de développement (branche dev)
- `production` - Version de production (branche main)
- `{sha}` - Tag basé sur le hash du commit

## 🧩 Structure du projet

```
frontend/
├── __tests__/     # Tests unitaires et d'intégration
├── docker/        # Configuration Docker
├── public/        # Fichiers statiques et traductions
├── src/
│   ├── app/       # Structure des pages (App Router)
│   ├── components/# Composants React réutilisables
│   ├── hooks/     # Hooks React personnalisés
│   ├── i18n/      # Configuration i18next
│   ├── lib/       # Bibliothèques et utilitaires
│   └── styles/    # Styles globaux
└── ...
```

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push sur la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Conventions

- **Commits**: Suivre la convention [Conventional Commits](https://www.conventionalcommits.org/)
- **Branches**: `feature/*`, `fix/*`, `refactor/*`, etc.
- **Pull Requests**: Pull requests obligatoires pour `main` et `dev`

## 👨‍💻 Contributeurs

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/LoanCB">
        <img src="https://github.com/LoanCB.png" width="100px;" alt="Loan Courchinoux-Billonnet"/>
        <br />
        <sub><b>Loan Courchinoux-Billonnet</b></sub>
      </a>
      <br />
      <sub>LoanCB</sub>
    </td>
    <td align="center">
      <a href="https://github.com/operdrix">
        <img src="https://github.com/operdrix.png" width="100px;" alt="Olivier PERDRIX"/>
        <br />
        <sub><b>Olivier PERDRIX</b></sub>
      </a>
      <br />
      <sub>operdrix</sub>
    </td>
    <td align="center">
      <a href="https://github.com/s-kenza">
        <img src="https://github.com/s-kenza.png" width="100px;" alt="Kenza Schuler"/>
        <br />
        <sub><b>Kenza Schuler</b></sub>
      </a>
      <br />
      <sub>s-kenza</sub>
    </td>
  </tr>
</table>

## 📝 Licence

Ce projet est sous licence [MIT](LICENSE).

## 🙏 Remerciements

- L'équipe Axignis pour leur vision et leur expertise
- Tous les contributeurs qui ont rendu ce projet possible
