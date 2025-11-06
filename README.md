# 🥦 Replate – Application de Réduction du Gaspillage Alimentaire

**Replate** est une application web visant à **réduire le gaspillage alimentaire**.  
Elle met en relation des **commerçants (merchants)** disposant de surplus alimentaires avec des **bénéficiaires** pouvant les récupérer.

Ce projet est développé avec **Angular 17+**, en utilisant une **architecture 100% standalone**, **Angular Material** pour l’interface utilisateur, et **TailwindCSS 3** pour le style.

---

## 🚀 Objectifs du Sprint 1

Le **Sprint 1** se concentre sur les fonctionnalités de base pour les rôles **Admin** et **Merchant** :

### 👤 Gestion des Comptes
| Référence | Fonctionnalité |
|------------|----------------|
| RDT-3 / RDT-71 | Inscription et Connexion des utilisateurs |
| RDT-4 | Validation des nouveaux comptes par l’Admin |

### 🛒 Gestion des Annonces (Merchant)
| Référence | Fonctionnalité |
|------------|----------------|
| RDT-5 | Publication d’annonces (Don ou Vente) |
| RDT-6 | Modification des annonces |
| RDT-7 | Suppression des annonces |

### 🧩 Application
| Référence | Fonctionnalité |
|------------|----------------|
| RDT-29 | Mise en place d’un layout et d’une structure cohérente |

---

## 🧱 Architecture du Projet

L’architecture suit une structure **modulaire orientée fonctionnalités** (_feature-based_) avec **lazy loading** pour une meilleure performance et maintenance.

```bash
src/app/
│
├── core/                         # Logique centrale (services, gardes, modèles)
│   ├── guards/                   # auth.guard.ts, role.guard.ts
│   ├── models/                   # user.model.ts, announcement.model.ts
│   └── services/                 # auth.service.ts, menu.service.ts
│
├── layout/                       # Structure du dashboard
│   ├── main-layout/              # Conteneur principal avec <router-outlet>
│   ├── header/                   # Barre supérieure
│   └── sidenav/                  # Barre latérale dynamique selon le rôle
│
├── features/                     # Modules métier (lazy loading)
│   ├── auth/                     # Authentification (login/register)
│   ├── admin/                    # Espace Admin (validation comptes)
│   └── merchant/                 # Espace Marchand (gestion annonces)
│
├── shared/                       # Composants réutilisables
│   └── components/
│       ├── status-badge/         # Exemple : "Pending", "Active"
│       └── confirm-dialog/       # Exemple : "Voulez-vous supprimer ?"
│
├── app.component.ts              # Composant racine
├── app.config.ts                 # Configuration principale
└── app.routes.ts                 # Routage principal
```

