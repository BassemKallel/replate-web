Vous avez raison. Essayons une version plus directe et visuelle.

Voici un README.md structuré pour être aussi clair que possible.

Projet Replate
1. Objectif
Replate est une application web conçue pour réduire le gaspillage alimentaire. Elle connecte les commerçants (restaurants, boulangeries) avec des associations et des bénéficiaires pour faciliter le don ou la vente à prix réduit des surplus alimentaires.

2. Objectifs du Sprint 1
Ce sprint se concentre sur les fonctionnalités de base pour les rôles Admin et Merchant, basées sur le backlog :

Gestion des Comptes :

RDT-3 / RDT-71 : Création de compte et Connexion.

RDT-4 : Écran de validation des comptes par l'Admin.

Gestion des Annonces (Merchant) :

RDT-5 : Publication d'annonces (Don ou Vente).

RDT-6 : Modification d'une annonce.

RDT-7 : Suppression d'une annonce.

Application :

RDT-29 : Mise en place d'une application et d'un layout cohérents.

3. Pile Technique
Framework : Angular 17+ (Architecture 100% Standalone)

UI : Angular Material

Style : TailwindCSS v3

4. Architecture du Projet
Le projet est divisé en quatre zones principales pour séparer clairement les responsabilités.

src/app/
│
├── core/         # LE CERVEAU : Services globaux et logique métier.
│
├── layout/       # LE CORPS : La coquille visuelle (Sidenav, Header).
│
├── features/     # LES ORGANES : Les pages de l'application (Login, Admin, Merchant).
│
└── shared/       # LES OUTILS : Composants réutilisables (ex: boutons, badges).
Explication détaillée des dossiers (Sprint 1)
src/app/core/ (Le Cerveau)

services/ :

auth.service.ts : Gère la connexion, la déconnexion, et sait qui est l'utilisateur (RDT-71).

menu.service.ts : Sait quels liens montrer dans le Sidenav en fonction du rôle.

guards/ :

auth.guard.ts : Bloque l'accès aux pages si l'utilisateur n'est pas connecté.

role.guard.ts : Bloque l'accès si l'utilisateur n'a pas le bon rôle (ex: un Merchant ne peut pas aller sur /admin).

models/ :

user.model.ts : Définit ce qu'est un User (rôle, statut, etc.).

announcement.model.ts : Définit ce qu'est une Announcement.

src/app/layout/ (Le Corps)

main-layout/ : Le composant principal qui affiche le sidenav, le header et la page actuelle (<router-outlet>).

sidenav/ : La barre latérale qui utilise le MenuService pour s'afficher dynamiquement.

header/ : L'en-tête (barre de recherche, menu profil).

src/app/features/ (Les Organes)

auth/ : Pages publiques.

login/ (RDT-71)

register/ (RDT-3)

admin/ : Pages protégées (pour le rôle "admin").

validate-accounts/ (RDT-4)

merchant/ : Pages protégées (pour le rôle "merchant").

announcement-list/ (RDT-6, RDT-7)

announcement-form/ (RDT-5)

src/app/shared/ (Les Outils)

components/ :

status-badge/ : Le composant réutilisable pour afficher "Pending", "Active", "Cancelled".

confirm-dialog/ : Pop-up pour confirmer les suppressions (RDT-7).

5. Démarrage
Installer les dépendances :

Bash

npm install
Lancer le serveur de développement :

Bash

npm start
L'application est disponible sur http://localhost:4200/
