import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { ValidateAccounts } from './features/admin/validate-accounts/validate-accounts';

export const routes: Routes = [
    // Routes pour l'authentification (publiques)
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: 'admin/validate-accounts', component: ValidateAccounts },
        ]
    },


    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'auth/login' } // Page 404
];