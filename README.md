# EventHub — Fil Rouge

Plateforme web de **gestion d'événements et de billetterie en ligne**, développée dans le cadre du projet Fil Rouge.

EventHub permet de gérer des événements, des utilisateurs et des réservations, avec une architecture conteneurisée et une authentification sécurisée par JWT.

---

## 📋 Sommaire

- [Présentation](#-présentation)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Développement](#-développement)
- [Authentification](#-authentification)
- [Docker](#-docker)
- [Docker Compose](#-docker-compose)
- [Docker Hub](#-docker-hub)
- [Git et workflow](#-git-et-workflow)
- [Convention des commits](#-convention-des-commits)
- [Git Hooks](#-git-hooks)
- [Scripts](#-scripts)
- [Sécurité](#-sécurité)

---

# 🎯 Présentation

EventHub est une plateforme permettant de centraliser la gestion d'événements et leur billetterie.

Le projet répond notamment aux besoins suivants :

- consultation des événements ;
- création et modification d'événements ;
- gestion des utilisateurs ;
- authentification ;
- gestion des réservations ;
- persistance des données ;
- séparation entre frontend et backend ;
- déploiement reproductible avec Docker.

L'objectif du projet est également de mettre en place une **architecture moderne, reproductible et déployable**, en appliquant des bonnes pratiques de développement et de DevOps.

---

# 🏗️ Architecture

Le projet est organisé sous forme de **monorepo npm** :

```text
eventhub/
│
├── apps/
│   ├── api/                  # Backend Node.js / Express / TypeScript
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── database/
│   │   │   ├── middlewares/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── Dockerfile
│   │   └── Dockerfile.dev
│   │
│   └── web/                  # Frontend React / Vite
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── types/
│       ├── Dockerfile
│       ├── Dockerfile.dev
│       └── nginx.conf
│
├── .husky/                   # Git Hooks
├── .env.example              # Exemple de configuration
├── docker-compose.yml        # Environnement de développement
├── docker-compose.prod.yaml  # Environnement de production
├── package.json
├── package-lock.json
└── README.md
```

### Architecture applicative

```text
                         ┌──────────────────┐
                         │     Browser      │
                         └────────┬─────────┘
                                  │
                                  │ HTTP :8080
                                  ▼
                         ┌──────────────────┐
                         │      Nginx       │
                         │ React production │
                         └────────┬─────────┘
                                  │
                         /api/*   │
                                  ▼
                         ┌──────────────────┐
                         │   Node / Express │
                         │       API        │
                         └───────┬──────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
         ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
         │ PostgreSQL  │  │   MongoDB   │  │    Redis    │
         │     SQL     │  │    NoSQL    │  │    Cache    │
         └─────────────┘  └─────────────┘  └─────────────┘
```

Tous les services de production communiquent sur le réseau Docker :

```text
eventhub-net-prod
```

---

# 🛠️ Technologies

## Frontend

- React
- TypeScript
- Vite
- Nginx

## Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt

## Bases de données et services

- PostgreSQL
- MongoDB
- Redis

## DevOps

- Docker
- Docker Compose
- Docker Hub
- Git
- GitHub
- Husky
- lint-staged

---

# 📦 Prérequis

Pour installer le projet localement, il est recommandé d'avoir :

- Node.js 20+
- npm
- Git
- Docker Desktop

Vérifier les installations :

```bash
node --version
npm --version
git --version
docker --version
docker compose version
```

---

# 🚀 Installation

Cloner le projet :

```bash
git clone <URL_DU_REPOSITORY>
cd eventhub
```

Installer les dépendances :

```bash
npm install
```

Le projet utilise les **npm workspaces** afin de gérer le frontend et le backend depuis le monorepo.

---

# 🔐 Variables d'environnement

Les variables d'environnement sont centralisées dans un fichier `.env`.

Créer le fichier à partir du modèle :

```bash
cp .env.example .env
```

Sous PowerShell :

```powershell
Copy-Item .env.example .env
```

Exemple :

```env
NODE_ENV=development

API_PORT=3000

JWT_SECRET=change-me

POSTGRES_URL=postgres://eventhub:eventhub@postgres:5432/eventhub

MONGO_URL=mongodb://mongo:27017/eventhub

REDIS_URL=redis://redis:6379
```

### Important

Le fichier `.env` contient des informations sensibles et **ne doit jamais être versionné**.

Il est donc présent dans `.gitignore`.

Le fichier `.env.example` permet de documenter les variables nécessaires sans exposer de secrets.

---

# 💻 Développement

Le projet dispose d'un environnement Docker dédié au développement.

Lancer l'ensemble des services :

```bash
docker compose up -d --build
```

Services disponibles :

| Service    | Adresse               |
| ---------- | --------------------- |
| Frontend   | http://localhost:5173 |
| API        | http://localhost:3001 |
| PostgreSQL | localhost:5432        |
| MongoDB    | localhost:27017       |
| Redis      | localhost:6379        |

Arrêter les services :

```bash
docker compose down
```

Voir les logs :

```bash
docker compose logs -f
```

Voir l'état des conteneurs :

```bash
docker compose ps
```

---

# 🔑 Authentification

L'API utilise une authentification basée sur **JWT (JSON Web Token)**.

Le processus est le suivant :

```text
Utilisateur
     │
     │ Login
     ▼
POST /api/auth/login
     │
     ▼
Validation email / mot de passe
     │
     ▼
JWT généré
     │
     ▼
Frontend
     │
     │ Authorization: Bearer <token>
     ▼
API
     │
     ▼
Middleware JWT
     │
     ▼
Route protégée
```

Les mots de passe sont hashés avec **bcrypt**.

Les routes nécessitant une authentification utilisent un middleware JWT.

Exemple :

```http
Authorization: Bearer <token>
```

Les rôles disponibles sont :

```text
PARTICIPANT
ORGANIZER
ADMIN
```

---

# 🐳 Docker

Le projet utilise Docker afin de garantir un environnement reproductible.

Deux types de Dockerfiles sont disponibles :

```text
Dockerfile
Dockerfile.dev
```

- `Dockerfile` : image de production optimisée.
- `Dockerfile.dev` : environnement de développement avec montage des sources.

## API

L'image de production du backend utilise un **build multi-stage** :

```text
Node.js
   │
   ├── Builder
   │     ├── installation dépendances
   │     ├── compilation TypeScript
   │     └── génération de dist/
   │
   └── Runner
         ├── dépendances production uniquement
         ├── utilisateur node
         └── application compilée
```

Cette approche permet de réduire la taille de l'image finale et de ne pas embarquer les dépendances de développement.

## Frontend

Le frontend utilise également un build multi-stage :

```text
Node.js
   │
   ├── installation
   └── npm run build
             │
             ▼
        fichiers dist/
             │
             ▼
      Nginx Alpine
```

Nginx sert les fichiers React et agit également comme reverse proxy vers l'API.

---

# 🐳 Docker Compose

## Environnement de production

Lancer la stack complète :

```bash
docker compose -f docker-compose.prod.yaml up -d --build
```

Vérifier les services :

```bash
docker compose -f docker-compose.prod.yaml ps
```

Les services utilisés sont :

```text
eventhub-postgres-prod
eventhub-mongo-prod
eventhub-redis-prod
eventhub-api-prod
eventhub-web-prod
```

Le frontend est accessible sur :

```text
http://localhost:8080
```

L'API est accessible à travers Nginx :

```text
http://localhost:8080/api
```

Arrêter la stack :

```bash
docker compose -f docker-compose.prod.yaml down
```

Voir les logs :

```bash
docker compose -f docker-compose.prod.yaml logs -f
```

---

# 💾 Volumes Docker

Les données des bases sont persistées grâce aux volumes Docker.

PostgreSQL :

```text
eventhub-pgdata-prod
```

MongoDB :

```text
eventhub-mongodata-prod
```

Cela permet de conserver les données même lorsque les conteneurs sont recréés.

Lister les volumes :

```bash
docker volume ls
```

---

# 🌐 Réseau Docker

Les services de production communiquent via :

```text
eventhub-net-prod
```

Les communications internes utilisent les noms des services Docker.

Par exemple, l'API peut communiquer avec PostgreSQL via :

```text
postgres:5432
```

et avec Redis via :

```text
redis:6379
```

Le frontend Nginx communique avec l'API via :

```text
api:3000
```

Cette communication interne évite d'exposer inutilement les services à l'extérieur du réseau Docker.

---

# ☁️ Docker Hub

Les images de production sont publiées sur Docker Hub.

## API

```text
maxpham517/filrouge-api
```

## Frontend

```text
maxpham517/filrouge-web
```

Chaque image est versionnée avec :

```text
1.0.0
latest
```

Exemple pour récupérer les images :

```bash
docker pull maxpham517/filrouge-api:1.0.0
docker pull maxpham517/filrouge-web:1.0.0
```

Les images peuvent ensuite être utilisées pour déployer l'application sans reconstruire le code source.

---

# 🌿 Git et workflow

Le projet utilise un workflow Git basé sur trois niveaux de branches :

```text
main
 │
 │ Pull Request
 ▼
dev
 │
 │ Pull Request
 ├───────────────┐
 ▼               ▼
feature/events   feature/auth
```

### `main`

Branche de production.

Les modifications ne sont pas réalisées directement sur `main`.

### `dev`

Branche d'intégration permettant de regrouper et valider les fonctionnalités avant leur passage en production.

### `feature/*`

Branches temporaires utilisées pour développer les différentes fonctionnalités.

Exemples :

```text
feature/events
feature/auth
feature/reservations
feature/docker
```

### Règles

- Pas de développement directement sur `main`.
- Les fonctionnalités sont développées sur `feature/*`.
- Les branches `feature/*` sont intégrées dans `dev` via Pull Request.
- Les fonctionnalités validées dans `dev` sont intégrées dans `main` via Pull Request.
- Les branches `main` et `dev` sont protégées sur GitHub.

---

# 📝 Convention des commits

Le projet utilise **Conventional Commits 1.0.0**.

Structure :

```text
<type>[scope optionnel]: <description>
```

Exemples :

```text
feat: add event creation
fix: correct event date validation
docs: update README
style: format project files
refactor: simplify event service
test: add event tests
chore: update dependencies
```

## Types utilisés

| Type       | Utilisation                                       |
| ---------- | ------------------------------------------------- |
| `feat`     | Ajout d'une fonctionnalité                        |
| `fix`      | Correction d'un bug                               |
| `docs`     | Documentation                                     |
| `style`    | Formatage sans changement fonctionnel             |
| `refactor` | Modification du code sans nouvelle fonctionnalité |
| `test`     | Tests                                             |
| `chore`    | Maintenance                                       |

Un scope peut être utilisé pour préciser le domaine concerné :

```text
feat(events): add event creation
fix(auth): correct login validation
docs(docker): update deployment instructions
```

La description du commit doit rester courte et explicite.

---

# 🪝 Git Hooks

Le projet utilise **Husky** pour gérer les Git Hooks et **lint-staged** pour automatiser les vérifications sur les fichiers modifiés.

Les fichiers concernés comprennent notamment :

```text
*.ts
*.tsx
*.js
*.json
*.md
*.yml
```

Avant chaque commit, les fichiers staged sont automatiquement traités par les outils configurés dans le projet.

---

# 📜 Scripts

Installer les dépendances :

```bash
npm install
```

Lancer le frontend :

```bash
npm run dev:web
```

Compiler le frontend :

```bash
npm run build:web
```

Lancer le lint :

```bash
npm run lint
```

Lancer les tests :

```bash
npm run test
```

Afficher l'historique Git :

```bash
git log --oneline
```

---

# 🔒 Sécurité

Plusieurs mesures sont mises en place :

- secrets stockés dans `.env` ;
- `.env` exclu du dépôt Git ;
- présence d'un `.env.example` sans secrets réels ;
- mots de passe hashés avec bcrypt ;
- authentification JWT ;
- routes sensibles protégées par middleware ;
- dépendances de développement exclues de l'image API finale ;
- conteneur API exécuté avec l'utilisateur non-root `node` ;
- services internes accessibles via le réseau Docker ;
- PostgreSQL, MongoDB et Redis non exposés directement dans l'environnement de production.

Les secrets réels ne doivent jamais être ajoutés au repository ou aux images Docker.

---

# 🧪 Vérifications

Vérifier les images Docker :

```bash
docker images
```

Vérifier les conteneurs :

```bash
docker compose -f docker-compose.prod.yaml ps
```

Tester l'API :

```bash
curl http://localhost:8080/api
```

Tester le build frontend :

```bash
npm run build -w web
```

Tester le build backend :

```bash
npm run build -w api
```

---

# 📌 État du projet

Le projet dispose actuellement de :

- ✅ Frontend React / TypeScript
- ✅ Backend Node.js / Express / TypeScript
- ✅ PostgreSQL
- ✅ MongoDB
- ✅ Redis
- ✅ Authentification JWT
- ✅ Hashage des mots de passe avec bcrypt
- ✅ Routes protégées
- ✅ Docker développement
- ✅ Docker production
- ✅ Dockerfiles multi-stage
- ✅ Docker Compose
- ✅ Réseau Docker dédié
- ✅ Volumes persistants
- ✅ Images Docker Hub
- ✅ Git workflow
- ✅ Conventional Commits
- ✅ Husky / lint-staged
- ✅ Configuration par variables d'environnement

---

# 👨‍💻 Projet

**EventHub — Fil Rouge**

Projet réalisé dans le cadre de la formation CDA / 3W Academy.
