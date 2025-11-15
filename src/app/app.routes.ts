import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';
import { publicGuard } from './core/guards/publicGuard';
import { roleGuard } from './core/guards/role-guard';
// CORRIGÉ: Importe 'MyAnnouncements', pas 'MyAnnouncementsComponent'
import { MyAnnouncements } from './features/merchant/my-announcements/my-announcements';
// CORRIGÉ: Importe 'AnnouncementDetail', pas 'AnnouncementDetailComponent'
import { AnnouncementDetail } from './features/merchant/announcement-detail/announcement-detail';
import { AnnouncementEditorComponent } from './features/merchant/announcement-editor/announcement-editor';
import { ValidateAccounts } from './features/admin/validate-accounts/validate-accounts';
import { AnnouncementList } from './features/merchant/announcement-list/announcement-list';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'announcements', pathMatch: 'full' },
            { path: 'announcements', component: AnnouncementList },

            // Routes 'Merchant'
            {
                path: 'merchant',
                canActivate: [roleGuard],
                data: { role: 'MERCHANT' },
                children: [
                    // CORRIGÉ: Utilise 'MyAnnouncements'
                    { path: 'my-announcements', component: MyAnnouncements },
                    // CORRIGÉ: Utilise 'AnnouncementDetail'
                    { path: 'announcement/:id', component: AnnouncementDetail },
                    { path: 'create', component: AnnouncementEditorComponent },
                    { path: 'edit/:id', component: AnnouncementEditorComponent },
                ]
            },

            // Routes 'Admin'
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { role: 'ADMIN' },
                children: [
                    { path: 'validate-accounts', component: ValidateAccounts },
                ]
            },
        ]
    },
    {
        path: 'auth',
        canActivate: [publicGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    { path: '**', redirectTo: '' } // Redirige les routes inconnues
];