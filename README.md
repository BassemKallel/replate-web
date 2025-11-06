Replate - Application de Réduction du Gaspillage Alimentaire
Replate est une application web dont l'objectif est de réduire le gaspillage alimentaire. Elle met en relation des commerçants (merchant) ayant des surplus alimentaires avec des bénéficiaires pour la récupération de ces produits.

Ce projet est construit avec Angular (v17+) et utilise une architecture 100% standalone (composants autonomes), Angular Material pour les composants d'interface utilisateur, et TailwindCSS (v3) pour le style personnalisé.

🚀 Objectifs du Sprint 1
Ce projet est structuré pour répondre aux exigences du Sprint 1, qui se concentre sur les fonctionnalités de base pour les rôles Admin et Merchant :

Gestion des Comptes :

RDT-3 / RDT-71 : Inscription et Connexion des utilisateurs.

RDT-4 : Validation des nouveaux comptes par l'Admin.

Gestion des Annonces (Merchant) :

RDT-5 : Publication d'annonces (Don ou Vente).

RDT-6 : Modification des annonces.

RDT-7 : Suppression des annonces.

Application :

RDT-29 : Mise en place d'une application et d'un layout cohérents.

📂 Architecture du Projet (Sprint 1)
Le projet suit une architecture modulaire basée sur les fonctionnalités ("feature-based"), optimisée pour la maintenance et le "lazy loading" (chargement paresseux).

src/app/
│
├── core/               # Logique centrale, services globaux, et gardes
│   ├── guards/         # (auth.guard.ts, role.guard.ts)
│   ├── models/         # (user.model.ts, announcement.model.ts, etc.)
│   └── services/       # (auth.service.ts, menu.service.ts)
│
├── layout/             # Composants de la "coquille" principale du dashboard
│   ├── main-layout/    # (Conteneur principal avec <router-outlet>)
│   ├── header/
│   └── sidenav/        # (La barre latérale dynamique par rôle)
│
├── features/           # Modules métier, chargés en lazy loading
│   │
│   ├── auth/           # Pages publiques de Connexion / Inscription
│   │   ├── login/
│   │   └── register/
│   │
│   ├── admin/          # Pages protégées pour le rôle "Admin"
│   │   └── validate-accounts/ # (RDT-4)
│   │
│   └── merchant/       # Pages protégées pour le rôle "Merchant"
│       ├── announcement-list/ # (RDT-6, RDT-7)
│       └── announcement-form/ # (RDT-5)
│
├── shared/             # Composants réutilisables
│   └── components/
│       ├── status-badge/     # (ex: "Pending", "Active")
│       └── confirm-dialog/   # (ex: "Voulez-vous supprimer ?")
│
├── app.component.ts    # Composant racine
├── app.config.ts       # Configuration principale
└── app.routes.ts       # Fichier de routage principal
Explication de l'Architecture
/core (Cœur) : Contient la logique centrale de l'application.

services/ : AuthService (sait qui est connecté et quel est son rôle) et MenuService (sait quels liens montrer dans la barre latérale).

guards/ : Protège les routes. auth.guard (vérifie si l'utilisateur est connecté) et role.guard (vérifie si l'utilisateur a le bon rôle, ex: "admin").

models/ : Les interfaces TypeScript (contrats) qui définissent nos données, comme User, UserRole, et Announcement.

/layout (Mise en page) : Gère la structure visuelle persistante du dashboard (barre latérale et en-tête). Le MainLayoutComponent contient le <router-outlet> où les pages des features seront chargées.

/features (Fonctionnalités) : C'est là que se trouve la logique métier. Chaque dossier correspond à une section de l'application et est chargé en "lazy loading".

/auth est public.

/admin et /merchant sont protégés par les gardes du dossier /core.

/shared (Partagé) : Contient tous les composants "bêtes" (dumb components) qui sont réutilisés dans plusieurs features, comme le badge de statut ou les dialogues de confirmation.

🛠️ Démarrage du Projet
Installer les dépendances :

Bash

npm install
Lancer le serveur de développement :

Bash

npm start
L'application est disponible sur http://localhost:4200/