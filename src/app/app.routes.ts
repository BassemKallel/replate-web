import { Routes } from '@angular/router';

export const routes: Routes = [
    // Routes pour l'authentification (publiques)
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },


    // Redirection par défaut vers la page de connexion
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: 'auth/login' } // Page 404
];