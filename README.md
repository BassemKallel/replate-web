🥦 Replate – Application de Réduction du Gaspillage Alimentaire

Replate est une application web visant à réduire le gaspillage alimentaire en mettant en relation des commerçants ayant des surplus alimentaires avec des bénéficiaires souhaitant les récupérer.

Ce projet est développé avec Angular (v17+), utilise une architecture 100% standalone, Angular Material pour les composants UI, et TailwindCSS (v3) pour le style personnalisé.

🚀 Objectifs du Sprint 1

Le Sprint 1 se concentre sur la mise en place des fonctionnalités de base pour les rôles Admin et Merchant :

👤 Gestion des Comptes
Référence	Fonctionnalité
RDT-3 / RDT-71	Inscription et Connexion des utilisateurs
RDT-4	Validation des nouveaux comptes par l’Admin
🛒 Gestion des Annonces (Merchant)
Référence	Fonctionnalité
RDT-5	Publication d’annonces (Don ou Vente)
RDT-6	Modification des annonces
RDT-7	Suppression des annonces
🧩 Application
Référence	Fonctionnalité
RDT-29	Mise en place d’un layout et d’une structure d’application cohérents
🧱 Architecture du Projet

Le projet adopte une architecture modulaire par fonctionnalités (feature-based), facilitant la maintenance et le lazy loading.

src/app/
│
├── core/                         # Logique centrale (services, gardes, modèles)
│   ├── guards/                   # auth.guard.ts, role.guard.ts
│   ├── models/                   # user.model.ts, announcement.model.ts
│   └── services/                 # auth.service.ts, menu.service.ts
│
├── layout/                       # Structure visuelle du dashboard
│   ├── main-layout/              # Contient le <router-outlet>
│   ├── header/                   # Barre supérieure
│   └── sidenav/                  # Barre latérale dynamique selon le rôle
│
├── features/                     # Modules métier (lazy loading)
│   ├── auth/                     # Pages publiques (connexion / inscription)
│   │   ├── login/
│   │   └── register/
│   │
│   ├── admin/                    # Espace Admin (RDT-4)
│   │   └── validate-accounts/
│   │
│   └── merchant/                 # Espace Merchant
│       ├── announcement-list/    # (RDT-6, RDT-7)
│       └── announcement-form/    # (RDT-5)
│
├── shared/                       # Composants réutilisables
│   └── components/
│       ├── status-badge/         # (ex: "Pending", "Active")
│       └── confirm-dialog/       # (ex: "Voulez-vous supprimer ?")
│
├── app.component.ts              # Composant racine
├── app.config.ts                 # Configuration principale
└── app.routes.ts                 # Fichier de routage principal

🧠 Explication de l’Architecture
/core

Contient la logique centrale de l’application :

services/ :

AuthService → gère l’authentification et les rôles utilisateurs

MenuService → détermine les liens visibles dans la barre latérale

guards/ :

auth.guard.ts → protège les routes non accessibles sans connexion

role.guard.ts → contrôle l’accès selon le rôle (admin, merchant)

models/ :
Interfaces TypeScript décrivant les structures de données (User, Announcement, etc.)

/layout

Structure visuelle principale du tableau de bord :

MainLayoutComponent → contient le <router-outlet> pour charger dynamiquement les pages

HeaderComponent et SidenavComponent → affichage dynamique selon le rôle

/features

Modules métier :

auth/ → connexion et inscription (public)

admin/ → validation des comptes (protégé)

merchant/ → gestion des annonces (protégé)

/shared

Composants réutilisables et “bêtes” (sans logique métier complexe), par ex. :

status-badge (indique l’état d’un élément)

confirm-dialog (fenêtre de confirmation)

⚙️ Installation et Exécution
1️⃣ Cloner le projet
git clone https://github.com/ton-profil/replate-angular.git
cd replate-angular

2️⃣ Installer les dépendances
npm install

3️⃣ Lancer le serveur de développement
npm start


L’application sera disponible sur :
👉 http://localhost:4200

🧩 Technologies Utilisées
Outil / Librairie	Rôle
Angular 17+	Framework principal
Angular Material	Composants UI
TailwindCSS 3	Style et personnalisation
TypeScript	Typage statique
RxJS	Programmation réactive
ESLint / Prettier	Linting et formatage du code
🔐 Rôles et Accès
Rôle	Accès
Admin	Validation des comptes, gestion globale
Merchant	Gestion des annonces (ajout, modification, suppression)
Public	Connexion / Inscription uniquement
🧭 Routage Principal
Route	Rôle	Description
/auth/login	Public	Connexion utilisateur
/auth/register	Public	Création de compte
/admin/validate-accounts	Admin	Validation des comptes
/merchant/announcement-list	Merchant	Liste et suppression des annonces
/merchant/announcement-form	Merchant	Ajout / modification d’annonces
