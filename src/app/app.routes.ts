import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

// 1. Importer les nouveaux composants

import { ValidateAccounts } from './features/admin/validate-accounts/validate-accounts';
import { MyAnnouncementsComponent } from './features/merchant/my-announcements/my-announcements';
import { AnnouncementEditorComponent } from './features/merchant/announcement-editor/announcement-editor';
import { AnnouncementDetailComponent } from './features/merchant/announcement-detail/announcement-detail';
// 2. Importer les guards
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
    // --- Routes publiques (Authentification) ---
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },

    // --- Routes protégées (Layout Principal) ---
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard], // <-- 1. L'utilisateur doit être connecté
        children: [

            // --- Routes ADMIN ---
            {
                path: 'admin/validate-accounts',
                component: ValidateAccounts,
                canActivate: [roleGuard], // <-- 2. Le rôle doit être 'ADMIN'
                data: { role: 'ADMIN' }
            },

            // --- Routes MERCHANT ---
            {
                path: 'merchant/my-announcements', // (Read)
                component: MyAnnouncementsComponent,
                canActivate: [roleGuard],
                data: { role: 'MERCHANT' } // (ou 'ASSOCIATION')
            },
            {
                path: 'merchant/announcement-editor', // (Create - RDT-5)
                component: AnnouncementEditorComponent,
                canActivate: [roleGuard],
                data: { role: 'MERCHANT' }
            },
            {
                path: 'merchant/announcement-editor/:id', // (Update - RDT-6)
                component: AnnouncementEditorComponent,
                canActivate: [roleGuard],
                data: { role: 'MERCHANT' }
            },
            {
                path: 'merchant/announcement-detail/:id', // (Read Detail / Delete - RDT-7)
                component: AnnouncementDetailComponent,
                canActivate: [roleGuard],
                data: { role: 'MERCHANT' }
            },

            // Redirection par défaut (une fois connecté)
            { path: '', redirectTo: 'admin/validate-accounts', pathMatch: 'full' },
        ],
    },

    // --- Fallback Général ---
    { path: '**', redirectTo: 'auth/login' },
];